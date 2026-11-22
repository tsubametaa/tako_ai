<script lang="ts">
  import { BookOpen, ChevronDown } from '@lucide/svelte';

  interface Props {
    count: number;
    label?: string;
    open?: boolean;
    onclick?: () => void;
  }

  let { count, label, open = false, onclick }: Props = $props();

  const chipText = $derived(
    label
      ? count > 1
        ? `${label} (+${count - 1} lainnya)`
        : label
      : `Lihat sumber (${count})`,
  );
</script>

{#if count > 0}
  <button
    type="button"
    class="inline-flex w-fit max-w-full items-center gap-1.5 rounded-lg border border-line/35 bg-mustard-soft px-2.5 py-1.5 text-left text-xs font-bold text-ink transition hover:border-line hover:bg-mustard hover:text-on-mustard active:scale-[0.99]"
    aria-expanded={open}
    onclick={() => onclick?.()}
  >
    <BookOpen class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    <span class="truncate">{chipText}</span>
    <ChevronDown
      class="h-3.5 w-3.5 shrink-0 transition-transform duration-150 {open
        ? 'rotate-180'
        : ''}"
      aria-hidden="true"
    />
  </button>
{/if}
