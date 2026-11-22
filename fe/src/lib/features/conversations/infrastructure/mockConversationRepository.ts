import type { ConversationRepository } from '../application/ports';
import type { Conversation } from '../domain/conversation';

export class MockConversationRepository implements ConversationRepository {
  private items: Conversation[] = [
    {
      id: 'demo-room-1',
      title: 'Perbedaan Data Latih dan Data Uji',
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    },
    {
      id: 'demo-room-2',
      title: 'Langkah Menyusun Algoritma Pseudocode',
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      lastActivityAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-room-3',
      title: 'Etika dan Bias pada Model AI',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivityAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  async list(): Promise<Conversation[]> {
    return [...this.items];
  }

  async getById(id: string): Promise<Conversation | null> {
    return this.items.find((c) => c.id === id) || null;
  }

  async search(query: string): Promise<Conversation[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.list();
    return this.items.filter((c) => c.title.toLowerCase().includes(q));
  }

  async create(initialTitle: string): Promise<Conversation> {
    const newConv: Conversation = {
      id: `room-${Date.now()}`,
      title: initialTitle.slice(0, 60),
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    this.items.unshift(newConv);
    return newConv;
  }

  async rename(id: string, newTitle: string): Promise<Conversation> {
    const item = this.items.find((c) => c.id === id);
    if (!item) throw new Error('Percakapan tidak ditemukan');
    item.title = newTitle.slice(0, 100);
    return { ...item };
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((c) => c.id !== id);
  }
}

