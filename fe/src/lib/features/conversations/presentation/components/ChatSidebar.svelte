<script lang="ts">
  import {
    BotMessageSquare,
    HelpCircle,
    LogOut,
    MoreVertical,
    Palette,
    PanelLeftClose,
    Plus,
    Search,
    Settings,
    User,
    X,
  } from "@lucide/svelte";
  import type { SettingsTab } from "$lib/features/settings";
  import { Button, Input, NekoMark } from "$lib/shared/ui";
  import type {
    Conversation,
    ConversationGroup,
  } from "../../domain/conversation";
  import ConversationList from "./ConversationList.svelte";

  interface Props {
    groups: ConversationGroup[];
    activeId?: string | null;
    searchQuery?: string;
    userName?: string;
    userSubtitle?: string;
    onsearch?: (q: string) => void;
    onnewchat?: () => void;
    onselect?: (id: string) => void;
    onrename?: (conv: Conversation) => void;
    ondelete?: (conv: Conversation) => void;
    onclose?: () => void;
    oncollapse?: () => void;
    onopensettings?: (tab: SettingsTab) => void;
    onlogout?: () => void;
  }

  let {
    groups = [],
    activeId = null,
    searchQuery = "",
    userName = "Siswa Kelas X",
    userSubtitle = "KKA - SMKN / SMAN",
    onsearch,
    onnewchat,
    onselect,
    onrename,
    ondelete,
    onclose,
    oncollapse,
    onopensettings,
    onlogout,
  }: Props = $props();

  let showProfileMenu = $state(false);
</script>

<div class="flex h-full w-full flex-col justify-between overflow-hidden">
  <!-- Top Section: Header & Action -->
  <div class="flex flex-col gap-3 p-3 border-b-2 border-line">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <NekoMark size="sm" />
        <span class="text-sm font-extrabold tracking-tight text-ink">
          NEKO <span class="text-primary">AI</span>
        </span>
      </div>

      <!-- Close button on Mobile (<1024px) -->
      <button
        type="button"
        class="neo-control inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink hover:bg-surface-soft lg:hidden"
        aria-label="Tutup panel riwayat"
        onclick={() => onclose?.()}
      >
        <X class="h-5 w-5" aria-hidden="true" />
      </button>

      <!-- Collapse button on Desktop (>=1024px) -->
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

    <!-- Tombol Percakapan Baru -->
    <Button
      variant="primary"
      class="w-full justify-center"
      onclick={() => onnewchat?.()}
    >
      <Plus class="h-4 w-4" aria-hidden="true" />
      <span>Percakapan baru</span>
    </Button>

    <!-- Kolom Pencarian -->
    <div class="relative w-full">
      <Input
        value={searchQuery}
        placeholder="Cari percakapan…"
        class="pl-9 text-xs"
        oninput={(e) => onsearch?.(e.currentTarget.value)}
      />
      <Search
        class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted/80"
        aria-hidden="true"
      />
    </div>
  </div>

  <!-- Middle: Grouped Conversation List -->
  <ConversationList {groups} {activeId} {onselect} {onrename} {ondelete} />

  <!-- Bottom: User Account Profile with Logout Action -->
  <div
    class="flex items-center justify-between border-t-2 border-line p-3 bg-surface"
  >
    <div class="flex items-center gap-2.5 min-w-0">
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-line bg-sage/30 text-ink shadow-[2px_2px_0px_var(--neo-shadow-color)]"
      >
        <User class="h-4 w-4" aria-hidden="true" />
      </div>
      <div class="flex flex-col min-w-0">
        <span class="truncate text-xs font-bold text-ink">{userName}</span>
        <span class="text-[10px] font-medium text-muted">{userSubtitle}</span
        >
      </div>
    </div>

    <!-- Menu Profil Siswa & Pengaturan -->
    <div class="relative">
      <button
        type="button"
        class="neo-control inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink hover:bg-mustard hover:text-on-mustard"
        aria-label="Menu akun dan pengaturan"
        aria-expanded={showProfileMenu}
        onclick={() => (showProfileMenu = !showProfileMenu)}
      >
        <MoreVertical class="h-4 w-4" aria-hidden="true" />
      </button>

      {#if showProfileMenu}
        <div
          class="fixed inset-0 z-40"
          role="presentation"
          onclick={() => (showProfileMenu = false)}
        ></div>

        <!-- Dropdown Popover ke atas -->
        <div
          class="absolute bottom-full right-0 mb-2 z-50 flex w-48 flex-col gap-1 rounded-xl border-2 border-line bg-surface p-1.5 shadow-[4px_4px_0px_var(--neo-shadow-color)] animate-in fade-in-50 zoom-in-95 duration-100"
        >
          <button
            type="button"
            class="flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-ink hover:bg-surface-soft"
            onclick={() => {
              showProfileMenu = false;
              onopensettings?.("account");
            }}
          >
            <User class="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Akun</span>
          </button>

          <button
            type="button"
            class="flex min-h-[36px] w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-ink hover:bg-surface-soft"
            onclick={() => {
              showProfileMenu = false;
              onopensettings?.("personalization");
            }}
          >
            <BotMessageSquare class="h-4 w-4 text-mustard" aria-hidden="true" />
            <span>Personalisasi AI</span>
          </button>

          <button
            type="button"
            class="flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-ink hover:bg-surface-soft"
            onclick={() => {
              showProfileMenu = false;
              onopensettings?.("theme");
            }}
          >
            <Palette class="h-4 w-4 text-sage" aria-hidden="true" />
            <span>Tema Tampilan</span>
          </button>

          <button
            type="button"
            class="flex min-h-[36px] w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-ink hover:bg-surface-soft"
            onclick={() => {
              showProfileMenu = false;
              onopensettings?.("help");
            }}
          >
            <HelpCircle class="h-4 w-4 text-sage" aria-hidden="true" />
            <span>Bantuan</span>
          </button>

          <button
            type="button"
            class="flex min-h-[36px] w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-ink hover:bg-surface-soft"
            onclick={() => {
              showProfileMenu = false;
              onopensettings?.("settings");
            }}
          >
            <Settings class="h-4 w-4 text-muted" aria-hidden="true" />
            <span>Pengaturan</span>
          </button>

          <div class="my-1 border-t-2 border-line"></div>

          <button
            type="button"
            class="flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-bold text-danger hover:bg-danger/10"
            onclick={() => {
              showProfileMenu = false;
              onlogout?.();
            }}
          >
            <LogOut class="h-4 w-4" aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
