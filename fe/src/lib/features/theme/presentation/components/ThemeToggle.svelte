<script lang="ts">
  import { Laptop, Moon, Sun } from '@lucide/svelte';
  import type { ResolvedTheme, ThemePreference } from '../../domain/theme';

  interface Props {
    preference?: ThemePreference;
    resolved?: ResolvedTheme;
    oncycle?: () => void;
    class?: string;
  }

  let {
    preference = 'system',
    resolved = 'light',
    oncycle,
    class: className = '',
  }: Props = $props();

  const label = $derived(
    preference === 'system'
      ? `Tema mengikuti perangkat (${resolved === 'dark' ? 'gelap' : 'terang'})`
      : preference === 'dark'
        ? 'Tema gelap'
        : 'Tema terang',
  );
</script>

<button
  type="button"
  class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-surface text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition-all duration-150 hover:bg-surface-soft active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus {className}"
  aria-label={label}
  title={label}
  onclick={() => oncycle?.()}
>
  {#if preference === 'system'}
    <Laptop class="h-[18px] w-[18px] text-ink" aria-hidden="true" />
  {:else if resolved === 'dark'}
    <Moon class="h-[18px] w-[18px] text-ink" aria-hidden="true" />
  {:else}
    <Sun class="h-[18px] w-[18px] text-ink" aria-hidden="true" />
  {/if}
</button>
