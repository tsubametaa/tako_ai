<script lang="ts">
  import { onMount } from 'svelte';
  import {
    GraduationCap,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    User,
    Users,
  } from '@lucide/svelte';
  import {
    Button,
    Card,
    Dialog,
    Input,
    Pagination,
    Select,
    type SelectOption,
  } from '$lib/shared/ui';
  import StudentFormDialog from '../components/StudentFormDialog.svelte';
  import { AdminStudentsController } from '../state/adminStudents.svelte';

  const ctrl = new AdminStudentsController();

  const classFilterOptions = $derived<SelectOption[]>([
    { value: '', label: 'Semua Kelas' },
    ...ctrl.classes.map((cls) => ({
      value: cls.id,
      label: cls.name,
      badge: cls.gradeLevel || undefined,
    })),
  ]);

  onMount(() => {
    void ctrl.load();
  });
</script>

<svelte:head>
  <title>Kelola Akun Siswa - TAKO AI</title>
</svelte:head>

<div class="flex flex-col gap-5">
  <Card class="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
    <div class="flex items-center gap-3">
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-line bg-mustard text-on-mustard shadow-[2px_2px_0px_var(--neo-shadow-color)]"
      >
        <Users class="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-lg font-extrabold text-ink md:text-xl">
            Kelola Akun Siswa
          </h2>
          <span
            class="rounded-lg border border-line/30 bg-surface-soft px-2 py-0.5 text-xs font-extrabold text-ink"
          >
            {ctrl.totalItems} siswa
          </span>
        </div>
        <p class="text-xs font-medium text-muted">
          Tambah akun baru, ubah kelas & profil, reset kata sandi, atau hapus akses akun siswa.
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        disabled={ctrl.loading}
        onclick={() => ctrl.load()}
      >
        <RefreshCw class="h-4 w-4" aria-hidden="true" />
        <span>{ctrl.loading ? 'Memuat…' : 'Muat Ulang'}</span>
      </Button>
      <Button variant="primary" size="sm" onclick={() => ctrl.openCreate()}>
        <Plus class="h-4 w-4" aria-hidden="true" />
        <span>Tambah Siswa</span>
      </Button>
    </div>
  </Card>

  {#if ctrl.errorMessage}
    <p
      role="alert"
      class="rounded-xl border-2 border-danger bg-danger/10 px-4 py-2.5 text-xs font-bold text-danger"
    >
      {ctrl.errorMessage}
    </p>
  {/if}

  {#if ctrl.statusBanner}
    <p
      class="rounded-xl border-2 border-line bg-mustard-soft px-4 py-2.5 text-xs font-bold text-ink"
    >
      {ctrl.statusBanner}
    </p>
  {/if}

  <Card class="flex flex-col gap-4 p-4 sm:p-5">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-12">
      <div class="relative sm:col-span-8">
        <Input
          value={ctrl.searchQuery}
          placeholder="Cari nama siswa, username, NIS, atau kelas…"
          class="pl-9 text-xs sm:text-sm"
          oninput={(e) => ctrl.onSearchInput(e.currentTarget.value)}
        />
        <Search
          class="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted/80"
          aria-hidden="true"
        />
      </div>

      <div class="sm:col-span-4">
        <Select
          ariaLabel="Filter berdasarkan kelas"
          value={ctrl.selectedClassId}
          options={classFilterOptions}
          placeholder="Semua Kelas"
          onchange={(val) => ctrl.onClassFilterChange(val)}
        />
      </div>
    </div>

    {#if ctrl.loading}
      <p class="py-10 text-center text-xs font-bold text-muted">
        Memuat data akun siswa dari Supabase…
      </p>
    {:else if ctrl.students.length === 0}
      <div class="flex flex-col items-center gap-3 py-10 text-center">
        <p class="text-sm font-bold text-ink">Belum ada akun siswa yang cocok</p>
        <p class="max-w-sm text-xs font-medium text-muted">
          Coba ubah kata kunci pencarian atau tambahkan akun siswa baru agar siswa dapat login ke TAKO AI.
        </p>
        <Button variant="primary" size="sm" onclick={() => ctrl.openCreate()}>
          <Plus class="h-4 w-4" aria-hidden="true" />
          <span>Tambah Akun Siswa</span>
        </Button>
      </div>
    {:else}
      <!-- Tampilan Tabel Desktop -->
      <div class="hidden overflow-x-auto rounded-xl border-2 border-line md:block">
        <table class="w-full border-collapse text-left text-sm">
          <thead class="border-b-2 border-line bg-surface-soft text-xs font-extrabold text-muted uppercase">
            <tr>
              <th class="px-4 py-3">Siswa</th>
              <th class="px-4 py-3">Username</th>
              <th class="px-4 py-3">NIS / ID</th>
              <th class="px-4 py-3">Kelas</th>
              <th class="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line/20 bg-surface">
            {#each ctrl.students as student (student.id)}
              <tr class="transition hover:bg-surface-soft/50">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2.5">
                    <span
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-line bg-sage/25 text-ink"
                    >
                      <User class="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span class="font-bold text-ink">{student.fullName}</span>
                  </div>
                </td>
                <td class="px-4 py-3 font-mono text-xs font-semibold text-ink">
                  @{student.username || '-'}
                </td>
                <td class="px-4 py-3 text-xs font-medium text-muted">
                  {student.identifier || '-'}
                </td>
                <td class="px-4 py-3">
                  {#if student.className}
                    <span
                      class="inline-flex items-center gap-1 rounded-lg border border-line/35 bg-mustard-soft px-2.5 py-1 text-xs font-bold text-ink"
                    >
                      <GraduationCap class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{student.className}</span>
                    </span>
                  {:else}
                    <span class="text-xs font-medium text-muted">Belum diatur</span>
                  {/if}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      class="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border-2 border-line bg-surface px-2.5 py-1 text-xs font-bold text-ink transition hover:bg-mustard hover:text-on-mustard"
                      onclick={() => ctrl.openEdit(student)}
                    >
                      <Pencil class="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      class="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border-2 border-danger/60 bg-danger/10 px-2.5 py-1 text-xs font-bold text-danger transition hover:bg-danger hover:text-white"
                      onclick={() => ctrl.openDelete(student)}
                    >
                      <Trash2 class="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Tampilan Kartu Mobile -->
      <div class="flex flex-col gap-3 md:hidden">
        {#each ctrl.students as student (student.id)}
          <div class="flex flex-col gap-3 rounded-xl border-2 border-line bg-surface-soft p-3.5">
            <div class="flex items-start justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2.5">
                <span
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-line bg-sage/25 text-ink"
                >
                  <User class="h-4 w-4" aria-hidden="true" />
                </span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-extrabold text-ink">
                    {student.fullName}
                  </p>
                  <p class="truncate font-mono text-xs font-medium text-muted">
                    @{student.username || '-'}{student.identifier
                      ? ` • NIS ${student.identifier}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-2 border-t border-line/15 pt-2.5">
              {#if student.className}
                <span
                  class="inline-flex items-center gap-1 rounded-lg border border-line/35 bg-mustard-soft px-2.5 py-1 text-[11px] font-bold text-ink"
                >
                  <GraduationCap class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{student.className}</span>
                </span>
              {:else}
                <span class="text-xs font-medium text-muted">Kelas belum diatur</span>
              {/if}

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="inline-flex min-h-[34px] items-center gap-1 rounded-lg border-2 border-line bg-surface px-2.5 text-xs font-bold text-ink"
                  onclick={() => ctrl.openEdit(student)}
                >
                  <Pencil class="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  class="inline-flex min-h-[34px] items-center gap-1 rounded-lg border-2 border-danger/60 bg-danger/10 px-2.5 text-xs font-bold text-danger"
                  onclick={() => ctrl.openDelete(student)}
                >
                  <Trash2 class="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <Pagination
        page={ctrl.page}
        pageSize={ctrl.pageSize}
        totalItems={ctrl.totalItems}
        totalPages={ctrl.totalPages}
        disabled={ctrl.loading}
        itemLabel="siswa"
        onpagechange={(p) => ctrl.goToPage(p)}
        onpagesizechange={(size) => ctrl.setPageSize(size)}
      />
    {/if}
  </Card>
</div>

<StudentFormDialog
  open={ctrl.formOpen}
  student={ctrl.editingStudent}
  classes={ctrl.classes}
  saving={ctrl.saving}
  errorMessage={ctrl.formError}
  onclose={() => ctrl.closeForm()}
  onsubmit={(payload) => ctrl.submitForm(payload)}
/>

<Dialog
  open={ctrl.deleteTarget !== null}
  title="Hapus Akun Siswa?"
  onclose={() => ctrl.closeDelete()}
>
  {#if ctrl.deleteTarget}
    <p class="leading-relaxed text-ink">
      Akun <strong>{ctrl.deleteTarget.fullName}</strong> (<code>@{ctrl.deleteTarget.username}</code>) akan dihapus permanen dari database sekolah dan tidak bisa lagi login ke TAKO AI.
    </p>
  {/if}

  {#snippet footer()}
    <Button
      variant="secondary"
      size="sm"
      disabled={ctrl.deletingId !== null}
      onclick={() => ctrl.closeDelete()}
    >
      Batal
    </Button>
    <Button
      variant="danger"
      size="sm"
      disabled={ctrl.deletingId !== null}
      onclick={() => ctrl.confirmDelete()}
    >
      {ctrl.deletingId ? 'Menghapus…' : 'Ya, Hapus Akun'}
    </Button>
  {/snippet}
</Dialog>
