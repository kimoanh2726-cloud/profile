"use client";

import React, { useState } from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { useTheme } from "../theme/ThemeProvider";
import type { ResearchItem } from "@/lib/schema";
import {
  FileText,
  Calendar,
  Users,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  BookOpen,
} from "lucide-react";

const TYPE_LABELS: Record<
  ResearchItem["type"],
  { vi: string; en: string }
> = {
  paper: { vi: "Bài báo khoa học", en: "Journal Article" },
  thesis: { vi: "Khóa luận", en: "Thesis" },
  presentation: { vi: "Báo cáo hội thảo", en: "Conference Presentation" },
  blog: { vi: "Bài viết / Blog", en: "Article / Blog" },
  "book-chapter": { vi: "Chương sách", en: "Book Chapter" },
  report: { vi: "Báo cáo chuyên môn", en: "Research Report" },
};

export function Research({ items }: { items: ResearchItem[] }) {
  const { theme, lang, t } = useTheme();
  const [expandedAbstracts, setExpandedAbstracts] = useState<
    Record<string, boolean>
  >({});

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Sort by date descending
  const sortedItems = [...items].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <SectionWrapper
      id="research"
      number="03"
      title={{ vi: "Dự án", en: "Projects" }}
      subtitle={{
        vi: "Các đề tài nghiên cứu, dự án thực địa và công trình khoa học đã thực hiện",
        en: "Research projects, fieldwork initiatives, and academic publications",
      }}
    >
      <div className="space-y-6">
        {sortedItems.map((item) => {
          const isExpanded = !!expandedAbstracts[item.id];
          const typeLabel = TYPE_LABELS[item.type] || {
            vi: item.type,
            en: item.type,
          };
          const doiUrl = item.doi
            ? item.doi.startsWith("http")
              ? item.doi
              : `https://doi.org/${item.doi}`
            : null;

          return (
            <article
              key={item.id}
              className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
                theme === "a"
                  ? "bg-white dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] hover:border-[#B45309]/40 shadow-sm"
                  : "bg-[#141414] border-white/10 hover:border-[#00D4FF]/40 shadow-sm"
              }`}
            >
              {/* Type Badge & Date */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                    theme === "a"
                      ? "bg-amber-100/70 dark:bg-amber-950/50 text-[#B45309] dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                      : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                  }`}
                >
                  {t(typeLabel)}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-mono opacity-70">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              </div>

              {/* Title */}
              <h3
                className={`text-xl md:text-2xl font-bold mb-3 leading-snug ${
                  theme === "a"
                    ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                    : "font-be-vietnam text-white"
                }`}
              >
                {t(item.title)}
              </h3>

              {/* Authors */}
              {item.authors && item.authors.length > 0 && (
                <div className="flex items-center gap-2 text-xs md:text-sm text-stone-500 dark:text-stone-400 mb-2">
                  <Users className="w-4 h-4 shrink-0 opacity-70" />
                  <span>{item.authors.join(", ")}</span>
                </div>
              )}

              {/* Publication / Venue */}
              {item.publication && (
                <div className="flex items-center gap-2 text-xs md:text-sm font-medium mb-4 text-[#B45309] dark:text-[#D97706]">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{t(item.publication)}</span>
                </div>
              )}

              {/* Abstract Toggle */}
              {item.abstract && (
                <div className="mt-4 pt-4 border-t border-dashed border-stone-200 dark:border-stone-800">
                  <button
                    onClick={() => toggleAbstract(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium opacity-80 hover:opacity-100 transition-opacity mb-2"
                    aria-expanded={isExpanded}
                  >
                    <span>
                      {isExpanded
                        ? lang === "vi"
                          ? "Ẩn tóm tắt"
                          : "Hide Abstract"
                        : lang === "vi"
                        ? "Xem tóm tắt (Abstract)"
                        : "View Abstract"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isExpanded && (
                    <div
                      className={`p-4 rounded-xl text-xs md:text-sm leading-relaxed mt-2 animate-fade-in ${
                        theme === "a"
                          ? "bg-[#FAF7F2] dark:bg-[#1E1915] text-[#66584B] dark:text-[#9E9382]"
                          : "bg-black/40 text-stone-300 border border-white/5"
                      }`}
                    >
                      <p>{t(item.abstract)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Links & Action Row */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 text-xs font-medium">
                {doiUrl && (
                  <a
                    href={doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>DOI: {item.doi}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 hover:underline ${
                      theme === "a"
                        ? "text-[#B45309] dark:text-[#D97706]"
                        : "text-[#00D4FF]"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{lang === "vi" ? "Xem toàn văn" : "Full Text / Link"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
