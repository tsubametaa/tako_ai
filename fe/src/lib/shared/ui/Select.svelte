<script lang="ts">
  import { Check, ChevronDown } from '@lucide/svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  export interface SelectOption {
    value: string;
    label: string;
    badge?: string;
  }

  interface Props {
    id?: string;
    value: string;
    options: SelectOption[];
    placeholder?: string;
    ariaLabel?: string;
    disabled?: boolean;
    class?: string;
    onchange?: (value: string) => void;
  }

  let {
    id,
    value,
    options = [],
    placeholder = 'Pilih opsi',
    ariaLabel,
    disabled = false,
    class: className = '',
    onchange,
  }: Props = $props();

  let open = $state(false);
  let highlightedIndex = $state(-1);
  let containerEl = $state<HTMLDivElement | null>(null);
  let triggerEl = $state<HTMLButtonElement | null>(null);
  const uid = $props.id();
  const listboxId = `${uid}-listbox`;

  const selectedOption = $derived(
    options.find((opt) => opt.value === value) ?? null,
  );

  function openMenu() {
    if (disabled) return;
    open = true;
    const idx = options.findIndex((opt) => opt.value === value);
    highlightedIndex = idx >= 0 ? idx : 0;
  }

  function closeMenu(restoreFocus = false) {
    open = false;
    highlightedIndex = -1;
    if (restoreFocus) triggerEl?.focus();
  }

  function toggleMenu() {
    if (open) closeMenu(false);
    else openMenu();
  }

  function selectOption(opt: SelectOption) {
    onchange?.(opt.value);
    closeMenu(true);
  }

  function handleWindowClick(event: MouseEvent) {
    if (!open || !containerEl) return;
    if (!containerEl.contains(event.target as Node)) {
      closeMenu(false);
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (disabled) return;

    if (!open) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeMenu(true);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % Math.max(options.length, 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlightedIndex =
        (highlightedIndex - 1 + Math.max(options.length, 1)) %
        Math.max(options.length, 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      highlightedIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      highlightedIndex = Math.max(options.length - 1, 0);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const target = options[highlightedIndex];
      if (target) selectOption(target);
    } else if (event.key === 'Tab') {
      closeMenu(false);
    }
  }
</script>

<svelte:window onclick={handleWindowClick} />

<div bind:this={containerEl} data-slot="select" class="relative w-full {className}">
  <button
    bind:this={triggerEl}
    {id}
    type="button"
    data-slot="select-trigger"
    role="combobox"
    aria-haspopup="listbox"
    aria-controls={listboxId}
    aria-expanded={open}
    aria-label={ariaLabel}
    {disabled}
    class="flex h-11 w-full items-center justify-between gap-2 rounded-xl border-2 border-line bg-surface px-3.5 text-left text-xs font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition-all duration-150 hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm {open
      ? 'border-line bg-surface-soft'
      : ''}"
    onclick={toggleMenu}
    onkeydown={handleKeydown}
  >
    <span class="flex min-w-0 items-center gap-2">
      <span class="truncate {selectedOption ? 'text-ink' : 'text-muted'}">
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      {#if selectedOption?.badge}
        <span
          class="shrink-0 rounded-md border border-line/25 bg-mustard-soft px-1.5 py-0.5 text-[10px] font-extrabold text-ink"
        >
          {selectedOption.badge}
        </span>
      {/if}
    </span>
    <ChevronDown
      class="h-4 w-4 shrink-0 text-muted transition-transform duration-150 {open
        ? 'rotate-180 text-ink'
        : ''}"
      aria-hidden="true"
    />
  </button>

  {#if open}
    <ul
      id={listboxId}
      data-slot="select-content"
      role="listbox"
      aria-label={ariaLabel ?? placeholder}
      transition:fly={{ y: -6, duration: 150, easing: cubicOut }}
      class="absolute left-0 right-0 z-50 mt-2 flex max-h-64 flex-col gap-1 overflow-y-auto rounded-xl border-2 border-line bg-surface p-1.5 shadow-[4px_4px_0px_var(--neo-shadow-color)]"
    >
      {#each options as opt, idx (opt.value)}
        {@const isSelected = opt.value === value}
        {@const isHighlighted = idx === highlightedIndex}
        <li role="presentation">
          <button
            type="button"
            role="option"
            aria-selected={isSelected}
            class="flex min-h-[38px] w-full items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-left text-xs font-bold transition-colors duration-100 sm:text-[13px] {isSelected
              ? 'border-line bg-mustard text-on-mustard shadow-[1.5px_1.5px_0px_var(--neo-shadow-color)]'
              : isHighlighted
                ? 'border-transparent bg-surface-soft text-ink'
                : 'border-transparent bg-transparent text-ink hover:bg-surface-soft'}"
            onmouseenter={() => (highlightedIndex = idx)}
            onclick={() => selectOption(opt)}
          >
            <span class="flex min-w-0 items-center gap-2">
              <span class="truncate">{opt.label}</span>
              {#if opt.badge}
                <span
                  class="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold {isSelected
                    ? 'border border-on-mustard/30 bg-on-mustard/10 text-on-mustard'
                    : 'border border-line/20 bg-surface-soft text-muted'}"
                >
                  {opt.badge}
                </span>
              {/if}
            </span>
            {#if isSelected}
              <Check class="h-4 w-4 shrink-0" aria-hidden="true" />
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
