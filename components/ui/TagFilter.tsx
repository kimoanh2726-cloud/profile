"use client";

import React from "react";
import { useTheme } from "../theme/ThemeProvider";
import type { TagDefinition } from "@/lib/schema";

interface TagFilterProps {
  tags: TagDefinition[];
  selectedTag: string | null;
  onSelectTag: (tagId: string | null) => void;
  className?: string;
}

export function TagFilter({
  tags,
  selectedTag,
  onSelectTag,
  className = "",
}: TagFilterProps) {
  const { theme, lang, t } = useTheme();

  return (
    <div
      className={`flex flex-wrap gap-2 items-center py-2 ${className}`}
      role="group"
      aria-label="Filter by tag"
    >
      <button
        onClick={() => onSelectTag(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          selectedTag === null
            ? theme === "a"
              ? "bg-[#B45309] text-white shadow-sm"
              : "bg-[#00D4FF] text-black font-semibold shadow-[0_0_10px_rgba(0,212,255,0.3)]"
            : theme === "a"
            ? "bg-[#FAF7F2] dark:bg-[#25201B] text-[#66584B] dark:text-[#9E9382] border border-[#E5DECE] dark:border-[#3A3228] hover:bg-[#F0E9DC] dark:hover:bg-[#2F2922]"
            : "bg-white/5 text-stone-300 border border-white/10 hover:bg-white/10"
        }`}
      >
        {lang === "vi" ? "Tất cả" : "All"}
      </button>

      {tags.map((tag) => {
        const isSelected = selectedTag === tag.id;
        return (
          <button
            key={tag.id}
            onClick={() => onSelectTag(isSelected ? null : tag.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isSelected
                ? theme === "a"
                  ? "bg-[#B45309] text-white shadow-sm"
                  : "bg-[#00D4FF] text-black font-semibold shadow-[0_0_10px_rgba(0,212,255,0.3)]"
                : theme === "a"
                ? "bg-[#FAF7F2] dark:bg-[#25201B] text-[#66584B] dark:text-[#9E9382] border border-[#E5DECE] dark:border-[#3A3228] hover:bg-[#F0E9DC] dark:hover:bg-[#2F2922]"
                : "bg-white/5 text-stone-300 border border-white/10 hover:bg-white/10"
            }`}
          >
            {t(tag.label)}
          </button>
        );
      })}
    </div>
  );
}
