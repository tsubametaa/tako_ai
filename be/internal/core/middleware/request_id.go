package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"kka-backend-go/internal/core/aiclient"
	"kka-backend-go/internal/core/response"
)

const RequestIDHeader = "X-Request-ID"

func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := strings.TrimSpace(c.GetHeader(RequestIDHeader))
		if id == "" || len(id) > 64 || strings.ContainsAny(id, " \t\r\n") {
			id = uuid.NewString()
		}

		c.Set(response.RequestIDContextKey, id)
		c.Request = c.Request.WithContext(aiclient.WithRequestID(c.Request.Context(), id))
		c.Writer.Header().Set(RequestIDHeader, id)
		c.Next()
	}
}

