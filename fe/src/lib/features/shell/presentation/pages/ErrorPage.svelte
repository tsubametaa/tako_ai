<script lang="ts">
  import { page } from '$app/state';
  import { buildSiteUrl } from '$lib/shared/config/subdomains';
  import { Card } from '$lib/shared/ui';

  interface Props {
    status: number;
    message?: string;
  }

  let { status, message }: Props = $props();

  const homeHref = $derived(buildSiteUrl('home', page.url, '/'));
  const heading = $derived(
    status === 404 ? 'Halaman tidak ditemukan' : 'Terjadi kendala saat memuat halaman',
  );
</script>

<svelte:head>
  <title>{status} - Tako KKA</title>
</svelte:head>

<main class="flex min-h-dvh items-center justify-center bg-background px-4 py-12 text-ink">
  <Card class="flex w-full max-w-md flex-col items-start gap-4 p-6 md:p-8">
    <span class="rounded-lg border-2 border-line bg-mustard px-2.5 py-1 text-xs font-extrabold text-on-mustard">
      HTTP {status}
    </span>
    <h1 class="text-2xl font-extrabold text-ink">{heading}</h1>
    <p class="text-sm leading-relaxed font-medium text-muted">
      {message || 'Periksa kembali alamat URL yang dibuka atau kembali ke halaman utama.'}
    </p>
    <div class="flex flex-wrap gap-3 pt-1">
      <a
        href="/"
        class="neo-control inline-flex min-h-[44px] items-center bg-primary px-4 py-2 text-sm font-bold text-on-primary"
      >
        Kembali ke Beranda Situs
      </a>
      <a
        href={homeHref}
        class="neo-control inline-flex min-h-[44px] items-center bg-surface-soft px-4 py-2 text-sm font-bold text-ink hover:bg-surface"
      >
        Ke Beranda Tako
      </a>
    </div>
  </Card>
</main>
