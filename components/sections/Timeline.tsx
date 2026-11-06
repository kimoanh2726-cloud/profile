"use client";

import React, { useState } from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { TimelineItem, UnifiedTimelineItem } from "../ui/TimelineItem";
import { useTheme } from "../theme/ThemeProvider";
import type { EducationItem, ExperienceItem } from "@/lib/schema";

interface TimelineProps {
  education: EducationItem[];
  experience: ExperienceItem[];
}

export function Timeline({ education, experience }: TimelineProps) {
  const { theme, lang } = useTheme();
  const [filter, setFilter] = useState<"all" | "education" | "experience">("all");

  const merged: UnifiedTimelineItem[] = [
    ...education.map((e) => ({ ...e, itemType: "education" as const })),
    ...experience.map((e) => ({ ...e, itemType: "experience" as const })),
  ].sort((a, b) => b.startDate.localeCompare(a.startDate));

  const filteredItems = merged.filter((item) => {
    if (filter === "education") return item.itemType === "education";
    if (filter === "experience") return item.itemType === "experience";
    return true;
  });

  return (
    <SectionWrapper
      id="timeline"
      number="03"
      title={{ vi: "Quá trình & Học vấn", en: "Education & Experience" }}
      subtitle={{
        vi: "Dấu mốc học tập, dự án điền dã và kinh nghiệm thực tiễn",
        en: "Academic milestones, ethnographic fieldwork, and professional experience",
      }}
    >
      {/* Tab Filter */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === "all"
              ? theme === "a"
                ? "bg-[#B45309] text-white"
                : "bg-[#00D4FF] text-black font-semibold shadow-[0_0_12px_rgba(0,212,255,0.3)]"
              : "bg-white/5 text-stone-500 hover:text-stone-300 border border-transparent"
          }`}
        >
          {lang === "vi" ? "Tất cả" : "All"} ({merged.length})
        </button>

        <button
          onClick={() => setFilter("education")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === "education"
              ? theme === "a"
                ? "bg-[#B45309] text-white"
                : "bg-[#00D4FF] text-black font-semibold shadow-[0_0_12px_rgba(0,212,255,0.3)]"
              : "bg-white/5 text-stone-500 hover:text-stone-300 border border-transparent"
          }`}
        >
          {lang === "vi" ? "Học vấn" : "Education"} ({education.length})
        </button>

        <button
          onClick={() => setFilter("experience")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === "experience"
              ? theme === "a"
                ? "bg-[#B45309] text-white"
                : "bg-[#00D4FF] text-black font-semibold shadow-[0_0_12px_rgba(0,212,255,0.3)]"
              : "bg-white/5 text-stone-500 hover:text-stone-300 border border-transparent"
          }`}
        >
          {lang === "vi" ? "Kinh nghiệm" : "Experience"} ({experience.length})
        </button>
      </div>

      {/* Timeline items list */}
      <div className="relative">
        {filteredItems.map((item, index) => (
          <TimelineItem
            key={`${item.itemType}-${item.id}`}
            item={item}
            isLast={index === filteredItems.length - 1}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
