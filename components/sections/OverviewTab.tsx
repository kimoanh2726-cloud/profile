"use client";

import React from "react";
import { Hero } from "./Hero";
import { useTheme } from "../theme/ThemeProvider";
import type { Profile, EducationItem, ExperienceItem, ResearchItem, CertificateItem } from "@/lib/schema";
import {
  GraduationCap,
  BookOpen,
  Award,
  ArrowRight,
  MapPin,
  Mail,
  FolderOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

interface OverviewTabProps {
  profile: Profile;
  education: EducationItem[];
  experience: ExperienceItem[];
  research: ResearchItem[];
  certificates: CertificateItem[];
  onSelectTab: (tab: string) => void;
}

export function OverviewTab({
  profile,
  education,
  experience,
  research,
  certificates,
  onSelectTab,
}: OverviewTabProps) {
  const { theme, lang, t } = useTheme();
  const themeA = theme === "a";

  const publicCertCount = certificates.filter((c) => c.visibility === "public").length;

  return (
    <div className="flex flex-col">
      {/* ── CUỘN 1: HERO & ĐIỀU HƯỚNG NHANH ── */}
      <Hero profile={profile} onSelectTab={onSelectTab} />

      {/* ── CUỘN 2: ĐIỂM NỔI BẬT & TÓM TẮT HỒ SƠ NĂNG LỰC (HIGHLIGHTS) ── */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 3xl:px-12 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60">
        <div className="max-w-6xl mx-auto">
          {/* Section Subheading */}
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles
                  className={clsx(
                    "w-4 h-4",
                    themeA ? "text-[#B45309] dark:text-[#D97706]" : "text-[#00D4FF]"
                  )}
                />
                <span
                  className={clsx(
                    "text-xs uppercase tracking-widest font-mono font-semibold",
                    themeA ? "text-[#B45309] dark:text-[#D97706]" : "text-[#00D4FF]"
                  )}
                >
                  {lang === "vi" ? "Tiêu điểm hồ sơ" : "Spotlight"}
                </span>
              </div>
              <h2
                className={clsx(
                  "text-2xl sm:text-3xl font-bold tracking-tight",
                  themeA
                    ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                    : "font-be-vietnam text-white"
                )}
              >
                {lang === "vi" ? "Năng lực & Trọng tâm học thuật" : "Competencies & Academic Focus"}
              </h2>
            </div>
          </div>

          {/* 3 Thẻ tóm tắt trọng tâm */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Cột 1: Học vấn & Thực địa */}
            <div
              className={clsx(
                "p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300",
                themeA
                  ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] shadow-sm hover:shadow-md"
                  : "bg-white/[0.03] backdrop-blur-md border-white/10 hover:border-[#00D4FF]/30"
              )}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      themeA
                        ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706]"
                        : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                    )}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className={clsx(
                        "font-bold text-base",
                        themeA ? "text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                      )}
                    >
                      {lang === "vi" ? "Học vấn & Điền dã" : "Education & Fieldwork"}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      VNU-USSH Hà Nội
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === "vi"
                        ? "Sinh viên năm 3 chuyên ngành Tôn giáo học, Khoa Nhân học và Tôn giáo (GPA: 3.6/4.0)"
                        : "Third-year Religious Studies student, Faculty of Anthropology & Religion (GPA: 3.6/4.0)"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === "vi"
                        ? "Trưởng nhóm điền dã khảo sát Phật giáo Theravāda tại 12 chùa Khmer"
                        : "Fieldwork Team Lead surveying Theravāda practices across 12 Khmer temples"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === "vi"
                        ? "Trợ giảng môn Đại cương Tôn giáo học"
                        : "Teaching Assistant for Introduction to Religious Studies"}
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectTab("timeline")}
                className={clsx(
                  "inline-flex items-center gap-1.5 text-xs font-semibold pt-3 border-t transition-colors",
                  themeA
                    ? "border-neutral-100 dark:border-neutral-800 text-[#B45309] dark:text-[#D97706] hover:text-[#92400e]"
                    : "border-white/5 text-[#00D4FF] hover:text-white"
                )}
              >
                <span>{lang === "vi" ? "Xem chi tiết quá trình" : "View Full Timeline"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cột 2: Nghiên cứu khoa học */}
            <div
              className={clsx(
                "p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300",
                themeA
                  ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] shadow-sm hover:shadow-md"
                  : "bg-white/[0.03] backdrop-blur-md border-white/10 hover:border-[#00D4FF]/30"
              )}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      themeA
                        ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706]"
                        : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                    )}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className={clsx(
                        "font-bold text-base",
                        themeA ? "text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                      )}
                    >
                      {lang === "vi" ? "Dự án & Đề tài" : "Projects & Research"}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {research.length} {lang === "vi" ? "dự án tiêu biểu" : "featured projects"}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === "vi"
                        ? "Dự án NCKH: Giao thoa giữa Phật giáo Theravāda và tín ngưỡng dân gian Khmer"
                        : "Research Project: Syncretism between Theravāda Buddhism & Khmer folk rituals"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === "vi"
                        ? "Số hóa di sản: Ứng dụng bản đồ GIS phân tích phân bố không gian 120+ cơ sở tín ngưỡng"
                        : "Heritage Digitization: GIS spatial mapping of 120+ religious sites"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === "vi"
                        ? "Báo cáo tại Hội thảo Sinh viên Nghiên cứu Khoa học 2026"
                        : "Presented at 2026 Student Scientific Research Conference"}
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectTab("research")}
                className={clsx(
                  "inline-flex items-center gap-1.5 text-xs font-semibold pt-3 border-t transition-colors",
                  themeA
                    ? "border-neutral-100 dark:border-neutral-800 text-[#B45309] dark:text-[#D97706] hover:text-[#92400e]"
                    : "border-white/5 text-[#00D4FF] hover:text-white"
                )}
              >
                <span>{lang === "vi" ? "Xem chi tiết các dự án" : "Explore All Projects"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cột 3: Văn bằng & Chứng chỉ */}
            <div
              className={clsx(
                "p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300",
                themeA
                  ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] shadow-sm hover:shadow-md"
                  : "bg-white/[0.03] backdrop-blur-md border-white/10 hover:border-[#00D4FF]/30"
              )}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      themeA
                        ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706]"
                        : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                    )}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className={clsx(
                        "font-bold text-base",
                        themeA ? "text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                      )}
                    >
                      {lang === "vi" ? "Kỹ năng & Chứng chỉ" : "Skills & Certificates"}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {publicCertCount} {lang === "vi" ? "chứng chỉ & kỹ năng xác thực" : "verified credentials & skills"}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === "vi"
                        ? "32 Chứng chỉ quốc tế HP Foundation (HP LIFE): AI, Dữ liệu, Quản trị Agile, An ninh mạng, Khởi nghiệp..."
                        : "32 HP Foundation (HP LIFE) Global Certificates: AI, Analytics, Agile, Cybersecurity..."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === "vi"
                        ? "IELTS Academic 7.0 (British Council)"
                        : "IELTS Academic 7.0 (British Council)"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === "vi"
                        ? "GIS, Mapping, and Spatial Analysis (University of Toronto/Coursera)"
                        : "GIS & Spatial Analysis (University of Toronto/Coursera)"}
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onSelectTab("skills")}
                className={clsx(
                  "inline-flex items-center gap-1.5 text-xs font-semibold pt-3 border-t transition-colors cursor-pointer",
                  themeA
                    ? "border-neutral-100 dark:border-neutral-800 text-[#B45309] dark:text-[#D97706] hover:text-[#92400e]"
                    : "border-white/5 text-[#00D4FF] hover:text-white"
                )}
              >
                <span>{lang === "vi" ? "Xem chi tiết Kỹ năng & Chứng chỉ" : "Explore Skills & Certifications"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Contact & Google Drive Repository Strip */}
          <div
            className={clsx(
              "p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all",
              themeA
                ? "bg-[#FAF7F2] dark:bg-[#201B17] border-[#E5DECE] dark:border-[#3A3228]"
                : "bg-white/[0.02] border-white/10"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  themeA
                    ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706]"
                    : "bg-[#00D4FF]/10 text-[#00D4FF]"
                )}
              >
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <p
                  className={clsx(
                    "text-sm font-semibold",
                    themeA ? "text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                  )}
                >
                  {lang === "vi"
                    ? "Kho tài liệu và văn bằng gốc đã đồng bộ trên Google Drive"
                    : "All verified credentials and PDF scans are backed up on Google Drive"}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {lang === "vi"
                    ? "Truy cập nhanh kho bản scan PDF chất lượng cao mọi lúc mọi nơi"
                    : "Direct cloud access to high-resolution original PDF scans"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://drive.google.com/drive/folders/1eiHNJXMydGjJnk1iSkGMNmXcTDM499Tu"
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5",
                  themeA
                    ? "bg-[#B45309] hover:bg-[#92400e] text-white shadow-sm"
                    : "bg-[#00D4FF] hover:bg-[#38e1ff] text-black font-semibold shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                )}
              >
                <span>{lang === "vi" ? "Mở Google Drive" : "Open Drive"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => onSelectTab("contact")}
                className={clsx(
                  "px-4 py-2 rounded-xl text-xs font-medium border transition-all inline-flex items-center gap-1.5",
                  themeA
                    ? "border-[#E5DECE] dark:border-[#3A3228] bg-white dark:bg-[#1E1A14] text-[#1A1108] dark:text-[#EDE8E1] hover:border-[#B45309]"
                    : "border-white/10 bg-white/5 text-stone-200 hover:border-[#00D4FF]/40 hover:text-[#00D4FF]"
                )}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{lang === "vi" ? "Liên hệ" : "Contact"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
