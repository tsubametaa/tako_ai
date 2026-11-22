package students

import (
	"errors"
	"log/slog"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"kka-backend-go/internal/core/response"
)

type Handler struct {
	store Store
}

func NewHandler(store Store) *Handler {
	return &Handler{store: store}
}

func RegisterAdminRoutes(v1 *gin.RouterGroup, authMW, guruMW gin.HandlerFunc, h *Handler) {
	admin := v1.Group("/admin/students", authMW, guruMW)
	admin.GET("", h.List)
	admin.POST("", h.Create)
	admin.PUT("/:id", h.Update)
	admin.DELETE("/:id", h.Delete)
}

func (h *Handler) List(c *gin.Context) {
	q := strings.TrimSpace(c.Query("q"))
	classID := strings.TrimSpace(c.Query("class_id"))

	page, _ := strconv.Atoi(c.Query("page"))
	if page < 1 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(c.Query("page_size"))
	if pageSize <= 0 {
		pageSize = 15
	} else if pageSize < 5 {
		pageSize = 5
	} else if pageSize > 100 {
		pageSize = 100
	}

	items, totalItems, err := h.store.ListStudents(c.Request.Context(), q, classID, page, pageSize)
	if err != nil {
		slog.Error("failed to list students", "error", err)
		response.InternalError(c, "Gagal memuat daftar akun siswa.")
		return
	}

	totalPages := 1
	if totalItems > 0 {
		totalPages = (totalItems + pageSize - 1) / pageSize
		if page > totalPages {
			page = totalPages
			items, totalItems, err = h.store.ListStudents(c.Request.Context(), q, classID, page, pageSize)
			if err != nil {
				slog.Error("failed to reload clamped students page", "error", err)
				response.InternalError(c, "Gagal memuat daftar akun siswa.")
				return
			}
		}
	}

	classes, err := h.store.ListClasses(c.Request.Context())
	if err != nil {
		slog.Warn("failed to list classes", "error", err)
		classes = []ClassOptionDTO{}
	}

	c.JSON(http.StatusOK, ListStudentsResponse{
		Items:   items,
		Classes: classes,
		Pagination: PaginationDTO{
			Page:       page,
			PageSize:   pageSize,
			TotalItems: totalItems,
			TotalPages: totalPages,
		},
	})
}

func (h *Handler) Create(c *gin.Context) {
	var req CreateStudentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "INVALID_PAYLOAD", "Format permintaan tidak valid.")
		return
	}

	req.FullName = strings.TrimSpace(req.FullName)
	req.Username = strings.TrimSpace(req.Username)
	req.Identifier = strings.TrimSpace(req.Identifier)
	req.ClassID = strings.TrimSpace(req.ClassID)

	if msg := validateStudentFields(req.FullName, req.Username, req.Password, true); msg != "" {
		response.BadRequest(c, "VALIDATION_ERROR", msg)
		return
	}

	created, err := h.store.CreateStudent(c.Request.Context(), req)
	if err != nil {
		switch {
		case errors.Is(err, ErrUsernameExists):
			response.Conflict(c, "USERNAME_EXISTS", "Username sudah digunakan oleh akun lain.")
		case errors.Is(err, ErrInvalidClass):
			response.BadRequest(c, "INVALID_CLASS", "Kelas yang dipilih tidak valid.")
		default:
			slog.Error("failed to create student", "error", err)
			response.InternalError(c, "Gagal membuat akun siswa baru.")
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"student": created})
}

func (h *Handler) Update(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		response.BadRequest(c, "INVALID_ID", "ID siswa wajib diisi.")
		return
	}

	var req UpdateStudentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "INVALID_PAYLOAD", "Format permintaan tidak valid.")
		return
	}

	req.FullName = strings.TrimSpace(req.FullName)
	req.Username = strings.TrimSpace(req.Username)
	req.Identifier = strings.TrimSpace(req.Identifier)
	req.ClassID = strings.TrimSpace(req.ClassID)

	if msg := validateStudentFields(req.FullName, req.Username, req.Password, false); msg != "" {
		response.BadRequest(c, "VALIDATION_ERROR", msg)
		return
	}

	updated, err := h.store.UpdateStudent(c.Request.Context(), id, req)
	if err != nil {
		switch {
		case errors.Is(err, ErrNotFound):
			response.NotFound(c, "STUDENT_NOT_FOUND", "Akun siswa tidak ditemukan.")
		case errors.Is(err, ErrUsernameExists):
			response.Conflict(c, "USERNAME_EXISTS", "Username sudah digunakan oleh akun lain.")
		case errors.Is(err, ErrInvalidClass):
			response.BadRequest(c, "INVALID_CLASS", "Kelas yang dipilih tidak valid.")
		default:
			slog.Error("failed to update student", "id", id, "error", err)
			response.InternalError(c, "Gagal memperbarui akun siswa.")
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"student": updated})
}

func (h *Handler) Delete(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		response.BadRequest(c, "INVALID_ID", "ID siswa wajib diisi.")
		return
	}

	if err := h.store.DeleteStudent(c.Request.Context(), id); err != nil {
		if errors.Is(err, ErrNotFound) {
			response.NotFound(c, "STUDENT_NOT_FOUND", "Akun siswa tidak ditemukan.")
			return
		}
		slog.Error("failed to delete student", "id", id, "error", err)
		response.InternalError(c, "Gagal menghapus akun siswa.")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"deleted": true,
		"id":      id,
	})
}

func validateStudentFields(fullName, username, password string, passwordRequired bool) string {
	if len(fullName) < 2 {
		return "Nama lengkap siswa minimal 2 karakter."
	}
	if len(username) < 3 {
		return "Username minimal 3 karakter."
	}
	if strings.ContainsAny(username, " \t\r\n") {
		return "Username tidak boleh mengandung spasi."
	}
	if passwordRequired && len(password) < 4 {
		return "Kata sandi awal minimal 4 karakter."
	}
	if !passwordRequired && password != "" && len(password) < 4 {
		return "Kata sandi baru minimal 4 karakter."
	}
	return ""
}
