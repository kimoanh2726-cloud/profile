"use client";

import clsx from "clsx";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { ColorMode } from "@/components/theme/ThemeProvider";
import { useSettings } from "@/components/settings/SettingsProvider";
import { Toggle } from "./controls/Toggle";
import { Select } from "./controls/Select";
import { ColorPicker } from "./controls/ColorPicker";
import {
  getSettingsByGroup,
  GROUP_LABELS,
  type SettingGroup,
  type SettingDef,
} from "@/lib/settings/registry";
import type { Settings } from "@/lib/settings/defaults";

interface SettingsGroupProps {
  group: SettingGroup;
  lang: "vi" | "en";
  theme: "a" | "b";
}

export function SettingsGroup({ group, lang, theme }: SettingsGroupProps) {
  const { settings, setSetting } = useSettings();
  const themeCtx = useTheme();

  const defs = getSettingsByGroup(group);
  const groupLabel = lang === "vi" ? GROUP_LABELS[group].vi : GROUP_LABELS[group].en;

  // Helper: get current value (bridged or local)
  function getValue(def: SettingDef): unknown {
    if (def.bridgedTo === "theme") return themeCtx.theme;
    if (def.bridgedTo === "lang") return themeCtx.lang;
    if (def.bridgedTo === "colorMode") return themeCtx.colorMode;
    return settings[def.id as keyof Settings];
  }

  // Helper: set value (bridged or local)
  function setValue(def: SettingDef, value: unknown) {
    if (def.bridgedTo === "theme") {
      themeCtx.setTheme(value as "a" | "b");
      return;
    }
    if (def.bridgedTo === "lang") {
      themeCtx.setLang(value as "vi" | "en");
      return;
    }
    if (def.bridgedTo === "colorMode") {
      themeCtx.setColorMode(value as "light" | "dark" | "system");
      return;
    }
    setSetting(def.id as keyof Settings, value as Settings[keyof Settings]);
  }

  // Filter visible settings via showWhen
  const visibleDefs = defs.filter((def) =>
    def.showWhen ? def.showWhen(settings) : true
  );

  if (visibleDefs.length === 0) return null;

  return (
    <section aria-labelledby={`settings-group-${group}`} className="py-4">
      {/* Group header */}
      <h3
        id={`settings-group-${group}`}
        className={clsx(
          "text-[10px] font-bold tracking-[0.15em] uppercase mb-3 px-4",
          theme === "a"
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-accent)]"
        )}
      >
        {groupLabel}
      </h3>

      {/* Settings rows */}
      <div className="flex flex-col divide-y divide-[var(--color-border)]">
        {visibleDefs.map((def) => {
          const currentValue = getValue(def);
          const defLabel = lang === "vi" ? def.labelVi : def.labelEn;
          const defDesc =
            lang === "vi" ? def.descriptionVi : def.descriptionEn;

          return (
            <div
              key={def.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              {/* Label + description */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-[var(--color-fg)] leading-tight">
                  {defLabel}
                </span>
                {defDesc && (
                  <span className="text-xs text-[var(--color-fg-muted)] mt-0.5 leading-snug">
                    {defDesc}
                  </span>
                )}
              </div>

              {/* Control */}
              <div className="shrink-0">
                {def.type === "toggle" && (
                  <Toggle
                    value={Boolean(currentValue)}
                    onChange={(v) => setValue(def, v)}
                    theme={theme}
                    label={defLabel}
                  />
                )}
                {def.type === "select" && def.options && (
                  <Select
                    value={String(currentValue ?? def.default)}
                    options={def.options}
                    onChange={(v) => setValue(def, v)}
                    lang={lang}
                    theme={theme}
                    label={defLabel}
                  />
                )}
                {def.type === "color" && (
                  <ColorPicker
                    value={currentValue as string | null}
                    onChange={(v) => setValue(def, v)}
                    theme={theme}
                    lang={lang}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
