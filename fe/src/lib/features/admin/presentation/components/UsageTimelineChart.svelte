<script lang="ts">
  import { BarChart3 } from '@lucide/svelte';
  import { Card } from '$lib/shared/ui';
  import type { DailyUsagePoint } from '../../infrastructure/adminAnalyticsApi';

  interface Props {
    points: DailyUsagePoint[];
    days: number;
    periodQuestions: number;
    loading?: boolean;
  }

  let { points = [], days = 14, periodQuestions = 0, loading = false }: Props = $props();

  let hoveredIdx = $state<number | null>(null);

  const SVG_W = 640;
  const SVG_H = 228;
  const PAD_LEFT = 36;
  const PAD_RIGHT = 14;
  const PAD_TOP = 16;
  const PAD_BOTTOM = 30;
  const PLOT_W = SVG_W - PAD_LEFT - PAD_RIGHT;
  const PLOT_H = SVG_H - PAD_TOP - PAD_BOTTOM;

  const maxTotal = $derived.by(() => {
    const peak = Math.max(1, ...points.map((p) => p.total));
    if (peak <= 4) return 4;
    const step = Math.ceil(peak / 4);
    return step * 4;
  });

  const yTicks = $derived([
    maxTotal,
    Math.round(maxTotal * 0.75),
    Math.round(maxTotal * 0.5),
    Math.round(maxTotal * 0.25),
    0,
  ]);

  const xLabelStep = $derived(days >= 30 ? 5 : days >= 14 ? 2 : 1);

  const bars = $derived.by(() => {
    const n = Math.max(points.length, 1);
    const slotW = PLOT_W / n;
    const barW = Math.min(26, Math.max(8, slotW * 0.62));
    return points.map((pt, idx) => {
      const cx = PAD_LEFT + slotW * idx + slotW / 2;
      const x = cx - barW / 2;
      const totalH = (pt.total / maxTotal) * PLOT_H;
      const umumH = (pt.umum / maxTotal) * PLOT_H;
      const deepH = Math.max(0, totalH - umumH);
      const yBottom = PAD_TOP + PLOT_H;
      return {
        ...pt,
        idx,
        cx,
        x,
        barW,
        slotX: PAD_LEFT + slotW * idx,
        slotW,
        umumY: yBottom - umumH,
        umumH,
        deepY: yBottom - totalH,
        deepH,
        showTick: idx % xLabelStep === 0 || idx === n - 1,
      };
    });
  });

  const activePoint = $derived(
    hoveredIdx !== null && bars[hoveredIdx] ? bars[hoveredIdx] : null,
  );
</script>

<Card class="flex flex-col gap-4 p-5">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h3 class="text-sm font-extrabold text-ink md:text-base">
        Tren Pertanyaan Harian ke NEKO AI ({days} Hari Terakhir)
      </h3>
      <p class="mt-0.5 text-xs font-medium text-muted">
        Total <strong class="font-extrabold text-ink tabular-nums">{periodQuestions}</strong> pertanyaan dalam periode ini (Mode Umum vs Deep Think).
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3 text-[11px] font-bold text-ink">
      <span class="inline-flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-[3px] border border-line bg-primary" aria-hidden="true"></span>
        <span>Mode Umum</span>
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-[3px] border border-line bg-mustard" aria-hidden="true"></span>
        <span>Deep Think</span>
      </span>
    </div>
  </div>

  {#if loading && points.length === 0}
    <div class="flex h-[228px] items-center justify-center rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft text-xs font-bold text-muted">
      Memuat grafik aktivitas harian…
    </div>
  {:else if points.length === 0 || periodQuestions === 0}
    <div class="flex h-[228px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle bg-surface-soft px-4 text-center">
      <BarChart3 class="h-6 w-6 text-muted" aria-hidden="true" />
      <p class="text-xs font-extrabold text-ink">Belum ada aktivitas chat pada {days} hari terakhir</p>
      <p class="max-w-sm text-[11px] text-muted">
        Grafik akan terisi otomatis ketika siswa mulai mengajukan pertanyaan ke NEKO AI.
      </p>
    </div>
  {:else}
    <div class="relative w-full" onmouseleave={() => (hoveredIdx = null)} role="region" aria-label="Grafik penggunaan AI harian">
      {#if activePoint}
        <div
          class="pointer-events-none absolute top-1 z-20 min-w-[168px] -translate-x-1/2 rounded-xl border-2 border-line bg-surface px-3 py-2 text-[11px] shadow-[3px_3px_0px_var(--neo-shadow-color)]"
          style="left: {Math.min(82, Math.max(18, (activePoint.cx / SVG_W) * 100))}%;"
        >
          <p class="mb-1 border-b border-border-subtle pb-1 font-extrabold text-ink">
            {activePoint.label} ({activePoint.date})
          </p>
          <div class="flex items-center justify-between gap-3">
            <span class="inline-flex items-center gap-1.5 text-muted">
              <span class="h-2 w-2 rounded-[2px] bg-primary" aria-hidden="true"></span>
              <span>Mode Umum</span>
            </span>
            <strong class="font-extrabold text-ink tabular-nums">{activePoint.umum}</strong>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="inline-flex items-center gap-1.5 text-muted">
              <span class="h-2 w-2 rounded-[2px] bg-mustard" aria-hidden="true"></span>
              <span>Deep Think</span>
            </span>
            <strong class="font-extrabold text-ink tabular-nums">{activePoint.terstruktur}</strong>
          </div>
          <div class="mt-1 flex items-center justify-between gap-3 border-t border-border-subtle pt-1 text-[10.5px]">
            <span class="font-bold text-muted">Total ({activePoint.activeStudents} siswa)</span>
            <strong class="font-extrabold text-ink tabular-nums">{activePoint.total}</strong>
          </div>
        </div>
      {/if}

      <svg
        viewBox="0 0 {SVG_W} {SVG_H}"
        class="h-auto w-full select-none overflow-visible"
        role="img"
        aria-label="Diagram batang penggunaan AI harian"
      >
        {#each yTicks as tick}
          {@const y = PAD_TOP + PLOT_H - (tick / maxTotal) * PLOT_H}
          <line
            x1={PAD_LEFT}
            x2={SVG_W - PAD_RIGHT}
            y1={y}
            y2={y}
            stroke="var(--border-subtle)"
            stroke-dasharray={tick === 0 ? undefined : '4 4'}
            stroke-width="1"
          />
          <text
            x={PAD_LEFT - 8}
            y={y + 3.5}
            text-anchor="end"
            fill="var(--muted)"
            font-size="10"
            font-weight="600"
          >
            {tick}
          </text>
        {/each}

        {#each bars as b (b.date)}
          {@const isHovered = hoveredIdx === b.idx}
          <g
            tabindex="0"
            role="button"
            aria-label="{b.label}: {b.total} pertanyaan ({b.umum} umum, {b.terstruktur} deep think)"
            class="cursor-pointer outline-none"
            onmouseenter={() => (hoveredIdx = b.idx)}
            onfocus={() => (hoveredIdx = b.idx)}
          >
            <rect
              x={b.slotX}
              y={PAD_TOP}
              width={b.slotW}
              height={PLOT_H}
              rx="6"
              fill={isHovered ? 'var(--surface-soft)' : 'transparent'}
            />

            {#if b.umumH > 0}
              <rect
                x={b.x}
                y={b.umumY}
                width={b.barW}
                height={b.umumH}
                rx="3"
                fill="var(--primary)"
                stroke="var(--border)"
                stroke-width={isHovered ? '1.5' : '1'}
              />
            {/if}

            {#if b.deepH > 0}
              <rect
                x={b.x}
                y={b.deepY}
                width={b.barW}
                height={b.deepH}
                rx="3"
                fill="var(--mustard)"
                stroke="var(--border)"
                stroke-width={isHovered ? '1.5' : '1'}
              />
            {/if}

            {#if b.showTick}
              <text
                x={b.cx}
                y={SVG_H - 8}
                text-anchor="middle"
                fill={isHovered ? 'var(--text)' : 'var(--muted)'}
                font-size="10"
                font-weight={isHovered ? '800' : '600'}
              >
                {b.label}
              </text>
            {/if}
          </g>
        {/each}
      </svg>
    </div>
  {/if}
</Card>
