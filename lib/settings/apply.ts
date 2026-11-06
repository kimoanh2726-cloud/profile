import { SETTINGS_REGISTRY } from "./registry";
import type { Settings } from "./defaults";

/**
 * Apply all non-bridged settings to the DOM root element (default: <html>).
 * Each registry entry with an `applyToDOM` function is called with the
 * current value and the root element.
 */
export function applySettingsToDOM(
  settings: Settings,
  root: HTMLElement = document.documentElement
): void {
  for (const def of SETTINGS_REGISTRY) {
    if (!def.applyToDOM || def.bridgedTo) continue;
    const value = settings[def.id as keyof Settings];
    def.applyToDOM(value, root);
  }
}

/**
 * Minimal inline script (stringified) to apply critical settings before
 * React hydration — prevents flash of wrong appearance.
 *
 * Keep this IIFE small: no imports, no external deps.
 */
export const ANTI_FLASH_SCRIPT = /* javascript */ `
(function() {
  try {
    var raw = localStorage.getItem('${`profile_settings_v1`}');
    if (!raw) return;
    var s = JSON.parse(raw);
    var r = document.documentElement;
    var apply = function(attr, val, def) {
      if (val !== undefined && val !== null && val !== def) r.setAttribute(attr, String(val));
    };
    apply('data-font-size',           s.fontSize,           'md');
    apply('data-content-width',       s.contentWidth,       'normal');
    apply('data-card-radius',         s.cardRadius,         'md');
    apply('data-animations',          s.animationsEnabled,  true);
    apply('data-animation-intensity', s.animationIntensity, 'moderate');
    apply('data-custom-cursor',       s.customCursor,       true);
    apply('data-date-format',         s.dateFormat,         'absolute');
    apply('data-section-numbers',     s.showSectionNumbers, true);
    apply('data-show-expired',        s.showExpiredCerts,   false);
    apply('data-high-contrast',       s.highContrast,       false);
    apply('data-reduced-motion',      s.reducedMotion,      false);
    apply('data-dyslexia-font',       s.dyslexiaFont,       false);
    apply('data-focus-ring',          s.enhancedFocusRing,  false);
    if (s.accentColor) {
      r.style.setProperty('--color-accent-override', s.accentColor);
      r.setAttribute('data-accent-override', 'true');
    }
  } catch(e) {}
})();
`;

