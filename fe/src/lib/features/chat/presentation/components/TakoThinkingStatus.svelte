<script lang="ts">
  import { onMount } from 'svelte';
  import { LoaderCircle } from '@lucide/svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import type { GenerationStatus } from '../../domain/generation';

  interface Props {
    status?: GenerationStatus;
    hasSources?: boolean;
  }

  let { status = 'retrieving', hasSources = false }: Props = $props();

  let elapsedMs = $state(0);

  const elapsedSeconds = $derived(Math.floor(elapsedMs / 1000));

  const stageLabel = $derived.by(() => {
    if (elapsedMs >= 6500) {
      return 'Tunggu ya…';
    }
    if (elapsedMs >= 2600 || hasSources || status === 'generating') {
      return 'Tako lagi menyusun jawaban…';
    }
    return 'Tako lagi berfikir…';
  });

  onMount(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      elapsedMs = Date.now() - startedAt;
    }, 250);
    return () => window.clearInterval(timer);
  });
</script>

<div
  class="flex items-center justify-between gap-3 py-0.5"
  role="status"
  aria-live="polite"
>
  <div class="flex min-w-0 items-center gap-2">
    <LoaderCircle
      class="h-4 w-4 shrink-0 animate-spin text-mustard motion-reduce:animate-none"
      aria-hidden="true"
    />
    {#key stageLabel}
      <span
        in:fly={{ y: 4, duration: 180, easing: cubicOut }}
        class="tako-shimmer truncate text-sm font-semibold tracking-tight"
      >
        {stageLabel}
      </span>
    {/key}
  </div>

  {#if elapsedSeconds >= 1}
    <span class="shrink-0 font-mono text-[11px] font-semibold text-muted/80 tabular-nums">
      {elapsedSeconds} dtk
    </span>
  {/if}
</div>
