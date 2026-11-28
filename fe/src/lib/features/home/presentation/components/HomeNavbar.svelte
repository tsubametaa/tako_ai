<script lang="ts">
  import { LogIn } from '@lucide/svelte';
  import type { ResolvedTheme } from '$lib/features/theme';
  import { NekoMark } from '$lib/shared/ui';
  import HomeThemeSwitch from './HomeThemeSwitch.svelte';

  interface Props {
    homeHref: string;
    loginHref: string;
    scrolled: boolean;
    themeResolved: ResolvedTheme;
    ontoggletheme: () => void;
  }

  let {
    homeHref,
    loginHref,
    scrolled,
    themeResolved,
    ontoggletheme,
  }: Props = $props();
</script>

<header
  class="sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-200 motion-reduce:transition-none {scrolled
    ? 'border-b border-line/20 bg-surface/95 backdrop-blur-xs shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
    : 'border-b border-transparent bg-transparent shadow-none'}"
>
  <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:h-[72px] md:px-6">
    <a
      href={homeHref}
      class="inline-flex min-h-[40px] items-center gap-2.5 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <NekoMark size="md" />
      <span class="text-base font-extrabold tracking-tight md:text-lg">
        NEKO <span class="text-primary">AI</span>
      </span>
    </a>

    <nav aria-label="Navigasi utama" class="flex items-center gap-2 sm:gap-2.5">
      <a
        href={loginHref}
        class="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border-2 border-line bg-surface px-3.5 text-sm font-bold text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)] transition-all duration-150 hover:bg-surface-soft active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none sm:px-4"
      >
        <LogIn class="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <span>Masuk</span>
      </a>

      <span class="mx-0.5 hidden h-5 w-[1.5px] bg-line/25 sm:inline-block" aria-hidden="true"></span>

      <HomeThemeSwitch resolved={themeResolved} ontoggle={ontoggletheme} />
    </nav>
  </div>
</header>
