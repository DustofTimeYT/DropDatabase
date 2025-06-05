package api

import (
	"context"
	"pixora-blobs/internal/domain"
	"time"

	"golang.org/x/sync/errgroup"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type Server struct {
	app *fiber.App
}

func NewServer(blobService *domain.BlobService) *Server {
	app := fiber.New(fiber.Config{
		ErrorHandler: ErrorHandler,
	})

	app.Use(cors.New())
	app.Use(logger.New())

	blobController := NewBlobController(blobService)

	app.Get("/v1/blobs/:id", blobController.DownloadBlob)
	app.Post("/v1/blobs:upload", blobController.UploadBlob)

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
