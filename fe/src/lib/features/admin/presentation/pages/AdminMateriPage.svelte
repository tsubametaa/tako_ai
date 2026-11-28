<script lang="ts">
  import { BookOpen, Upload } from '@lucide/svelte';
  import { page } from '$app/state';
  import { buildSitePath } from '$lib/shared/config/subdomains';
  import { Button, Card, Input } from '$lib/shared/ui';
  import { AdminRagController } from '../state/adminRag.svelte';

  const ctrl = new AdminRagController();
  const overviewHref = $derived(buildSitePath('admin', page.url, '/'));
</script>

<svelte:head>
  <title>Materi Global - Neko Admin</title>
</svelte:head>

<Card class="flex flex-col items-start gap-5 p-6 md:p-8">
  <div class="flex items-center gap-3">
    <div class="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]">
      <BookOpen class="h-5 w-5" aria-hidden="true" />
    </div>
    <div>
      <h2 class="text-xl font-extrabold text-ink">
        Unggah Modul Kurikulum Global (Scope: Kelas)
      </h2>
      <p class="text-xs font-medium text-muted">
        Terhubung ke <code class="rounded bg-surface-soft px-1.5 py-0.5 font-mono text-ink">POST /api/v1/admin/rag/documents</code> (Khusus akun Guru)
      </p>
    </div>
  </div>

  <div class="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
    <div class="flex flex-col gap-1.5">
      <label for="global-doc-title" class="text-xs font-extrabold text-ink">
        Judul Modul / Buku Ajar
      </label>
      <Input
        id="global-doc-title"
        value={ctrl.sourceTitle}
        placeholder="Contoh: Modul KKA Bab 3 - Machine Learning"
        oninput={(e) => (ctrl.sourceTitle = e.currentTarget.value)}
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="global-doc-topic" class="text-xs font-extrabold text-ink">
        Topik / Bab
      </label>
      <Input
        id="global-doc-topic"
        value={ctrl.topic}
        placeholder="Contoh: Data Latih dan Data Uji"
        oninput={(e) => (ctrl.topic = e.currentTarget.value)}
      />
    </div>
  </div>

  <div class="flex w-full max-w-2xl flex-col gap-2">
    <label for="global-doc-file" class="text-xs font-extrabold text-ink">
      Berkas Dokumen (PDF, PNG, JPG, WEBP, TXT, MD — Maks 20 MB)
    </label>
    <input
      id="global-doc-file"
      type="file"
      accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md"
      class="neo-control w-full rounded-xl border-2 border-line bg-surface-soft p-2.5 text-xs font-bold text-ink"
      onchange={(e) => ctrl.setFile(e.currentTarget.files)}
    />
  </div>

  {#if ctrl.uploadError}
    <p class="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2 text-xs font-bold text-danger">
      {ctrl.uploadError}
    </p>
  {/if}

  {#if ctrl.uploadResult}
    <p class="rounded-xl border-2 border-line bg-mustard/20 px-3.5 py-2 text-xs font-bold text-ink">
      {ctrl.uploadResult}
    </p>
  {/if}

  <div class="flex flex-wrap items-center gap-3">
    <Button
      variant="primary"
      disabled={ctrl.uploading || !ctrl.selectedFile}
      onclick={() => ctrl.submitGlobalUpload()}
    >
      <Upload class="h-4 w-4" aria-hidden="true" />
      <span>{ctrl.uploading ? 'Mengunggah ke Server AI…' : 'Unggah Materi Global'}</span>
    </Button>

    <a
      href={overviewHref}
      class="neo-control inline-flex min-h-[44px] items-center bg-surface-soft px-4 py-2 text-sm font-bold text-ink hover:bg-surface"
    >
      Kembali ke Ringkasan
    </a>
  </div>
</Card>
