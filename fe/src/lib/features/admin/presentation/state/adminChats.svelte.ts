import {
  deleteAdminChatConversation,
  deleteAdminChatMessage,
  exportAdminChatsJson,
  fetchAdminChatMessages,
  fetchAdminChats,
  type AdminChatMessage,
  type AdminConversationItem,
} from '../../infrastructure/adminChatsApi';

export class AdminChatsController {
  conversations = $state<AdminConversationItem[]>([]);
  searchQuery = $state('');
  loadingList = $state(false);
  exporting = $state(false);

  selectedConversation = $state<AdminConversationItem | null>(null);
  messages = $state<AdminChatMessage[]>([]);
  loadingMessages = $state(false);

  errorMessage = $state<string | null>(null);
  statusBanner = $state<string | null>(null);

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  async loadConversations(): Promise<void> {
    this.loadingList = true;
    this.errorMessage = null;
    try {
      this.conversations = await fetchAdminChats(this.searchQuery, 50);
      if (
        this.selectedConversation &&
        !this.conversations.some((c) => c.id === this.selectedConversation?.id)
      ) {
        this.selectedConversation = null;
        this.messages = [];
      }
    } catch (err) {
      this.errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal memuat log percakapan siswa dari backend.';
    } finally {
      this.loadingList = false;
    }
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadConversations();
    }, 300);
  }

  async selectConversation(conv: AdminConversationItem): Promise<void> {
    this.selectedConversation = conv;
    this.loadingMessages = true;
    this.errorMessage = null;
    this.statusBanner = null;
    try {
      const res = await fetchAdminChatMessages(conv.id);
      this.selectedConversation = res.conversation;
      this.messages = res.items || [];
    } catch (err) {
      this.errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal memuat detail pesan percakapan.';
    } finally {
      this.loadingMessages = false;
    }
  }

  async removeConversation(convId: string): Promise<void> {
    this.errorMessage = null;
    this.statusBanner = null;
    try {
      const res = await deleteAdminChatConversation(convId);
      this.conversations = this.conversations.filter((c) => c.id !== convId);
      if (this.selectedConversation?.id === convId) {
        this.selectedConversation = null;
        this.messages = [];
      }
      this.statusBanner = res.aiSessionSynced
        ? 'Percakapan siswa berhasil dihapus dari Supabase dan Astra DB (kka_lab).'
        : 'Percakapan siswa berhasil dihapus dari database.';
    } catch (err) {
      this.errorMessage =
        err instanceof Error ? err.message : 'Gagal menghapus percakapan.';
    }
  }

  async removeMessage(messageId: string): Promise<void> {
    if (!this.selectedConversation) return;
    const convId = this.selectedConversation.id;
    this.errorMessage = null;
    this.statusBanner = null;
    try {
      await deleteAdminChatMessage(convId, messageId);
      this.messages = this.messages.filter((m) => m.id !== messageId);
      this.conversations = this.conversations.map((c) =>
        c.id === convId
          ? { ...c, messageCount: Math.max(0, c.messageCount - 1) }
          : c,
      );
      this.statusBanner = 'Pesan berhasil dihapus dari log percakapan.';
    } catch (err) {
      this.errorMessage =
        err instanceof Error ? err.message : 'Gagal menghapus pesan.';
    }
  }

  async exportJson(scope: 'students' | 'all' = 'students'): Promise<void> {
    if (this.exporting) return;
    this.exporting = true;
    this.errorMessage = null;
    this.statusBanner = null;
    try {
      const { filename } = await exportAdminChatsJson(scope);
      this.statusBanner = `Seluruh riwayat chat berhasil diekspor ke ${filename}.`;
    } catch (err) {
      this.errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal mengekspor riwayat chat ke JSON.';
    } finally {
      this.exporting = false;
    }
  }
}
