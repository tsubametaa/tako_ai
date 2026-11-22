<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLInputAttributes, 'value'> {
    value?: string;
    error?: string | boolean;
    class?: string;
  }

  let {
    value = $bindable(''),
    error = false,
    class: className = '',
    type = 'text',
    disabled = false,
    ...restProps
  }: Props = $props();

  const hasError = $derived(Boolean(error));
</script>

<div class="w-full">
  <input
    {type}
    {disabled}
    bind:value
    aria-invalid={hasError ? 'true' : undefined}
    class="min-h-[44px] w-full rounded-xl border-2 bg-surface px-4 py-2.5 text-base font-medium text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] placeholder:text-muted/70 transition-all duration-120 outline-none focus:border-neo-border focus:shadow-[3.5px_3.5px_0px_var(--neo-shadow-color)] disabled:cursor-not-allowed disabled:opacity-50 {hasError
      ? 'border-danger focus-visible:outline-danger'
      : 'border-line'} {className}"
    {...restProps}
  />
  {#if typeof error === 'string' && error.trim().length > 0}
    <p class="mt-1.5 text-xs font-semibold text-danger" role="alert">{error}</p>
  {/if}
</div>
