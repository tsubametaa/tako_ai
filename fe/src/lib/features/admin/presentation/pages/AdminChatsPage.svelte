<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Bot,
    Download,
    MessageSquareText,
    RefreshCw,
    Search,
    Trash2,
    User,
  } from '@lucide/svelte';
  import { page } from '$app/state';
  import { buildSitePath } from '$lib/shared/config/subdomains';
  import { Button, Card, Input } from '$lib/shared/ui';
  import { AdminChatsController } from '../state/adminChats.svelte';

  const ctrl = new AdminChatsController();
  const overviewHref = $derived(buildSitePath('admin', page.url, '/'));

  function formatDateTime(iso: string): string {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Jakarta',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  onMount(() => {
    ctrl.loadConversations();
  });
</script>

<svelte:head>
  <title>Log Chat Siswa - Admin KKA</title>
</svelte:head>

<div class="flex flex-col gap-5">
  <Card class="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
    <div class="flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]">
        <MessageSquareText class="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <h2 class="text-lg font-extrabold text-ink md:text-xl">
          Log Percakapan Siswa dengan AI
        </h2>
        <p class="text-xs font-medium text-muted">
          Tinjau interaksi siswa dan hapus riwayat chat (tersinkronisasi ke Supabase & Astra DB <code class="font-mono text-ink">kka_lab</code>)
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <Button
        variant="accent"
        size="sm"
        disabled={ctrl.exporting}
        onclick={() => ctrl.exportJson('students')}
      >
        <Download class="h-4 w-4" aria-hidden="true" />
        <span>{ctrl.exporting ? 'Mengekspor…' : 'Export JSON'}</span>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={ctrl.loadingList}
        onclick={() => ctrl.loadConversations()}
      >
        <RefreshCw class="h-4 w-4" aria-hidden="true" />
        <span>{ctrl.loadingList ? 'Memuat…' : 'Muat Ulang'}</span>
      </Button>
      <a
        href={overviewHref}
        class="neo-control inline-flex min-h-9.5 items-center bg-surface-soft px-3.5 py-1.5 text-xs font-bold text-ink hover:bg-surface"
      >
        Ringkasan
      </a>
    </div>
  </Card>

  {#if ctrl.errorMessage}
    <p class="rounded-xl border-2 border-danger bg-danger/10 px-4 py-2.5 text-xs font-bold text-danger">
      {ctrl.errorMessage}
    </p>
  {/if}

  {#if ctrl.statusBanner}
    <p class="rounded-xl border-2 border-line bg-mustard/20 px-4 py-2.5 text-xs font-bold text-ink">
      {ctrl.statusBanner}
    </p>
  {/if}

  <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
    <!-- Daftar Percakapan Siswa (Kiri) -->
    <Card class="flex flex-col gap-3.5 p-4 lg:col-span-5">
      <div class="relative w-full">
        <Input
          value={ctrl.searchQuery}
          placeholder="Cari nama siswa, NIS, username, atau judul chat…"
          class="pl-9 text-xs"
          oninput={(e) => ctrl.onSearchInput(e.currentTarget.value)}
        />
        <Search
          class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted/80"
          aria-hidden="true"
        />
      </div>

      {#if ctrl.loadingList}
        <p class="py-6 text-center text-xs font-bold text-muted">
          Memuat daftar percakapan siswa…
        </p>
      {:else if ctrl.conversations.length === 0}
        <p class="py-6 text-center text-xs font-medium text-muted">
          Belum ada percakapan siswa yang ditemukan.
        </p>
      {:else}
        <div class="flex max-h-[540px] flex-col gap-2.5 overflow-y-auto pr-1">
          {#each ctrl.conversations as conv (conv.id)}
            {@const isSelected = ctrl.selectedConversation?.id === conv.id}
            <div
              class="flex flex-col gap-2 rounded-xl border-2 border-line p-3 transition {isSelected
                ? 'bg-mustard/15 shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]'
                : 'bg-surface-soft hover:bg-surface'}"
            >
              <div class="flex items-start justify-between gap-2">
                <button
                  type="button"
                  class="flex-1 text-left"
                  onclick={() => ctrl.selectConversation(conv)}
                >
                  <p class="line-clamp-1 text-xs font-extrabold text-ink">
                    {conv.title}
                  </p>
                  <p class="mt-0.5 text-[11px] font-bold text-primary">
                    {conv.studentName}
                    {#if conv.username}
                      <span class="text-muted">(@{conv.username})</span>
                    {/if}
                    {#if conv.identifier}
                      <span class="text-muted">• {conv.identifier}</span>
                    {/if}
                  </p>
                </button>

                <button
                  type="button"
                  class="neo-control inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-danger hover:bg-danger hover:text-white"
                  title="Hapus percakapan ini"
                  aria-label="Hapus percakapan {conv.title}"
                  onclick={() => ctrl.removeConversation(conv.id)}
                >
                  <Trash2 class="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <div class="flex items-center justify-between text-[10.5px] font-medium text-muted">
                <span>{conv.messageCount} pesan</span>
                <span>{formatDateTime(conv.lastActivityAt)}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </Card>

    <!-- Isi Log Pesan User <-> AI (Kanan) -->
    <Card class="flex flex-col gap-4 p-5 lg:col-span-7">
      {#if !ctrl.selectedConversation}
        <div class="flex min-h-[320px] flex-col items-center justify-center gap-2 text-center">
          <MessageSquareText class="h-8 w-8 text-muted" aria-hidden="true" />
          <p class="text-sm font-extrabold text-ink">
            Pilih Percakapan Siswa di Panel Kiri
          </p>
          <p class="max-w-sm text-xs text-muted">
            Klik salah satu ruang percakapan untuk memeriksa seluruh log pertanyaan siswa dan jawaban AI beserta sumber materinya.
          </p>
        </div>
      {:else}
        <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line pb-3">
          <div>
            <h3 class="text-sm font-extrabold text-ink md:text-base">
              {ctrl.selectedConversation.title}
            </h3>
            <p class="text-xs font-medium text-muted">
              Siswa: <strong class="text-ink">{ctrl.selectedConversation.studentName}</strong>
              {#if ctrl.selectedConversation.identifier}
                ({ctrl.selectedConversation.identifier})
              {/if}
              • Sesi AI: <code class="font-mono text-[11px]">{ctrl.selectedConversation.aiSessionId}</code>
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            onclick={() =>
              ctrl.selectedConversation &&
              ctrl.removeConversation(ctrl.selectedConversation.id)}
          >
            <Trash2 class="h-3.5 w-3.5" aria-hidden="true" />
            <span>Hapus Room</span>
          </Button>
        </div>

        {#if ctrl.loadingMessages}
          <p class="py-8 text-center text-xs font-bold text-muted">
            Memuat transkrip percakapan…
          </p>
        {:else if ctrl.messages.length === 0}
          <p class="py-8 text-center text-xs font-medium text-muted">
            Tidak ada pesan di dalam percakapan ini.
          </p>
        {:else}
          <div class="flex max-h-[500px] flex-col gap-3 overflow-y-auto pr-1">
            {#each ctrl.messages as msg (msg.id)}
              <div
                class="flex flex-col gap-2 rounded-xl border-2 border-line p-3.5 {msg.role ===
                'user'
                  ? 'bg-surface-soft'
                  : 'bg-surface shadow-[2px_2px_0px_var(--neo-shadow-color)]'}"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-line {msg.role ===
                      'user'
                        ? 'bg-sage/30 text-ink'
                        : 'bg-mustard text-on-mustard'}"
                    >
                      {#if msg.role === 'user'}
                        <User class="h-3.5 w-3.5" aria-hidden="true" />
                      {:else}
                        <Bot class="h-3.5 w-3.5" aria-hidden="true" />
                      {/if}
                    </span>
                    <span class="text-xs font-extrabold text-ink">
                      {msg.role === 'user'
                        ? ctrl.selectedConversation.studentName
                        : 'NEKO AI'}
                    </span>
                    <span class="text-[10.5px] text-muted">
                      • {formatDateTime(msg.createdAt)}
                    </span>
                  </div>

                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-danger hover:bg-danger/10"
                    title="Hapus pesan ini"
                    onclick={() => ctrl.removeMessage(msg.id)}
                  >
                    <Trash2 class="h-3 w-3" aria-hidden="true" />
                    <span>Hapus</span>
                  </button>
                </div>

                <p class="whitespace-pre-wrap text-xs leading-relaxed text-ink">
                  {msg.content || '(Pesan kosong / dibatalkan)'}
                </p>

                {#if msg.sources && msg.sources.length > 0}
                  <div class="flex flex-wrap gap-1.5 border-t border-line/40 pt-2">
                    {#each msg.sources as src (src.id)}
                      <span class="rounded-lg border border-line bg-surface-soft px-2 py-0.5 text-[10px] font-bold text-muted">
                        Sumber: {src.title}
                        {#if src.topic}
                          ({src.topic})
                        {/if}
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </Card>
  </div>
</div>
