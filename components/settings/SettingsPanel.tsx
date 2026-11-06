"use client";

import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, RotateCcw, Download, Upload } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useSettings } from "@/components/settings/SettingsProvider";
import { SettingsGroup } from "./SettingsGroup";
import { ALL_GROUPS } from "@/lib/settings/registry";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

export function SettingsPanel({ isOpen, onClose, triggerRef }: SettingsPanelProps) {
  const { theme, lang } = useTheme();
  const { resetSettings, exportSettings, importSettings } = useSettings();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Focus trap + Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus close button when opening
    const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.closest('[aria-hidden="true"]'));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      // Return focus to trigger
      triggerRef?.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  // Export JSON
  const handleExport = useCallback(() => {
    const json = exportSettings();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportSettings]);

  // Import JSON
  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const ok = importSettings(text);
        if (!ok) alert(lang === "vi" ? "File cài đặt không hợp lệ." : "Invalid settings file.");
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [importSettings, lang]
  );

  const labels = {
    title: lang === "vi" ? "Cài đặt" : "Settings",
    reset: lang === "vi" ? "Đặt lại mặc định" : "Reset to Defaults",
    export: lang === "vi" ? "Xuất JSON" : "Export JSON",
    import: lang === "vi" ? "Nhập JSON" : "Import JSON",
    confirmReset:
      lang === "vi"
        ? "Đặt lại tất cả cài đặt về mặc định?"
        : "Reset all settings to defaults?",
  };

  // Desktop drawer: slide from right; Mobile bottom sheet: slide from bottom
  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };
  const sheetVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
    exit: { y: "100%" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="settings-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className={clsx(
              "fixed inset-0 z-40",
              theme === "a" ? "bg-black/40" : "bg-black/60"
            )}
            aria-hidden="true"
          />

          {/* Panel — Desktop (md+): right drawer */}
          <motion.div
            key="settings-panel-desktop"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-panel-title"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className={clsx(
              "fixed top-0 right-0 h-full z-50",
              "hidden md:flex flex-col",
              "w-[380px] max-w-[90vw]",
              theme === "a"
                ? "bg-[var(--color-bg)] border-l border-[var(--color-border)]"
                : "bg-[var(--color-surface)] border-l border-[var(--color-border)]"
            )}
          >
            <PanelContent
              theme={theme}
              lang={lang}
              labels={labels}
              closeButtonRef={closeButtonRef}
              fileInputRef={fileInputRef}
              onClose={onClose}
              onExport={handleExport}
              onImport={handleImport}
              onReset={() => {
                if (window.confirm(labels.confirmReset)) resetSettings();
              }}
            />
          </motion.div>

          {/* Panel — Mobile (<md): bottom sheet */}
          <motion.div
            key="settings-panel-mobile"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-panel-title-mobile"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className={clsx(
              "fixed bottom-0 inset-x-0 z-50",
              "flex md:hidden flex-col",
              "max-h-[88vh] rounded-t-2xl overflow-hidden",
              theme === "a"
                ? "bg-[var(--color-bg)] border-t border-[var(--color-border)]"
                : "bg-[var(--color-surface)] border-t border-[var(--color-border)]"
            )}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[var(--color-border)]" />
            </div>
            <PanelContent
              theme={theme}
              lang={lang}
              labels={labels}
              closeButtonRef={closeButtonRef}
              fileInputRef={fileInputRef}
              titleId="settings-panel-title-mobile"
              onClose={onClose}
              onExport={handleExport}
              onImport={handleImport}
              onReset={() => {
                if (window.confirm(labels.confirmReset)) resetSettings();
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Shared panel content ─────────────────────────────────────────────────────
interface PanelContentProps {
  theme: "a" | "b";
  lang: "vi" | "en";
  labels: { title: string; reset: string; export: string; import: string };
  closeButtonRef: React.RefObject<HTMLButtonElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  titleId?: string;
  onClose: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

function PanelContent({
  theme,
  lang,
  labels,
  closeButtonRef,
  fileInputRef,
  titleId = "settings-panel-title",
  onClose,
  onExport,
  onImport,
  onReset,
}: PanelContentProps) {
  return (
    <>
      {/* Header */}
      <div
        className={clsx(
          "flex items-center justify-between px-4 py-4 shrink-0 border-b",
          "border-[var(--color-border)]"
        )}
      >
        <h2
          id={titleId}
          className={clsx(
            "font-semibold text-base text-[var(--color-fg)]",
            theme === "a" && "font-serif"
          )}
        >
          {labels.title}
        </h2>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label={lang === "vi" ? "Đóng cài đặt" : "Close settings"}
          className={clsx(
            "p-1.5 rounded transition-colors",
            "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
            "hover:bg-[var(--color-surface-hover)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          )}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="divide-y divide-[var(--color-border)]">
          {ALL_GROUPS.filter((g) => g !== "advanced").map((group) => (
            <SettingsGroup key={group} group={group} lang={lang} theme={theme} />
          ))}
        </div>
      </div>

      {/* Footer — advanced actions */}
      <div
        className={clsx(
          "shrink-0 px-4 py-3 flex flex-wrap gap-2 border-t",
          "border-[var(--color-border)]"
        )}
      >
        <button
          onClick={onReset}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors",
            "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
            "hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          )}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {labels.reset}
        </button>

        <button
          onClick={onExport}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors",
            "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
            "hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          )}
        >
          <Download className="w-3.5 h-3.5" />
          {labels.export}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors",
            "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
            "hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          )}
        >
          <Upload className="w-3.5 h-3.5" />
          {labels.import}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={onImport}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </>
  );
}
