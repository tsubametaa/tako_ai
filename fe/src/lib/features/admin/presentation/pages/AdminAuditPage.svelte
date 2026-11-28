<script lang="ts">
  import { onMount } from 'svelte';
  import { FileSearch, RefreshCw, Trash2 } from '@lucide/svelte';
  import { page } from '$app/state';
  import { buildSitePath } from '$lib/shared/config/subdomains';
  import { Button, Card } from '$lib/shared/ui';
  import { AdminRagController } from '../state/adminRag.svelte';

  const ctrl = new AdminRagController();
  const overviewHref = $derived(buildSitePath('admin', page.url, '/'));

  onMount(() => {
    ctrl.loadAutoLearned();
  });
</script>

<svelte:head>
  <title>Audit Auto-Learn - Neko Admin</title>
</svelte:head>

<Card class="flex flex-col items-start gap-5 p-6 md:p-8">
  <div class="flex w-full flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line bg-sage/30 text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)]">
        <FileSearch class="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <h2 class="text-xl font-extrabold text-ink">
          Audit Pengetahuan Auto-Learned
        </h2>
        <p class="text-xs font-medium text-muted">
          Terhubung ke <code class="rounded bg-surface-soft px-1.5 py-0.5 font-mono text-ink">GET /api/v1/admin/rag/auto-learned</code>
        </p>
      </div>
    </div>

    <Button
      variant="secondary"
      size="sm"
      disabled={ctrl.loadingAudit}
      onclick={() => ctrl.loadAutoLearned()}
    >
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      <span>{ctrl.loadingAudit ? 'Memuat…' : 'Muat Ulang'}</span>
    </Button>
  </div>

  {#if ctrl.auditError}
    <p class="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2 text-xs font-bold text-danger">
      {ctrl.auditError}
    </p>
  {/if}

  {#if ctrl.loadingAudit}
    <p class="text-sm font-bold text-muted">Memuat entri auto-learned dari server AI…</p>
  {:else if ctrl.autoLearned.length === 0}
    <p class="text-sm font-medium text-muted">
      Belum ada catatan auto-learned yang tersimpan di korpus saat ini.
    </p>
  {:else}
    <div class="flex w-full flex-col gap-3">
      {#each ctrl.autoLearned as item (item.doc_id || item.id)}
        {@const docId = item.doc_id || item.id || ''}
        <div class="flex flex-col justify-between gap-3 rounded-xl border-2 border-line bg-surface-soft p-4 md:flex-row md:items-center">
          <div class="flex flex-col gap-1">
            <span class="text-sm font-extrabold text-ink">
              {item.source_title || item.title || docId}
            </span>
            {#if item.topic}
              <span class="text-xs font-bold text-muted">Topik: {item.topic}</span>
            {/if}
            {#if item.excerpt || item.content}
              <p class="text-xs text-ink/80">{item.excerpt || item.content}</p>
            {/if}
          </div>

          {#if docId}
            <Button
              variant="danger"
              size="sm"
              onclick={() => ctrl.removeDocument(docId)}
            >
              <Trash2 class="h-4 w-4" aria-hidden="true" />
              <span>Hapus</span>
            </Button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <a
    href={overviewHref}
    class="neo-control inline-flex min-h-[44px] items-center bg-surface-soft px-4 py-2 text-sm font-bold text-ink hover:bg-surface"
  >
    Kembali ke Ringkasan
  </a>
</Card>
