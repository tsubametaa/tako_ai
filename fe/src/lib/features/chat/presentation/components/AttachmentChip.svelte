<script lang="ts">
  import { FileCode, FileText, Presentation, X } from '@lucide/svelte';
  import { formatFileSize, type Attachment } from '../../domain/attachment';

  interface Props {
    attachment: Attachment;
    removable?: boolean;
    onremove?: () => void;
  }

  let { attachment, removable = false, onremove }: Props = $props();

  const typeConfig = $derived.by(() => {
    switch (attachment.type) {
      case 'pdf':
        return {
          label: 'PDF',
          bg: 'bg-danger/15 text-danger border-danger/40',
        };
      case 'ppt':
        return {
          label: 'PPT',
          bg: 'bg-mustard/20 text-on-mustard border-mustard/50',
        };
      case 'docx':
        return {
          label: 'DOC',
          bg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-400/40',
        };
      case 'md':
        return {
          label: 'MD',
          bg: 'bg-sage/25 text-sage-deep dark:text-sage border-sage/40',
        };
      case 'txt':
        return {
          label: 'TXT',
          bg: 'bg-surface-soft text-ink border-line/30',
        };
      default:
        return {
          label: 'FILE',
          bg: 'bg-surface-soft text-ink border-line/30',
        };
    }
  });
</script>

<div
  class="neo-box-sm group inline-flex max-w-[260px] items-center gap-2 rounded-xl border-2 border-line bg-surface p-1.5 pr-2.5 shadow-[2px_2px_0px_var(--neo-shadow-color)] transition md:max-w-[320px]"
  title="{attachment.name} ({formatFileSize(attachment.size)})"
>
  <!-- Badge Tipe Berkas -->
  <div
    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 {typeConfig.bg}"
  >
    {#if attachment.type === 'pdf'}
      <FileText class="h-4 w-4" aria-hidden="true" />
    {:else if attachment.type === 'ppt'}
      <Presentation class="h-4 w-4" aria-hidden="true" />
    {:else if attachment.type === 'md'}
      <FileCode class="h-4 w-4" aria-hidden="true" />
    {:else}
      <FileText class="h-4 w-4" aria-hidden="true" />
    {/if}
  </div>

  <!-- Detail Berkas -->
  <div class="flex min-w-0 flex-1 flex-col">
    <span class="truncate text-xs font-bold text-ink leading-tight">
      {attachment.name}
    </span>
    <span class="text-[10px] font-medium text-muted leading-none mt-0.5">
      {formatFileSize(attachment.size)} • {typeConfig.label}
    </span>
  </div>

  <!-- Tombol Hapus Lampiran -->
  {#if removable && onremove}
    <button
      type="button"
      class="neo-control ml-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-line/40 bg-surface text-muted hover:border-danger hover:bg-danger hover:text-white transition active:translate-y-px"
      aria-label="Hapus lampiran {attachment.name}"
      onclick={onremove}
    >
      <X class="h-3 w-3" aria-hidden="true" />
    </button>
  {/if}
</div>

