package conversations

import (
	"encoding/json"
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

type MessagesPageDTO struct {
	Conversation     ConversationDTO `json:"conversation"`
	Items            []MessageDTO    `json:"items"`
	OlderCursor      *string         `json:"olderCursor"`
	ActiveGeneration *GenerationDTO  `json:"activeGeneration"`
	EventCursor      *string         `json:"eventCursor"`
}

type ListResponseDTO struct {
	Items      []ConversationDTO `json:"items"`
	NextCursor *string           `json:"nextCursor"`
}

type CreateRequest struct {
	ClientConversationID string `json:"clientConversationId"`
	Title                string `json:"title"`
}

type RenameRequest struct {
	Title string `json:"title"`
}

type RequestLookupDTO struct {
	Status             string `json:"status"`
	GenerationID       string `json:"generationId"`
	AssistantMessageID string `json:"assistantMessageId"`
	GenerationStatus   string `json:"generationStatus"`
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

