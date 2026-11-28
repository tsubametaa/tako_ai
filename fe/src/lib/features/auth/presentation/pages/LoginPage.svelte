<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { resolveSafePostLoginTarget } from '$lib/shared/config/subdomains';
  import { themeController } from '$lib/features/theme';
  import type { User } from '../../domain/user';
  import { LoginFormController } from '../state/loginForm.svelte';
  import LoginForm from '../components/LoginForm.svelte';

  const formController = new LoginFormController();

  onMount(() => {
    themeController.init();
  });

  async function handleSuccess(user: User) {
    const target = resolveSafePostLoginTarget(page.url, user.role);
    if (target.startsWith('/')) {
      await goto(target);
      return;
    }
    window.location.href = target;
  }
</script>

<svelte:head>
  <title>Masuk - NEKO AI</title>
</svelte:head>

<main class="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-8 text-ink">
  <LoginForm
    usernameOrEmail={formController.usernameOrEmail}
    password={formController.password}
    showPassword={formController.showPassword}
    submitting={formController.submitting}
    errorMessage={formController.errorMessage}
    fieldErrors={formController.fieldErrors}
    sessionExpired={page.url.searchParams.get('expired') === 'true'}
    onusernamechange={(v) => (formController.usernameOrEmail = v)}
    onpasswordchange={(v) => (formController.password = v)}
    ontoggleshowpassword={() => formController.toggleShowPassword()}
    onsubmit={() => formController.submit(handleSuccess)}
  />
</main>
