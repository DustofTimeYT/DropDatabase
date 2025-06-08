package domain

import (
	"github.com/google/uuid"
)

type Image struct {
	ID     uuid.UUID `json:"id"`
	Width  int       `json:"width"`
	Height int       `json:"height"`
}
