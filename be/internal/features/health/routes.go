package health

import "github.com/gin-gonic/gin"

func RegisterRoutes(v1 *gin.RouterGroup, h *Handler) {
	v1.GET("/health", h.Check)
}

