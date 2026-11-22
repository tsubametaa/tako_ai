export type AttachmentType = 'pdf' | 'ppt' | 'docx' | 'txt' | 'md' | 'other';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: AttachmentType;
  rawFile?: File;
}

export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.txt',
  '.md',
];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
  'text/markdown',
];

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB (aligned with backend MAX_UPLOAD_BYTES)
export const MAX_ATTACHMENTS_PER_MESSAGE = 3;

export function getAttachmentType(fileName: string, mimeType?: string): AttachmentType {
  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith('.pdf') || mimeType === 'application/pdf') return 'pdf';
  if (
    lowerName.endsWith('.ppt') ||
    lowerName.endsWith('.pptx') ||
    mimeType?.includes('presentation') ||
    mimeType?.includes('powerpoint')
  ) {
    return 'ppt';
  }
  if (
    lowerName.endsWith('.doc') ||
    lowerName.endsWith('.docx') ||
    mimeType?.includes('word') ||
    mimeType?.includes('officedocument.wordprocessingml')
  ) {
    return 'docx';
  }
  if (lowerName.endsWith('.md') || mimeType === 'text/markdown') return 'md';
  if (lowerName.endsWith('.txt') || mimeType === 'text/plain') return 'txt';
  return 'other';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateAttachmentFile(file: File): { valid: boolean; error?: string } {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isAllowedExt = ALLOWED_FILE_EXTENSIONS.includes(extension);
  const isAllowedMime = ALLOWED_MIME_TYPES.some((mime) => file.type.startsWith(mime));

  if (!isAllowedExt && !isAllowedMime) {
    return {
      valid: false,
      error: `Format berkas "${file.name}" tidak didukung. Unggah PDF, PNG, JPG, WEBP, TXT, atau MD.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Ukuran berkas "${file.name}" melebihi batas maksimum 20 MB (${formatFileSize(file.size)}).`,
    };
  }

  return { valid: true };
}
