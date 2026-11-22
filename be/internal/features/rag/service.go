package rag

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"kka-backend-go/internal/core/aiclient"
)

type Service struct {
	aiClient       *aiclient.Client
	sem            chan struct{}
	queueWait      time.Duration
	uploadTimeout  time.Duration
	defaultTimeout time.Duration
}

func NewService(aiClient *aiclient.Client, maxInflight int, queueWait, uploadTimeout, defaultTimeout time.Duration) *Service {
	if maxInflight <= 0 {
		maxInflight = 3
	}
	return &Service{
		aiClient:       aiClient,
		sem:            make(chan struct{}, maxInflight),
		queueWait:      queueWait,
		uploadTimeout:  uploadTimeout,
		defaultTimeout: defaultTimeout,
	}
}

func (s *Service) UploadDocument(ctx context.Context, in UploadInput) (map[string]any, error) {
	if in.File == nil || in.Filename == "" || !isAllowedExtension(in.Filename) {
		return nil, ErrValidation
	}

	waitCtx, cancelWait := context.WithTimeout(ctx, s.queueWait)
	defer cancelWait()

	select {
	case s.sem <- struct{}{}:
		defer func() { <-s.sem }()
	case <-waitCtx.Done():
		if ctx.Err() != nil {
			return nil, ctx.Err()
		}
		return nil, ErrQueueFull
	}

	fields := make(map[string]string, len(in.ExtraFields)+2)
	for k, v := range in.ExtraFields {
		fields[k] = v
	}
	fields["user_id"] = in.UserID
	fields["scope"] = in.Scope

	aiCtx, cancelAI := context.WithTimeout(ctx, s.uploadTimeout)
	defer cancelAI()

	var out map[string]any
	err := s.aiClient.ProxyMultipart(
		aiCtx,
		"/api/rag/documents",
		in.Admin,
		"file",
		in.Filename,
		in.ContentType,
		in.File,
		fields,
		&out,
	)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (s *Service) GetJobStatus(ctx context.Context, userID, jobID string) (map[string]any, error) {
	aiCtx, cancel := context.WithTimeout(ctx, s.defaultTimeout)
	defer cancel()

	var out map[string]any
	path := fmt.Sprintf("/api/rag/jobs/%s?user_id=%s", url.PathEscape(jobID), url.QueryEscape(userID))
	if err := s.aiClient.DoJSONWithRetry(aiCtx, path, false, &out); err != nil {
		return nil, err
	}
	return out, nil
}

func (s *Service) ListUserDocuments(ctx context.Context, userID string) (any, error) {
	aiCtx, cancel := context.WithTimeout(ctx, s.defaultTimeout)
	defer cancel()

	var out any
	path := fmt.Sprintf("/api/users/%s/documents", url.PathEscape(userID))
	if err := s.aiClient.DoJSONWithRetry(aiCtx, path, false, &out); err != nil {
		return nil, err
	}
	return out, nil
}

func (s *Service) DeleteUserDocument(ctx context.Context, userID, docID string) (map[string]any, error) {
	aiCtx, cancel := context.WithTimeout(ctx, s.defaultTimeout)
	defer cancel()

	var out map[string]any
	path := fmt.Sprintf("/api/rag/documents/%s?user_id=%s", url.PathEscape(docID), url.QueryEscape(userID))
	if err := s.aiClient.DoJSON(aiCtx, http.MethodDelete, path, false, nil, &out); err != nil {
		return nil, err
	}
	if out == nil {
		out = map[string]any{"deleted": true}
	}
	return out, nil
}

func (s *Service) ListAutoLearned(ctx context.Context, limit int) (any, error) {
	if limit <= 0 || limit > 200 {
		limit = 50
	}
	aiCtx, cancel := context.WithTimeout(ctx, s.defaultTimeout)
	defer cancel()

	var out any
	path := "/api/rag/auto-learned?limit=" + strconv.Itoa(limit)
	if err := s.aiClient.DoJSONWithRetry(aiCtx, path, true, &out); err != nil {
		return nil, err
	}
	return out, nil
}

func (s *Service) DeleteAdminDocument(ctx context.Context, docID string) (map[string]any, error) {
	aiCtx, cancel := context.WithTimeout(ctx, s.defaultTimeout)
	defer cancel()

	var out map[string]any
	path := fmt.Sprintf("/api/rag/documents/%s", url.PathEscape(docID))
	if err := s.aiClient.DoJSON(aiCtx, http.MethodDelete, path, true, nil, &out); err != nil {
		return nil, err
	}
	if out == nil {
		out = map[string]any{"deleted": true}
	}
	return out, nil
}

