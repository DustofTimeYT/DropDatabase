package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"pixora-feed/internal/api"
	"pixora-feed/internal/config"
	"pixora-feed/internal/domain"
	"syscall"

	"github.com/jackc/pgx/v5"
)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	config, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	db, err := pgx.Connect(ctx, fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		config.PostgresUser,
		config.PostgresPassword,
		config.PostgresHost,
		config.PostgresPort,
		config.PostgresDB,
	))
	if err != nil {
		log.Fatal(err)
	}

	server := api.NewServer(
		config,
		domain.NewPostService(db),
	)

	if err := server.Listen(ctx, fmt.Sprintf("0.0.0.0:%s", config.Port)); err != nil {
		log.Fatal(err)
	}
}
