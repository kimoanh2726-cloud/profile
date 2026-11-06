"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
  theme: "a" | "b";
}

export function Toggle({ value, onChange, disabled = false, label, theme }: ToggleProps) {
  const id = useId();

  return (
    <button
      id={id}
      role="switch"
      aria-checked={value}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!value)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          onChange(!value);
        }
      }}
      className={clsx(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled && "opacity-40 cursor-not-allowed",
        value
          ? theme === "a"
            ? "bg-[var(--color-accent)] border-[var(--color-accent)] focus-visible:ring-[var(--color-accent)]"
            : "bg-[var(--color-accent)] border-[var(--color-accent)] focus-visible:ring-[var(--color-accent)]"
          : theme === "a"
          ? "bg-transparent border-[var(--color-border)] focus-visible:ring-[var(--color-accent)]"
          : "bg-transparent border-[var(--color-border)] focus-visible:ring-[var(--color-accent)]"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={clsx(
          "pointer-events-none inline-block h-4 w-4 rounded-full shadow-sm",
          value
            ? "translate-x-5 bg-white"
            : "translate-x-0.5 bg-[var(--color-fg-muted)]"
        )}
        style={{ translateX: value ? "1.1rem" : "0.125rem" }}
      />
    </button>
  );
}

