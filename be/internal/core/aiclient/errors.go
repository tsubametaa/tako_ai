package aiclient

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"kka-backend-go/internal/core/response"
)

var ErrCircuitOpen = errors.New("ai service circuit breaker is open")

type UpstreamError struct {
	StatusCode int
	Code       string
	Message    string
	Retryable  bool
}

func (e *UpstreamError) Error() string {
	return e.Message
}

func ParseUpstreamError(statusCode int, body []byte) *UpstreamError {
	msg := extractMessage(body)
	switch statusCode {
	case http.StatusBadRequest:
		return &UpstreamError{StatusCode: statusCode, Code: "BAD_REQUEST", Message: msg}
	case http.StatusNotFound:
		return &UpstreamError{StatusCode: statusCode, Code: "NOT_FOUND", Message: msg}
	case http.StatusConflict:
		return &UpstreamError{StatusCode: statusCode, Code: "CONFLICT", Message: msg}
	case http.StatusRequestEntityTooLarge:
		return &UpstreamError{StatusCode: statusCode, Code: "PAYLOAD_TOO_LARGE", Message: msg}
	case http.StatusUnprocessableEntity:
		return &UpstreamError{StatusCode: statusCode, Code: "VALIDATION_ERROR", Message: msg}
	case http.StatusTooManyRequests:
		return &UpstreamError{StatusCode: statusCode, Code: "AI_RATE_LIMITED", Message: msg, Retryable: true}
	default:
		if statusCode >= 500 {
			return &UpstreamError{
				StatusCode: http.StatusServiceUnavailable,
				Code:       "AI_UNAVAILABLE",
				Message:    "Asisten sedang belum dapat merespons. Coba kembali sebentar lagi.",
				Retryable:  true,
			}
		}
		return &UpstreamError{StatusCode: statusCode, Code: "UPSTREAM_ERROR", Message: msg}
	}
}

func WriteHTTPError(c *gin.Context, err error) {
	if errors.Is(err, ErrCircuitOpen) || errors.Is(err, context.DeadlineExceeded) {
		response.ServiceUnavailable(c, "AI_UNAVAILABLE", "Asisten sedang belum dapat merespons. Coba kembali sebentar lagi.")
		return
	}
	var upErr *UpstreamError
	if errors.As(err, &upErr) {
		response.JSONError(c, upErr.StatusCode, upErr.Code, upErr.Message, upErr.Retryable)
		return
	}
	response.ServiceUnavailable(c, "AI_UNAVAILABLE", "Layanan AI sedang tidak dapat dihubungi.")
}

func extractMessage(body []byte) string {
	var parsed struct {
		Detail any `json:"detail"`
		Error  *struct {
			Message string `json:"message"`
		} `json:"error"`
		Message string `json:"message"`
	}
	if err := json.Unmarshal(body, &parsed); err == nil {
		if parsed.Error != nil && strings.TrimSpace(parsed.Error.Message) != "" {
			return strings.TrimSpace(parsed.Error.Message)
		}
		if s, ok := parsed.Detail.(string); ok && strings.TrimSpace(s) != "" {
			return strings.TrimSpace(s)
		}
		if obj, ok := parsed.Detail.(map[string]any); ok {
			if m, ok := obj["message"].(string); ok && strings.TrimSpace(m) != "" {
				return strings.TrimSpace(m)
			}
			if m, ok := obj["msg"].(string); ok && strings.TrimSpace(m) != "" {
				return strings.TrimSpace(m)
			}
		}
		if arr, ok := parsed.Detail.([]any); ok && len(arr) > 0 {
			if first, ok := arr[0].(map[string]any); ok {
				if m, ok := first["msg"].(string); ok && strings.TrimSpace(m) != "" {
					return strings.TrimSpace(m)
				}
			}
		}
		if strings.TrimSpace(parsed.Message) != "" {
			return strings.TrimSpace(parsed.Message)
		}
	}
	if text := strings.TrimSpace(string(body)); text != "" && len(text) <= 300 {
		return text
	}
	return "Permintaan ke layanan AI gagal diproses."
}

