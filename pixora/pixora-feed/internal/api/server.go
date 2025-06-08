package api

import (
	"context"
	"pixora-feed/internal/config"
	"pixora-feed/internal/domain"
	"time"

	"golang.org/x/sync/errgroup"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type Server struct {
	app *fiber.App
}

func NewServer(config config.Config, postService *domain.PostService) *Server {
	app := fiber.New(fiber.Config{
		ErrorHandler: ErrorHandler,
	})

	app.Use(cors.New())
	app.Use(logger.New())

	app.Use(jwtware.New(jwtware.Config{
		JWKSetURLs: []string{config.JWKSURL},
	}))

	postsController := NewPostController(postService)

	app.Get("/v1/posts/all", postsController.ListPosts)
	app.Get("/v1/posts/user", postsController.ListUserPosts)
	app.Post("/v1/posts", postsController.CreatePost)
	app.Delete("/v1/posts/:id", postsController.DeletePost)

	return &Server{app: app}
}

func (s *Server) Listen(ctx context.Context, addr string) error {
	g, ctx := errgroup.WithContext(ctx)

	g.Go(func() error {
		return s.app.Listen(addr)
	})

	g.Go(func() error {
		<-ctx.Done()
		return s.app.ShutdownWithTimeout(15 * time.Second)
	})

	return g.Wait()
}
