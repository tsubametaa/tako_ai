import { apiRequest } from '$lib/shared/api';
import type { ConversationRepository } from '../application/ports';
import type { Conversation } from '../domain/conversation';

interface ConversationDto {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  lastActivityAt: string;
}

interface ListConversationsDto {
  items: ConversationDto[];
  nextCursor: string | null;
}

interface MessagesPageSummaryDto {
  conversation: ConversationDto;
}

function mapConversation(dto: ConversationDto): Conversation {
  return {
    id: dto.id,
    title: dto.title,
    createdAt: dto.createdAt,
    lastActivityAt: dto.lastActivityAt || dto.updatedAt || dto.createdAt,
  };
}

export class ApiConversationRepository implements ConversationRepository {
  async list(): Promise<Conversation[]> {
    const res = await apiRequest<ListConversationsDto>(
      '/conversations?limit=50',
    );
    return (res.items || []).map(mapConversation);
  }

  async getById(id: string): Promise<Conversation | null> {
    try {
      const res = await apiRequest<MessagesPageSummaryDto>(
        `/conversations/${encodeURIComponent(id)}/messages?limit=1`,
      );
      return res.conversation ? mapConversation(res.conversation) : null;
    } catch {
      return null;
    }
  }

  async search(query: string): Promise<Conversation[]> {
    const trimmed = query.trim();
    if (!trimmed) return this.list();
    const res = await apiRequest<ListConversationsDto>(
      `/conversations?limit=50&q=${encodeURIComponent(trimmed)}`,
    );
    return (res.items || []).map(mapConversation);
  }

  async create(initialTitle: string): Promise<Conversation> {
    const dto = await apiRequest<ConversationDto>('/conversations', {
      method: 'POST',
      body: JSON.stringify({
        clientConversationId: crypto.randomUUID(),
        title: initialTitle.trim().slice(0, 60) || 'Percakapan Baru',
      }),
    });
    return mapConversation(dto);
  }

  async rename(id: string, newTitle: string): Promise<Conversation> {
    const dto = await apiRequest<ConversationDto>(
      `/conversations/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          title: newTitle.trim().slice(0, 100),
        }),
      },
    );
    return mapConversation(dto);
  }

  async delete(id: string): Promise<void> {
    await apiRequest<void>(`/conversations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }
}
