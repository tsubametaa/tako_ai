<script lang="ts">
  import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from '@lucide/svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly, slide } from 'svelte/transition';
  import { Button, Card, Input, NekoMark } from '$lib/shared/ui';

  interface Props {
    usernameOrEmail: string;
    password: string;
    showPassword: boolean;
    submitting: boolean;
    errorMessage?: string | null;
    fieldErrors?: { username?: string; password?: string };
    sessionExpired?: boolean;
    onusernamechange: (val: string) => void;
    onpasswordchange: (val: string) => void;
    ontoggleshowpassword: () => void;
    onsubmit: () => void;
  }

  let {
    usernameOrEmail,
    password,
    showPassword,
    submitting,
    errorMessage = null,
    fieldErrors = {},
    sessionExpired = false,
    onusernamechange,
    onpasswordchange,
    ontoggleshowpassword,
    onsubmit,
  }: Props = $props();
</script>

<div
  in:fly={{ y: 16, duration: 300, easing: cubicOut }}
  class="w-full max-w-[400px]"
>
<Card class="flex w-full flex-col gap-6 rounded-2xl border-2 border-line bg-surface p-6 shadow-[4px_4px_0px_var(--neo-shadow-color)] sm:p-7">
  <!-- CardHeader (shadcn/ui pattern) -->
  <div data-slot="card-header" class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <NekoMark size="sm" />
      <span class="text-sm font-extrabold tracking-tight text-ink">
        NEKO <span class="text-primary">AI</span>
      </span>
    </div>
    <h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
      Masuk ke Akun
    </h1>
    <p class="text-xs leading-relaxed font-medium text-muted sm:text-[13px]">
      Masukkan nama pengguna atau NIS untuk mengakses ruang belajar NEKO AI.
    </p>
  </div>

  {#if sessionExpired}
    <div
      transition:slide={{ duration: 180, easing: cubicOut }}
      class="flex items-center gap-2.5 rounded-xl border-2 border-line bg-mustard/20 px-3.5 py-2.5 text-xs font-bold text-ink"
      role="alert"
    >
      <AlertCircle class="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>Sesi Anda telah berakhir. Silakan masuk kembali.</span>
    </div>
  {/if}

  {#if errorMessage}
    <div
      transition:slide={{ duration: 180, easing: cubicOut }}
      class="flex items-center gap-2.5 rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2.5 text-xs font-bold text-danger"
      role="alert"
    >
      <AlertCircle class="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{errorMessage}</span>
    </div>
  {/if}

  <!-- CardContent: FieldGroup & Field (shadcn/ui pattern) -->
  <form
    class="flex flex-col gap-4"
    onsubmit={(e) => {
      e.preventDefault();
      onsubmit();
    }}
  >
    <div class="flex flex-col gap-1.5">
      <label
        for="login-username"
        class="text-xs font-bold tracking-tight text-ink"
      >
        Nama pengguna atau NIS
      </label>
      <Input
        id="login-username"
        name="username"
        autocomplete="username"
        placeholder="siswa.x01 atau NIS-10001"
        value={usernameOrEmail}
        error={fieldErrors.username}
        class="h-11 text-sm"
        oninput={(e) => onusernamechange(e.currentTarget.value)}
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label
        for="login-password"
        class="text-xs font-bold tracking-tight text-ink"
      >
        Kata sandi
      </label>
      <div class="relative w-full">
        <Input
          id="login-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autocomplete="current-password"
          placeholder="Masukkan kata sandi"
          value={password}
          error={fieldErrors.password}
          class="h-11 pr-11 text-sm"
          oninput={(e) => onpasswordchange(e.currentTarget.value)}
        />
        <button
          type="button"
          class="absolute right-1.5 top-[22px] -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-soft hover:text-ink"
          aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          onclick={ontoggleshowpassword}
        >
          {#if showPassword}
            <EyeOff class="h-4 w-4" aria-hidden="true" />
          {:else}
            <Eye class="h-4 w-4" aria-hidden="true" />
          {/if}
        </button>
      </div>
    </div>

    <Button
      type="submit"
      variant="primary"
      disabled={submitting}
      class="mt-1 h-11 w-full justify-center text-sm font-bold"
    >
      {#if submitting}
        <Loader2 class="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>Memverifikasi…</span>
      {:else}
        <LogIn class="h-4 w-4" aria-hidden="true" />
        <span>Masuk</span>
      {/if}
    </Button>
  </form>

  <!-- CardFooter (shadcn/ui pattern) -->
  <div class="border-t border-line/20 pt-4 text-center">
    <p class="text-xs font-medium text-muted">
      Kesulitan masuk? Hubungi guru pengampu atau pengelola kelas.
    </p>
  </div>
</Card>
</div>
