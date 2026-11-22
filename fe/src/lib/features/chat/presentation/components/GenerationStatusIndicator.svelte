<script lang="ts">
  import { Loader2 } from '@lucide/svelte';
  import {
    GENERATION_STATUS_LABELS,
    type GenerationStatus,
  } from '../../domain/generation';

  interface Props {
    status: GenerationStatus;
  }

  let { status }: Props = $props();

  const isVisible = $derived(
    status === 'queued' || status === 'reconnecting',
  );
</script>

{#if isVisible}
  <div class="flex items-center justify-center px-2 pt-2">
    <div
      class="inline-flex items-center gap-2 rounded-xl border-2 border-line bg-surface px-3.5 py-1.5 text-xs font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] animate-in fade-in duration-150"
      role="status"
    >
      <Loader2 class="h-3.5 w-3.5 animate-spin text-mustard" aria-hidden="true" />
      <span>{GENERATION_STATUS_LABELS[status]}</span>
    </div>
  </div>
{/if}

