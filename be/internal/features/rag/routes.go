package rag

import "github.com/gin-gonic/gin"

func RegisterRoutes(v1 *gin.RouterGroup, authMW, guruMW, uploadLimitMW gin.HandlerFunc, h *Handler) {
	user := v1.Group("/rag", authMW)
	user.POST("/documents", uploadLimitMW, h.UploadUser)
	user.GET("/jobs/:jobId", h.GetJobStatus)
	user.GET("/documents", h.ListUserDocuments)
	user.DELETE("/documents/:docId", h.DeleteUserDocument)

	admin := v1.Group("/admin/rag", authMW, guruMW)
	admin.POST("/documents", uploadLimitMW, h.UploadGlobal)
	admin.GET("/auto-learned", h.ListAutoLearned)
	admin.DELETE("/documents/:docId", h.DeleteAdminDocument)
}

