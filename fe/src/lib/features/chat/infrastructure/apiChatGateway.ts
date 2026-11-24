import type { Source } from '$lib/features/sources';
import { apiRequest, apiStream } from '$lib/shared/api';
import type { ChatGateway, SendMessageOptions } from '../application/ports';
import type { Attachment } from '../domain/attachment';
import type { GenerationStatus } from '../domain/generation';
import type { Message } from '../domain/message';
import { SSEStreamParser } from './sseParser';

interface SourceDto {
  id: string;
  label?: string;
  title: string;
  pages?: number[];
  topic?: string;
  excerpt?: string;
  url?: string;
}

interface MessageDto {
  id: string;
  conversationId: string;
  clientRequestId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  status: string;
  generationId?: string;
  sources?: SourceDto[];
}

interface MessagesPageDto {
  items: MessageDto[];
}

function mapSource(dto: SourceDto): Source {
  const cleanTopic = dto.topic?.replace(/\s+/g, ' ').trim();
  return {
    id: dto.id,
    title: dto.title,
    topic: cleanTopic || undefined,
    section: cleanTopic || dto.label,
    page:
      Array.isArray(dto.pages) && dto.pages.length > 0
        ? dto.pages[0]
        : undefined,
    snippet: dto.excerpt || '',
    url: dto.url || undefined,
  };
}

function mapMessage(dto: MessageDto): Message {
  return {
    id: dto.id,
    role: dto.role,
    content: dto.content,
    timestamp: dto.createdAt,
    sources: (dto.sources || []).map(mapSource),
    isCancelled: dto.status === 'cancelled',
    clientRequestId: dto.clientRequestId,
  };
}

export class ApiChatGateway implements ChatGateway {
  private activeControllers = new Map<string, AbortController>();
  private activeGenerations = new Map<string, string>();

  async loadMessages(conversationId: string): Promise<Message[]> {
    const page = await apiRequest<MessagesPageDto>(
      `/conversations/${encodeURIComponent(conversationId)}/messages?limit=50`,
    );
    return (page.items || []).map(mapMessage);
  }

  private async uploadAttachments(attachments?: Attachment[]): Promise<void> {
    if (!attachments || attachments.length === 0) return;

    for (const att of attachments) {
      if (!att.rawFile) continue;
      const formData = new FormData();
      // Backend streaming reader expects extra fields before the 'file' part
      formData.append('source_title', att.name);
      formData.append('file', att.rawFile, att.name);

      await apiRequest<{ job_id?: string }>('/rag/documents', {
        method: 'POST',
        body: formData,
      });
    }
  }

  async sendMessage(options: SendMessageOptions): Promise<void> {
    const {
      conversationId,
      content,
      clientRequestId,
      mode = 'umum',
      attachments,
      onToken,
      onStatus,
      onSources,
      onConversationUpdated,
    } = options;

    if (attachments && attachments.length > 0) {
      onStatus('retrieving');
      await this.uploadAttachments(attachments);
    }

    const questionText =
      content.trim() ||
      (attachments && attachments.length > 0
        ? `Tolong bantu jelaskan materi dari berkas ${attachments.map((a) => a.name).join(', ')} yang baru saya unggah.`
        : '');

    const abortController = new AbortController();
    this.activeControllers.set(conversationId, abortController);

    try {
      const response = await apiStream(
        `/conversations/${encodeURIComponent(conversationId)}/messages`,
        {
          clientRequestId,
          content: questionText,
          mode,
          consentToTraining: false,
        },
        abortController.signal,
      );

      if (!response.body) {
        throw new Error('Stream respons dari server kosong.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const parser = new SSEStreamParser();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const textChunk = decoder.decode(value, { stream: true });
        const events = parser.push(textChunk);
        this.processEvents(events, conversationId, {
          onToken,
          onStatus,
          onSources,
          onConversationUpdated,
        });
      }

      const trailing = parser.flush();
      this.processEvents(trailing, conversationId, {
        onToken,
        onStatus,
        onSources,
        onConversationUpdated,
      });
    } finally {
      this.activeControllers.delete(conversationId);
      this.activeGenerations.delete(conversationId);
    }
  }

  private processEvents(
    events: { id?: string; event?: string; data: string }[],
    conversationId: string,
    callbacks: Pick<
      SendMessageOptions,
      'onToken' | 'onStatus' | 'onSources' | 'onConversationUpdated'
    >,
  ): void {
    for (const evt of events) {
      if (!evt.data) continue;
      let payload: Record<string, unknown>;
      try {
        payload = JSON.parse(evt.data) as Record<string, unknown>;
      } catch {
        continue;
      }

      switch (evt.event) {
        case 'accepted': {
          const gen = payload.generation as { id?: string } | undefined;
          if (gen?.id) {
            this.activeGenerations.set(conversationId, gen.id);
          }
          break;
        }
        case 'status': {
          const st = payload.status as GenerationStatus | undefined;
          if (st) callbacks.onStatus(st);
          break;
        }
        case 'conversation_updated': {
          const conv = payload.conversation as
            | {
                id: string;
                title: string;
                createdAt: string;
                lastActivityAt: string;
              }
            | undefined;
          if (conv && callbacks.onConversationUpdated) {
            callbacks.onConversationUpdated(conv);
          }
          break;
        }
        case 'sources': {
          const srcs = (payload.sources as SourceDto[] | undefined) || [];
          callbacks.onSources(srcs.map(mapSource));
          break;
        }
        case 'delta': {
          const text = payload.text as string | undefined;
          if (typeof text === 'string') {
            callbacks.onToken(text);
          }
          break;
        }
        case 'done': {
          const msg = payload.message as MessageDto | undefined;
          if (msg?.sources && msg.sources.length > 0) {
            callbacks.onSources(msg.sources.map(mapSource));
          }
          callbacks.onStatus('completed');
          break;
        }
        case 'cancelled': {
          callbacks.onStatus('cancelled');
          break;
        }
        case 'generation_error': {
          const errMsg =
            (payload.message as string | undefined) ||
            'Asisten sedang belum dapat merespons. Coba sebentar lagi.';
          throw new Error(errMsg);
        }
      }
    }
  }

  async stopGeneration(conversationId: string): Promise<void> {
    const genId = this.activeGenerations.get(conversationId);
    const controller = this.activeControllers.get(conversationId);

    if (genId) {
      try {
        await apiRequest(`/generations/${encodeURIComponent(genId)}/cancel`, {
          method: 'POST',
        });
      } catch {
        // Ignore cancel errors if stream already closed
      }
    }

    if (controller) {
      controller.abort();
      this.activeControllers.delete(conversationId);
    }
    this.activeGenerations.delete(conversationId);
  }
}

export const apiChatGateway = new ApiChatGateway();
