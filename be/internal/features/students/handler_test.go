package students

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

type stubStore struct {
	students []StudentDTO
	classes  []ClassOptionDTO
	err      error
}

func (s *stubStore) ListClasses(_ context.Context) ([]ClassOptionDTO, error) {
	return s.classes, nil
}

func (s *stubStore) ListStudents(_ context.Context, _, _ string, page, pageSize int) ([]StudentDTO, int, error) {
	if s.err != nil {
		return nil, 0, s.err
	}
	total := len(s.students)
	start := (page - 1) * pageSize
	if start >= total {
		return []StudentDTO{}, total, nil
	}
	end := start + pageSize
	if end > total {
		end = total
	}
	return s.students[start:end], total, nil
}

func (s *stubStore) CreateStudent(_ context.Context, req CreateStudentRequest) (*StudentDTO, error) {
	if s.err != nil {
		return nil, s.err
	}
	return &StudentDTO{
		ID:         "11111111-1111-1111-1111-111111111111",
		FullName:   req.FullName,
		Username:   req.Username,
		Identifier: req.Identifier,
		Role:       "siswa",
		ClassID:    req.ClassID,
	}, nil
}

func (s *stubStore) UpdateStudent(_ context.Context, id string, req UpdateStudentRequest) (*StudentDTO, error) {
	if s.err != nil {
		return nil, s.err
	}
	return &StudentDTO{
		ID:         id,
		FullName:   req.FullName,
		Username:   req.Username,
		Identifier: req.Identifier,
		Role:       "siswa",
		ClassID:    req.ClassID,
	}, nil
}

func (s *stubStore) DeleteStudent(_ context.Context, _ string) error {
	return s.err
}

func setupRouter(store Store) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	v1 := r.Group("/api/v1")
	passthrough := func(c *gin.Context) { c.Next() }
	RegisterAdminRoutes(v1, passthrough, passthrough, NewHandler(store))
	return r
}

func TestStudentsHandlerValidationAndCRUD(t *testing.T) {
	store := &stubStore{
		classes: []ClassOptionDTO{{ID: "c1", Name: "X RPL 1", GradeLevel: "X"}},
		students: []StudentDTO{
			{ID: "s1", FullName: "Firzy Muttaqin", Username: "15049", ClassID: "c1", ClassName: "X RPL 1"},
		},
	}
	r := setupRouter(store)

	// 1. GET list with pagination
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/v1/admin/students?page=1&page_size=10", nil)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", rec.Code, rec.Body.String())
	}
	var listRes ListStudentsResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &listRes); err != nil {
		t.Fatalf("unmarshal list response: %v", err)
	}
	if listRes.Pagination.Page != 1 || listRes.Pagination.PageSize != 10 || listRes.Pagination.TotalItems != 1 {
		t.Fatalf("unexpected pagination: %+v", listRes.Pagination)
	}

	// 2. POST validation failure (short password)
	badBody, _ := json.Marshal(CreateStudentRequest{FullName: "Siswa Baru", Username: "siswa.baru", Password: "12"})
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/admin/students", bytes.NewReader(badBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for short password, got %d", rec.Code)
	}

	// 3. POST valid student
	okBody, _ := json.Marshal(CreateStudentRequest{FullName: "Siswa Baru", Username: "siswa.baru", Password: "password123"})
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/admin/students", bytes.NewReader(okBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", rec.Code, rec.Body.String())
	}

	// 4. POST duplicate username returns 409
	store.err = ErrUsernameExists
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPost, "/api/v1/admin/students", bytes.NewReader(okBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusConflict {
		t.Fatalf("expected 409 for duplicate username, got %d", rec.Code)
	}

	// 5. PUT without password change succeeds
	store.err = nil
	updBody, _ := json.Marshal(UpdateStudentRequest{FullName: "Firzy Updated", Username: "15049"})
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodPut, "/api/v1/admin/students/s1", bytes.NewReader(updBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on update, got %d: %s", rec.Code, rec.Body.String())
	}

	// 6. DELETE returns 200
	rec = httptest.NewRecorder()
	req = httptest.NewRequest(http.MethodDelete, "/api/v1/admin/students/s1", nil)
	r.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on delete, got %d", rec.Code)
	}
}
