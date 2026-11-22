<script lang="ts">
  import { Moon, Sun } from '@lucide/svelte';
  import type { ResolvedTheme } from '$lib/features/theme';

  interface Props {
    resolved: ResolvedTheme;
    ontoggle: () => void;
    class?: string;
  }

  let { resolved, ontoggle, class: className = '' }: Props = $props();

  const isDark = $derived(resolved === 'dark');
  const label = $derived(
    isDark
      ? 'Mode gelap aktif. Beralih ke mode terang.'
      : 'Mode terang aktif. Beralih ke mode gelap.',
  );
</script>

<button
  type="button"
  role="switch"
  aria-checked={isDark}
  aria-label={label}
  title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
  class="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-surface text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition-all duration-150 hover:bg-surface-soft active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus {className}"
  onclick={ontoggle}
>
  <Sun
    class="h-[18px] w-[18px] transition-all duration-200 {isDark
      ? 'scale-0 -rotate-90 opacity-0'
      : 'scale-100 rotate-0 opacity-100'}"
    aria-hidden="true"
  />
  <Moon
    class="absolute h-[18px] w-[18px] transition-all duration-200 {isDark
      ? 'scale-100 rotate-0 opacity-100'
      : 'scale-0 rotate-90 opacity-0'}"
    aria-hidden="true"
  />
  <span class="sr-only">{label}</span>
</button>
