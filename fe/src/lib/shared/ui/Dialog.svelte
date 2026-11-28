<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    title: string;
    onclose: () => void;
    children?: Snippet;
    footer?: Snippet;
  }

  let { open = false, title, onclose, children, footer }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      event.stopPropagation();
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs"
    role="presentation"
    onclick={(e) => {
      if (e.target === e.currentTarget) onclose();
    }}
  >
    <div
      data-slot="dialog-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      class="neo-box flex w-full max-w-md flex-col gap-4 border-2 border-line bg-surface p-6 shadow-[6px_6px_0px_var(--neo-shadow-color)] animate-in fade-in-50 zoom-in-95 duration-150"
    >
      <div class="flex items-center justify-between">
        <h2 id="dialog-title" class="text-lg font-bold text-ink">
          {title}
        </h2>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-surface-soft hover:text-ink"
          aria-label="Tutup dialog"
          onclick={onclose}
        >
          ✕
        </button>
      </div>

      <div class="text-sm text-ink">
        {#if children}
          {@render children()}
        {/if}
      </div>

      {#if footer}
        <div class="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-line/60">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}

