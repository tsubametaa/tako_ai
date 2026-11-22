<script lang="ts">
  import { Edit2, MessageSquare, MoreVertical, Trash2 } from '@lucide/svelte';
  import type { Conversation } from '../../domain/conversation';

  interface Props {
    conversation: Conversation;
    active?: boolean;
    onselect?: (id: string) => void;
    onrename?: (conv: Conversation) => void;
    ondelete?: (conv: Conversation) => void;
  }

  let {
    conversation,
    active = false,
    onselect,
    onrename,
    ondelete,
  }: Props = $props();

  let showMenu = $state(false);
</script>

<div
  class="group relative flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition {active
    ? 'border-2 border-line bg-surface font-bold text-ink shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]'
    : 'border-2 border-transparent text-ink hover:border-line/40 hover:bg-surface/60'}"
>
  <a
    href="/chat/{conversation.id}"
    aria-current={active ? 'page' : undefined}
    class="flex min-h-[40px] flex-1 items-center gap-2.5 truncate"
    onclick={(e) => {
      e.preventDefault();
      onselect?.(conversation.id);
    }}
  >
    <MessageSquare class="h-4 w-4 shrink-0 {active ? 'text-mustard' : 'text-muted'}" aria-hidden="true" />
    <span class="truncate">{conversation.title}</span>
  </a>

  <!-- Action Menu Button -->
  <div class="relative">
    <button
      type="button"
      class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted opacity-80 hover:bg-surface-soft hover:text-ink hover:opacity-100 group-hover:opacity-100"
      aria-label="Opsi percakapan {conversation.title}"
      aria-expanded={showMenu}
      onclick={() => (showMenu = !showMenu)}
    >
      <MoreVertical class="h-4 w-4" aria-hidden="true" />
    </button>

    {#if showMenu}
      <div
        class="fixed inset-0 z-30"
        role="presentation"
        onclick={() => (showMenu = false)}
      ></div>
      <div
        class="absolute right-0 top-9 z-40 flex w-36 flex-col gap-1 rounded-xl border-2 border-line bg-surface p-1.5 shadow-[4px_4px_0px_var(--neo-shadow-color)]"
      >
        <button
          type="button"
          class="flex min-h-[36px] w-full items-center gap-2 rounded-lg px-2.5 text-xs text-ink hover:bg-surface-soft"
          onclick={() => {
            showMenu = false;
            onrename?.(conversation);
          }}
        >
          <Edit2 class="h-3.5 w-3.5" aria-hidden="true" />
          <span>Ubah judul</span>
        </button>
        <button
          type="button"
          class="flex min-h-[36px] w-full items-center gap-2 rounded-lg px-2.5 text-xs text-danger hover:bg-danger/10"
          onclick={() => {
            showMenu = false;
            ondelete?.(conversation);
          }}
        >
          <Trash2 class="h-3.5 w-3.5" aria-hidden="true" />
          <span>Hapus</span>
        </button>
      </div>
    {/if}
  </div>
</div>

