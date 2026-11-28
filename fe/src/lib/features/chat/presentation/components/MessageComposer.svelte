<script lang="ts">
  import { tick } from 'svelte';
  import { AlertCircle, Paperclip, Send, Square, X } from '@lucide/svelte';
  import type { Attachment } from '../../domain/attachment';
  import { MAX_MESSAGE_CHARACTERS } from '../../domain/generation';
  import {
    evaluateNextMultilineState,
    syncTextareaHeight,
  } from '../state/composerLayout';
  import AttachmentChip from './AttachmentChip.svelte';
  import DeepThinkToggle from './DeepThinkToggle.svelte';

  interface Props {
    text: string;
    attachments?: Attachment[];
    deepThink?: boolean;
    isBusy?: boolean;
    canSubmit?: boolean;
    errorMessage?: string | null;
    oninput: (val: string) => void;
    ontoggledeepthink?: () => void;
    onfileselected?: (files: FileList | File[]) => void;
    onremoveattachment?: (id: string) => void;
    onclearerror?: () => void;
    onsend: () => void;
    onstop: () => void;
    onkeydown?: (e: KeyboardEvent) => void;
    oncompositionstart?: () => void;
    oncompositionend?: () => void;
  }

  let {
    text,
    attachments = [],
    deepThink = false,
    isBusy = false,
    canSubmit = false,
    errorMessage = null,
    oninput,
    ontoggledeepthink,
    onfileselected,
    onremoveattachment,
    onclearerror,
    onsend,
    onstop,
    onkeydown,
    oncompositionstart,
    oncompositionend,
  }: Props = $props();

  let containerEl: HTMLDivElement | undefined = $state();
  let textareaEl: HTMLTextAreaElement | undefined = $state();
  let fileInputEl: HTMLInputElement | undefined = $state();
  let isDragging = $state(false);
  let isMultilineText = $state(false);
  let inlineTextareaWidth = 0;

  const hasAttachments = $derived(attachments.length > 0);
  const hasNewline = $derived(text.includes('\n'));
  const isExpanded = $derived(hasAttachments || hasNewline || isMultilineText);

  function updateLayoutAndHeight(currentText = text) {
    if (!textareaEl) return;

    const currentHasNewline = currentText.includes('\n');
    const currentlyExpanded =
      hasAttachments || currentHasNewline || isMultilineText;

    if (!currentlyExpanded && textareaEl.clientWidth > 0) {
      inlineTextareaWidth = textareaEl.clientWidth;
    }

    const nextMultiline = evaluateNextMultilineState({
      el: textareaEl,
      text: currentText,
      hasNewline: currentHasNewline,
      hasAttachments,
      isExpanded: currentlyExpanded,
      isMultilineText,
      inlineTextareaWidth,
    });

    const nextExpanded = hasAttachments || currentHasNewline || nextMultiline;

    if (nextMultiline !== isMultilineText) {
      isMultilineText = nextMultiline;
      void tick().then(() =>
        syncTextareaHeight(textareaEl, currentText, nextExpanded),
      );
      return;
    }

    syncTextareaHeight(textareaEl, currentText, nextExpanded);
  }

  $effect(() => {
    const snapshot = text;
    void hasAttachments;
    void isExpanded;
    void tick().then(() => updateLayoutAndHeight(snapshot));
  });

  $effect(() => {
    if (!containerEl || typeof ResizeObserver === 'undefined') return;
    let lastObservedWidth = textareaEl?.clientWidth ?? 0;
    const observer = new ResizeObserver(() => {
      const currentWidth = textareaEl?.clientWidth ?? 0;
      if (currentWidth !== lastObservedWidth) {
        lastObservedWidth = currentWidth;
        updateLayoutAndHeight();
      }
    });
    observer.observe(containerEl);
    if (textareaEl) observer.observe(textareaEl);
    return () => observer.disconnect();
  });

  function handleContainerClick(e: MouseEvent) {
    if (
      e.target !== textareaEl &&
      !(e.target as HTMLElement).closest('button')
    ) {
      textareaEl?.focus();
    }
  }

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      onfileselected?.(target.files);
      target.value = '';
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      onfileselected?.(e.dataTransfer.files);
    }
  }
</script>

<div class="w-full bg-transparent px-3 pb-3 pt-1 md:px-4 md:pb-4">
  <div class="mx-auto flex w-full max-w-3xl flex-col gap-2">
    <!-- Pesan Peringatan Validasi Berkas -->
    {#if errorMessage}
      <div
        class="neo-box-sm flex items-center justify-between rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2 text-xs font-semibold text-danger shadow-[2px_2px_0px_var(--neo-shadow-color)] animate-in fade-in duration-150"
      >
        <div class="flex items-center gap-2">
          <AlertCircle class="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
        {#if onclearerror}
          <button
            type="button"
            class="p-0.5 text-danger hover:opacity-75 transition"
            onclick={onclearerror}
            aria-label="Tutup pesan peringatan"
          >
            <X class="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        {/if}
      </div>
    {/if}

    <!-- Kontainer InputGroup Adaptif (1-Level Inline -> Morph ke 2-Level Block) -->
    <div
      bind:this={containerEl}
      data-slot="input-group"
      data-layout={isExpanded ? 'expanded' : 'inline'}
      data-deep-think={deepThink ? 'on' : 'off'}
      class="composer-grid relative cursor-text rounded-2xl border-2 bg-surface transition-[border-color,box-shadow,background-color] duration-200 focus-within:border-neo-border focus-within:shadow-[5px_5px_0px_var(--neo-shadow-color)] has-[[data-slot=input-group-control]:focus-visible]:border-neo-border {isDragging
        ? 'border-mustard bg-mustard/5 shadow-[4px_4px_0px_var(--neo-shadow-color)]'
        : deepThink
          ? 'border-line shadow-[4px_4px_0px_var(--neo-shadow-color)] ring-2 ring-mustard/25 dark:border-mustard/70 dark:ring-mustard/20'
          : 'border-line shadow-[4px_4px_0px_var(--neo-shadow-color)]'} {isExpanded
        ? 'p-0'
        : 'px-2 py-1.5 sm:px-2.5 sm:py-2'}"
      role="presentation"
      onclick={handleContainerClick}
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
    >
      <!-- Area Lampiran Berkas (align="block-start" saat ada berkas) -->
      {#if attachments.length > 0}
        <div
          data-slot="input-group-addon"
          data-align="block-start"
          class="composer-attachments flex flex-wrap items-center gap-2 border-b-2 border-line/15 px-3 pb-2 pt-3 animate-in fade-in duration-150"
        >
          {#each attachments as att (att.id)}
            <AttachmentChip
              attachment={att}
              removable
              onremove={() => onremoveattachment?.(att.id)}
            />
          {/each}
        </div>
      {/if}

      <!-- Area Teks Pesan (Tetap 1 elemen DOM agar fokus & kursor tidak reset saat morph) -->
      <div
        class="composer-input min-w-0 {isExpanded
          ? 'border-b border-line/10 px-3.5 pb-1.5 pt-2.5'
          : 'px-1'}"
      >
        <textarea
          bind:this={textareaEl}
          data-slot="input-group-control"
          value={text}
          rows={1}
          placeholder={attachments.length > 0
            ? 'Tulis pertanyaan atau hal yang ingin kamu diskusikan dari berkas ini…'
            : deepThink
              ? 'Deep Think aktif — NEKO akan membimbingmu bertahap langkah demi langkah…'
              : 'Tanyakan materi KKA atau ceritakan bagian yang belum kamu pahami…'}
          class="composer-textarea block max-h-[200px] min-h-[36px] w-full resize-none border-0 bg-transparent px-0 py-1.5 text-sm leading-6 text-ink placeholder:text-muted/60 outline-none ring-0 focus:border-0 focus:outline-hidden focus:ring-0 focus-visible:border-0 focus-visible:outline-hidden focus-visible:ring-0"
          style="outline: none !important; box-shadow: none !important;"
          oninput={(e) => {
            const nextValue = e.currentTarget.value;
            oninput(nextValue);
            updateLayoutAndHeight(nextValue);
          }}
          {onkeydown}
          {oncompositionstart}
          {oncompositionend}
        ></textarea>
      </div>

      <!-- Menu Kiri: Lampiran (inline-start saat 1-level, block-end kiri saat 2-level) -->
      <div
        data-slot="input-group-addon"
        data-align={isExpanded ? 'block-end' : 'inline-start'}
        class="composer-left flex items-center gap-2 {isExpanded
          ? 'pb-2.5 pl-3 pt-2'
          : ''}"
      >
        <button
          type="button"
          class="inline-flex h-10 touch-manipulation items-center justify-center gap-1.5 rounded-xl border-2 border-line/35 bg-surface text-xs font-bold text-muted shadow-none transition active:translate-y-px hover:border-line hover:bg-mustard hover:text-on-mustard hover:shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)] sm:h-9 {isExpanded
            ? 'w-10 sm:w-auto sm:px-2.5'
            : 'w-10 sm:w-9'}"
          title="Lampirkan berkas (PDF, PPT, DOCX, TXT, MD - Maks. 10 MB)"
          aria-label="Lampirkan berkas"
          onclick={() => fileInputEl?.click()}
        >
          <Paperclip class="h-4 w-4 shrink-0" aria-hidden="true" />
          {#if isExpanded}
            <span class="hidden sm:inline">Lampirkan</span>
          {/if}
        </button>

        <input
          bind:this={fileInputEl}
          type="file"
          multiple
          accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
          class="hidden"
          onchange={handleFileChange}
        />
      </div>

      <!-- Menu Kanan: Counter, Deep Think & Kirim/Stop (inline-end saat 1-level, block-end kanan saat 2-level) -->
      <div
        data-slot="input-group-addon"
        data-align={isExpanded ? 'block-end' : 'inline-end'}
        class="composer-right flex items-center gap-1.5 sm:gap-2 {isExpanded
          ? 'pb-2.5 pr-3 pt-2'
          : ''}"
      >
        {#if isExpanded || text.length > MAX_MESSAGE_CHARACTERS}
          <span
            class="hidden text-[11px] font-semibold text-muted sm:inline {text.length >
            MAX_MESSAGE_CHARACTERS
              ? 'font-bold text-danger'
              : ''}"
          >
            {text.length}/{MAX_MESSAGE_CHARACTERS}
          </span>
        {/if}

        <DeepThinkToggle
          active={deepThink}
          disabled={isBusy}
          ontoggle={() => ontoggledeepthink?.()}
        />

        {#if isBusy}
          <button
            type="button"
            class="neo-control inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl border-2 border-line bg-danger text-white shadow-[2px_2px_0px_var(--neo-shadow-color)] transition hover:bg-danger/90 active:translate-y-px sm:h-9 sm:w-9"
            aria-label="Hentikan respons asisten"
            onclick={onstop}
          >
            <Square class="h-4 w-4 fill-current" aria-hidden="true" />
          </button>
        {:else}
          <button
            type="button"
            disabled={!canSubmit}
            class="inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl border-2 transition active:translate-y-px sm:h-9 sm:w-9 {canSubmit
              ? 'border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)] hover:bg-mustard/90'
              : 'cursor-not-allowed border-line/25 bg-surface-soft text-muted/40 shadow-none'}"
            aria-label="Kirim pesan"
            onclick={onsend}
          >
            <Send class="h-4 w-4" aria-hidden="true" />
          </button>
        {/if}
      </div>
    </div>

    <!-- Catatan Edukatif Bawah -->
    <div
      class="flex items-center justify-center px-1 text-center text-[11px] text-muted"
    >
      <span>
        NEKO AI • Konfirmasi jawaban kepada guru jika masih ragu
      </span>
    </div>
  </div>
</div>

<style>
  .composer-grid {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: 'left input right';
    align-items: center;
    column-gap: 0.5rem;
  }

  .composer-grid[data-layout='expanded'] {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas:
      'attachments attachments'
      'input input'
      'left right';
    align-items: stretch;
    column-gap: 0.5rem;
  }

  .composer-attachments {
    grid-area: attachments;
  }

  .composer-input {
    grid-area: input;
  }

  .composer-left {
    grid-area: left;
    justify-self: start;
    align-self: center;
  }

  .composer-right {
    grid-area: right;
    justify-self: end;
    align-self: center;
  }

  .composer-textarea:placeholder-shown {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
