package api

import (
	_ "image/jpeg"
	_ "image/png"
	"pixora-feed/internal/api/auth"
	"pixora-feed/internal/domain"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type PostImage struct {
	ID      string `json:"id"`
	PostID  string `json:"post_id"`
	ImageID string `json:"image_id"`
	Width   int    `json:"width"`
	Height  int    `json:"height"`
}

type Post struct {
	ID     string      `json:"id"`
	UserID string      `json:"user_id"`
	Images []PostImage `json:"images"`
}

type Blob struct {
	ID     string `json:"id"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type PostController struct {
	postService *domain.PostService
}

type CreatePostRequest struct {
	Text string   `form:"text"`
	Tags []string `form:"tags"`
}

func NewPostController(postService *domain.PostService) *PostController {
	return &PostController{postService: postService}
}

func (c *PostController) ListPosts(ctx *fiber.Ctx) error {
	posts, err := c.postService.ListPosts(ctx.Context())
	if err != nil {
		return err
	}

	return ctx.Status(200).JSON(posts)
}

func (c *PostController) ListUserPosts(ctx *fiber.Ctx) error {
	userID, err := auth.GetUserFromContext(ctx)
	if err != nil {
		return fiber.NewError(500, "invalid user")
	}

	posts, err := c.postService.ListUserPosts(ctx.Context(), userID)
	if err != nil {
		return err
	}

	return ctx.Status(200).JSON(posts)
}

func (c *PostController) CreatePost(ctx *fiber.Ctx) error {
	userID, err := auth.GetUserFromContext(ctx)
	if err != nil {
		return fiber.NewError(500, "invalid user")
	}

	var req CreatePostRequest
	if err := ctx.BodyParser(&req); err != nil {
		return fiber.NewError(400, "invalid params")
	}

	for _, tag := range req.Tags {
		if len(tag) < 3 {
			return fiber.NewError(400, "minimun tag length is 3")
		}
	}

	form, err := ctx.MultipartForm()
	if err != nil {
		return fiber.NewError(400, "invalid form data")
	}

	images, ok := form.File["images"]
	if !ok {
		return fiber.NewError(400, "invalid images data")
	}

	post, err := c.postService.CreatePost(ctx.Context(), userID, req.Text, req.Tags, images)
	if err != nil {
		return err
	}

	return ctx.Status(200).JSON(post)
}

func (c *PostController) DeletePost(ctx *fiber.Ctx) error {
	userID, err := auth.GetUserFromContext(ctx)
	if err != nil {
		return fiber.NewError(500, "invalid user")
	}

	postIDParam := ctx.Params("id")
	if len(postIDParam) == 0 {
		return fiber.NewError(400, "id is required")
	}

	postID, err := uuid.Parse(postIDParam)
	if err != nil {
		return fiber.NewError(400, "invalid id")
	}

	err = c.postService.DeletePost(ctx.Context(), userID, postID)
	if err != nil {
		return err
	}

	return ctx.SendStatus(204)
}
