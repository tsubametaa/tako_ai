<script lang="ts">
  import { Eye, EyeOff } from "@lucide/svelte";
  import {
    Button,
    Dialog,
    Input,
    Select,
    type SelectOption,
  } from "$lib/shared/ui";
  import type {
    AdminClassOption,
    AdminStudentItem,
    CreateStudentPayload,
  } from "../../infrastructure/adminStudentsApi";

  interface Props {
    open: boolean;
    student: AdminStudentItem | null;
    classes: AdminClassOption[];
    saving: boolean;
    errorMessage: string | null;
    onclose: () => void;
    onsubmit: (payload: CreateStudentPayload) => void;
  }

  let {
    open,
    student,
    classes,
    saving,
    errorMessage,
    onclose,
    onsubmit,
  }: Props = $props();

  let fullName = $state("");
  let username = $state("");
  let identifier = $state("");
  let classId = $state("");
  let password = $state("");
  let showPassword = $state(false);
  let localError = $state<string | null>(null);

  const isEdit = $derived(student !== null);
  const dialogTitle = $derived(
    isEdit ? "Edit Akun Siswa" : "Tambah Akun Siswa Baru",
  );
  const classOptions = $derived<SelectOption[]>([
    { value: "", label: "Belum ditetapkan ke kelas" },
    ...classes.map((cls) => ({
      value: cls.id,
      label: cls.name,
      badge: cls.gradeLevel || undefined,
    })),
  ]);

  $effect(() => {
    if (open) {
      fullName = student?.fullName ?? "";
      username = student?.username ?? "";
      identifier = student?.identifier ?? "";
      classId = student?.classId ?? "";
      password = "";
      showPassword = false;
      localError = null;
    }
  });

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    localError = null;

    const cleanName = fullName.trim();
    const cleanUser = username.trim();
    if (cleanName.length < 2) {
      localError = "Nama lengkap minimal 2 karakter.";
      return;
    }
    if (cleanUser.length < 3 || /\s/.test(cleanUser)) {
      localError = "Username minimal 3 karakter dan tanpa spasi.";
      return;
    }
    if (!isEdit && password.length < 4) {
      localError = "Kata sandi awal minimal 4 karakter.";
      return;
    }
    if (isEdit && password.length > 0 && password.length < 4) {
      localError = "Kata sandi baru minimal 4 karakter.";
      return;
    }

    onsubmit({
      fullName: cleanName,
      username: cleanUser,
      identifier: identifier.trim(),
      password,
      classId,
    });
  }
</script>

<Dialog {open} title={dialogTitle} {onclose}>
  <form
    id="student-account-form"
    class="flex flex-col gap-3.5"
    onsubmit={handleSubmit}
  >
    {#if localError || errorMessage}
      <p
        role="alert"
        class="rounded-xl border-2 border-danger bg-danger/10 px-3.5 py-2 text-xs font-bold text-danger"
      >
        {localError ?? errorMessage}
      </p>
    {/if}

    <div class="flex flex-col gap-1.5">
      <label for="student-fullname" class="text-xs font-bold text-ink">
        Nama Lengkap <span class="text-danger">*</span>
      </label>
      <Input
        id="student-fullname"
        value={fullName}
        placeholder="Contoh: Nino Nakano"
        disabled={saving}
        oninput={(e) => (fullName = e.currentTarget.value)}
      />
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="flex flex-col gap-1.5">
        <label for="student-username" class="text-xs font-bold text-ink">
          Username Login <span class="text-danger">*</span>
        </label>
        <Input
          id="student-username"
          value={username}
          placeholder="Contoh: 052000"
          disabled={saving}
          oninput={(e) => (username = e.currentTarget.value)}
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="student-identifier" class="text-xs font-bold text-ink">
          NIS / Identitas
        </label>
        <Input
          id="student-identifier"
          value={identifier}
          placeholder="mis. 05200"
          disabled={saving}
          oninput={(e) => (identifier = e.currentTarget.value)}
        />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="student-class" class="text-xs font-bold text-ink">
        Kelas
      </label>
      <Select
        id="student-class"
        ariaLabel="Pilih kelas siswa"
        value={classId}
        options={classOptions}
        placeholder="Belum ditetapkan ke kelas"
        disabled={saving}
        onchange={(val) => (classId = val)}
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="student-password" class="text-xs font-bold text-ink">
        {isEdit ? "Reset Kata Sandi (Opsional)" : "Kata Sandi Awal"}
        {#if !isEdit}<span class="text-danger">*</span>{/if}
      </label>
      <div class="relative">
        <Input
          id="student-password"
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder={isEdit
            ? "Kosongkan jika tidak ingin mengubah"
            : "Minimal 4 karakter"}
          class="pr-11"
          disabled={saving}
          oninput={(e) => (password = e.currentTarget.value)}
        />
        <button
          type="button"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:bg-surface-soft hover:text-ink"
          aria-label={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
          onclick={() => (showPassword = !showPassword)}
        >
          {#if showPassword}
            <EyeOff class="h-4 w-4" aria-hidden="true" />
          {:else}
            <Eye class="h-4 w-4" aria-hidden="true" />
          {/if}
        </button>
      </div>
      {#if isEdit}
        <p class="text-[11px] font-medium text-muted">
          Isi kolom ini hanya jika ingin mereset kata sandi siswa.
        </p>
      {/if}
    </div>
  </form>

  {#snippet footer()}
    <Button variant="secondary" size="sm" disabled={saving} onclick={onclose}>
      Batal
    </Button>
    <Button
      type="submit"
      form="student-account-form"
      variant="primary"
      size="sm"
      disabled={saving}
    >
      {saving ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Buat Akun Siswa"}
    </Button>
  {/snippet}
</Dialog>
