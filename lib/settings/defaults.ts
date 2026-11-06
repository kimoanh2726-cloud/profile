import { z } from "zod";

// ─── Version ────────────────────────────────────────────────────────────────
export const SETTINGS_VERSION = 1;
export const SETTINGS_STORAGE_KEY = "profile_settings_v1";

// ─── Sub-schemas ─────────────────────────────────────────────────────────────
export const SectionVisibilitySchema = z.object({
  about: z.boolean().default(true),
  research: z.boolean().default(true),
  timeline: z.boolean().default(true),
  certificates: z.boolean().default(true),
  skills: z.boolean().default(true),
  contact: z.boolean().default(true),
});

// ─── Main schema ─────────────────────────────────────────────────────────────
export const SettingsSchema = z.object({
  _version: z.number().default(SETTINGS_VERSION),

  // — Appearance (non-bridged) —
  fontSize: z.enum(["sm", "md", "lg"]).default("md"),
  contentWidth: z.enum(["narrow", "normal", "wide"]).default("normal"),
  cardRadius: z.enum(["none", "sm", "md", "lg"]).default("md"),
  accentColor: z.string().nullable().default(null),

  // — Motion —
  animationsEnabled: z.boolean().default(true),
  animationIntensity: z.enum(["subtle", "moderate", "full"]).default("moderate"),
  customCursor: z.boolean().default(true),

  // — Display —
  dateFormat: z.enum(["relative", "absolute"]).default("absolute"),
  sectionVisibility: SectionVisibilitySchema.default({}),
  showSectionNumbers: z.boolean().default(true), // demo registry setting

  // — Certificates —
  showExpiredCerts: z.boolean().default(false),
  expiryWarningDays: z.enum(["30", "60", "90"]).default("60"),
  certSortBy: z.enum(["newest", "expiring", "tag"]).default("newest"),

  // — Accessibility —
  highContrast: z.boolean().default(false),
  reducedMotion: z.boolean().default(false),
  dyslexiaFont: z.boolean().default(false),
  enhancedFocusRing: z.boolean().default(false),
});

export type Settings = z.infer<typeof SettingsSchema>;
export type SectionVisibility = z.infer<typeof SectionVisibilitySchema>;

export function getDefaultSettings(): Settings {
  return SettingsSchema.parse({});
}

