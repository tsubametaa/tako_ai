package conversations

import (
	"testing"
	"time"
)

func TestBuildChatAnalyticsAggregatesDailyClassesAndTopics(t *testing.T) {
	now := time.Date(2026, 11, 22, 12, 0, 0, 0, analyticsWIB)

	classes := []analyticsClassRecord{
		{ID: "c1", Name: "X LP", GradeLevel: "X", RegisteredStudents: 32},
		{ID: "c2", Name: "X DKV", GradeLevel: "X", RegisteredStudents: 30},
		{ID: "c3", Name: "X ANM", GradeLevel: "X", RegisteredStudents: 28},
	}

	profiles := map[string]analyticsStudentRecord{
		"s1": {UserID: "s1", Role: "siswa", ClassID: "c1", ClassName: "X LP", GradeLevel: "X"},
		"s2": {UserID: "s2", Role: "siswa", ClassID: "c1", ClassName: "X LP", GradeLevel: "X"},
		"s3": {UserID: "s3", Role: "siswa", ClassID: "c2", ClassName: "X DKV", GradeLevel: "X"},
		"t1": {UserID: "t1", Role: "guru", ClassID: "", ClassName: ""},
	}

	docs := []astraChatDoc{
		{
			ID:        "ex_1",
			Type:      "exchange",
			SessionID: "sess_1",
			UserID:    "s1",
			Question:  "Apakah dalam prompting ada tata caranya?",
			Answer:    "Ada pola CS-S.",
			Mode:      "umum",
			Sources:   []map[string]any{{"topic": "Prompt Engineering"}},
			CreatedAt: "2026-11-22T10:00:00+07:00",
			Timestamp: 300,
		},
		{
			ID:        "ex_2",
			Type:      "exchange",
			SessionID: "sess_1",
			UserID:    "s1",
			Question:  "Contoh CoT pada prompt matematika?",
			Answer:    "Gunakan langkah bertahap.",
			Mode:      "terstruktur",
			Sources:   []map[string]any{{"topic": "Prompt Engineering"}},
			CreatedAt: "2026-11-22T11:00:00+07:00",
			Timestamp: 310,
		},
		{
			ID:        "ex_3",
			Type:      "exchange",
			SessionID: "sess_2",
			UserID:    "s2",
			Question:  "Kenapa overfitting terjadi pada data latih?",
			Answer:    "Karena model menghafal data latih.",
			Mode:      "terstruktur",
			CreatedAt: "2026-11-21T09:00:00+07:00",
			Timestamp: 200,
		},
		{
			ID:        "ex_4",
			Type:      "exchange",
			SessionID: "sess_3",
			UserID:    "s3",
			Question:  "Apa itu PKTO dalam prompt engineering?",
			Answer:    "Peran, Konteks, Tujuan, Output.",
			Mode:      "umum",
			CreatedAt: "2026-11-21T15:00:00+07:00",
			Timestamp: 210,
		},
		// Harus diabaikan saat scope=students
		{
			ID:        "ex_t1",
			Type:      "exchange",
			SessionID: "sess_t",
			UserID:    "t1",
			Question:  "Tes guru tentang prompt",
			Answer:    "OK",
			Mode:      "umum",
			CreatedAt: "2026-11-22T11:30:00+07:00",
			Timestamp: 320,
		},
	}

	res := buildChatAnalytics(docs, classes, profiles, 7, "students", now)

	if res.Summary.TotalQuestions != 4 || res.Summary.PeriodQuestions != 4 {
		t.Fatalf("expected 4 student questions, got %+v", res.Summary)
	}
	if res.Summary.TotalRegisteredStudents != 90 || res.Summary.ActiveStudents != 3 {
		t.Fatalf("unexpected student totals: %+v", res.Summary)
	}
	if res.Summary.UmumCount != 2 || res.Summary.TerstrukturCount != 2 || res.Summary.DeepThinkPercent != 50 {
		t.Fatalf("unexpected mode split: %+v", res.Summary)
	}
	if len(res.DailyUsage) != 7 {
		t.Fatalf("expected 7 daily points, got %d", len(res.DailyUsage))
	}

	todayPt := res.DailyUsage[6]
	if todayPt.Date != "2026-11-22" || todayPt.Umum != 1 || todayPt.Terstruktur != 1 || todayPt.ActiveStudents != 1 {
		t.Fatalf("unexpected today usage point: %+v", todayPt)
	}

	if len(res.ClassUsage) != 3 {
		t.Fatalf("expected all 3 classes even with 0 usage, got %d", len(res.ClassUsage))
	}
	if res.ClassUsage[0].ClassName != "X LP" || res.ClassUsage[0].TotalQuestions != 3 || res.ClassUsage[0].ActiveStudents != 2 {
		t.Fatalf("expected X LP ranked #1 with 3 questions and 2 active students, got %+v", res.ClassUsage[0])
	}
	if res.ClassUsage[2].ClassName != "X ANM" || res.ClassUsage[2].TotalQuestions != 0 {
		t.Fatalf("expected X ANM with 0 questions included, got %+v", res.ClassUsage[2])
	}

	if len(res.TopTopics) != 2 {
		t.Fatalf("expected 2 topics, got %+v", res.TopTopics)
	}
	if res.TopTopics[0].Topic != "Prompt Engineering" || res.TopTopics[0].QuestionCount != 3 || res.TopTopics[0].StudentCount != 2 {
		t.Fatalf("unexpected top topic: %+v", res.TopTopics[0])
	}
	if res.TopTopics[1].Topic != "Machine Learning" || res.TopTopics[1].QuestionCount != 1 {
		t.Fatalf("unexpected second topic: %+v", res.TopTopics[1])
	}
}
