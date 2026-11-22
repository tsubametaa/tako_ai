<script lang="ts">
  import { ExternalLink, X } from '@lucide/svelte';
  import { cubicOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';
  import { isSafeUrl, type Source } from '../../domain/source';

  interface Props {
    sources: Source[];
    open: boolean;
    onclose: () => void;
  }

  let { sources = [], open = false, onclose }: Props = $props();
</script>

{#if open}
  <div
    transition:slide={{ duration: 220, easing: cubicOut }}
    class="mt-3 flex flex-col gap-3 rounded-2xl border-2 border-line bg-surface-soft p-4 shadow-[3px_3px_0px_var(--neo-shadow-color)]"
    aria-label="Panel rincian sumber materi"
  >
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold uppercase tracking-wider text-muted">
        Sumber Materi Referensi ({sources.length})
      </span>
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink"
        aria-label="Tutup panel sumber"
        onclick={onclose}
      >
        <X class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>

    {#if sources.length === 0}
      <p class="text-xs text-muted">
        Sumber materi tidak tersedia untuk respons ini.
      </p>
    {:else}
      <div class="flex flex-col gap-3">
        {#each sources as src, idx (src.id || idx)}
          <div class="flex flex-col gap-1.5 rounded-xl border-2 border-line bg-surface p-3 shadow-[2px_2px_0px_var(--neo-shadow-color)]">
            <div class="flex items-start justify-between gap-2">
              <span class="text-xs font-bold text-ink">
                [{idx + 1}] {src.title}
              </span>
              {#if isSafeUrl(src.url)}
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex min-h-[32px] items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <span>Buka Dokumen</span>
                  <ExternalLink class="h-3 w-3" aria-hidden="true" />
                </a>
              {/if}
            </div>

            <div class="flex flex-wrap gap-2 text-[11px] text-muted">
              {#if src.section}
                <span>Topik: {src.section}</span>
              {/if}
              {#if src.page}
                <span>• Halaman: {src.page}</span>
              {/if}
            </div>

            {#if src.snippet}
              <blockquote class="mt-1 border-l-2 border-sage/60 pl-2 text-xs italic text-ink/80">
                "{src.snippet}"
              </blockquote>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

