package rag

import (
	"errors"
	"io"
	"path/filepath"
	"strings"
)

var (
	ErrValidation = errors.New("invalid upload request")
	ErrQueueFull  = errors.New("ocr queue is busy")
)

var allowedExtensions = map[string]bool{
	".pdf":  true,
	".png":  true,
	".jpg":  true,
	".jpeg": true,
	".webp": true,
	".txt":  true,
	".md":   true,
}

type UploadInput struct {
	UserID      string
	Scope       string
	Admin       bool
	Filename    string
	ContentType string
	File        io.Reader
	ExtraFields map[string]string
}

func isAllowedExtension(filename string) bool {
	ext := strings.ToLower(filepath.Ext(strings.TrimSpace(filename)))
	return allowedExtensions[ext]
}

