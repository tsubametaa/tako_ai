<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ArrowRight,
    BookOpen,
    Brain,
    FileSearch,
    Flame,
    MessageSquareText,
    RefreshCw,
    Users,
  } from '@lucide/svelte';
  import { page } from '$app/state';
  import { buildSitePath } from '$lib/shared/config/subdomains';
  import { Button, Card } from '$lib/shared/ui';
  import { ADMIN_SECTIONS } from '../../domain/navigation';
  import type { AnalyticsWindowDays } from '../../infrastructure/adminAnalyticsApi';
  import ClassComparisonChart from '../components/ClassComparisonChart.svelte';
  import TopTopicsSummary from '../components/TopTopicsSummary.svelte';
  import UsageTimelineChart from '../components/UsageTimelineChart.svelte';
  import { AdminAnalyticsController } from '../state/adminAnalytics.svelte';

  const ctrl = new AdminAnalyticsController();
  const dayOptions: AnalyticsWindowDays[] = [7, 14, 30];

  const quickModules = $derived(
    ADMIN_SECTIONS.filter((section) => section.id !== 'overview').map(
      (section) => ({
        ...section,
        href: buildSitePath('admin', page.url, section.subPath),
      }),
    ),
  );

  onMount(() => {
    void ctrl.load();
  });
</script>

<svelte:head>
  <title>Ringkasan Analitik AI - Admin NEKO</title>
</svelte:head>

<div class="flex flex-col gap-5">
  <!-- Header & Filter Periode -->
  <Card class="flex flex-wrap items-center justify-between gap-4 p-5">
    <div>
      <h2 class="text-lg font-extrabold text-ink md:text-xl">
        Ringkasan Penggunaan NEKO AI
      </h2>
      <p class="mt-0.5 text-xs font-medium text-muted">
        Pantau tren pertanyaan siswa, perbandingan keaktifan antar kelas, dan topik KKA paling banyak ditanyakan.
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div
        class="inline-flex rounded-xl border-2 border-line bg-surface-soft p-0.5"
        role="group"
        aria-label="Rentang waktu grafik"
      >
        {#each dayOptions as d}
          <button
            type="button"
            disabled={ctrl.loading}
            class="rounded-lg px-2.5 py-1 text-xs font-extrabold transition {ctrl.days === d
              ? 'bg-mustard text-on-mustard shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]'
              : 'text-muted hover:text-ink'}"
            onclick={() => ctrl.setDays(d)}
          >
            {d} Hari
          </button>
        {/each}
      </div>

      <div
        class="inline-flex rounded-xl border-2 border-line bg-surface-soft p-0.5"
        role="group"
        aria-label="Filter akun"
      >
        <button
          type="button"
          disabled={ctrl.loading}
          class="rounded-lg px-2.5 py-1 text-xs font-extrabold transition {ctrl.scope ===
          'students'
            ? 'bg-primary text-on-primary shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]'
            : 'text-muted hover:text-ink'}"
          onclick={() => ctrl.setScope('students')}
        >
          Hanya Siswa
        </button>
        <button
          type="button"
          disabled={ctrl.loading}
          class="rounded-lg px-2.5 py-1 text-xs font-extrabold transition {ctrl.scope === 'all'
            ? 'bg-primary text-on-primary shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]'
            : 'text-muted hover:text-ink'}"
          onclick={() => ctrl.setScope('all')}
        >
          Semua Akun
        </button>
      </div>

      <Button
        variant="secondary"
        size="sm"
        disabled={ctrl.loading}
        onclick={() => ctrl.load()}
      >
        <RefreshCw class="h-4 w-4 {ctrl.loading ? 'animate-spin' : ''}" aria-hidden="true" />
        <span>Muat Ulang</span>
      </Button>
    </div>
  </Card>

  {#if ctrl.errorMessage}
    <p role="alert" class="rounded-xl border-2 border-danger bg-danger/10 px-4 py-2.5 text-xs font-bold text-danger">
      {ctrl.errorMessage}
    </p>
  {/if}

  <!-- KPI Metrik Nyata -->
  <div class="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
    <Card class="flex flex-col gap-1 p-4">
      <div class="flex items-center justify-between text-xs font-bold text-muted">
        <span>Total Pertanyaan</span>
        <MessageSquareText class="h-4 w-4 text-primary" aria-hidden="true" />
      </div>
      <p class="text-2xl font-extrabold text-ink tabular-nums">
        {ctrl.data ? ctrl.data.summary.totalQuestions : '—'}
      </p>
      <p class="text-[11px] font-medium text-muted tabular-nums">
        {ctrl.data ? `${ctrl.data.summary.totalConversations} sesi percakapan` : 'Memuat data…'}
      </p>
    </Card>

    <Card class="flex flex-col gap-1 p-4">
      <div class="flex items-center justify-between text-xs font-bold text-muted">
        <span>Siswa Aktif Bertanya</span>
        <Users class="h-4 w-4 text-primary" aria-hidden="true" />
      </div>
      <p class="text-2xl font-extrabold text-ink tabular-nums">
        {ctrl.data ? ctrl.data.summary.activeStudents : '—'}
        {#if ctrl.data && ctrl.data.summary.totalRegisteredStudents > 0}
          <span class="text-sm font-bold text-muted">
            / {ctrl.data.summary.totalRegisteredStudents}
          </span>
        {/if}
      </p>
      <p class="text-[11px] font-medium text-muted">
        Kelas teraktif: <strong class="text-ink">{ctrl.data?.summary.topClassName ?? '—'}</strong>
      </p>
    </Card>

    <Card class="flex flex-col gap-1 p-4">
      <div class="flex items-center justify-between text-xs font-bold text-muted">
        <span>Penggunaan Deep Think</span>
        <Brain class="h-4 w-4 text-mustard" aria-hidden="true" />
      </div>
      <p class="text-2xl font-extrabold text-ink tabular-nums">
        {ctrl.data ? `${ctrl.data.summary.deepThinkPercent}%` : '—'}
      </p>
      <p class="text-[11px] font-medium text-muted tabular-nums">
        {ctrl.data
          ? `${ctrl.data.summary.terstrukturCount} Deep Think • ${ctrl.data.summary.umumCount} Umum`
          : 'Memuat rasio mode…'}
      </p>
    </Card>

    <Card class="flex flex-col gap-1 p-4">
      <div class="flex items-center justify-between text-xs font-bold text-muted">
        <span>Topik Paling Populer</span>
        <Flame class="h-4 w-4 text-mustard" aria-hidden="true" />
      </div>
      <p class="line-clamp-1 text-lg font-extrabold text-ink" title={ctrl.data?.summary.topTopicName}>
        {ctrl.data?.summary.topTopicName ?? '—'}
      </p>
      <p class="text-[11px] font-medium text-muted">
        Berdasarkan materi RAG & pertanyaan
      </p>
    </Card>
  </div>

  <!-- Grafik Tren Harian & Perbandingan Kelas -->
  <div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
    <div class="xl:col-span-7">
      <UsageTimelineChart
        points={ctrl.data?.dailyUsage ?? []}
        days={ctrl.days}
        periodQuestions={ctrl.data?.summary.periodQuestions ?? 0}
        loading={ctrl.loading}
      />
    </div>
    <div class="xl:col-span-5">
      <ClassComparisonChart
        classes={ctrl.data?.classUsage ?? []}
        loading={ctrl.loading}
      />
    </div>
  </div>

  <!-- Ringkasan Topik Paling Banyak Ditanya -->
  <TopTopicsSummary
    topics={ctrl.data?.topTopics ?? []}
    totalQuestions={ctrl.data?.summary.totalQuestions ?? 0}
    loading={ctrl.loading}
  />

  <!-- Akses Cepat Modul Admin -->
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {#each quickModules as item}
      <a
        href={item.href}
        class="neo-control flex items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-left transition hover:bg-surface-soft"
      >
        <div class="flex min-w-0 items-center gap-2.5">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-line bg-surface-soft text-ink">
            {#if item.id === 'students'}
              <Users class="h-4 w-4" aria-hidden="true" />
            {:else if item.id === 'chats'}
              <MessageSquareText class="h-4 w-4" aria-hidden="true" />
            {:else if item.id === 'materi'}
              <BookOpen class="h-4 w-4" aria-hidden="true" />
            {:else}
              <FileSearch class="h-4 w-4" aria-hidden="true" />
            {/if}
          </div>
          <span class="truncate text-xs font-extrabold text-ink">{item.label}</span>
        </div>
        <ArrowRight class="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      </a>
    {/each}
  </div>
</div>
