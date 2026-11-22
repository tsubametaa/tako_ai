<script lang="ts">
  import type { Snippet } from 'svelte';
  import { drawerController } from '../state/drawer.svelte';

  interface Props {
    sidebar?: Snippet;
    children?: Snippet;
  }

  let { sidebar, children }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && drawerController.mobileOpen) {
      drawerController.closeDrawer();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative flex h-dvh w-full overflow-hidden bg-background">
  <!-- Mobile Drawer Backdrop Overlay -->
  {#if drawerController.mobileOpen}
    <div
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
      role="presentation"
      onclick={() => drawerController.closeDrawer()}
    ></div>
  {/if}

  <!-- Sidebar: Mobile Drawer Overlay (<1024px) / Collapsible Sticky Sidebar on Desktop (>=1024px) -->
  <aside
    class="fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col overflow-hidden border-line bg-surface-soft transition-all duration-300 ease-in-out lg:static lg:z-auto lg:h-full {drawerController.mobileOpen
      ? 'w-72 translate-x-0 border-r-2 shadow-[6px_0px_0px_var(--neo-shadow-color)]'
      : '-translate-x-full lg:translate-x-0'} {drawerController.desktopCollapsed
      ? 'lg:w-0 lg:overflow-hidden lg:border-r-0 lg:opacity-0 pointer-events-none lg:pointer-events-none'
      : 'lg:w-72 lg:border-r-2 lg:opacity-100'}"
    aria-label="Panel riwayat percakapan"
  >
    <div class="flex h-full w-72 shrink-0 flex-col overflow-hidden">
      {#if sidebar}
        {@render sidebar()}
      {/if}
    </div>
  </aside>

  <!-- Main Area -->
  <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
