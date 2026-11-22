package chat

import (
	"encoding/json"
	"fmt"
	"time"
)

type SourceDTO struct {
	ID         string   `json:"id"`
	Label      string   `json:"label"`
	Title      string   `json:"title"`
	Similarity *float64 `json:"similarity,omitempty"`
	Pages      []int    `json:"pages,omitempty"`
	Topic      string   `json:"topic,omitempty"`
	Excerpt    string   `json:"excerpt,omitempty"`
	URL        string   `json:"url,omitempty"`
}

type ConversationDTO struct {
	ID             string    `json:"id"`
	Title          string    `json:"title"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
	LastActivityAt time.Time `json:"lastActivityAt"`
}

type MessageDTO struct {
	ID              string      `json:"id"`
	ConversationID  string      `json:"conversationId"`
	ClientRequestID string      `json:"clientRequestId"`
	Role            string      `json:"role"`
	Content         string      `json:"content"`
	CreatedAt       time.Time   `json:"createdAt"`
	Status          string      `json:"status"`
	GenerationID    *string     `json:"generationId,omitempty"`
	Sources         []SourceDTO `json:"sources"`
}

type GenerationDTO struct {
	ID                 string  `json:"id"`
	ConversationID     string  `json:"conversationId"`
	AssistantMessageID string  `json:"assistantMessageId"`
	Status             string  `json:"status"`
	LastEventID        *string `json:"lastEventId"`
}

type SendMessageRequest struct {
	ClientRequestID   string `json:"clientRequestId"`
	Content           string `json:"content"`
	Mode              string `json:"mode"`
	ConsentToTraining bool   `json:"consentToTraining"`
}

type ConversationRecord struct {
	ID          string
	Title       string
	AISessionID string
}

type GenerationRecord struct {
	ID                 string
	ConversationID     string
	AssistantMessageID string
	Status             string
	LastEventID        *string
	ErrorCode          *string
	ErrorMessage       *string
}

type AIChatRequest struct {
	UserID            string `json:"user_id"`
	StudentName       string `json:"student_name,omitempty"`
	Question          string `json:"question"`
	SessionID         string `json:"session_id"`
	Mode              string `json:"mode"`
	ConsentToTraining bool   `json:"consent_to_training"`
	ResetContext      bool   `json:"reset_context"`
}

type AIChatResponse struct {
	SessionID string           `json:"session_id"`
	Answer    string           `json:"answer"`
	Sources   []map[string]any `json:"sources"`
}

func mapAISources(raw []map[string]any) []SourceDTO {
	out := make([]SourceDTO, 0, len(raw))
	for i, item := range raw {
		id := strField(item, "id")
		if id == "" {
			id = fmt.Sprintf("src_%d", i+1)
		}
		title := strField(item, "title", "filename", "source", "document")
		if title == "" {
			title = fmt.Sprintf("Materi %d", i+1)
		}
		label := strField(item, "label")
		if label == "" {
			label = fmt.Sprintf("Sumber %d", i+1)
		}
		topic := strField(item, "topic", "section")
		excerpt := strField(item, "excerpt", "snippet", "content")
		urlStr := strField(item, "url")

		var sim *float64
		if v, ok := item["similarity"].(float64); ok {
			sim = &v
		}

		pages := extractPages(item)
		out = append(out, SourceDTO{
			ID:         id,
			Label:      label,
			Title:      title,
			Similarity: sim,
			Pages:      pages,
			Topic:      topic,
			Excerpt:    excerpt,
			URL:        urlStr,
		})
	}
	return out
}

func strField(m map[string]any, keys ...string) string {
	for _, k := range keys {
		if s, ok := m[k].(string); ok && s != "" {
			return s
		}
	}
	return ""
}

func extractPages(m map[string]any) []int {
	if arr, ok := m["pages"].([]any); ok {
		pages := make([]int, 0, len(arr))
		for _, v := range arr {
			if f, ok := v.(float64); ok {
				pages = append(pages, int(f))
			}
		}
		return pages
	}
	if arr, ok := m["pages_pdf"].([]any); ok {
		pages := make([]int, 0, len(arr))
		for _, v := range arr {
			if f, ok := v.(float64); ok {
				pages = append(pages, int(f))
			}
		}
		return pages
	}
	if f, ok := m["page"].(float64); ok {
		return []int{int(f)}
	}
	return nil
}

func decodeSources(raw []byte) []SourceDTO {
	if len(raw) == 0 {
		return []SourceDTO{}
	}
	var out []SourceDTO
	if err := json.Unmarshal(raw, &out); err != nil || out == nil {
		return []SourceDTO{}
	}
	return out
}

