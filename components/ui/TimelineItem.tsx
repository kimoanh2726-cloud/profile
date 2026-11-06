"use client";

import React from "react";
import { useTheme } from "../theme/ThemeProvider";
import type { EducationItem, ExperienceItem } from "@/lib/schema";
import { GraduationCap, Briefcase, Calendar, CheckCircle } from "lucide-react";

export type UnifiedTimelineItem =
  | ({ itemType: "education" } & EducationItem)
  | ({ itemType: "experience" } & ExperienceItem);

export function TimelineItem({
  item,
  isLast = false,
}: {
  item: UnifiedTimelineItem;
  isLast?: boolean;
}) {
  const { theme, lang, t } = useTheme();

  const isEdu = item.itemType === "education";
  const startDate = item.startDate;
  const endDate =
    item.endDate || (lang === "vi" ? "Hiện tại" : "Present");

  return (
    <div className="relative pl-8 md:pl-10 pb-10 group">
      {/* Vertical connection line */}
      {!isLast && (
        <div
          className={`absolute left-[15px] md:left-[19px] top-8 bottom-0 w-[2px] transition-colors ${
            theme === "a"
              ? "bg-[#E5DECE] dark:bg-[#3A3228] group-hover:bg-[#B45309]/50"
              : "bg-white/10 group-hover:bg-[#00D4FF]/40"
          }`}
        />
      )}

      {/* Node Dot / Icon */}
      <div
        className={`absolute left-0 top-1.5 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
          isEdu
            ? theme === "a"
              ? "bg-[#FAF7F2] dark:bg-[#25201B] border-[#B45309] text-[#B45309]"
              : "bg-[#141414] border-[#00D4FF] text-[#00D4FF] shadow-[0_0_12px_rgba(0,212,255,0.4)]"
            : theme === "a"
            ? "bg-[#FAF7F2] dark:bg-[#25201B] border-[#8C7E72] dark:border-[#9E9382] text-[#8C7E72] dark:text-[#9E9382]"
            : "bg-[#141414] border-stone-500 text-stone-300"
        }`}
      >
        {isEdu ? (
          <GraduationCap className="w-4 h-4" />
        ) : (
          <Briefcase className="w-4 h-4" />
        )}
      </div>

      {/* Content Card */}
      <div
        className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 ${
          theme === "a"
            ? "bg-white dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] hover:border-[#B45309]/40 shadow-sm"
            : "bg-[#141414] border-white/10 hover:border-white/20"
        }`}
      >
        {/* Date badge & type tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium opacity-75">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {startDate} — {endDate}
            </span>
          </div>

          <span
            className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
              isEdu
                ? theme === "a"
                  ? "bg-amber-100 dark:bg-amber-950/50 text-[#B45309] dark:text-amber-400"
                  : "bg-[#00D4FF]/10 text-[#00D4FF]"
                : theme === "a"
                ? "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                : "bg-white/10 text-stone-300"
            }`}
          >
            {isEdu
              ? lang === "vi"
                ? "Học vấn"
                : "Education"
              : lang === "vi"
              ? "Kinh nghiệm"
              : "Experience"}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-lg md:text-xl font-bold mb-1 ${
            theme === "a"
              ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
              : "font-be-vietnam text-white"
          }`}
        >
          {t(item.title)}
        </h3>

        {/* Institution or Organization */}
        <p
          className={`text-sm font-medium mb-3 ${
            theme === "a"
              ? "text-[#B45309] dark:text-[#D97706]"
              : "text-[#00D4FF]"
          }`}
        >
          {isEdu
            ? t((item as EducationItem).institution)
            : t((item as ExperienceItem).organization)}
        </p>

        {/* Degree & Field / GPA for Education */}
        {isEdu && (
          <div className="flex flex-wrap gap-2 text-xs mb-3 text-stone-500 dark:text-stone-400">
            {(item as EducationItem).degree && (
              <span>• {t((item as EducationItem).degree)}</span>
            )}
            {(item as EducationItem).field && (
              <span>• {t((item as EducationItem).field)}</span>
            )}
            {(item as EducationItem).gpa && (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                • GPA: {(item as EducationItem).gpa}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p
            className={`text-sm mb-3 leading-relaxed ${
              theme === "a"
                ? "text-[#66584B] dark:text-[#9E9382]"
                : "text-stone-300"
            }`}
          >
            {t(item.description)}
          </p>
        )}

        {/* Highlights if Experience */}
        {!isEdu && (item as ExperienceItem).highlights && (
          <ul className="space-y-1.5 mt-2 mb-3">
            {(item as ExperienceItem).highlights?.map((hl, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs md:text-sm text-stone-600 dark:text-stone-300"
              >
                <CheckCircle
                  className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    theme === "a" ? "text-[#B45309]" : "text-[#00D4FF]"
                  }`}
                />
                <span>{t(hl)}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
