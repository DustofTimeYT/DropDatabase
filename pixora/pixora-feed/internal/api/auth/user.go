package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func GetUserFromContext(ctx *fiber.Ctx) (uuid.UUID, error) {
	user := ctx.Locals("user").(*jwt.Token)

	claims := user.Claims.(jwt.MapClaims)
	userID := claims["sub"].(string)

	return uuid.Parse(userID)
}
