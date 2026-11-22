package auth

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"kka-backend-go/internal/core/middleware"
	"kka-backend-go/internal/core/response"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) LoginInfo(c *gin.Context) {
	id := c.Query("identifier")
	pw := c.Query("password")
	if id != "" && pw != "" {
		res, err := h.svc.Login(c.Request.Context(), LoginRequest{Identifier: id, Password: pw})
		if err != nil {
			if errors.Is(err, ErrInvalidCredentials) {
				response.Unauthorized(c, "Username/identifier atau kata sandi salah.")
				return
			}
			response.BadRequest(c, "LOGIN_FAILED", err.Error())
			return
		}
		c.JSON(http.StatusOK, res)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"endpoint": "POST /api/v1/auth/login",
		"status":   "ready",
		"message":  "Endpoint login aktif. Gunakan metode POST dengan JSON {identifier, password}.",
	})
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "INVALID_JSON", "Format JSON login tidak valid.")
		return
	}

	res, err := h.svc.Login(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, ErrValidation) {
			response.Unprocessable(c, "VALIDATION_ERROR", "Identifier minimal 3 karakter dan kata sandi minimal 4 karakter.")
			return
		}
		if errors.Is(err, ErrInvalidCredentials) {
			response.Unauthorized(c, "Username/identifier atau kata sandi salah.")
			return
		}
		response.InternalError(c, "Gagal memproses login.")
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *Handler) Me(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": h.svc.ResolveUserDTO(c.Request.Context(), claims),
	})
}

func (h *Handler) Logout(c *gin.Context) {
	claims, ok := middleware.ClaimsFromContext(c)
	if !ok {
		response.Unauthorized(c, "Sesi tidak valid.")
		return
	}

	if err := h.svc.Logout(c.Request.Context(), claims); err != nil {
		response.InternalError(c, "Gagal mencabut sesi.")
		return
	}

	c.JSON(http.StatusOK, gin.H{"loggedOut": true})
}

