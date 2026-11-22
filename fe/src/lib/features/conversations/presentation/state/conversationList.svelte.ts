import type { ConversationRepository } from '../../application/ports';
import {
  groupConversationsByDate,
  type Conversation,
  type ConversationGroup,
} from '../../domain/conversation';
import { ApiConversationRepository } from '../../infrastructure/apiConversationRepository';

export class ConversationListController {
  private repository: ConversationRepository;
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  private activeSearchSeq = 0;

  conversations = $state<Conversation[]>([]);
  searchQuery = $state('');
  loading = $state(false);
  activeId = $state<string | null>(null);

  renameTarget = $state<Conversation | null>(null);
  deleteTarget = $state<Conversation | null>(null);

  groups = $derived<ConversationGroup[]>(
    groupConversationsByDate(this.conversations),
  );

  constructor(
    repository: ConversationRepository = new ApiConversationRepository(),
  ) {
    this.repository = repository;
  }

  async load(): Promise<void> {
    this.loading = true;
    try {
      this.conversations = await this.repository.list();
    } catch {
      this.conversations = [];
    } finally {
      this.loading = false;
    }
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    const currentSeq = ++this.activeSearchSeq;
    this.searchTimeout = setTimeout(async () => {
      this.loading = true;
      try {
        const results = await this.repository.search(query);
        if (currentSeq === this.activeSearchSeq) {
          this.conversations = results;
        }
      } finally {
        if (currentSeq === this.activeSearchSeq) {
          this.loading = false;
        }
      }
    }, 300);
  }

  openRename(conv: Conversation): void {
    this.renameTarget = conv;
  }

  closeRename(): void {
    this.renameTarget = null;
  }

  async confirmRename(newTitle: string): Promise<void> {
    if (!this.renameTarget) return;
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const updated = await this.repository.rename(this.renameTarget.id, trimmed);
    this.conversations = this.conversations.map((c) =>
      c.id === updated.id ? updated : c,
    );
    this.closeRename();
  }

  openDelete(conv: Conversation): void {
    this.deleteTarget = conv;
  }

  closeDelete(): void {
    this.deleteTarget = null;
  }

  async confirmDelete(): Promise<string | null> {
    if (!this.deleteTarget) return null;
    const deletedId = this.deleteTarget.id;
    await this.repository.delete(deletedId);
    this.conversations = this.conversations.filter((c) => c.id !== deletedId);
    this.closeDelete();
    return deletedId;
  }

  async createNew(initialTitle: string): Promise<Conversation> {
    const created = await this.repository.create(initialTitle);
    this.upsert(created);
    return created;
  }

  upsert(conv: Conversation): void {
    const exists = this.conversations.some((c) => c.id === conv.id);
    if (exists) {
      this.conversations = this.conversations.map((c) =>
        c.id === conv.id ? conv : c,
      );
    } else {
      this.conversations = [conv, ...this.conversations];
    }
  }
}

export const conversationListController = new ConversationListController();
