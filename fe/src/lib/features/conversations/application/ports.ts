import type { Conversation } from '../domain/conversation';

export interface ConversationRepository {
  list(): Promise<Conversation[]>;
  getById(id: string): Promise<Conversation | null>;
  search(query: string): Promise<Conversation[]>;
  create(initialTitle: string): Promise<Conversation>;
  rename(id: string, newTitle: string): Promise<Conversation>;
  delete(id: string): Promise<void>;
}

