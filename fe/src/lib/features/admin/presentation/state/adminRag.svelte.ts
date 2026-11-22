import {
  deleteAdminDocument,
  fetchAutoLearnedDocs,
  uploadGlobalDocument,
  type AutoLearnedDoc,
} from '../../infrastructure/adminRagApi';

export class AdminRagController {
  sourceTitle = $state('');
  topic = $state('');
  selectedFile = $state<File | null>(null);
  uploading = $state(false);
  uploadResult = $state<string | null>(null);
  uploadError = $state<string | null>(null);

  autoLearned = $state<AutoLearnedDoc[]>([]);
  loadingAudit = $state(false);
  auditError = $state<string | null>(null);

  setFile(files: FileList | null): void {
    this.selectedFile = files && files.length > 0 ? files[0] : null;
    this.uploadError = null;
    this.uploadResult = null;
  }

  async submitGlobalUpload(): Promise<void> {
    if (!this.selectedFile || this.uploading) {
      this.uploadError = 'Pilih berkas materi terlebih dahulu.';
      return;
    }

    this.uploading = true;
    this.uploadError = null;
    this.uploadResult = null;

    try {
      const res = await uploadGlobalDocument(
        this.selectedFile,
        this.sourceTitle || this.selectedFile.name,
        this.topic,
      );
      this.uploadResult = `Dokumen berhasil dikirim ke antrean OCR/RAG (Job ID: ${res.job_id || res.doc_id || 'queued'}).`;
      this.selectedFile = null;
      this.sourceTitle = '';
      this.topic = '';
    } catch (err) {
      this.uploadError =
        err instanceof Error
          ? err.message
          : 'Gagal mengunggah dokumen kurikulum global.';
    } finally {
      this.uploading = false;
    }
  }

  async loadAutoLearned(): Promise<void> {
    this.loadingAudit = true;
    this.auditError = null;
    try {
      this.autoLearned = await fetchAutoLearnedDocs(50);
    } catch (err) {
      this.auditError =
        err instanceof Error
          ? err.message
          : 'Gagal memuat daftar audit auto-learned dari backend.';
    } finally {
      this.loadingAudit = false;
    }
  }

  async removeDocument(docId: string): Promise<void> {
    if (!docId) return;
    this.auditError = null;
    try {
      await deleteAdminDocument(docId);
      this.autoLearned = this.autoLearned.filter(
        (d) => (d.doc_id || d.id) !== docId,
      );
    } catch (err) {
      this.auditError =
        err instanceof Error ? err.message : 'Gagal menghapus dokumen.';
    }
  }
}
