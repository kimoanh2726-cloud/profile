import { SettingsSchema, SETTINGS_STORAGE_KEY, SETTINGS_VERSION, getDefaultSettings } from "./defaults";
import type { Settings } from "./defaults";

/** Migrate old stored object to current schema version. */
function migrateSettings(raw: unknown): Settings {
  if (!raw || typeof raw !== "object") return getDefaultSettings();
  const obj = raw as Record<string, unknown>;

  // Future migrations: check obj._version and transform accordingly
  // e.g. if (obj._version === 1) { ... upgrade to v2 ... }

  // Parse through Zod — unknown keys are stripped, missing ones get defaults
  const result = SettingsSchema.safeParse({ ...obj, _version: SETTINGS_VERSION });
  if (result.success) return result.data;
  return getDefaultSettings();
}

/** Load settings from localStorage (SSR-safe). */
export function loadSettings(): Settings {
  if (typeof window === "undefined") return getDefaultSettings();
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return getDefaultSettings();
    const parsed = JSON.parse(raw) as unknown;
    return migrateSettings(parsed);
  } catch {
    return getDefaultSettings();
  }
}

/** Persist settings to localStorage. */
export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // QuotaExceededError or private browsing — silently ignore
  }
}

/** Remove settings from localStorage (reset). */
export function clearSettings(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
  } catch {
    // ignore
  }
}

