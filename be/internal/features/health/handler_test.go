package health

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"kka-backend-go/internal/core/aiclient"
)

func TestHealthDegradedWhenDependenciesMissing(t *testing.T) {
	gin.SetMode(gin.TestMode)

	aiSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/health" {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	}))
	defer aiSrv.Close()

	aiClient := aiclient.NewClient(aiSrv.URL, "secret", "")
	r := gin.New()
	RegisterRoutes(r.Group("/api/v1"), NewHandler(nil, nil, aiClient))

	req := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected 503 when supabase/redis unconfigured, got %d", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), `"ai":"ok"`) {
		t.Fatalf("expected ai ok in health output, got %s", rec.Body.String())
	}
}

