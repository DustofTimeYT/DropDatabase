package domain

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"mime/multipart"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"golang.org/x/sync/errgroup"
)

var (
	ErrPostNotFound = errors.New("post not found")
)

type PostService struct {
	db *pgx.Conn
}

func NewPostService(db *pgx.Conn) *PostService {
	return &PostService{db: db}
}

func (s *PostService) ListUserPosts(ctx context.Context, userID uuid.UUID) ([]Post, error) {
	query := `
		SELECT
			p.id,
			p.user_id,
			p.text,
			p.upvote_number,
			p.downvote_number,
			p.created_at,
			COALESCE(pi.ids, '{}') AS image_ids,
			COALESCE(pi.widths, '{}') AS widths,
			COALESCE(pi.heights, '{}') AS heights,
			COALESCE(t.tags, '{}') AS tags
		FROM posts p
		LEFT JOIN (
			SELECT
				post_id,
				array_agg(image_id) AS ids,
				array_agg(width) AS widths,
				array_agg(height) AS heights
			FROM post_images
			GROUP BY post_id
		) pi ON pi.post_id = p.id
		LEFT JOIN (
			SELECT
				pt.post_id,
				array_agg(t.name) AS tags
			FROM post_tags pt
			JOIN tags t ON t.id = pt.tag_id
			GROUP BY pt.post_id
		) t ON t.post_id = p.id
        WHERE p.user_id = $1
		ORDER BY p.created_at DESC
	`

	rows, err := s.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	posts := make([]Post, 0)
	for rows.Next() {
		var p Post
		var imageIDs []uuid.UUID
		var widths []int32
		var heights []int32
		var tags []string

		err := rows.Scan(
			&p.ID,
			&p.UserID,
			&p.Text,
			&p.UpvoteNumber,
			&p.DownvoteNumber,
			&p.CreatedAt,
			&imageIDs,
			&widths,
			&heights,
			&tags,
		)
		if err != nil {
			return nil, err
		}

		p.Images = make([]Image, len(imageIDs))
		for i := range imageIDs {
			p.Images[i] = Image{
				ID:     imageIDs[i],
				Width:  int(widths[i]),
				Height: int(heights[i]),
			}
		}

		p.Tags = tags

		posts = append(posts, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (s *PostService) ListPosts(ctx context.Context) ([]Post, error) {
	query := `
		SELECT
			p.id,
			p.user_id,
			p.text,
			p.upvote_number,
			p.downvote_number,
			p.created_at,
			COALESCE(pi.ids, '{}') AS image_ids,
			COALESCE(pi.widths, '{}') AS widths,
			COALESCE(pi.heights, '{}') AS heights,
			COALESCE(t.tags, '{}') AS tags
		FROM posts p
		LEFT JOIN (
			SELECT
				post_id,
				array_agg(image_id) AS ids,
				array_agg(width) AS widths,
				array_agg(height) AS heights
			FROM post_images
			GROUP BY post_id
		) pi ON pi.post_id = p.id
		LEFT JOIN (
			SELECT
				pt.post_id,
				array_agg(t.name) AS tags
			FROM post_tags pt
			JOIN tags t ON t.id = pt.tag_id
			GROUP BY pt.post_id
		) t ON t.post_id = p.id
		ORDER BY p.created_at DESC
	`

	rows, err := s.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	posts := make([]Post, 0)
	for rows.Next() {
		var p Post
		var imageIDs []uuid.UUID
		var widths []int32
		var heights []int32
		var tags []string

		err := rows.Scan(
			&p.ID,
			&p.UserID,
			&p.Text,
			&p.UpvoteNumber,
			&p.DownvoteNumber,
			&p.CreatedAt,
			&imageIDs,
			&widths,
			&heights,
			&tags,
		)
		if err != nil {
			return nil, err
		}

		p.Images = make([]Image, len(imageIDs))
		for i := range imageIDs {
			p.Images[i] = Image{
				ID:     imageIDs[i],
				Width:  int(widths[i]),
				Height: int(heights[i]),
			}
		}

		p.Tags = tags
		posts = append(posts, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (s *PostService) CreatePost(ctx context.Context, userID uuid.UUID, text string, tags []string, images []*multipart.FileHeader) (Post, error) {
	tx, err := s.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return Post{}, err
	}
	defer tx.Rollback(ctx)

	var postID uuid.UUID
	err = tx.QueryRow(ctx, "INSERT INTO posts (user_id, text) VALUES ($1, $2) RETURNING id", userID, text).Scan(&postID)
	if err != nil {
		return Post{}, err
	}

	for _, tag := range tags {
		_, err := tx.Exec(ctx, "INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", tag)
		if err != nil {
			return Post{}, err
		}

		_, err = tx.Exec(ctx, "INSERT INTO post_tags (post_id, tag_id) SELECT $1, id FROM tags WHERE name = $2 ON CONFLICT DO NOTHING", postID, tag)
		if err != nil {
			return Post{}, err
		}
	}

	imageBlobs := make(chan Image, len(images)+1)
	imageGroup := errgroup.Group{}

	for _, image := range images {
		mimeType := image.Header.Get("Content-Type")
		if mimeType != "image/jpeg" && mimeType != "image/png" {
			return Post{}, errors.New("unsupported image type")
		}

		imageGroup.Go(func() error {
			file, err := image.Open()
			if err != nil {
				return err
			}
			defer file.Close()

			fileBytes, err := io.ReadAll(file)
			if err != nil {
				return err
			}

			formFile := &fiber.FormFile{
				Fieldname: "file",
				Name:      image.Filename,
				Content:   fileBytes,
			}

			agent := fiber.Post("http://host.docker.internal:5008/v1/blobs:upload")
			agent.FileData(formFile).MultipartForm(nil)

			statusCode, body, _ := agent.Bytes()
			if statusCode != 201 {
				return errors.New("failed to upload file")
			}

			var imageBlob Image
			if err := json.Unmarshal(body, &imageBlob); err != nil {
				return err
			}

			imageBlobs <- imageBlob
			return nil
		})
	}

	imageGroup.Wait()
	close(imageBlobs)

	postImages := make([]Image, 0)

	for imageBlob := range imageBlobs {
		_, err = tx.Exec(ctx, "INSERT INTO post_images (post_id, image_id, width, height) VALUES ($1, $2, $3, $4)", postID, imageBlob.ID, imageBlob.Width, imageBlob.Height)
		if err != nil {
			return Post{}, err
		}
		postImages = append(postImages, imageBlob)
	}

	if err := tx.Commit(ctx); err != nil {
		return Post{}, err
	}

	return Post{
		ID:     postID,
		UserID: userID,
		Text:   text,
		Images: postImages,
		Tags:   tags,
	}, nil
}

func (s *PostService) DeletePost(ctx context.Context, userID uuid.UUID, postID uuid.UUID) error {
	cmdTag, err := s.db.Exec(ctx, "DELETE FROM posts WHERE id = $1 AND user_id = $2", postID, userID)
	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return ErrPostNotFound
	}

	return nil
}
