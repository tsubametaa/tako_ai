<script lang="ts">
  import { ArrowDown, Loader2, RefreshCw } from '@lucide/svelte';
  import type { GenerationStatus } from '../../domain/generation';
  import type { Message } from '../../domain/message';
  import ChatEmptyState from './ChatEmptyState.svelte';
  import MessageBubble from './MessageBubble.svelte';

  interface Props {
    messages: Message[];
    streamingMessage?: Message | null;
    status?: GenerationStatus;
    userScrolledUp?: boolean;
    userName?: string | null;
    onselectexample?: (text: string) => void;
    onretry?: () => void;
    onscroll?: (e: Event) => void;
    onscrolltobottom?: () => void;
  }

  let {
    messages = [],
    streamingMessage = null,
    status = 'idle',
    userScrolledUp = false,
    userName = null,
    onselectexample,
    onretry,
    onscroll,
    onscrolltobottom,
  }: Props = $props();

  let listContainer: HTMLDivElement | undefined = $state();

  $effect(() => {
    // Auto-scroll when new token arrives if user has not scrolled up
    void messages.length;
    void streamingMessage?.content;
    if (listContainer && !userScrolledUp) {
      listContainer.scrollTop = listContainer.scrollHeight;
    }
  });

  $effect(() => {
    // Keep latest message visible when the morphing composer grows upward
    if (!listContainer || typeof ResizeObserver === 'undefined') return;
    const container = listContainer;
    const observer = new ResizeObserver(() => {
      if (!userScrolledUp) {
        container.scrollTop = container.scrollHeight;
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  });
</script>

<div
  bind:this={listContainer}
  class="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6"
  onscroll={onscroll}
>
  {#if messages.length === 0 && !streamingMessage}
    {#if status === 'loading'}
      <div class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <Loader2 class="h-6 w-6 animate-spin text-mustard" aria-hidden="true" />
        <p class="text-xs font-bold text-muted">Memuat riwayat percakapan…</p>
      </div>
    {:else if status === 'failed' && onretry}
      <div class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p class="text-sm font-bold text-ink">Riwayat percakapan gagal dimuat</p>
        <p class="max-w-sm text-xs font-medium text-muted">
          Pastikan server backend aktif lalu coba muat ulang riwayat room ini.
        </p>
        <button
          type="button"
          class="neo-control inline-flex min-h-[40px] items-center gap-2 rounded-xl border-2 border-line bg-mustard px-4 py-2 text-xs font-extrabold text-on-mustard shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]"
          onclick={onretry}
        >
          <RefreshCw class="h-3.5 w-3.5" aria-hidden="true" />
          <span>Muat Ulang Riwayat</span>
        </button>
      </div>
    {:else}
      <ChatEmptyState {userName} {onselectexample} />
    {/if}
  {:else}
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-6">
      {#each messages as msg (msg.id)}
        <MessageBubble message={msg} />
      {/each}

      {#if streamingMessage}
        <MessageBubble message={streamingMessage} {status} />
      {/if}
    </div>
  {/if}

  <!-- Floating Scroll To Bottom Button (Spec 12.5) -->
  {#if userScrolledUp}
    <div class="sticky bottom-4 flex justify-center">
      <button
        type="button"
        class="neo-control inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-2 border-line bg-surface px-4 py-2 text-xs font-bold text-ink shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)] hover:bg-mustard hover:text-on-mustard"
        onclick={() => {
          if (listContainer) {
            listContainer.scrollTop = listContainer.scrollHeight;
          }
          onscrolltobottom?.();
        }}
      >
        <span>Ke pesan terbaru</span>
        <ArrowDown class="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  {/if}
</div>

