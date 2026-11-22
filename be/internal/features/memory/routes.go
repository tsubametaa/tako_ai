package memory

import "github.com/gin-gonic/gin"

func RegisterRoutes(v1 *gin.RouterGroup, authMW gin.HandlerFunc, h *Handler) {
	group := v1.Group("/memory", authMW)
	group.POST("/knowledge", h.AddKnowledge)
	group.DELETE("", h.DeleteMemory)
}

