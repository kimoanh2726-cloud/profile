"use client";

import { useRef } from "react";
import clsx from "clsx";

// Preset accent colors (work in both themes)
const PRESET_COLORS = [
  { value: "#c06a3f", label: "Đất nung" },   // terracotta (theme A default)
  { value: "#00bcd4", label: "Cyan" },         // theme B default
  { value: "#6b8c5a", label: "Xanh rêu" },    // sage green
  { value: "#8b5cf6", label: "Tím" },          // violet
  { value: "#e54b4b", label: "Đỏ" },           // red
  { value: "#f59e0b", label: "Vàng" },         // amber
];

interface ColorPickerProps {
  value: string | null;
  onChange: (v: string | null) => void;
  theme: "a" | "b";
  lang: "vi" | "en";
}

export function ColorPicker({ value, onChange, theme, lang }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2.5">
      {/* Preset swatches */}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => {
          const isActive = value === color.value;
          return (
            <button
              key={color.value}
              title={color.label}
              aria-label={color.label}
              aria-pressed={isActive}
              onClick={() => onChange(isActive ? null : color.value)}
              className={clsx(
                "h-7 w-7 rounded-full transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]",
                isActive
                  ? "ring-2 ring-offset-2 ring-[var(--color-fg)] scale-110"
                  : "hover:scale-110"
              )}
              style={{ backgroundColor: color.value }}
            />
          );
        })}

        {/* Custom color button */}
        <button
          title={lang === "vi" ? "Màu tùy chỉnh" : "Custom color"}
          aria-label={lang === "vi" ? "Màu tùy chỉnh" : "Custom color"}
          onClick={() => inputRef.current?.click()}
          className={clsx(
            "h-7 w-7 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-150",
            "border-[var(--color-border)] hover:border-[var(--color-fg-muted)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
            value && !PRESET_COLORS.find((c) => c.value === value)
              ? "ring-2 ring-offset-2 ring-[var(--color-fg)] scale-110"
              : ""
          )}
          style={
            value && !PRESET_COLORS.find((c) => c.value === value)
              ? { backgroundColor: value }
              : {}
          }
        >
          {(!value || PRESET_COLORS.find((c) => c.value === value)) && (
            <span className="text-[10px] text-[var(--color-fg-muted)] font-bold">+</span>
          )}
        </button>

        {/* Hidden color input */}
        <input
          ref={inputRef}
          type="color"
          value={value && !PRESET_COLORS.find((c) => c.value === value) ? value : "#c06a3f"}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Reset button */}
      {value && (
        <button
          onClick={() => onChange(null)}
          className={clsx(
            "self-start text-xs underline underline-offset-2 transition-opacity",
            "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
          )}
        >
          {lang === "vi" ? "Dùng màu mặc định" : "Use default color"}
        </button>
      )}
    </div>
  );
}

