"use client";

import React from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { SkillBadge } from "../ui/SkillBadge";
import { useTheme } from "../theme/ThemeProvider";
import type { SkillItem } from "@/lib/schema";
import { Languages, Wrench, Sparkles, BookOpen } from "lucide-react";

export function Skills({ skills }: { skills: SkillItem[] }) {
  const { theme, lang, t } = useTheme();

  // Separate Languages from other skills
  const languageSkills = skills.filter(
    (s) =>
      s.category.vi.toLowerCase().includes("ngôn ngữ") ||
      s.category.en.toLowerCase().includes("language") ||
      s.tags.includes("ngon-ngu")
  );

  const otherSkills = skills.filter(
    (s) => !languageSkills.some((l) => l.id === s.id)
  );

  // Group other skills by category
  const categoriesMap = new Map<string, { label: { vi: string; en: string }; items: SkillItem[] }>();

  otherSkills.forEach((skill) => {
    const key = skill.category.vi;
    if (!categoriesMap.has(key)) {
      categoriesMap.set(key, {
        label: skill.category,
        items: [],
      });
    }
    categoriesMap.get(key)!.items.push(skill);
  });

  const categories = Array.from(categoriesMap.values());

  return (
    <SectionWrapper
      id="skills"
      number="05"
      title={{ vi: "Kỹ năng & Ngôn ngữ", en: "Skills & Languages" }}
      subtitle={{
        vi: "Năng lực phương pháp nghiên cứu, ngoại ngữ cổ & hiện đại, công cụ số",
        en: "Methodological expertise, ancient & modern languages, and digital scholarship tools",
      }}
    >
      {/* 1. Languages Section (Tách riêng nổi bật) */}
      {languageSkills.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Languages
              className={`w-5 h-5 ${
                theme === "a" ? "text-[#B45309]" : "text-[#00D4FF]"
              }`}
            />
            <h3
              className={`text-lg md:text-xl font-bold ${
                theme === "a"
                  ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                  : "font-be-vietnam text-white"
              }`}
            >
              {lang === "vi" ? "Ngôn ngữ sử dụng" : "Language Proficiencies"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {languageSkills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      )}

      {/* 2. Other Categories Grouped */}
      <div className="space-y-12">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles
                className={`w-4 h-4 ${
                  theme === "a" ? "text-[#B45309]" : "text-[#00D4FF]"
                }`}
              />
              <h3
                className={`text-base md:text-lg font-bold tracking-tight ${
                  theme === "a"
                    ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                    : "font-be-vietnam text-stone-200"
                }`}
              >
                {t(cat.label)}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((skill) => (
                <SkillBadge key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
