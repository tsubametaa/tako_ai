package chat

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"kka-backend-go/internal/core/aiclient"
	"kka-backend-go/internal/core/middleware"
)

type fakeChatStore struct {
	mu      sync.Mutex
	conv    ConversationRecord
	gens    map[string]GenerationRecord
	active  bool
	failErr error
}

func (f *fakeChatStore) GetOwnedConversation(_ context.Context, _, convID string) (*ConversationRecord, error) {
	if convID != f.conv.ID {
		return nil, context.DeadlineExceeded
	}
	c := f.conv
	return &c, nil
}

func (f *fakeChatStore) CreateGenerationTurn(_ context.Context, _, convID, clientReqID, content string) (*MessageDTO, *MessageDTO, *GenerationDTO, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.active {
		return nil, nil, nil, ErrActiveGeneration
	}
	f.active = true
	now := time.Now().UTC()
	genID := uuid.NewString()
	asstID := uuid.NewString()
	f.gens[genID] = GenerationRecord{ID: genID, ConversationID: convID, AssistantMessageID: asstID, Status: "queued"}
	u := &MessageDTO{ID: uuid.NewString(), ConversationID: convID, ClientRequestID: clientReqID, Role: "user", Content: content, CreatedAt: now, Status: "completed", Sources: []SourceDTO{}}
	a := &MessageDTO{ID: asstID, ConversationID: convID, ClientRequestID: clientReqID, Role: "assistant", CreatedAt: now, Status: "pending", GenerationID: &genID, Sources: []SourceDTO{}}
	g := &GenerationDTO{ID: genID, ConversationID: convID, AssistantMessageID: asstID, Status: "queued"}
	return u, a, g, nil
}

func (f *fakeChatStore) UpdateGenerationStatus(_ context.Context, genID, genStatus, _, _, lastEventID string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	g := f.gens[genID]
	g.Status = genStatus
	g.LastEventID = &lastEventID
	f.gens[genID] = g
	return nil
}

func (f *fakeChatStore) CompleteGeneration(_ context.Context, genID, msgID, answer string, sources []SourceDTO, _ string) (*MessageDTO, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.active = false
	g := f.gens[genID]
	g.Status = "completed"
	f.gens[genID] = g
	return &MessageDTO{ID: msgID, ConversationID: f.conv.ID, Role: "assistant", Content: answer, Status: "completed", GenerationID: &genID, Sources: sources}, nil
}

func (f *fakeChatStore) FailGeneration(_ context.Context, genID, _, code, errMsg, _ string) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.active = false
	g := f.gens[genID]
	g.Status = "failed"
	g.ErrorCode = &code
	g.ErrorMessage = &errMsg
	f.gens[genID] = g
	return nil
}

func (f *fakeChatStore) CancelGeneration(_ context.Context, _, genID string) (*GenerationRecord, *MessageDTO, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.active = false
	g := f.gens[genID]
	g.Status = "cancelled"
	f.gens[genID] = g
	return &g, &MessageDTO{ID: g.AssistantMessageID, Status: "cancelled", Sources: []SourceDTO{}}, nil
}

func (f *fakeChatStore) GetGenerationOwned(_ context.Context, _, genID string) (*GenerationRecord, *MessageDTO, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	g := f.gens[genID]
	return &g, &MessageDTO{ID: g.AssistantMessageID, Status: g.Status, Sources: []SourceDTO{}}, nil
}

func (f *fakeChatStore) TouchConversation(_ context.Context, convID, newTitle, newSessionID string) (*ConversationDTO, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if newTitle != "" {
		f.conv.Title = newTitle
	}
	if newSessionID != "" {
		f.conv.AISessionID = newSessionID
	}
	now := time.Now().UTC()
	return &ConversationDTO{ID: convID, Title: f.conv.Title, CreatedAt: now, UpdatedAt: now, LastActivityAt: now}, nil
}

func TestSendMessageSSEAdapterAndPrivacy(t *testing.T) {
	gin.SetMode(gin.TestMode)

	var seenAIReq map[string]any
	aiSrv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/chat" || r.Header.Get("X-API-Key") != "secret-key" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		raw, _ := io.ReadAll(r.Body)
		_ = json.Unmarshal(raw, &seenAIReq)
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{
			"session_id": "astra-sess-9",
			"answer": "Data latih dipakai melatih model, sedangkan data uji untuk evaluasi.",
			"sources": [{"title":"Modul KKA Bab 2","page":12,"excerpt":"Perbedaan train dan test"}]
		}`))
	}))
	defer aiSrv.Close()

	convID := uuid.NewString()
	userID := uuid.NewString()
	store := &fakeChatStore{
		conv: ConversationRecord{ID: convID, Title: "Percakapan Baru", AISessionID: "astra-sess-1"},
		gens: make(map[string]GenerationRecord),
	}

	aiClient := aiclient.NewClient(aiSrv.URL, "secret-key", "")
	svc := NewService(store, nil, aiClient, 2, 50*time.Millisecond, 5*time.Second, time.Minute)

	secret := "test-jwt-secret-key-at-least-32-chars"
	token, _, _ := middleware.SignToken(secret, time.Hour, middleware.CustomClaims{
		UserID:     userID,
		Role:       "siswa",
		FullName:   "Nadia Putri",
		Username:   "nadia.x",
		Identifier: "NIS-778899",
	})

	r := gin.New()
	r.Use(middleware.RequestID())
	RegisterRoutes(r.Group("/api/v1"), middleware.RequireAuth(secret, nil), func(c *gin.Context) { c.Next() }, NewHandler(svc))

	body := `{"clientRequestId":"` + uuid.NewString() + `","content":"Apa beda data latih dan data uji?","mode":"umum","consentToTraining":false}`
	req := httptest.NewRequest(http.MethodPost, "/api/v1/conversations/"+convID+"/messages", strings.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 SSE, got %d: %s", rec.Code, rec.Body.String())
	}
	sseText := rec.Body.String()
	for _, evt := range []string{"event: accepted", "event: status", "event: conversation_updated", "event: sources", "event: delta", "event: done"} {
		if !strings.Contains(sseText, evt) {
			t.Fatalf("missing SSE event %s in body:\n%s", evt, sseText)
		}
	}
	if seenAIReq["user_id"] != userID || seenAIReq["student_name"] != "Nadia Putri" {
		t.Fatalf("unexpected AI payload identity: %v", seenAIReq)
	}
	if _, hasIdentifier := seenAIReq["identifier"]; hasIdentifier {
		t.Fatalf("NIS/identifier must never be forwarded to LLM")
	}
}

func TestSendMessageQueueBackpressure503(t *testing.T) {
	gin.SetMode(gin.TestMode)
	convID := uuid.NewString()
	store := &fakeChatStore{
		conv: ConversationRecord{ID: convID, Title: "Test", AISessionID: "s1"},
		gens: make(map[string]GenerationRecord),
	}
	aiClient := aiclient.NewClient("http://127.0.0.1:1", "k", "")
	svc := NewService(store, nil, aiClient, 1, 25*time.Millisecond, time.Second, time.Minute)
	svc.sem <- struct{}{} // occupy single slot

	secret := "test-jwt-secret-key-at-least-32-chars"
	token, _, _ := middleware.SignToken(secret, time.Hour, middleware.CustomClaims{UserID: uuid.NewString(), Role: "siswa"})

	r := gin.New()
	RegisterRoutes(r.Group("/api/v1"), middleware.RequireAuth(secret, nil), func(c *gin.Context) { c.Next() }, NewHandler(svc))

	body := `{"clientRequestId":"` + uuid.NewString() + `","content":"Halo","mode":"umum"}`
	req := httptest.NewRequest(http.MethodPost, "/api/v1/conversations/"+convID+"/messages", strings.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected 503 when queue saturated, got %d: %s", rec.Code, rec.Body.String())
	}
}

