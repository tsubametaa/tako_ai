<script lang="ts">
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';
  import Select, { type SelectOption } from './Select.svelte';

  interface Props {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    disabled?: boolean;
    itemLabel?: string;
    onpagechange: (page: number) => void;
    onpagesizechange?: (pageSize: number) => void;
  }

  let {
    page,
    pageSize,
    totalItems,
    totalPages,
    disabled = false,
    itemLabel = 'data',
    onpagechange,
    onpagesizechange,
  }: Props = $props();

  const pageSizeOptions: SelectOption[] = [
    { value: '10', label: '10 / hal' },
    { value: '15', label: '15 / hal' },
    { value: '25', label: '25 / hal' },
    { value: '50', label: '50 / hal' },
  ];

  const startItem = $derived(
    totalItems === 0 ? 0 : (page - 1) * pageSize + 1,
  );
  const endItem = $derived(Math.min(page * pageSize, totalItems));

  const visiblePages = $derived.by<Array<number | 'ellipsis'>>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items: Array<number | 'ellipsis'> = [1];
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);

    if (left > 2) items.push('ellipsis');
    for (let p = left; p <= right; p++) items.push(p);
    if (right < totalPages - 1) items.push('ellipsis');
    items.push(totalPages);
    return items;
  });
</script>

<div
  class="flex flex-col gap-3 border-t-2 border-line/15 pt-4 sm:flex-row sm:items-center sm:justify-between"
>
  <div class="flex flex-wrap items-center justify-between gap-3 sm:justify-start">
    <p class="text-xs font-semibold text-muted">
      Menampilkan <span class="font-extrabold text-ink">{startItem}–{endItem}</span>
      dari <span class="font-extrabold text-ink">{totalItems}</span>
      {itemLabel}
    </p>

    {#if onpagesizechange}
      <div class="w-28">
        <Select
          ariaLabel="Jumlah data per halaman"
          value={String(pageSize)}
          options={pageSizeOptions}
          {disabled}
          onchange={(val) => onpagesizechange(Number(val))}
        />
      </div>
    {/if}
  </div>

  <nav
    aria-label="Navigasi halaman"
    class="flex flex-wrap items-center justify-center gap-1.5 sm:justify-end"
  >
    <button
      type="button"
      disabled={disabled || page <= 1}
      class="inline-flex h-9 items-center gap-1 rounded-xl border-2 border-line bg-surface px-2.5 text-xs font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition hover:bg-surface-soft active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
      aria-label="Halaman sebelumnya"
      onclick={() => onpagechange(page - 1)}
    >
      <ChevronLeft class="h-4 w-4" aria-hidden="true" />
      <span class="hidden sm:inline">Sebelumnya</span>
    </button>

    {#each visiblePages as token, idx (token === 'ellipsis' ? `e-${idx}` : token)}
      {#if token === 'ellipsis'}
        <span class="px-1.5 text-xs font-bold text-muted" aria-hidden="true">…</span>
      {:else}
        <button
          type="button"
          disabled={disabled}
          aria-current={token === page ? 'page' : undefined}
          class="inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl border-2 px-2 text-xs font-extrabold transition {token ===
          page
            ? 'border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]'
            : 'border-line/30 bg-surface text-ink hover:border-line hover:bg-surface-soft'}"
          onclick={() => onpagechange(token)}
        >
          {token}
        </button>
      {/if}
    {/each}

    <button
      type="button"
      disabled={disabled || page >= totalPages}
      class="inline-flex h-9 items-center gap-1 rounded-xl border-2 border-line bg-surface px-2.5 text-xs font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition hover:bg-surface-soft active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
      aria-label="Halaman berikutnya"
      onclick={() => onpagechange(page + 1)}
    >
      <span class="hidden sm:inline">Berikutnya</span>
      <ChevronRight class="h-4 w-4" aria-hidden="true" />
    </button>
  </nav>
</div>
