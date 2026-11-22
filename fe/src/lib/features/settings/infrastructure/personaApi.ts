import { apiRequest, getStoredToken } from '$lib/shared/api';
import type { AiPersonalizationConfig } from '../domain/settings';

const STORAGE_KEY = 'kka_ai_personalization';

const DEFAULT_CONFIG: AiPersonalizationConfig = {
  style: 'structured',
  tone: 'friendly',
  includeCode: true,
  customInstructions: '',
};

export function loadLocalPersona(): AiPersonalizationConfig {
  if (typeof window === 'undefined') return { ...DEFAULT_CONFIG };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw) as Partial<AiPersonalizationConfig>;
    return {
      style: parsed.style || 'structured',
      tone: parsed.tone || 'friendly',
      includeCode: parsed.includeCode ?? true,
      customInstructions: parsed.customInstructions || '',
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveLocalPersona(config: AiPersonalizationConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage error
  }
}

export async function fetchPersonaFromApi(): Promise<AiPersonalizationConfig> {
  const local = loadLocalPersona();
  if (!getStoredToken()) return local;

  try {
    const remote = await apiRequest<AiPersonalizationConfig>('/persona');
    const merged: AiPersonalizationConfig = {
      style: remote.style || 'structured',
      tone: remote.tone || 'friendly',
      includeCode: remote.includeCode ?? true,
      customInstructions: remote.customInstructions ?? '',
    };
    saveLocalPersona(merged);
    return merged;
  } catch {
    return local;
  }
}

export async function updatePersonaOnApi(
  config: AiPersonalizationConfig,
): Promise<AiPersonalizationConfig> {
  const payload: AiPersonalizationConfig = {
    ...config,
    customInstructions: config.customInstructions.trim().slice(0, 350),
  };

  if (!getStoredToken()) {
    saveLocalPersona(payload);
    return payload;
  }

  const saved = await apiRequest<AiPersonalizationConfig>('/persona', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  saveLocalPersona(saved);
  return saved;
}

export async function resetPersonaOnApi(): Promise<AiPersonalizationConfig> {
  saveLocalPersona(DEFAULT_CONFIG);
  if (getStoredToken()) {
    await apiRequest<{ deleted: boolean }>('/persona', {
      method: 'DELETE',
    });
  }
  return { ...DEFAULT_CONFIG };
}
