<script lang="ts">
  import {
    BotMessageSquare,
    HelpCircle,
    Palette,
    Settings,
    User,
    X,
  } from "@lucide/svelte";
  import { cubicOut } from "svelte/easing";
  import { fade, scale } from "svelte/transition";
  import { Button } from "$lib/shared/ui";
  import { SETTINGS_TABS, type SettingsTab } from "../../domain/settings";
  import AccountTab from "./AccountTab.svelte";
  import GeneralSettingsTab from "./GeneralSettingsTab.svelte";
  import HelpTab from "./HelpTab.svelte";
  import PersonalizationTab from "./PersonalizationTab.svelte";
  import ThemeTab from "./ThemeTab.svelte";

  interface Props {
    open: boolean;
    activeTab?: SettingsTab;
    userDisplayName?: string;
    userUsername?: string;
    userClassName?: string;
    userGradeLevel?: string;
    userRole?: 'student' | 'teacher';
    onclose: () => void;
  }

  let {
    open = false,
    activeTab = "settings",
    userDisplayName = "Siswa Kelas X",
    userUsername = "siswa.x01",
    userClassName = "",
    userGradeLevel = "",
    userRole = "student",
    onclose,
  }: Props = $props();

  let currentTab = $state<SettingsTab>("settings");

  $effect(() => {
    if (activeTab) {
      currentTab = activeTab;
    }
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs md:p-8 lg:p-12"
    role="presentation"
    onclick={(e) => {
      if (e.target === e.currentTarget) onclose();
    }}
  >
    <div
      transition:scale={{ start: 0.96, duration: 190, easing: cubicOut }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      class="neo-box flex h-auto max-h-[92vh] md:max-h-[740px] w-full max-w-2xl md:max-w-[720px] lg:max-w-3xl flex-col overflow-hidden border-2 border-line bg-surface shadow-[8px_8px_0px_var(--neo-shadow-color)]"
    >
      <!-- Header Dialog -->
      <div
        class="flex items-center justify-between border-b-2 border-line bg-surface-soft px-4 py-2.5 md:px-6 md:py-3"
      >
        <div class="flex items-center gap-2.5 md:gap-3">
          <div
            class="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]"
          >
            <Settings class="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="settings-dialog-title"
              class="text-sm font-extrabold text-ink md:text-base leading-tight"
            >
              Pengaturan & Preferensi
            </h2>
            <p class="text-[10.5px] md:text-[11px] text-muted">
              Personalisasi jawaban TAKO AI, tema visual, dan profil akun
            </p>
          </div>
        </div>

        <button
          type="button"
          class="neo-control inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl bg-surface text-ink hover:bg-danger hover:text-white"
          aria-label="Tutup pengaturan"
          onclick={onclose}
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <!-- Tab Navigation Bar -->
      <div
        class="flex border-b-2 border-line bg-surface-soft/60 px-4 py-2 md:px-6 md:py-2.5 gap-2 md:gap-2.5 overflow-x-auto no-scrollbar"
      >
        {#each SETTINGS_TABS as tab}
          <button
            type="button"
            class="neo-control inline-flex min-h-[36px] items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs md:text-[13px] font-extrabold transition whitespace-nowrap {currentTab ===
            tab.id
              ? 'border-2 border-line bg-mustard text-on-mustard shadow-[2.5px_2.5px_0px_var(--neo-shadow-color)]'
              : 'border-2 border-line/30 bg-surface text-ink/80 hover:text-ink hover:border-line hover:bg-surface shadow-none'}"
            onclick={() => (currentTab = tab.id)}
          >
            {#if tab.id === "account"}
              <User class="h-4 w-4" aria-hidden="true" />
            {:else if tab.id === "personalization"}
              <BotMessageSquare class="h-4 w-4" aria-hidden="true" />
            {:else if tab.id === "theme"}
              <Palette class="h-4 w-4" aria-hidden="true" />
            {:else if tab.id === "help"}
              <HelpCircle class="h-4 w-4" aria-hidden="true" />
            {:else}
              <Settings class="h-4 w-4" aria-hidden="true" />
            {/if}
            <span>{tab.label}</span>
          </button>
        {/each}
      </div>

      <!-- Modal Body Content -->
      <div class="flex-1 overflow-y-auto p-3.5 md:p-4 text-sm text-ink">
        {#if currentTab === "personalization"}
          <PersonalizationTab />
        {:else if currentTab === "theme"}
          <ThemeTab />
        {:else if currentTab === "account"}
          <AccountTab
            displayName={userDisplayName}
            username={userUsername}
            className={userClassName}
            gradeLevel={userGradeLevel}
            role={userRole}
          />
        {:else if currentTab === "help"}
          <HelpTab />
        {:else}
          <GeneralSettingsTab />
        {/if}
      </div>

      <!-- Footer Dialog -->
      <div
        class="flex items-center justify-end border-t-2 border-line bg-surface-soft px-4 py-2 md:px-6 md:py-2.5"
      >
        <Button variant="secondary" size="sm" onclick={onclose}>Tutup</Button>
      </div>
    </div>
  </div>
{/if}
