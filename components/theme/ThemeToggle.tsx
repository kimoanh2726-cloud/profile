"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, BookOpen, Sparkles, Globe } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, lang, toggleLang, colorMode, toggleColorMode } = useTheme();

  return (
    <div
      className={`inline-flex items-center gap-1.5 p-1 rounded-full border transition-all ${
        theme === "a"
          ? "bg-[#FAF7F2]/90 dark:bg-[#25201B]/90 border-[#E5DECE] dark:border-[#3A3228] shadow-sm"
          : "bg-[#141414]/90 dark:bg-[#141414]/90 border-white/10 shadow-md backdrop-blur-md"
      } ${className}`}
      role="toolbar"
      aria-label="Theme & language controls"
    >
      {/* Theme A / Theme B Toggle */}
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
          theme === "a"
            ? "bg-[#B45309] text-white shadow-sm"
            : "bg-[#00D4FF] text-black font-semibold shadow-[0_0_12px_rgba(0,212,255,0.4)]"
        }`}
        title={
          theme === "a"
            ? "Đang dùng Theme A (Biên tập học thuật). Bấm để chuyển Theme B (Tối giản hiện đại)."
            : "Using Theme B (Modern Minimalist). Click for Theme A (Academic Editorial)."
        }
        aria-label="Chuyển đổi giao diện A / B"
      >
        {theme === "a" ? (
          <>
            <BookOpen className="w-3.5 h-3.5" />
            <span>Theme A</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Theme B</span>
          </>
        )}
      </button>

      {/* Dark / Light Mode Toggle */}
      <button
        onClick={toggleColorMode}
        className={`p-1.5 rounded-full transition-colors ${
          theme === "a"
            ? "text-[#1A1108] dark:text-[#EDE8E1] hover:bg-[#EAE1D3] dark:hover:bg-[#332B22]"
            : "text-[#EDEDED] hover:bg-white/10"
        }`}
        title={
          colorMode === "dark"
            ? lang === "vi"
              ? "Chuyển sang chế độ Sáng"
              : "Switch to Light mode"
            : lang === "vi"
            ? "Chuyển sang chế độ Tối"
            : "Switch to Dark mode"
        }
        aria-label="Chuyển đổi sáng / tối"
      >
        {colorMode === "dark" ? (
          <Sun className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
        )}
      </button>

      {/* Language Toggle */}
      <button
        onClick={toggleLang}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
          theme === "a"
            ? "text-[#1A1108] dark:text-[#EDE8E1] hover:bg-[#EAE1D3] dark:hover:bg-[#332B22]"
            : "text-[#EDEDED] hover:bg-white/10"
        }`}
        title={lang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
        aria-label="Chuyển đổi ngôn ngữ"
      >
        <Globe className="w-3 h-3 opacity-70" />
        <span>{lang}</span>
      </button>
    </div>
  );
}
