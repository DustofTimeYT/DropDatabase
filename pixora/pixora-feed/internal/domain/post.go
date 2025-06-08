package domain

import (
	"time"

	"github.com/google/uuid"
)

type Post struct {
	ID             uuid.UUID `json:"id"`
	UserID         uuid.UUID `json:"user_id"`
	Text           string    `json:"text"`
	Images         []Image   `json:"images"`
	Tags           []string  `json:"tags"`
	UpvoteNumber   int       `json:"upvote_number"`
	DownvoteNumber int       `json:"downvote_number"`
	CreatedAt      time.Time `json:"created_at"`
}
