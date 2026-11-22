<script lang="ts">
  import { BookOpenCheck, Brain } from '@lucide/svelte';
  import { Card } from '$lib/shared/ui';
  import type { TopicSummaryItem } from '../../infrastructure/adminAnalyticsApi';

  interface Props {
    topics: TopicSummaryItem[];
    totalQuestions: number;
    loading?: boolean;
  }

  let { topics = [], totalQuestions = 0, loading = false }: Props = $props();

  const maxCount = $derived(
    Math.max(1, ...topics.map((t) => t.questionCount)),
  );
</script>

<Card class="flex flex-col gap-4 p-5">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h3 class="text-sm font-extrabold text-ink md:text-base">
        Ringkasan Topik yang Paling Banyak Ditanya Siswa
      </h3>
      <p class="mt-0.5 text-xs font-medium text-muted">
        Dikelompokkan dari sumber materi RAG & kata kunci pertanyaan di seluruh percakapan siswa.
      </p>
    </div>

    <span class="neo-badge bg-mustard px-2.5 py-0.5 text-[10.5px] text-on-mustard tabular-nums">
      {topics.length} topik terdeteksi
    </span>
  </div>

  {#if loading && topics.length === 0}
    <div class="flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft text-xs font-bold text-muted">
      Menganalisis topik pertanyaan siswa…
    </div>
  {:else if topics.length === 0}
    <div class="flex h-36 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft px-4 text-center">
      <BookOpenCheck class="h-6 w-6 text-muted" aria-hidden="true" />
      <p class="text-xs font-extrabold text-ink">Belum ada topik pertanyaan yang terekam</p>
      <p class="text-[11px] text-muted">
        Ringkasan topik terpopuler akan muncul otomatis begitu siswa berdiskusi dengan TAKO AI.
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      {#each topics as item, idx (item.topic)}
        {@const barPct = (item.questionCount / maxCount) * 100}
        <div class="flex flex-col justify-between gap-2.5 rounded-xl border-2 border-line bg-surface-soft p-3.5 shadow-[2px_2px_0px_var(--neo-shadow-color)]">
          <div class="flex flex-col gap-2">
            <div class="flex items-start justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2">
                <span
                  class="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-lg border-2 border-line px-1.5 text-[11px] font-extrabold tabular-nums {idx ===
                  0
                    ? 'bg-mustard text-on-mustard'
                    : 'bg-surface text-ink'}"
                >
                  #{idx + 1}
                </span>
                <h4 class="truncate text-sm font-extrabold text-ink" title={item.topic}>
                  {item.topic}
                </h4>
              </div>

              <div class="shrink-0 text-right tabular-nums">
                <span class="text-sm font-extrabold text-ink">{item.questionCount}</span>
                <span class="text-[11px] font-bold text-muted">
                  tanya{#if totalQuestions > 0} ({item.sharePercent}%){/if}
                </span>
              </div>
            </div>

            <div class="h-2.5 w-full overflow-hidden rounded-full border border-line/40 bg-surface">
              <div
                class="h-full rounded-full {idx === 0 ? 'bg-mustard' : 'bg-primary'}"
                style="width: {Math.max(5, barPct)}%;"
              ></div>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted">
              <span class="tabular-nums">{item.studentCount} siswa bertanya</span>
              {#if item.terstrukturCount > 0}
                <span class="inline-flex items-center gap-1 rounded-md border border-line/30 bg-mustard-soft px-1.5 py-0.5 text-[10px] font-bold text-ink tabular-nums">
                  <Brain class="h-3 w-3" aria-hidden="true" />
                  <span>{item.terstrukturCount} Deep Think</span>
                </span>
              {/if}
              {#each item.topClasses as clsBadge}
                <span class="rounded-md border border-border-subtle bg-surface px-1.5 py-0.5 text-[10px] font-bold text-ink">
                  {clsBadge}
                </span>
              {/each}
            </div>
          </div>

          {#if item.sampleQuestions.length > 0}
            <div class="border-t border-border-subtle pt-2">
              <p class="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-muted">
                Contoh pertanyaan terbaru:
              </p>
              <ul class="flex flex-col gap-1">
                {#each item.sampleQuestions as q}
                  <li class="line-clamp-1 text-[11.5px] font-medium text-ink">
                    “{q}”
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</Card>
