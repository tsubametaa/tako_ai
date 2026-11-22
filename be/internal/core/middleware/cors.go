package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORS(origins []string) gin.HandlerFunc {
	if len(origins) == 0 {
		origins = []string{"http://localhost:1234"}
	}

	return cors.New(cors.Config{
		AllowOrigins:  origins,
		AllowMethods:  []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:  []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Request-ID", "Last-Event-ID"},
		ExposeHeaders: []string{"X-Request-ID", "Retry-After", "Content-Length", "Content-Disposition"},
		MaxAge:        12 * time.Hour,
	})
}

