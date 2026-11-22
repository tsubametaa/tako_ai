<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    BookOpen,
    FileSearch,
    Home,
    LayoutDashboard,
    LogIn,
    LogOut,
    MessageSquare,
    PanelLeft,
    PanelLeftClose,
    PanelLeftOpen,
    ShieldCheck,
    User,
    Users,
    X,
  } from '@lucide/svelte';
  import type { ResolvedTheme, ThemePreference } from '$lib/features/theme';
  import { ThemeToggle } from '$lib/features/theme';
  import type { AdminSectionId } from '../../domain/navigation';

  export interface AdminNavLink {
    id: AdminSectionId;
    href: string;
    label: string;
    active: boolean;
  }

  interface Props {
    title: string;
    navItems: AdminNavLink[];
    homeHref: string;
    chatHref: string;
    loginHref: string;
    userName?: string;
    userSubtitle?: string;
    isAuthenticated?: boolean;
    desktopCollapsed?: boolean;
    themePreference: ThemePreference;
    themeResolved: ResolvedTheme;
    oncycletheme: () => void;
    oncollapse?: () => void;
    onexpand?: () => void;
    onlogout?: () => void;
    children?: Snippet;
  }

  let {
    title,
    navItems,
    homeHref,
    chatHref,
    loginHref,
    userName = 'Guru Pengampu',
    userSubtitle = 'Guru Pengampu KKA',
    isAuthenticated = false,
    desktopCollapsed = false,
    themePreference,
    themeResolved,
    oncycletheme,
    oncollapse,
    onexpand,
    onlogout,
    children,
  }: Props = $props();

  let mobileOpen = $state(false);

  const toggleTitle = $derived(
    desktopCollapsed ? 'Buka bilah samping' : 'Tutup bilah samping',
  );

  function handleHeaderSidebarToggle() {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      mobileOpen = true;
    } else {
      onexpand?.();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && mobileOpen) {
      mobileOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative flex h-dvh w-full overflow-hidden bg-background text-ink">
  {#if mobileOpen}
    <div
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
      role="presentation"
      onclick={() => (mobileOpen = false)}
    ></div>
  {/if}

  <aside
    class="fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col overflow-hidden border-line bg-surface-soft transition-all duration-300 ease-in-out lg:static lg:z-auto lg:h-full {mobileOpen
      ? 'w-72 translate-x-0 border-r-2 shadow-[6px_0px_0px_var(--neo-shadow-color)]'
      : '-translate-x-full lg:translate-x-0'} {desktopCollapsed
      ? 'lg:pointer-events-none lg:w-0 lg:overflow-hidden lg:border-r-0 lg:opacity-0'
      : 'lg:w-72 lg:border-r-2 lg:opacity-100'}"
    aria-label="Navigasi panel admin"
  >
    <div class="flex h-full w-72 shrink-0 flex-col justify-between overflow-hidden">
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div class="flex h-16 shrink-0 items-center justify-between border-b-2 border-line px-4">
          <div class="flex items-center gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]">
              <ShieldCheck class="h-5 w-5" aria-hidden="true" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-extrabold text-ink">
                TAKO <span class="text-primary">AI</span>
              </span>
              <span class="text-[11px] font-semibold text-muted">Panel Admin & Guru</span>
            </div>
          </div>

          <button
            type="button"
            class="neo-control inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink hover:bg-surface-soft lg:hidden"
            aria-label="Tutup menu admin"
            onclick={() => (mobileOpen = false)}
          >
            <X class="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="neo-control hidden h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink hover:bg-surface-soft lg:inline-flex"
            aria-label="Tutup bilah samping"
            title="Tutup bilah samping"
            onclick={() => oncollapse?.()}
          >
            <PanelLeftClose class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
          {#each navItems as item}
            <a
              href={item.href}
              onclick={() => (mobileOpen = false)}
              class="flex min-h-[44px] items-center gap-3 rounded-xl border-2 px-3.5 py-2 text-sm font-bold transition {item.active
                ? 'border-line bg-mustard text-on-mustard shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]'
                : 'border-transparent text-ink hover:border-line hover:bg-surface'}"
            >
              {#if item.id === 'overview'}
                <LayoutDashboard class="h-4 w-4 shrink-0" aria-hidden="true" />
              {:else if item.id === 'students'}
                <Users class="h-4 w-4 shrink-0" aria-hidden="true" />
              {:else if item.id === 'chats'}
                <MessageSquare class="h-4 w-4 shrink-0" aria-hidden="true" />
              {:else if item.id === 'materi'}
                <BookOpen class="h-4 w-4 shrink-0" aria-hidden="true" />
              {:else}
                <FileSearch class="h-4 w-4 shrink-0" aria-hidden="true" />
              {/if}
              <span>{item.label}</span>
            </a>
          {/each}
        </nav>
      </div>

      <div class="flex shrink-0 flex-col gap-2 border-t-2 border-line p-3">
        {#if isAuthenticated}
          <div class="flex items-center justify-between gap-2 rounded-xl border-2 border-line bg-surface px-3 py-2.5">
            <div class="flex min-w-0 items-center gap-2.5">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-line bg-sage/30 text-ink">
                <User class="h-4 w-4" aria-hidden="true" />
              </div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-xs font-extrabold text-ink">{userName}</span>
                <span class="truncate text-[10.5px] font-medium text-muted">{userSubtitle}</span>
              </div>
            </div>
            <button
              type="button"
              class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-danger transition hover:border-danger/30 hover:bg-danger/10"
              aria-label="Keluar dari akun guru"
              title="Keluar"
              onclick={() => onlogout?.()}
            >
              <LogOut class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        {:else}
          <a
            href={loginHref}
            class="neo-control flex min-h-[44px] items-center gap-2.5 bg-surface px-3.5 py-2 text-sm font-bold text-ink hover:bg-surface-soft"
          >
            <LogIn class="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Masuk Akun Guru</span>
          </a>
        {/if}
        <div class="grid grid-cols-2 gap-2">
          <a
            href={homeHref}
            class="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border-2 border-border-subtle bg-surface px-2.5 text-xs font-bold text-ink hover:border-line"
          >
            <Home class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Home</span>
          </a>
          <a
            href={chatHref}
            class="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border-2 border-border-subtle bg-surface px-2.5 text-xs font-bold text-ink hover:border-line"
          >
            <MessageSquare class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Chat</span>
          </a>
        </div>
      </div>
    </div>
  </aside>

  <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
    <header class="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b-2 border-line bg-surface px-4 lg:px-6">
      <div class="flex min-w-0 items-center gap-3">
        <button
          type="button"
          class="neo-control flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-ink hover:bg-surface-soft {desktopCollapsed
            ? 'lg:flex'
            : 'lg:hidden'}"
          aria-label={toggleTitle}
          title={toggleTitle}
          onclick={handleHeaderSidebarToggle}
        >
          <PanelLeft class="h-5 w-5 lg:hidden" aria-hidden="true" />
          <PanelLeftOpen class="hidden h-5 w-5 text-primary lg:block" aria-hidden="true" />
        </button>
        <div class="flex min-w-0 flex-col">
          <h1 class="truncate text-base font-extrabold text-ink md:text-lg">{title}</h1>
          <span class="text-xs font-medium text-muted">Pengelolaan Kurikulum KKA</span>
        </div>
      </div>

      <ThemeToggle
        preference={themePreference}
        resolved={themeResolved}
        oncycle={oncycletheme}
      />
    </header>

    <main class="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
      <div class="w-full">
        {#if children}
          {@render children()}
        {/if}
      </div>
    </main>
  </div>
</div>
