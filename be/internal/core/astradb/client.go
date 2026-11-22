package astradb

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"strings"
	"time"
)

var ErrNotConfigured = errors.New("astra db is not configured")

type Client struct {
	collectionURL string
	token         string
	httpClient    *http.Client
}

func NewClient(endpoint, token, keyspace, collection string) *Client {
	endpoint = strings.TrimRight(strings.TrimSpace(endpoint), "/")
	token = strings.TrimSpace(token)
	keyspace = strings.TrimSpace(keyspace)
	if keyspace == "" {
		keyspace = "rag"
	}
	collection = strings.TrimSpace(collection)
	if collection == "" {
		collection = "chat_history"
	}

	var colURL string
	if endpoint != "" && token != "" {
		colURL = fmt.Sprintf("%s/api/json/v1/%s/%s", endpoint, keyspace, collection)
	}

	transport := &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   10 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		ForceAttemptHTTP2:     true,
		MaxIdleConns:          50,
		MaxIdleConnsPerHost:   25,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ResponseHeaderTimeout: 15 * time.Second,
	}

	return &Client{
		collectionURL: colURL,
		token:         token,
		httpClient: &http.Client{
			Transport: transport,
			Timeout:   15 * time.Second,
		},
	}
}

func (c *Client) IsConfigured() bool {
	return c != nil && c.collectionURL != "" && c.token != ""
}

type apiResponse struct {
	Data struct {
		Document      json.RawMessage   `json:"document"`
		Documents     []json.RawMessage `json:"documents"`
		NextPageState *string           `json:"nextPageState"`
	} `json:"data"`
	Status map[string]any `json:"status"`
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors"`
}

func (c *Client) Execute(ctx context.Context, command map[string]any) (*apiResponse, error) {
	if !c.IsConfigured() {
		return nil, ErrNotConfigured
	}

	rawBody, err := json.Marshal(command)
	if err != nil {
		return nil, fmt.Errorf("marshal astra command: %w", err)
	}

	const maxAttempts = 3
	var lastErr error

	for attempt := range maxAttempts {
		if attempt > 0 {
			backoff := time.Duration(1<<attempt) * time.Second
			timer := time.NewTimer(backoff)
			select {
			case <-ctx.Done():
				timer.Stop()
				return nil, ctx.Err()
			case <-timer.C:
			}
		}

		res, status, err := c.doOnce(ctx, rawBody)
		if err == nil {
			return res, nil
		}
		lastErr = err
		if status != http.StatusTooManyRequests && status < 500 {
			return nil, err
		}
	}

	return nil, lastErr
}

func (c *Client) doOnce(ctx context.Context, rawBody []byte) (*apiResponse, int, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.collectionURL, bytes.NewReader(rawBody))
	if err != nil {
		return nil, 0, fmt.Errorf("create astra request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Token", c.token)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, 0, fmt.Errorf("astra http error: %w", err)
	}
	defer func() {
		_, _ = io.Copy(io.Discard, resp.Body)
		_ = resp.Body.Close()
	}()

	bodyBytes, err := io.ReadAll(io.LimitReader(resp.Body, 8*1024*1024))
	if err != nil {
		return nil, resp.StatusCode, fmt.Errorf("read astra response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, resp.StatusCode, fmt.Errorf("astra http %d: %s", resp.StatusCode, strings.TrimSpace(string(bodyBytes)))
	}

	var parsed apiResponse
	if err := json.Unmarshal(bodyBytes, &parsed); err != nil {
		return nil, resp.StatusCode, fmt.Errorf("decode astra response: %w", err)
	}
	if len(parsed.Errors) > 0 {
		return nil, resp.StatusCode, fmt.Errorf("astra api error: %s", parsed.Errors[0].Message)
	}

	return &parsed, resp.StatusCode, nil
}

func (c *Client) FindOne(ctx context.Context, filter map[string]any, out any) (bool, error) {
	res, err := c.Execute(ctx, map[string]any{
		"findOne": map[string]any{
			"filter": filter,
		},
	})
	if err != nil {
		return false, err
	}
	if len(res.Data.Document) == 0 || string(res.Data.Document) == "null" {
		return false, nil
	}
	if out != nil {
		if err := json.Unmarshal(res.Data.Document, out); err != nil {
			return false, err
		}
	}
	return true, nil
}

func (c *Client) Find(ctx context.Context, filter map[string]any, sort map[string]any, limit int, outSlicePtr any) error {
	maxPages := 10
	if limit > 200 {
		maxPages = (limit + 19) / 20
	}
	return c.findPaged(ctx, filter, sort, limit, maxPages, outSlicePtr)
}

// FindAll mengambil seluruh dokumen yang cocok melintasi semua halaman cursor Astra DB.
func (c *Client) FindAll(ctx context.Context, filter map[string]any, sort map[string]any, outSlicePtr any) error {
	const safetyMaxPages = 5000
	return c.findPaged(ctx, filter, sort, 0, safetyMaxPages, outSlicePtr)
}

func (c *Client) findPaged(ctx context.Context, filter map[string]any, sort map[string]any, limit, maxPages int, outSlicePtr any) error {
	collected := make([]json.RawMessage, 0)
	var pageState string

	for page := 0; page < maxPages; page++ {
		findCmd := map[string]any{
			"filter": filter,
		}
		if len(sort) > 0 {
			findCmd["sort"] = sort
		}
		opts := map[string]any{}
		if limit > 0 {
			remaining := limit - len(collected)
			if remaining <= 0 {
				break
			}
			opts["limit"] = remaining
		}
		if pageState != "" {
			opts["pageState"] = pageState
		}
		if len(opts) > 0 {
			findCmd["options"] = opts
		}

		res, err := c.Execute(ctx, map[string]any{
			"find": findCmd,
		})
		if err != nil {
			return err
		}

		collected = append(collected, res.Data.Documents...)

		if limit > 0 && len(collected) >= limit {
			collected = collected[:limit]
			break
		}
		if res.Data.NextPageState == nil || strings.TrimSpace(*res.Data.NextPageState) == "" {
			break
		}
		pageState = strings.TrimSpace(*res.Data.NextPageState)
	}

	rawArray, err := json.Marshal(collected)
	if err != nil {
		return err
	}
	return json.Unmarshal(rawArray, outSlicePtr)
}

func (c *Client) UpsertOne(ctx context.Context, filter map[string]any, setFields map[string]any) error {
	_, err := c.Execute(ctx, map[string]any{
		"updateOne": map[string]any{
			"filter": filter,
			"update": map[string]any{
				"$set": setFields,
			},
			"options": map[string]any{
				"upsert": true,
			},
		},
	})
	return err
}

func (c *Client) InsertOne(ctx context.Context, doc any) error {
	_, err := c.Execute(ctx, map[string]any{
		"insertOne": map[string]any{
			"document": doc,
		},
	})
	return err
}

func (c *Client) DeleteOne(ctx context.Context, filter map[string]any) error {
	_, err := c.Execute(ctx, map[string]any{
		"deleteOne": map[string]any{
			"filter": filter,
		},
	})
	return err
}

func (c *Client) DeleteMany(ctx context.Context, filter map[string]any) error {
	_, err := c.Execute(ctx, map[string]any{
		"deleteMany": map[string]any{
			"filter": filter,
		},
	})
	return err
}
