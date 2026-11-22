package aiclient

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
)

// PostSSE sends a JSON POST request to an upstream SSE endpoint and invokes
// onEvent for each received SSE frame in real time.
func (c *Client) PostSSE(
	ctx context.Context,
	path string,
	admin bool,
	reqBody any,
	onEvent func(eventName string, data []byte) error,
) error {
	if !c.breaker.Allow() {
		return ErrCircuitOpen
	}

	var bodyReader io.Reader
	if reqBody != nil {
		raw, err := json.Marshal(reqBody)
		if err != nil {
			return fmt.Errorf("marshal sse request: %w", err)
		}
		bodyReader = bytes.NewReader(raw)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+path, bodyReader)
	if err != nil {
		return fmt.Errorf("create sse request: %w", err)
	}
	if reqBody != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	req.Header.Set("Accept", "text/event-stream")
	req.Header.Set("Cache-Control", "no-cache")
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

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 1*1024*1024))
		if resp.StatusCode >= 500 {
			c.breaker.Failure()
		} else {
			c.breaker.Success()
		}
		return ParseUpstreamError(resp.StatusCode, body)
	}

	c.breaker.Success()
	return parseSSEStream(ctx, resp.Body, onEvent)
}

func parseSSEStream(ctx context.Context, r io.Reader, onEvent func(eventName string, data []byte) error) error {
	scanner := bufio.NewScanner(r)
	scanner.Buffer(make([]byte, 0, 64*1024), 2*1024*1024)

	var eventName string
	var dataLines []string

	flush := func() error {
		if len(dataLines) == 0 {
			eventName = ""
			return nil
		}
		ev := eventName
		if ev == "" {
			ev = "message"
		}
		payload := []byte(strings.Join(dataLines, "\n"))
		eventName = ""
		dataLines = dataLines[:0]
		return onEvent(ev, payload)
	}

	for scanner.Scan() {
		if ctx.Err() != nil {
			return ctx.Err()
		}
		line := strings.TrimRight(scanner.Text(), "\r")
		if line == "" {
			if err := flush(); err != nil {
				return err
			}
			continue
		}
		if strings.HasPrefix(line, ":") {
			continue
		}
		if strings.HasPrefix(line, "event:") {
			eventName = strings.TrimSpace(strings.TrimPrefix(line, "event:"))
		} else if strings.HasPrefix(line, "data:") {
			dataLines = append(dataLines, strings.TrimSpace(strings.TrimPrefix(line, "data:")))
		}
	}

	if err := scanner.Err(); err != nil {
		if ctx.Err() != nil {
			return ctx.Err()
		}
		return err
	}
	return flush()
}
