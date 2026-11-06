"use client";

import clsx from "clsx";
import type { SelectOption } from "@/lib/settings/registry";

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
  lang: "vi" | "en";
  theme: "a" | "b";
  label?: string;
}

export function Select({ value, options, onChange, lang, theme, label }: SelectProps) {
  // ≤ 3 options → button group; > 3 → native select
  if (options.length <= 3) {
    return (
      <div
        role="radiogroup"
        aria-label={label}
        className={clsx(
          "inline-flex rounded overflow-hidden border",
          theme === "a"
            ? "border-[var(--color-border)]"
            : "border-[var(--color-border)]"
        )}
      >
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(opt.value)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]",
                isActive
                  ? theme === "a"
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-accent)] text-[var(--color-bg)]"
                  : theme === "a"
                  ? "bg-transparent text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-hover)]"
                  : "bg-transparent text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-hover)]"
              )}
            >
              {lang === "vi" ? opt.labelVi : opt.labelEn}
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown for > 3 options
  return (
    <select
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        "px-3 py-1.5 text-xs rounded border bg-[var(--color-surface)] text-[var(--color-fg)]",
        "border-[var(--color-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        "cursor-pointer"
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {lang === "vi" ? opt.labelVi : opt.labelEn}
        </option>
      ))}
    </select>
  );
}

