import {
  createAdminStudent,
  deleteAdminStudent,
  listAdminStudents,
  updateAdminStudent,
  type AdminClassOption,
  type AdminStudentItem,
  type CreateStudentPayload,
  type UpdateStudentPayload,
} from '../../infrastructure/adminStudentsApi';

export class AdminStudentsController {
  students = $state<AdminStudentItem[]>([]);
  classes = $state<AdminClassOption[]>([]);
  searchQuery = $state('');
  selectedClassId = $state('');

  page = $state(1);
  pageSize = $state(15);
  totalItems = $state(0);
  totalPages = $state(1);

  loading = $state(false);
  saving = $state(false);
  deletingId = $state<string | null>(null);

  errorMessage = $state<string | null>(null);
  statusBanner = $state<string | null>(null);
  formError = $state<string | null>(null);

  formOpen = $state(false);
  editingStudent = $state<AdminStudentItem | null>(null);
  deleteTarget = $state<AdminStudentItem | null>(null);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  async load(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;
    try {
      const res = await listAdminStudents(
        this.searchQuery,
        this.selectedClassId,
        this.page,
        this.pageSize,
      );
      const rawItems = res.items ?? [];
      this.classes = res.classes ?? [];
      if (res.pagination) {
        this.students = rawItems;
        this.page = res.pagination.page;
        this.pageSize = res.pagination.pageSize;
        this.totalItems = res.pagination.totalItems;
        this.totalPages = Math.max(1, res.pagination.totalPages);
      } else {
        this.totalItems = rawItems.length;
        this.totalPages = Math.max(1, Math.ceil(rawItems.length / this.pageSize));
        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }
        const start = (this.page - 1) * this.pageSize;
        this.students = rawItems.slice(start, start + this.pageSize);
      }
    } catch (err) {
      this.errorMessage =
        err instanceof Error ? err.message : 'Gagal memuat daftar akun siswa.';
    } finally {
      this.loading = false;
    }
  }

  onSearchInput(value: string): void {
    this.searchQuery = value;
    this.page = 1;
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      void this.load();
    }, 280);
  }

  onClassFilterChange(classId: string): void {
    this.selectedClassId = classId;
    this.page = 1;
    void this.load();
  }

  goToPage(nextPage: number): void {
    const clamped = Math.max(1, Math.min(nextPage, this.totalPages));
    if (clamped === this.page || this.loading) return;
    this.page = clamped;
    void this.load();
  }

  setPageSize(nextSize: number): void {
    if (!Number.isFinite(nextSize) || nextSize < 5 || nextSize === this.pageSize) {
      return;
    }
    this.pageSize = nextSize;
    this.page = 1;
    void this.load();
  }

  openCreate(): void {
    this.editingStudent = null;
    this.formError = null;
    this.formOpen = true;
  }

  openEdit(student: AdminStudentItem): void {
    this.editingStudent = student;
    this.formError = null;
    this.formOpen = true;
  }

  closeForm(): void {
    if (this.saving) return;
    this.formOpen = false;
    this.editingStudent = null;
    this.formError = null;
  }

  async submitForm(
    payload: CreateStudentPayload | UpdateStudentPayload,
  ): Promise<void> {
    this.saving = true;
    this.formError = null;
    this.statusBanner = null;
    this.errorMessage = null;

    try {
      if (this.editingStudent) {
        const updated = await updateAdminStudent(this.editingStudent.id, payload);
        this.statusBanner = payload.password
          ? `Akun ${updated.fullName} dan kata sandi barunya berhasil diperbarui.`
          : `Data akun ${updated.fullName} berhasil diperbarui.`;
      } else {
        const created = await createAdminStudent(payload);
        this.page = 1;
        this.statusBanner = `Akun siswa ${created.fullName} (@${created.username}) berhasil dibuat.`;
      }
      this.formOpen = false;
      this.editingStudent = null;
      await this.load();
    } catch (err) {
      this.formError =
        err instanceof Error ? err.message : 'Gagal menyimpan akun siswa.';
    } finally {
      this.saving = false;
    }
  }

  openDelete(student: AdminStudentItem): void {
    this.deleteTarget = student;
  }

  closeDelete(): void {
    if (this.deletingId) return;
    this.deleteTarget = null;
  }

  async confirmDelete(): Promise<void> {
    const target = this.deleteTarget;
    if (!target || this.deletingId) return;

    this.deletingId = target.id;
    this.errorMessage = null;
    this.statusBanner = null;
    try {
      await deleteAdminStudent(target.id);
      if (this.students.length === 1 && this.page > 1) {
        this.page -= 1;
      }
      this.statusBanner = `Akun siswa ${target.fullName} (@${target.username}) berhasil dihapus.`;
      this.deleteTarget = null;
      await this.load();
    } catch (err) {
      this.errorMessage =
        err instanceof Error ? err.message : 'Gagal menghapus akun siswa.';
    } finally {
      this.deletingId = null;
    }
  }
}
