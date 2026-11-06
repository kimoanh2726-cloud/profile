"use client";

import React from "react";
import { useTheme } from "../theme/ThemeProvider";
import type { SkillItem } from "@/lib/schema";

const LEVEL_MAP: Record<
  "beginner" | "intermediate" | "advanced" | "expert",
  { percent: number; vi: string; en: string }
> = {
  beginner: { percent: 25, vi: "Sơ cấp", en: "Beginner" },
  intermediate: { percent: 50, vi: "Trung cấp", en: "Intermediate" },
  advanced: { percent: 75, vi: "Nâng cao", en: "Advanced" },
  expert: { percent: 100, vi: "Thành thạo", en: "Expert" },
};

export function SkillBadge({ skill }: { skill: SkillItem }) {
  const { theme, lang, t } = useTheme();
  const levelInfo = skill.level ? LEVEL_MAP[skill.level] : null;

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        theme === "a"
          ? "bg-white dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] hover:border-[#B45309]/50 shadow-sm"
          : "bg-[#141414] border-white/10 hover:border-[#00D4FF]/40"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`font-semibold text-sm ${
            theme === "a"
              ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
              : "font-be-vietnam text-white"
          }`}
        >
          {t(skill.name)}
        </span>

        {levelInfo && (
          <span className="text-xs font-mono opacity-70">
            {lang === "vi" ? levelInfo.vi : levelInfo.en}
          </span>
        )}
      </div>

      {levelInfo && (
        <div className="w-full h-1.5 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              theme === "a"
                ? "bg-[#B45309] dark:bg-[#D97706]"
                : "bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"
            }`}
            style={{ width: `${levelInfo.percent}%` }}
          />
        </div>
      )}

      {skill.description && (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
          {t(skill.description)}
        </p>
      )}
    </div>
  );
}
