"use client";

import React, { useState, useEffect } from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { SkillBadge } from "../ui/SkillBadge";
import { Certificates } from "./Certificates";
import { useTheme } from "../theme/ThemeProvider";
import type { SkillItem, CertificateItem, TagDefinition } from "@/lib/schema";
import { Languages, Sparkles, Award, Layers } from "lucide-react";
import clsx from "clsx";

interface SkillsProps {
  skills: SkillItem[];
  certificates?: CertificateItem[];
  tagDefinitions?: TagDefinition[];
}

export function Skills({
  skills,
  certificates = [],
  tagDefinitions = [],
}: SkillsProps) {
  const { theme, lang, t } = useTheme();
  const themeA = theme === "a";

  const [activeFilter, setActiveFilter] = useState<"all" | "skills" | "certificates">("all");

  // Tự động chuyển sub-tab nếu người dùng truy cập với hash #certificates
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (
        hash === "#certificates" ||
        hash === "#certificate" ||
        hash === "#certs"
      ) {
        setActiveFilter("certificates");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

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
  const categoriesMap = new Map<
    string,
    { label: { vi: string; en: string }; items: SkillItem[] }
  >();

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

  const subFilterTabs = [
    {
      id: "all",
      label: { vi: "Tất cả năng lực", en: "All Competencies" },
      count: skills.length + certificates.length,
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: "skills",
      label: { vi: "Kỹ năng & Ngôn ngữ", en: "Skills & Languages" },
      count: skills.length,
      icon: <Languages className="w-3.5 h-3.5" />,
    },
    {
      id: "certificates",
      label: { vi: "Chứng chỉ & Văn bằng", en: "Certificates" },
      count: certificates.length,
      icon: <Award className="w-3.5 h-3.5" />,
    },
  ] as const;

  return (
    <SectionWrapper
      id="skills"
      number="04"
      title={{
        vi: "Kỹ năng",
        en: "Skills",
      }}
      subtitle={{
        vi: "Năng lực phương pháp nghiên cứu, ngoại ngữ cổ & hiện đại, công cụ số cùng các chứng chỉ xác thực quốc tế",
        en: "Methodological expertise, ancient & modern languages, digital tools, and accredited certifications",
      }}
    >
      {/* ── Bộ nút chuyển đổi phân mục (Sub-tab Filters) ── */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
        {subFilterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={clsx(
                "inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer",
                isActive
                  ? themeA
                    ? "bg-[#B45309] text-white shadow-sm"
                    : "bg-[#00D4FF] text-black font-mono shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                  : themeA
                    ? "bg-white/70 dark:bg-[#1E1A14]/70 border border-[#E5DECE] dark:border-[#3A3228] text-[#66584B] dark:text-[#9E9382] hover:border-[#B45309]/50 hover:text-[#B45309]"
                    : "bg-white/5 border border-white/10 text-stone-300 hover:border-white/20 hover:text-white"
              )}
            >
              {tab.icon}
              <span>{t(tab.label)}</span>
              <span
                className={clsx(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-mono",
                  isActive
                    ? themeA
                      ? "bg-white/20 text-white"
                      : "bg-black/20 text-black"
                    : themeA
                      ? "bg-[#FAF7F2] dark:bg-[#2A241F] text-[#8C7E72]"
                      : "bg-white/10 text-stone-400"
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ════ PHẦN 1: KỸ NĂNG & NGÔN NGỮ ════ */}
      {(activeFilter === "all" || activeFilter === "skills") && (
        <div className="space-y-12">
          {/* 1.1 Ngôn ngữ sử dụng (Tách riêng nổi bật) */}
          {languageSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Languages
                  className={clsx(
                    "w-5 h-5",
                    themeA ? "text-[#B45309]" : "text-[#00D4FF]"
                  )}
                />
                <h3
                  className={clsx(
                    "text-lg md:text-xl font-bold",
                    themeA
                      ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                      : "font-be-vietnam text-white"
                  )}
                >
                  {lang === "vi"
                    ? "Ngôn ngữ sử dụng & Cổ ngữ"
                    : "Language Proficiencies & Classical Languages"}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 gap-4 3xl:gap-6">
                {languageSkills.map((skill) => (
                  <SkillBadge key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          )}

          {/* 1.2 Nhóm kỹ năng chuyên môn */}
          {categories.map((cat, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-5">
                <Sparkles
                  className={clsx(
                    "w-4 h-4",
                    themeA ? "text-[#B45309]" : "text-[#00D4FF]"
                  )}
                />
                <h3
                  className={clsx(
                    "text-base md:text-lg font-bold tracking-tight",
                    themeA
                      ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                      : "font-be-vietnam text-stone-200"
                  )}
                >
                  {t(cat.label)}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5 gap-4 3xl:gap-6">
                {cat.items.map((skill) => (
                  <SkillBadge key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════ PHẦN 2: CHỨNG CHỈ & VĂN BẰNG (GỘP VÀO ĐÂY) ════ */}
      {(activeFilter === "all" || activeFilter === "certificates") && (
        <div
          className={clsx(
            activeFilter === "all"
              ? "mt-16 pt-12 border-t border-[#E5DECE] dark:border-[#3A3228]"
              : ""
          )}
        >
          {activeFilter === "all" && (
            <div className="flex items-center gap-2 mb-8">
              <Award
                className={clsx(
                  "w-5 h-5",
                  themeA ? "text-[#B45309]" : "text-[#00D4FF]"
                )}
              />
              <h3
                className={clsx(
                  "text-lg md:text-xl font-bold",
                  themeA
                    ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                    : "font-be-vietnam text-white"
                )}
              >
                {lang === "vi"
                  ? "Chứng chỉ & Văn bằng xác thực"
                  : "Accredited Certifications & Credentials"}
              </h3>
            </div>
          )}

          <Certificates
            certificates={certificates}
            tagDefinitions={tagDefinitions}
            hideHeader={true}
          />
        </div>
      )}
    </SectionWrapper>
  );
}
