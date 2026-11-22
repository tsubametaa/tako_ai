package aiclient

import (
	"context"
	"strings"
	"testing"
)

func TestParseSSEStreamEmitsSourcesDeltaDone(t *testing.T) {
	raw := strings.Join([]string{
		"event: sources",
		`data: {"session_id":"s1","sources":[{"title":"Modul KKA"}]}`,
		"",
		"event: delta",
		`data: {"text":"Halo "}`,
		"",
		"event: delta",
		`data: {"text":"dunia"}`,
		"",
		"event: done",
		`data: {"session_id":"s1","answer":"Halo dunia"}`,
		"",
	}, "\n")

	var events []string
	var payloads []string
	err := parseSSEStream(context.Background(), strings.NewReader(raw), func(eventName string, data []byte) error {
		events = append(events, eventName)
		payloads = append(payloads, string(data))
		return nil
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(events) != 4 {
		t.Fatalf("expected 4 events, got %d (%v)", len(events), events)
	}
	if events[0] != "sources" || events[1] != "delta" || events[2] != "delta" || events[3] != "done" {
		t.Fatalf("unexpected event order: %v", events)
	}
	if !strings.Contains(payloads[3], `"Halo dunia"`) {
		t.Fatalf("unexpected done payload: %s", payloads[3])
	}
}
