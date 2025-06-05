package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"pixora-blobs/internal/api"
	"pixora-blobs/internal/config"
	"pixora-blobs/internal/domain"
	"syscall"
)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	config, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	server := api.NewServer(
		domain.NewBlobService(config.UploadFolder),
	)

	if err := server.Listen(ctx, fmt.Sprintf("0.0.0.0:%s", config.Port)); err != nil {
		log.Fatal(err)
	}
}
