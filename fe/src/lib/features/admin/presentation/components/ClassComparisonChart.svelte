<script lang="ts">
  import { GraduationCap } from '@lucide/svelte';
  import { Card } from '$lib/shared/ui';
  import type { ClassUsageItem } from '../../infrastructure/adminAnalyticsApi';

  interface Props {
    classes: ClassUsageItem[];
    loading?: boolean;
  }

  let { classes = [], loading = false }: Props = $props();

  let hoveredClass = $state<string | null>(null);

  const maxQuestions = $derived(
    Math.max(1, ...classes.map((c) => c.totalQuestions)),
  );
  const totalAllQuestions = $derived(
    classes.reduce((acc, c) => acc + c.totalQuestions, 0),
  );
</script>

<Card class="flex flex-col gap-4 p-5">
  <div class="flex flex-wrap items-start justify-between gap-2">
    <div>
      <h3 class="text-sm font-extrabold text-ink md:text-base">
        Perbandingan Penggunaan Antar Kelas
      </h3>
      <p class="mt-0.5 text-xs font-medium text-muted">
        Klasifikasi jumlah pertanyaan & siswa aktif tiap kelas (Normal vs Deep Think).
      </p>
    </div>

    <span class="neo-badge bg-surface-soft px-2 py-0.5 text-[10.5px] text-ink tabular-nums">
      {classes.length} kelas
    </span>
  </div>

  {#if loading && classes.length === 0}
    <div class="flex h-[228px] items-center justify-center rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft text-xs font-bold text-muted">
      Memuat perbandingan kelas…
    </div>
  {:else if classes.length === 0}
    <div class="flex h-[228px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft px-4 text-center">
      <GraduationCap class="h-6 w-6 text-muted" aria-hidden="true" />
      <p class="text-xs font-extrabold text-ink">Belum ada data kelas terdaftar</p>
      <p class="text-[11px] text-muted">
        Tambahkan siswa beserta kelasnya di menu Akun Siswa agar perbandingan muncul di sini.
      </p>
    </div>
  {:else}
    <div class="flex max-h-[268px] flex-col gap-2.5 overflow-y-auto pr-1">
      {#each classes as cl, idx (cl.className)}
        {@const widthPct = (cl.totalQuestions / maxQuestions) * 100}
        {@const umumPct = cl.totalQuestions > 0 ? (cl.umumCount / cl.totalQuestions) * 100 : 0}
        {@const deepPct = cl.totalQuestions > 0 ? 100 - umumPct : 0}
        {@const isHovered = hoveredClass === cl.className}
        <div
          class="relative rounded-xl border-2 p-2.5 transition {isHovered
            ? 'border-line bg-surface-soft shadow-[2px_2px_0px_var(--neo-shadow-color)]'
            : 'border-border-subtle bg-surface'}"
          onmouseenter={() => (hoveredClass = cl.className)}
          onmouseleave={() => (hoveredClass = null)}
          role="group"
          aria-label="Kelas {cl.className}: {cl.totalQuestions} pertanyaan"
        >
          <div class="mb-1.5 flex items-center justify-between gap-2 text-xs">
            <div class="flex min-w-0 items-center gap-2">
              <span class="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-line bg-mustard px-1 text-[10px] font-extrabold text-on-mustard tabular-nums">
                #{idx + 1}
              </span>
              <span class="truncate font-extrabold text-ink">{cl.className}</span>
              {#if cl.registeredStudents > 0}
                <span class="hidden text-[10.5px] font-semibold text-muted sm:inline tabular-nums">
                  ({cl.activeStudents}/{cl.registeredStudents} siswa aktif)
                </span>
              {/if}
            </div>

            <div class="shrink-0 text-right tabular-nums">
              <span class="font-extrabold text-ink">{cl.totalQuestions}</span>
              <span class="text-[10.5px] font-semibold text-muted">
                tanya{#if totalAllQuestions > 0} • {cl.sharePercent}%{/if}
              </span>
            </div>
          </div>

          <div class="h-3 w-full overflow-hidden rounded-full border border-line/40 bg-surface-soft">
            {#if cl.totalQuestions > 0}
              <div
                class="flex h-full overflow-hidden rounded-full transition-all duration-300"
                style="width: {Math.max(4, widthPct)}%;"
              >
                {#if cl.umumCount > 0}
                  <div
                    class="h-full bg-primary"
                    style="width: {umumPct}%;"
                    title="Mode Umum: {cl.umumCount}"
                  ></div>
                {/if}
                {#if cl.terstrukturCount > 0}
                  <div
                    class="h-full bg-mustard"
                    style="width: {deepPct}%;"
                    title="Deep Think: {cl.terstrukturCount}"
                  ></div>
                {/if}
              </div>
            {/if}
          </div>

          <div class="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-semibold text-muted tabular-nums">
            <span>
              Umum: <strong class="text-ink">{cl.umumCount}</strong> • Deep Think: <strong class="text-ink">{cl.terstrukturCount}</strong>
            </span>
            <span>{cl.totalConversations} sesi chat</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</Card>
