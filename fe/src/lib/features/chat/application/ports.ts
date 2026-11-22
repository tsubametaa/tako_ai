import type { Source } from '$lib/features/sources';
import type { Attachment } from '../domain/attachment';
import type { GenerationStatus } from '../domain/generation';
import type { Message } from '../domain/message';

export type ChatMode = 'umum' | 'terstruktur';

export interface UpdatedConversationMeta {
  id: string;
  title: string;
  createdAt: string;
  lastActivityAt: string;
}

export interface SendMessageOptions {
  conversationId: string;
  content: string;
  clientRequestId: string;
  mode?: ChatMode;
  attachments?: Attachment[];
  onToken: (token: string) => void;
  onStatus: (status: GenerationStatus) => void;
  onSources: (sources: Source[]) => void;
  onConversationUpdated?: (conversation: UpdatedConversationMeta) => void;
}

export interface ChatGateway {
  loadMessages(conversationId: string): Promise<Message[]>;
  sendMessage(options: SendMessageOptions): Promise<void>;
  stopGeneration(conversationId: string): Promise<void>;
}
