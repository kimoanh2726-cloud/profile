"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MotionConfig } from "framer-motion";
import type { Settings } from "@/lib/settings/defaults";
import { getDefaultSettings, SettingsSchema } from "@/lib/settings/defaults";
import { loadSettings, saveSettings, clearSettings } from "@/lib/settings/storage";
import { applySettingsToDOM } from "@/lib/settings/apply";

// ─── Context type ─────────────────────────────────────────────────────────────
interface SettingsContextValue {
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
interface SettingsProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(getDefaultSettings);
  const isFirstMount = useRef(true);

  // Load from localStorage on mount (client only)
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applySettingsToDOM(loaded);
    isFirstMount.current = false;
  }, []);

  // Persist + apply DOM whenever settings change (skip the very first render)
  useEffect(() => {
    if (isFirstMount.current) return;
    saveSettings(settings);
    applySettingsToDOM(settings);
  }, [settings]);

  const setSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    clearSettings();
    applySettingsToDOM(defaults);
  }, []);

  const exportSettings = useCallback((): string => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((json: string): boolean => {
    try {
      // 1. Giới hạn kích thước file import tối đa 50KB (chống DoS / tràn bộ nhớ)
      if (typeof json !== "string" || json.length > 50000) return false;

      // 2. Ngăn chặn tấn công Prototype Pollution
      if (json.includes("__proto__") || json.includes("constructor") || json.includes("prototype")) {
        return false;
      }

      const parsed = JSON.parse(json) as unknown;
      if (typeof parsed !== "object" || parsed === null) return false;
      const result = SettingsSchema.safeParse(parsed);
      if (!result.success) return false;
      setSettings(result.data as Settings);
      return true;
    } catch {
      return false;
    }
  }, []);

  // MotionConfig: disable Framer Motion when animations are off or reduced-motion is on
  const motionReducedMotion: "always" | "user" =
    !settings.animationsEnabled || settings.reducedMotion ? "always" : "user";

  const contextValue = useMemo(
    () => ({ settings, setSetting, resetSettings, exportSettings, importSettings }),
    [settings, setSetting, resetSettings, exportSettings, importSettings]
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      <MotionConfig reducedMotion={motionReducedMotion}>
        {children}
      </MotionConfig>
    </SettingsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used inside <SettingsProvider>");
  }
  return ctx;
}

