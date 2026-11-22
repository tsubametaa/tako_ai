package memory

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"kka-backend-go/internal/core/aiclient"
)

var ErrEmptyPayload = errors.New("knowledge payload cannot be empty")

type Service struct {
	aiClient  *aiclient.Client
	aiTimeout time.Duration
}

func NewService(aiClient *aiclient.Client, aiTimeout time.Duration) *Service {
	return &Service{aiClient: aiClient, aiTimeout: aiTimeout}
}

func (s *Service) AddKnowledge(ctx context.Context, userID string, payload map[string]any) (map[string]any, error) {
	if len(payload) == 0 {
		return nil, ErrEmptyPayload
	}
	delete(payload, "user_id")

	aiCtx, cancel := context.WithTimeout(ctx, s.aiTimeout)
	defer cancel()

	var out map[string]any
	path := fmt.Sprintf("/api/users/%s/knowledge", url.PathEscape(userID))
	if err := s.aiClient.DoJSON(aiCtx, http.MethodPost, path, false, payload, &out); err != nil {
		return nil, err
	}
	if out == nil {
		out = map[string]any{"saved": true}
	}
	return out, nil
}

func (s *Service) DeleteMemory(ctx context.Context, userID string) (map[string]any, error) {
	aiCtx, cancel := context.WithTimeout(ctx, s.aiTimeout)
	defer cancel()

	var out map[string]any
	path := fmt.Sprintf("/api/users/%s/memory", url.PathEscape(userID))
	if err := s.aiClient.DoJSON(aiCtx, http.MethodDelete, path, false, nil, &out); err != nil {
		return nil, err
	}
	if out == nil {
		out = map[string]any{"deleted": true}
	}
	return out, nil
}

