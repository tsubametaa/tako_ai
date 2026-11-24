<script lang="ts">
  import { Tag } from '@lucide/svelte';

  interface Props {
    topics: string[];
  }

  let { topics = [] }: Props = $props();
</script>

{#if topics.length > 0}
  <div
    class="flex flex-wrap items-center gap-1.5"
    aria-label="Konteks topik materi"
  >
    <span
      class="inline-flex items-center gap-1 text-[11px] font-bold text-muted"
    >
      <Tag class="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>Topik:</span>
    </span>

    {#each topics as topic (topic.toLowerCase())}
      <span
        class="inline-flex max-w-full items-center rounded-md border border-line/25 bg-surface px-2 py-0.5 text-[11px] font-semibold text-ink"
        title={topic}
      >
        <span class="truncate">{topic}</span>
      </span>
    {/each}
  </div>
{/if}
