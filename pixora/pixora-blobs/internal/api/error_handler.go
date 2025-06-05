package api

import (
	"errors"

	"github.com/gofiber/fiber/v2"
)

func ErrorHandler(ctx *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError

	var e *fiber.Error
	if errors.As(err, &e) {
		code = e.Code
	}

	apiError := map[string]any{
		"error": map[string]any{
			"code":    code,
			"message": err.Error(),
		},
	}

	return ctx.Status(code).JSON(apiError)
}
