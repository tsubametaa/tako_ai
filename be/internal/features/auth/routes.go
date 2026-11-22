package auth

import "github.com/gin-gonic/gin"

func RegisterRoutes(v1 *gin.RouterGroup, authMW gin.HandlerFunc, h *Handler) {
	group := v1.Group("/auth")
	group.GET("/login", h.LoginInfo)
	group.POST("/login", h.Login)
	group.GET("/me", authMW, h.Me)
	group.POST("/logout", authMW, h.Logout)
}
