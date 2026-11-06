"use client";

import React from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { useTheme } from "../theme/ThemeProvider";
import type { Profile } from "@/lib/schema";
import { MapPin, Mail, BookOpen, Compass, Sparkles } from "lucide-react";

export function About({ profile }: { profile: Profile }) {
  const { theme, lang, t } = useTheme();

  return (
    <SectionWrapper
      id="about"
      number="01"
      title={{ vi: "Về tôi", en: "About Me" }}
      subtitle={{
        vi: "Hành trình nghiên cứu tôn giáo và văn hóa Nam Bộ",
        en: "Research journey in religious studies and Southern Vietnamese culture",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Full Bio text */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className={`p-6 md:p-8 rounded-2xl border leading-relaxed text-sm md:text-base ${
              theme === "a"
                ? "bg-white dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] text-[#1A1108] dark:text-[#EDE8E1] shadow-sm"
                : "bg-[#141414] border-white/10 text-stone-200"
            }`}
          >
            <p className="whitespace-pre-line">{t(profile.bio)}</p>
          </div>
        </div>

        {/* Metadata Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Location & Contact info */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              theme === "a"
                ? "bg-white dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] shadow-sm"
                : "bg-[#141414] border-white/10"
            }`}
          >
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${
                theme === "a"
                  ? "text-[#B45309] dark:text-[#D97706]"
                  : "text-[#00D4FF]"
              }`}
            >
              {lang === "vi" ? "Thông tin liên lạc" : "Contact Information"}
            </h3>

            {profile.location && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-stone-400 shrink-0" />
                <div>
                  <span className="block text-xs text-stone-400">
                    {lang === "vi" ? "Địa điểm" : "Location"}
                  </span>
                  <span className="font-medium">{t(profile.location)}</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 text-sm">
              <Mail className="w-4 h-4 mt-0.5 text-stone-400 shrink-0" />
              <div>
                <span className="block text-xs text-stone-400">Email</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="font-medium hover:underline text-stone-800 dark:text-stone-200"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </div>

          {/* Research Focus Card */}
          <div
            className={`p-6 rounded-2xl border ${
              theme === "a"
                ? "bg-[#FAF7F2] dark:bg-[#201B17] border-[#E5DECE] dark:border-[#3A3228]"
                : "bg-[#0E0E0E] border-white/10"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Compass
                className={`w-4 h-4 ${
                  theme === "a" ? "text-[#B45309]" : "text-[#00D4FF]"
                }`}
              />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {lang === "vi" ? "Trọng tâm học thuật" : "Academic Focus"}
              </h4>
            </div>

            <ul className="space-y-2 text-xs md:text-sm text-stone-600 dark:text-stone-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                <span>
                  {lang === "vi"
                    ? "Tôn giáo học so sánh"
                    : "Comparative Religious Studies"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                <span>
                  {lang === "vi"
                    ? "Phật giáo Theravāda Nam Bộ"
                    : "Theravāda Buddhism in Southern Vietnam"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                <span>
                  {lang === "vi"
                    ? "Phương pháp điền dã dân tộc học"
                    : "Ethnographic Fieldwork Methodology"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
