package domain

import "github.com/google/uuid"

type Blob struct {
	ID     uuid.UUID `json:"id"`
	Width  int       `json:"width"`
	Height int       `json:"height"`
}
