package conversations

import (
	"testing"
	"time"
)

func TestBuildChatExportGroupsEnrichesAndFiltersStudents(t *testing.T) {
	docs := []astraChatDoc{
		{
			ID:      "persona_s1",
			Type:    "persona",
			UserID:  "s1",
			Persona: "Gaya santai dengan analogi game",
		},
		{
			ID:        "sess_c1",
			Type:      "session",
			SessionID: "c1",
			UserID:    "s1",
			Title:     "Belajar Prompting",
			CreatedAt: "2026-11-22T06:00:00Z",
			Timestamp: 1000,
		},
		{
			ID:             "ex_2",
			Type:           "exchange",
			SessionID:      "c1",
			UserID:         "s1",
			Question:       "Contoh CoT?",
			Answer:         "Misalnya langkah 1...",
			Mode:           "terstruktur",
			TrainingStatus: "excluded",
			TrainingReason: "consent_false",
			CreatedAt:      "2026-11-22T06:05:00Z",
			Timestamp:      1020,
		},
		{
			ID:        "ex_1",
			Type:      "exchange",
			SessionID: "c1",
			UserID:    "s1",
			Question:  "Apa itu prompt?",
			Answer:    "Prompt adalah instruksi ke AI.",
			Mode:      "umum",
			Sources: []map[string]any{
				{"title": "Modul Prompting", "pages_pdf": []any{float64(3)}},
			},
			CreatedAt: "2026-11-22T06:01:00Z",
			Timestamp: 1010,
		},
		// Duplikat exchange ID tidak boleh dihitung dua kali.
		{
			ID:        "ex_1",
			Type:      "exchange",
			SessionID: "c1",
			UserID:    "s1",
			Question:  "Apa itu prompt?",
			Answer:    "Prompt adalah instruksi ke AI.",
			Mode:      "umum",
			CreatedAt: "2026-11-22T06:01:00Z",
			Timestamp: 1010,
		},
		// Percakapan guru harus dikecualikan pada scope=students.
		{
			ID:        "ex_t1",
			Type:      "exchange",
			SessionID: "c_teacher",
			UserID:    "t1",
			Question:  "Tes guru",
			Answer:    "Siap.",
			Mode:      "umum",
			CreatedAt: "2026-11-22T06:10:00Z",
			Timestamp: 1030,
		},
		// Sesi kosong (tanpa exchange) tidak perlu diekspor.
		{
			ID:        "sess_empty",
			Type:      "session",
			SessionID: "c_empty",
			UserID:    "s1",
			Title:     "Kosong",
			CreatedAt: "2026-11-22T06:12:00Z",
			Timestamp: 1040,
		},
	}

	profiles := map[string]exportProfileIdentity{
		"s1": {
			FullName:   "MUHAMMAD FIRZY MUTTAQIN",
			Username:   "15049",
			Identifier: "15049",
			Role:       "siswa",
			ClassName:  "X LP",
			GradeLevel: "X",
		},
		"t1": {
			FullName: "Guru KKA",
			Username: "guru.kka",
			Role:     "guru",
		},
	}

	now := time.Date(2026, 11, 22, 12, 0, 0, 0, time.UTC)
	studentExport := buildChatExport(docs, profiles, "students", now)

	if studentExport.Summary.TotalStudents != 1 || studentExport.Summary.TotalConversations != 1 {
		t.Fatalf("unexpected student summary: %+v", studentExport.Summary)
	}
	if studentExport.Summary.TotalExchanges != 2 || studentExport.Summary.TotalMessages != 4 {
		t.Fatalf("expected 2 exchanges / 4 messages, got %+v", studentExport.Summary)
	}

	conv := studentExport.Conversations[0]
	if conv.Title != "Belajar Prompting" || conv.Student.ClassName != "X LP" {
		t.Fatalf("unexpected student metadata: %+v", conv.Student)
	}
	if conv.Student.Persona != "Gaya santai dengan analogi game" {
		t.Fatalf("expected persona attached, got %q", conv.Student.Persona)
	}
	if conv.Turns[0].ExchangeID != "ex_1" || conv.Turns[1].ExchangeID != "ex_2" {
		t.Fatalf("turns not sorted chronologically: %+v", conv.Turns)
	}
	if len(conv.Turns[0].Sources) != 1 || len(conv.Turns[0].Sources[0].Pages) != 1 || conv.Turns[0].Sources[0].Pages[0] != 3 {
		t.Fatalf("expected sources with page 3, got %+v", conv.Turns[0].Sources)
	}
	if conv.Messages[0].Role != "user" || conv.Messages[1].Role != "assistant" || conv.Messages[2].Content != "Contoh CoT?" {
		t.Fatalf("unexpected chronological messages: %+v", conv.Messages)
	}

	allExport := buildChatExport(docs, profiles, "all", now)
	if allExport.Summary.TotalConversations != 2 || allExport.Summary.TotalStudents != 2 {
		t.Fatalf("expected 2 conversations when scope=all, got %+v", allExport.Summary)
	}
}
