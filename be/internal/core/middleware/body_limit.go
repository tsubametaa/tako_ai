package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"kka-backend-go/internal/core/response"
)

func BodyLimit(maxBytes int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.ContentLength > maxBytes {
			response.JSONError(c, http.StatusRequestEntityTooLarge, "PAYLOAD_TOO_LARGE", "Ukuran file atau payload melebihi batas maksimal.", false)
			return
		}
		if c.Request.Body != nil {
			c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)
		}
		c.Next()
	}
}

