package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const RequestIDContextKey = "request_id"

type ErrorBody struct {
	Code      string `json:"code"`
	Message   string `json:"message"`
	RequestID string `json:"requestId"`
	Retryable bool   `json:"retryable"`
}

type ErrorEnvelope struct {
	Error ErrorBody `json:"error"`
}

func RequestID(c *gin.Context) string {
	if c == nil {
		return ""
	}
	return c.GetString(RequestIDContextKey)
}

func JSONError(c *gin.Context, status int, code, message string, retryable bool) {
	c.AbortWithStatusJSON(status, ErrorEnvelope{
		Error: ErrorBody{
			Code:      code,
			Message:   message,
			RequestID: RequestID(c),
			Retryable: retryable,
		},
	})
}

func BadRequest(c *gin.Context, code, message string) {
	JSONError(c, http.StatusBadRequest, code, message, false)
}

func Unprocessable(c *gin.Context, code, message string) {
	JSONError(c, http.StatusUnprocessableEntity, code, message, false)
}

func Unauthorized(c *gin.Context, message string) {
	JSONError(c, http.StatusUnauthorized, "UNAUTHORIZED", message, false)
}

func Forbidden(c *gin.Context, message string) {
	JSONError(c, http.StatusForbidden, "FORBIDDEN", message, false)
}

func NotFound(c *gin.Context, code, message string) {
	JSONError(c, http.StatusNotFound, code, message, false)
}

func Conflict(c *gin.Context, code, message string) {
	JSONError(c, http.StatusConflict, code, message, false)
}

func InternalError(c *gin.Context, message string) {
	JSONError(c, http.StatusInternalServerError, "INTERNAL_ERROR", message, true)
}

func ServiceUnavailable(c *gin.Context, code, message string) {
	JSONError(c, http.StatusServiceUnavailable, code, message, true)
}

