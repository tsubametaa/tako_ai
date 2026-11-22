<script lang="ts">
  import { PanelLeft, PanelLeftOpen } from '@lucide/svelte';
  import { themeController, ThemeToggle } from '$lib/features/theme';
  import { drawerController } from '../state/drawer.svelte';

  interface Props {
    title?: string;
    onopenmenu?: () => void;
  }

  let { title = 'Percakapan Baru', onopenmenu }: Props = $props();

  function handleToggleSidebar() {
    if (window.innerWidth < 1024) {
      if (onopenmenu) onopenmenu();
      else drawerController.openDrawer();
    } else {
      drawerController.extendDesktop();
    }
  }

  const toggleTitle = $derived(
    drawerController.desktopCollapsed
      ? 'Buka bilah samping'
      : 'Tutup bilah samping',
  );
</script>

<header
  class="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b-2 border-line bg-surface px-4 lg:px-6"
>
  <div class="flex items-center gap-3 min-w-0">
    <!-- Tombol bilah samping: Tampil di mobile, dan di desktop HANYA ketika sidebar tertutup -->
    <button
      type="button"
      class="neo-control flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-ink hover:bg-surface-soft {drawerController.desktopCollapsed
        ? 'lg:flex'
        : 'lg:hidden'}"
      aria-label={toggleTitle}
      title={toggleTitle}
      onclick={handleToggleSidebar}
    >
      <!-- Ikon mobile -->
      <PanelLeft class="h-5 w-5 lg:hidden" aria-hidden="true" />
      <!-- Ikon desktop (buka sidebar) -->
      <PanelLeftOpen class="hidden h-5 w-5 text-primary lg:block" aria-hidden="true" />
    </button>

    <div class="flex flex-col min-w-0">
      <h1 class="truncate text-base font-bold text-ink md:text-lg" title={title}>
        {title}
      </h1>
      <span class="text-xs font-semibold text-muted">TAKO AI</span>
    </div>
  </div>

  <div class="flex items-center gap-2">
    <ThemeToggle
      preference={themeController.preference}
      resolved={themeController.resolved}
      oncycle={() => themeController.cycleTheme()}
    />
  </div>
</header>
