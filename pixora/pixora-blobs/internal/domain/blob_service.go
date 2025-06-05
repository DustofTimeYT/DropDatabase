package domain

import (
	"context"
	"image"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"

	_ "image/jpeg"
	_ "image/png"

	"github.com/google/uuid"
)

type BlobService struct {
	uploadPath string
}

func NewBlobService(uploadPath string) *BlobService {
	return &BlobService{
		uploadPath: uploadPath,
	}
}

func (s *BlobService) UploadBlob(ctx context.Context, file *multipart.FileHeader) (Blob, error) {
	fileID, err := uuid.NewV7()
	if err != nil {
		return Blob{}, err
	}

	fileName := fileID.String() + filepath.Ext(file.Filename)
	filePath := filepath.Join(s.uploadPath, fileName)

	if err := saveFile(file, filePath); err != nil {
		return Blob{}, err
	}

	imgFile, err := os.Open(filePath)
	if err != nil {
		return Blob{}, err
	}
	defer imgFile.Close()

	image, _, err := image.DecodeConfig(imgFile)
	if err != nil {
		return Blob{}, err
	}

	return Blob{
		ID:     fileID,
		Width:  image.Width,
		Height: image.Height,
	}, nil
}

func saveFile(file *multipart.FileHeader, path string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	dst, err := os.Create(path)
	if err != nil {
		return err
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	return nil
}
