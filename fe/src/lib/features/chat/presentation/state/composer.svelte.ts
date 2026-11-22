import type { ChatMode } from '../../application/ports';
import {
  type Attachment,
  MAX_ATTACHMENTS_PER_MESSAGE,
  getAttachmentType,
  validateAttachmentFile,
} from '../../domain/attachment';
import { MAX_MESSAGE_CHARACTERS } from '../../domain/generation';

const DEEP_THINK_STORAGE_KEY = 'kka_deep_think_mode';

export class ComposerController {
  text = $state('');
  isComposing = $state(false);
  deepThink = $state(false);
  attachments = $state<Attachment[]>([]);
  errorMessage = $state<string | null>(null);

  mode = $derived<ChatMode>(this.deepThink ? 'terstruktur' : 'umum');
  length = $derived(this.text.length);
  isOverLimit = $derived(this.length > MAX_MESSAGE_CHARACTERS);
  canSubmit = $derived(
    (this.text.trim().length > 0 || this.attachments.length > 0) &&
      !this.isOverLimit &&
      !this.isComposing,
  );

  init(): void {
    if (typeof window === 'undefined') return;
    try {
      this.deepThink = localStorage.getItem(DEEP_THINK_STORAGE_KEY) === 'true';
    } catch {
      this.deepThink = false;
    }
  }

  toggleDeepThink(): void {
    this.deepThink = !this.deepThink;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DEEP_THINK_STORAGE_KEY, String(this.deepThink));
    } catch {
      // Ignore storage errors
    }
  }

  setText(val: string): void {
    this.text = val;
  }

  addFiles(fileList: FileList | File[]): void {
    this.errorMessage = null;
    const files = Array.from(fileList);

    if (this.attachments.length + files.length > MAX_ATTACHMENTS_PER_MESSAGE) {
      this.errorMessage = `Maksimal hanya dapat melampirkan ${MAX_ATTACHMENTS_PER_MESSAGE} berkas dalam satu pesan.`;
      setTimeout(() => (this.errorMessage = null), 4000);
      return;
    }

    const newAttachments: Attachment[] = [];

    for (const file of files) {
      const validation = validateAttachmentFile(file);
      if (!validation.valid) {
        this.errorMessage = validation.error || 'Berkas tidak valid.';
        setTimeout(() => (this.errorMessage = null), 4000);
        return;
      }

      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        type: getAttachmentType(file.name, file.type),
        rawFile: file,
      });
    }

    this.attachments = [...this.attachments, ...newAttachments];
  }

  removeAttachment(id: string): void {
    this.attachments = this.attachments.filter((a) => a.id !== id);
  }

  clearErrorMessage(): void {
    this.errorMessage = null;
  }

  clear(): void {
    this.text = '';
    this.attachments = [];
    this.errorMessage = null;
  }

  onCompositionStart(): void {
    this.isComposing = true;
  }

  onCompositionEnd(): void {
    this.isComposing = false;
  }

  handleKeydown(event: KeyboardEvent, onSend: () => void): void {
    // Spec 8.5: Desktop Enter sends; Shift+Enter creates new line; Ignore if IME composing
    if (event.key === 'Enter' && !event.shiftKey) {
      if (this.isComposing) return;
      if (window.innerWidth >= 768) {
        event.preventDefault();
        if (this.canSubmit) onSend();
      }
    }
  }
}
