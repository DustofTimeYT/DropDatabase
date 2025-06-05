package api

import (
	"errors"
	"fmt"
	_ "image/jpeg"
	_ "image/png"
	"path/filepath"
	"pixora-blobs/internal/domain"

	"github.com/gofiber/fiber/v2"
	"github.com/valyala/fasthttp"
)

type BlobController struct {
	blobService *domain.BlobService
}

func NewBlobController(blobService *domain.BlobService) *BlobController {
	return &BlobController{blobService: blobService}
}

func (c *BlobController) DownloadBlob(ctx *fiber.Ctx) error {
	fileID := ctx.Params("id")
	filePath := fmt.Sprintf("./static/%s.*", fileID)

	matches, err := filepath.Glob(filePath)
	if err != nil || len(matches) == 0 {
		return fiber.NewError(404, "file not found")
	}

	return ctx.Status(200).SendFile(matches[0])
}

func (c *BlobController) UploadBlob(ctx *fiber.Ctx) error {
	file, err := ctx.FormFile("file")
	if err != nil {
		if errors.Is(err, fasthttp.ErrNoMultipartForm) || errors.Is(err, fasthttp.ErrMissingFile) {
			return fiber.NewError(400, "no file provided")
		}
		return fiber.NewError(400, err.Error())
	}

	blob, err := c.blobService.UploadBlob(ctx.Context(), file)
	if err != nil {
		return fiber.NewError(500, "something went wrong")
	}

	return ctx.Status(201).JSON(blob)
}
