import type { Source } from '$lib/features/sources';
import type { Attachment } from './attachment';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: Source[];
  attachments?: Attachment[];
  isStreaming?: boolean;
  isCancelled?: boolean;
  thinkingSeconds?: number;
  clientRequestId?: string;
}
