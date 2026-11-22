import type {
  AiExplanationStyle,
  AiPersonalizationConfig,
} from '../../domain/settings';
import {
  fetchPersonaFromApi,
  loadLocalPersona,
  resetPersonaOnApi,
  updatePersonaOnApi,
} from '../../infrastructure/personaApi';

export class PersonalizationController {
  explanationStyle = $state<AiExplanationStyle>('structured');
  customInstructions = $state('');

  savedStyle = $state<AiExplanationStyle>('structured');
  savedInstructions = $state('');

  loading = $state(false);
  saving = $state(false);
  savedIndicator = $state(false);
  syncError = $state<string | null>(null);

  isDirty = $derived(
    this.explanationStyle !== this.savedStyle ||
      this.customInstructions.trim() !== this.savedInstructions.trim(),
  );

  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  async init(): Promise<void> {
    this.loading = true;
    this.syncError = null;
    try {
      const local = loadLocalPersona();
      this.applySnapshot(local);

      const remote = await fetchPersonaFromApi();
      this.applySnapshot(remote);
    } finally {
      this.loading = false;
    }
  }

  private applySnapshot(cfg: AiPersonalizationConfig): void {
    this.explanationStyle = cfg.style;
    this.customInstructions = cfg.customInstructions;
    this.savedStyle = cfg.style;
    this.savedInstructions = cfg.customInstructions;
  }

  private currentConfig(): AiPersonalizationConfig {
    return {
      style: this.explanationStyle,
      tone: 'friendly',
      includeCode: true,
      customInstructions: this.customInstructions.trim(),
    };
  }

  private flashSaved(): void {
    this.savedIndicator = true;
    if (this.savedTimer) clearTimeout(this.savedTimer);
    this.savedTimer = setTimeout(() => {
      this.savedIndicator = false;
    }, 2400);
  }

  selectStyle(style: AiExplanationStyle): void {
    this.explanationStyle = style;
    this.syncError = null;
    this.savedIndicator = false;
  }

  onInstructionsInput(value: string): void {
    this.customInstructions = value.slice(0, 350);
    this.syncError = null;
    this.savedIndicator = false;
  }

  applyTemplate(text: string): void {
    if (this.customInstructions.includes(text)) return;
    const next = this.customInstructions.trim()
      ? `${this.customInstructions.trim()}\n- ${text}`
      : `- ${text}`;
    this.onInstructionsInput(next);
  }

  async save(): Promise<void> {
    if (this.saving || !this.isDirty) return;
    this.saving = true;
    this.syncError = null;
    this.savedIndicator = false;
    try {
      const saved = await updatePersonaOnApi(this.currentConfig());
      this.applySnapshot(saved);
      this.flashSaved();
    } catch (err) {
      this.syncError =
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan persona ke backend AI.';
    } finally {
      this.saving = false;
    }
  }

  async clearInstructions(): Promise<void> {
    if (this.saving) return;
    this.saving = true;
    this.syncError = null;
    try {
      const def = await resetPersonaOnApi();
      this.applySnapshot(def);
      this.flashSaved();
    } catch (err) {
      this.syncError =
        err instanceof Error
          ? err.message
          : 'Gagal mereset persona di backend AI.';
    } finally {
      this.saving = false;
    }
  }
}
