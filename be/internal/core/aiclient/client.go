package aiclient

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand/v2"
	"mime/multipart"
	"net"
	"net/http"
	"net/textproto"
	"strings"
	"time"
)

type ctxKeyRequestID struct{}

func WithRequestID(ctx context.Context, requestID string) context.Context {
	return context.WithValue(ctx, ctxKeyRequestID{}, requestID)
}

func RequestIDFromContext(ctx context.Context) string {
	if v, ok := ctx.Value(ctxKeyRequestID{}).(string); ok {
		return v
	}
	return ""
}

type Client struct {
	baseURL        string
	internalSecret string
	adminSecret    string
	httpClient     *http.Client
	breaker        *CircuitBreaker
}

func NewClient(baseURL, internalSecret, adminSecret string) *Client {
	transport := &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   10 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		ForceAttemptHTTP2:     true,
		MaxIdleConns:          100,
		MaxIdleConnsPerHost:   50,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ResponseHeaderTimeout: 180 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
	}

	return &Client{
		baseURL:        strings.TrimRight(baseURL, "/"),
		internalSecret: internalSecret,
		adminSecret:    adminSecret,
		httpClient:     &http.Client{Transport: transport},
		breaker:        NewCircuitBreaker(5, 15*time.Second),
	}
}

func (c *Client) DoJSON(ctx context.Context, method, path string, admin bool, reqBody any, out any) error {
	if !c.breaker.Allow() {
		return ErrCircuitOpen
	}

	var bodyReader io.Reader
	if reqBody != nil {
		raw, err := json.Marshal(reqBody)
		if err != nil {
			return fmt.Errorf("marshal request: %w", err)
		}
		bodyReader = bytes.NewReader(raw)
	}

	req, err := http.NewRequestWithContext(ctx, method, c.baseURL+path, bodyReader)
	if err != nil {
		return fmt.Errorf("create request: %w", err)
	}
	if reqBody != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	c.applyHeaders(ctx, req, admin)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		if !errors.Is(err, context.Canceled) {
			c.breaker.Failure()
		}
		return err
	}
	defer func() {
		_, _ = io.Copy(io.Discard, resp.Body)
		_ = resp.Body.Close()
	}()

	return c.decodeResponse(resp, out)
}

// DoJSONWithRetry retries only idempotent GET calls; never use for POST /api/chat.
func (c *Client) DoJSONWithRetry(ctx context.Context, path string, admin bool, out any) error {
	const maxAttempts = 3
	var lastErr error

	for attempt := range maxAttempts {
		if attempt > 0 {
			backoff := time.Duration(150*(1<<(attempt-1)))*time.Millisecond + time.Duration(rand.IntN(75))*time.Millisecond
			timer := time.NewTimer(backoff)
			select {
			case <-ctx.Done():
				timer.Stop()
				return ctx.Err()
			case <-timer.C:
			}
		}

		err := c.DoJSON(ctx, http.MethodGet, path, admin, nil, out)
		if err == nil {
			return nil
		}
		lastErr = err

		if errors.Is(err, context.Canceled) || errors.Is(err, ErrCircuitOpen) {
			return err
		}
		var upErr *UpstreamError
		if errors.As(err, &upErr) && upErr.StatusCode < 500 && upErr.StatusCode != http.StatusTooManyRequests {
			return err
		}
	}
	return lastErr
}

func (c *Client) ProxyMultipart(
	ctx context.Context,
	path string,
	admin bool,
	fileField string,
	filename string,
	contentType string,
	fileSrc io.Reader,
	extraFields map[string]string,
	out any,
) error {
	if !c.breaker.Allow() {
		return ErrCircuitOpen
	}

	pr, pw := io.Pipe()
	mw := multipart.NewWriter(pw)

	go func() {
		defer pw.Close()
		for k, v := range extraFields {
			if err := mw.WriteField(k, v); err != nil {
				_ = pw.CloseWithError(err)
				return
			}
		}

		h := make(textproto.MIMEHeader)
		h.Set("Content-Disposition", fmt.Sprintf(`form-data; name="%s"; filename="%s"`, escapeQuotes(fileField), escapeQuotes(filename)))
		if contentType == "" {
			contentType = "application/octet-stream"
		}
		h.Set("Content-Type", contentType)

		part, err := mw.CreatePart(h)
		if err != nil {
			_ = pw.CloseWithError(err)
			return
		}
		if _, err := io.Copy(part, fileSrc); err != nil {
			_ = pw.CloseWithError(err)
			return
		}
		if err := mw.Close(); err != nil {
			_ = pw.CloseWithError(err)
		}
	}()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+path, pr)
	if err != nil {
		_ = pr.Close()
		return fmt.Errorf("create multipart request: %w", err)
	}
	req.Header.Set("Content-Type", mw.FormDataContentType())
	c.applyHeaders(ctx, req, admin)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		_ = pr.Close()
		if !errors.Is(err, context.Canceled) {
			c.breaker.Failure()
		}
		return err
	}
	defer func() {
		_, _ = io.Copy(io.Discard, resp.Body)
		_ = resp.Body.Close()
	}()

	return c.decodeResponse(resp, out)
}

func (c *Client) applyHeaders(ctx context.Context, req *http.Request, admin bool) {
	req.Header.Set("X-API-Key", c.internalSecret)
	if admin && c.adminSecret != "" {
		req.Header.Set("X-Admin-Key", c.adminSecret)
	}
	if reqID := RequestIDFromContext(ctx); reqID != "" {
		req.Header.Set("X-Request-ID", reqID)
	}
}

func (c *Client) decodeResponse(resp *http.Response, out any) error {
	body, err := io.ReadAll(io.LimitReader(resp.Body, 8*1024*1024))
	if err != nil {
		c.breaker.Failure()
		return fmt.Errorf("read upstream response: %w", err)
	}

	if resp.StatusCode >= 500 {
		c.breaker.Failure()
		return ParseUpstreamError(resp.StatusCode, body)
	}
	c.breaker.Success()

	if resp.StatusCode >= 400 {
		return ParseUpstreamError(resp.StatusCode, body)
	}
	if out != nil && len(bytes.TrimSpace(body)) > 0 {
		if err := json.Unmarshal(body, out); err != nil {
			return fmt.Errorf("decode upstream json: %w", err)
		}
	}
	return nil
}

func escapeQuotes(s string) string {
	s = strings.ReplaceAll(s, `\`, `\\`)
	return strings.ReplaceAll(s, `"`, `\"`)
}

