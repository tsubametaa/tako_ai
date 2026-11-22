import type {
  ChatGateway,
  ChatMode,
  UpdatedConversationMeta,
} from '../../application/ports';
import type { Attachment } from '../../domain/attachment';
import type { GenerationStatus } from '../../domain/generation';
import type { Message } from '../../domain/message';
import { apiChatGateway } from '../../infrastructure/apiChatGateway';

export class RoomStateController {
  private gateway: ChatGateway;
  private loadSeq = 0;

  conversationId = $state<string | null>(null);
  messages = $state<Message[]>([]);
  status = $state<GenerationStatus>('idle');
  streamingMessage = $state<Message | null>(null);
  userScrolledUp = $state(false);
  errorMessage = $state<string | null>(null);

  isBusy = $derived(
    this.status === 'submitting' ||
      this.status === 'retrieving' ||
      this.status === 'generating' ||
      this.status === 'queued',
  );

  constructor(gateway: ChatGateway = apiChatGateway) {
    this.gateway = gateway;
  }

  clearError(): void {
    this.errorMessage = null;
  }

  async setRoom(id: string | null, forceReload = false): Promise<void> {
    if (
      !forceReload &&
      id &&
      this.conversationId === id &&
      (this.isBusy || this.status === 'loading' || this.messages.length > 0)
    ) {
      return;
    }

    const seq = ++this.loadSeq;
    const isDifferentRoom = this.conversationId !== id;
    this.conversationId = id;
    this.streamingMessage = null;
    this.userScrolledUp = false;
    this.errorMessage = null;

    if (!id) {
      this.messages = [];
      this.status = 'empty';
      return;
    }

    if (isDifferentRoom) {
      this.messages = [];
    }

    this.status = 'loading';
    try {
      const loaded = await this.gateway.loadMessages(id);
      if (seq !== this.loadSeq || this.conversationId !== id) return;
      this.messages = loaded;
      this.status = loaded.length === 0 ? 'empty' : 'idle';
    } catch (err) {
      if (seq !== this.loadSeq || this.conversationId !== id) return;
      this.status = 'failed';
      this.errorMessage =
        err instanceof Error ? err.message : 'Gagal memuat riwayat percakapan.';
    }
  }

  async reload(): Promise<void> {
    if (!this.conversationId || this.isBusy) return;
    await this.setRoom(this.conversationId, true);
  }

  async send(
    content: string,
    attachments?: Attachment[],
    onRoomCreated?: () => Promise<string>,
    onConversationUpdated?: (conv: UpdatedConversationMeta) => void,
    mode: ChatMode = 'umum',
  ): Promise<void> {
    const trimmed = content.trim();
    const hasAttachments = attachments && attachments.length > 0;
    if ((!trimmed && !hasAttachments) || this.isBusy) return;

    this.errorMessage = null;
    let targetId = this.conversationId;
    if (!targetId && onRoomCreated) {
      try {
        targetId = await onRoomCreated();
        this.conversationId = targetId;
      } catch (err) {
        this.status = 'failed';
        this.errorMessage =
          err instanceof Error
            ? err.message
            : 'Gagal membuat ruang percakapan baru.';
        return;
      }
    }

    if (!targetId) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: trimmed,
      attachments:
        attachments && attachments.length > 0 ? [...attachments] : undefined,
      timestamp: new Date().toISOString(),
      clientRequestId: crypto.randomUUID(),
    };
    this.messages = [...this.messages, userMessage];

    const thinkingStartedAt = Date.now();
    let thinkingCaptured = false;

    const assistantPlaceholder: Message = {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
      sources: [],
    };
    this.streamingMessage = assistantPlaceholder;
    this.status = 'submitting';

    try {
      await this.gateway.sendMessage({
        conversationId: targetId,
        content: trimmed,
        mode,
        attachments: userMessage.attachments,
        clientRequestId: userMessage.clientRequestId!,
        onStatus: (st) => {
          this.status = st;
        },
        onSources: (srcs) => {
          if (this.streamingMessage) {
            this.streamingMessage.sources = srcs;
          }
        },
        onToken: (tok) => {
          if (this.streamingMessage) {
            if (!thinkingCaptured && tok.trim().length > 0) {
              thinkingCaptured = true;
              this.streamingMessage.thinkingSeconds = Math.max(
                1,
                Math.round((Date.now() - thinkingStartedAt) / 1000),
              );
            }
            this.streamingMessage.content += tok;
          }
        },
        onConversationUpdated,
      });

      if (this.streamingMessage) {
        if (!thinkingCaptured && this.streamingMessage.content.trim()) {
          this.streamingMessage.thinkingSeconds = Math.max(
            1,
            Math.round((Date.now() - thinkingStartedAt) / 1000),
          );
        }
        this.streamingMessage.isStreaming = false;
        this.messages = [...this.messages, this.streamingMessage];
        this.streamingMessage = null;
      }
      if ((this.status as GenerationStatus) !== 'cancelled') {
        this.status = 'completed';
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        this.status = 'cancelled';
        return;
      }
      this.status = 'failed';
      this.errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal terhubung ke layanan AI.';
      if (this.streamingMessage) {
        this.streamingMessage.isStreaming = false;
        if (this.streamingMessage.content.trim()) {
          this.messages = [...this.messages, this.streamingMessage];
        }
        this.streamingMessage = null;
      }
    }
  }

  async stop(): Promise<void> {
    if (!this.conversationId || !this.isBusy) return;
    await this.gateway.stopGeneration(this.conversationId);
    this.status = 'cancelled';
    if (this.streamingMessage) {
      this.streamingMessage.isStreaming = false;
      this.streamingMessage.isCancelled = true;
      this.messages = [...this.messages, this.streamingMessage];
      this.streamingMessage = null;
    }
  }

  onScroll(container: HTMLElement): void {
    const threshold = 120;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    this.userScrolledUp = distanceFromBottom > threshold;
  }
}

export const roomStateController = new RoomStateController();
