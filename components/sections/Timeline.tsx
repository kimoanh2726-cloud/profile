"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "../theme/ThemeProvider";
import type {
  Profile,
  EducationItem,
  ExperienceItem,
  ResearchItem,
  CertificateItem,
  SkillItem,
} from "@/lib/schema";
import { getAssetUrl } from "@/lib/cert-utils";
import {
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  FileText,
  Calendar,
  CheckCircle2,
  Printer,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Globe,
  Github,
  Linkedin,
  Compass,
  Download,
  BookOpen,
  Languages,
  Layers,
  ArrowUpRight,
  UserCheck,
} from "lucide-react";
import clsx from "clsx";

export interface TimelineProps {
  profile?: Profile;
  education: EducationItem[];
  experience: ExperienceItem[];
  research?: ResearchItem[];
  certificates?: CertificateItem[];
  skills?: SkillItem[];
  onNavigateTab?: (tabId: string) => void;
}

export function Timeline({
  profile,
  education,
  experience,
  research = [],
  certificates = [],
  skills = [],
  onNavigateTab,
}: TimelineProps) {
  const { theme, lang, t } = useTheme();
  const themeA = theme === "a";

  const [activeSection, setActiveSection] = useState<string>("cv-info");

  // Danh sách các mục trong Table of Contents
  const tocItems = [
    { id: "cv-info", label: { vi: "Thông tin cá nhân", en: "Information" }, icon: <UserCheck className="w-3.5 h-3.5" /> },
    { id: "cv-experience", label: { vi: "Kinh nghiệm & Điền dã", en: "Work Experience" }, icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: "cv-projects", label: { vi: "Đề tài & Nghiên cứu", en: "Research & Projects" }, icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "cv-education", label: { vi: "Học vấn", en: "Education" }, icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: "cv-certifications", label: { vi: "Chứng chỉ tiêu biểu", en: "Certifications" }, icon: <Award className="w-3.5 h-3.5" /> },
    { id: "cv-skills", label: { vi: "Kỹ năng chuyên môn", en: "Skills & Methods" }, icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  // ScrollSpy theo dõi mục đang cuộn
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      for (const item of tocItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Lọc chứng chỉ nổi bật nhất (Top 4)
  const featuredCerts = certificates
    .filter((c) => c.featured)
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
    .slice(0, 4);

  // Định dạng tên & chức danh
  const displayName = profile?.name ? t(profile.name) : "Trần Kim Oanh";
  const displayTitle = profile?.title
    ? t(profile.title)
    : lang === "vi"
    ? "Nghiên cứu Tôn giáo & Nhân học Văn hóa"
    : "Religious Studies & Cultural Anthropology";
  const displayLocation = profile?.location
    ? t(profile.location)
    : lang === "vi"
    ? "Hà Nội, Việt Nam"
    : "Hanoi, Vietnam";
  const displayBio = profile?.bio
    ? t(profile.bio)
    : lang === "vi"
    ? "Sinh viên năm 3 chuyên ngành Tôn giáo học, Khoa Nhân học và Tôn giáo, Trường ĐHKHXH&NV Hà Nội (ĐHQGHN). Đam mê nghiên cứu tôn giáo so sánh, nhân học văn hóa và tác động xã hội. Định hướng kết hợp phương pháp nghiên cứu điền dã truyền thống với công nghệ số, GIS và AI phục vụ học thuật và công việc thực tiễn."
    : "Third-year undergraduate majoring in Religious Studies at the Faculty of Anthropology and Religion, VNU-USSH Hanoi. Passionate about comparative religion, cultural anthropology, and societal dynamics. Dedicated to integrating ethnographic fieldwork with modern AI, digital tools, and data analytics for academic and practical excellence.";

  return (
    <section id="timeline" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── Print-only header stylesheet ── */}
      <style jsx global>{`
        @media print {
          nav,
          .no-print,
          .theme-a-noise,
          header,
          footer {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          #timeline {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .cv-print-full {
            grid-column: span 12 / span 12 !important;
            width: 100% !important;
          }
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* ── Tiêu đề đầu mục trang ── */}
      <div className="mb-10 pb-6 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B45309] dark:text-[#D97706]">
                02 // {lang === "vi" ? "HỒ SƠ HỌC THUẬT & CV" : "ACADEMIC CV & PROFILE"}
              </span>
            </div>
            <h1
              className={clsx(
                "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight",
                themeA
                  ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                  : "font-be-vietnam text-white"
              )}
            >
              {lang === "vi" ? "Hồ sơ Năng lực (Curriculum Vitae)" : "Curriculum Vitae (CV)"}
            </h1>
            <p className="mt-2 text-sm text-[#66584B] dark:text-[#9E9382] max-w-2xl leading-relaxed">
              {lang === "vi"
                ? "Tổng hợp quá trình đào tạo, kinh nghiệm khảo sát điền dã, công trình nghiên cứu và văn bằng chứng chỉ quốc tế được chuẩn hóa theo chuẩn CV học thuật."
                : "Comprehensive record of academic education, ethnographic fieldwork, published research, and accredited international certifications formatted as a professional CV."}
            </p>
          </div>

          {/* Nút hành động nhanh trên đầu trang */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm",
                themeA
                  ? "bg-[#B45309] text-white hover:bg-[#92400e]"
                  : "bg-[#00D4FF] text-black hover:bg-[#38bdf8] font-mono shadow-[0_0_15px_rgba(0,212,255,0.3)]"
              )}
              title={lang === "vi" ? "In bản in CV hoặc Lưu file PDF" : "Print CV or Save as PDF"}
            >
              <Printer className="w-4 h-4" />
              <span>{lang === "vi" ? "In / Lưu PDF" : "Print / PDF"}</span>
            </button>

            <a
              href="mailto:kimoanh2726@gmail.com"
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors",
                themeA
                  ? "border-[#E5DECE] dark:border-[#3A3228] bg-white dark:bg-[#1E1A14] text-[#1A1108] dark:text-[#EDE8E1] hover:border-[#B45309]"
                  : "border-white/10 bg-white/5 text-stone-200 hover:border-[#00D4FF]/40 hover:text-white"
              )}
            >
              <Mail className="w-4 h-4 text-[#B45309] dark:text-[#D97706]" />
              <span>{lang === "vi" ? "Liên hệ hợp tác" : "Contact"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── BỐ CỤC 2 CỘT (2-COLUMN LAYOUT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ══════════════════════════════════════════════════════════════════════
            CỘT CHÍNH (LEFT / MAIN CONTENT - 8 COLUMNS)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-12 cv-print-full">
          {/* 1. Header Bio & Introduction */}
          <div className="space-y-4">
            <h2
              className={clsx(
                "text-3xl sm:text-4xl font-extrabold tracking-tight",
                themeA
                  ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                  : "font-be-vietnam text-white"
              )}
            >
              {displayName}
            </h2>

            <p className="text-base sm:text-lg font-medium text-[#B45309] dark:text-[#D97706]">
              {displayTitle}
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-[#66584B] dark:text-[#9E9382] border-l-2 border-[#B45309]/50 pl-4 py-1 italic">
              {displayBio}
            </p>
          </div>

          {/* 2. Section: THÔNG TIN CÁ NHÂN (INFORMATION) */}
          <div id="cv-info" className="scroll-mt-24 break-inside-avoid">
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60">
              <UserCheck className="w-5 h-5 text-[#B45309] dark:text-[#D97706]" />
              <h3
                className={clsx(
                  "text-xl font-bold uppercase tracking-wider",
                  themeA ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                )}
              >
                {lang === "vi" ? "Thông tin cá nhân" : "Information"}
              </h3>
            </div>

            <div
              className={clsx(
                "rounded-2xl p-6 border transition-colors",
                themeA
                  ? "bg-white/70 dark:bg-[#1E1A14]/70 border-[#E5DECE] dark:border-[#3A3228]"
                  : "bg-white/5 border-white/10"
              )}
            >
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-xs font-mono uppercase text-[#8C7E72] dark:text-[#8E8375]">
                    {lang === "vi" ? "Họ và tên" : "Full Name"}
                  </dt>
                  <dd className="mt-1 font-semibold text-[#1A1108] dark:text-[#EDE8E1]">
                    {displayName}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-mono uppercase text-[#8C7E72] dark:text-[#8E8375]">
                    {lang === "vi" ? "Email học thuật" : "Email"}
                  </dt>
                  <dd className="mt-1 font-semibold">
                    <a
                      href="mailto:kimoanh2726@gmail.com"
                      className="text-[#B45309] dark:text-[#D97706] hover:underline"
                    >
                      kimoanh2726@gmail.com
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-mono uppercase text-[#8C7E72] dark:text-[#8E8375]">
                    {lang === "vi" ? "Địa điểm" : "Location"}
                  </dt>
                  <dd className="mt-1 font-semibold text-[#1A1108] dark:text-[#EDE8E1] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>{displayLocation}</span>
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-mono uppercase text-[#8C7E72] dark:text-[#8E8375]">
                    {lang === "vi" ? "Định hướng trọng tâm" : "Focus Area"}
                  </dt>
                  <dd className="mt-1 font-semibold text-[#1A1108] dark:text-[#EDE8E1]">
                    {lang === "vi"
                      ? "Tôn giáo so sánh · Nhân học văn hóa · GIS di sản"
                      : "Comparative Religion · Cultural Anthropology · Heritage GIS"}
                  </dd>
                </div>

                <div className="sm:col-span-2 pt-3 border-t border-dashed border-[#E5DECE] dark:border-[#3A3228]">
                  <dt className="text-xs font-mono uppercase text-[#8C7E72] dark:text-[#8E8375] mb-2">
                    {lang === "vi" ? "Ngôn ngữ sử dụng" : "Languages"}
                  </dt>
                  <dd className="flex flex-wrap gap-2.5">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                        themeA
                          ? "bg-[#FAF7F2] dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] text-[#1A1108] dark:text-[#EDE8E1]"
                          : "bg-white/10 border-white/10 text-stone-200"
                      )}
                    >
                      <span>🇻🇳</span>
                      <strong>{lang === "vi" ? "Tiếng Việt" : "Vietnamese"}</strong>
                      <span className="text-[#8C7E72]">({lang === "vi" ? "Bản ngữ" : "Native"})</span>
                    </span>

                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                        themeA
                          ? "bg-[#FAF7F2] dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] text-[#1A1108] dark:text-[#EDE8E1]"
                          : "bg-white/10 border-white/10 text-stone-200"
                      )}
                    >
                      <span>🇬🇧</span>
                      <strong>{lang === "vi" ? "Tiếng Anh" : "English"}</strong>
                      <span className="text-[#B45309] font-mono font-semibold">IELTS Academic 7.0</span>
                    </span>

                    <span
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                        themeA
                          ? "bg-[#FAF7F2] dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] text-[#1A1108] dark:text-[#EDE8E1]"
                          : "bg-white/10 border-white/10 text-stone-200"
                      )}
                    >
                      <span>🪷</span>
                      <strong>{lang === "vi" ? "Tiếng Pali" : "Pali"}</strong>
                      <span className="text-[#8C7E72]">
                        ({lang === "vi" ? "Đọc kinh điển Theravāda" : "Canonical texts"})
                      </span>
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* 3. Section: KINH NGHIỆM & ĐIỀN DÃ (WORK & FIELDWORK EXPERIENCE) */}
          <div id="cv-experience" className="scroll-mt-24">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#B45309] dark:text-[#D97706]" />
                <h3
                  className={clsx(
                    "text-xl font-bold uppercase tracking-wider",
                    themeA ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                  )}
                >
                  {lang === "vi" ? "Kinh nghiệm & Điền dã" : "Work Experience"}
                </h3>
              </div>
              <span className="text-xs font-mono font-medium text-[#8C7E72]">
                {experience.length} {lang === "vi" ? "dấu mốc" : "milestones"}
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5DECE] dark:before:bg-[#3A3228]">
              {experience.map((exp) => {
                // Tùy chỉnh danh sách Keywords đặc trưng giống thiennguyen.dev
                let keywords: string[] = [];
                if (exp.id.includes("mekong")) {
                  keywords = [
                    "Dân tộc học (Ethnography)",
                    "Khảo sát điền dã",
                    "GIS / QGIS",
                    "Phỏng vấn sâu",
                    "Phật giáo Theravāda",
                    "Cơ sở dữ liệu tín ngưỡng",
                  ];
                } else if (exp.id.includes("ta-religion")) {
                  keywords = [
                    "Giảng dạy Đại cương Tôn giáo",
                    "Soạn bài giảng học thuật",
                    "Thiết kế bài tập điền dã",
                    "Hướng dẫn sinh viên",
                  ];
                } else {
                  keywords = [
                    "Dịch thuật học thuật Anh - Việt",
                    "Phật học",
                    "Hoạt động cộng đồng",
                  ];
                }

                return (
                  <div key={exp.id} className="relative group break-inside-avoid">
                    {/* Node tròn trên đường timeline */}
                    <div
                      className={clsx(
                        "absolute -left-[30px] sm:-left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110",
                        themeA
                          ? "bg-[#FAF7F2] dark:bg-[#1E1A14] border-[#B45309] text-[#B45309]"
                          : "bg-[#141414] border-[#00D4FF] text-[#00D4FF]"
                      )}
                    >
                      <Briefcase className="w-3 h-3" />
                    </div>

                    <div
                      className={clsx(
                        "p-6 rounded-2xl border transition-all duration-200",
                        themeA
                          ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] shadow-sm hover:border-[#B45309]/50"
                          : "bg-white/5 border-white/10 hover:border-[#00D4FF]/30"
                      )}
                    >
                      {/* Tiêu đề tổ chức & ngày tháng */}
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309] dark:text-[#D97706]">
                          {t(exp.organization)}
                        </h4>
                        <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {exp.startDate} — {exp.endDate || (lang === "vi" ? "Hiện tại" : "Present")}
                        </span>
                      </div>

                      {/* Chức danh */}
                      <div className="text-lg font-bold text-[#1A1108] dark:text-[#EDE8E1] mb-2">
                        {t(exp.title)}
                      </div>

                      {/* Mô tả */}
                      {exp.description && (
                        <p className="text-sm text-[#66584B] dark:text-[#9E9382] leading-relaxed mb-3">
                          {t(exp.description)}
                        </p>
                      )}

                      {/* Bullet Highlights */}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-2 mb-4 text-xs sm:text-sm text-[#66584B] dark:text-[#9E9382]">
                          {exp.highlights.map((hl, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#B45309] dark:text-[#D97706] shrink-0 mt-0.5" />
                              <span>{t(hl)}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Dải Keywords dạng Pill badges (đặc trưng thiennguyen.dev) */}
                      <div className="pt-3 border-t border-dashed border-[#E5DECE]/60 dark:border-[#3A3228]/60 flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono text-[#8C7E72] mr-1">Keywords:</span>
                        {keywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className={clsx(
                              "text-[11px] font-mono px-2 py-0.5 rounded-md border",
                              themeA
                                ? "bg-[#FAF7F2] dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] text-[#66584B] dark:text-[#9E9382]"
                                : "bg-white/10 border-white/10 text-stone-300"
                            )}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Section: ĐỀ TÀI & NGHIÊN CỨU (RESEARCH & PERSONAL PROJECTS) */}
          <div id="cv-projects" className="scroll-mt-24">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#B45309] dark:text-[#D97706]" />
                <h3
                  className={clsx(
                    "text-xl font-bold uppercase tracking-wider",
                    themeA ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                  )}
                >
                  {lang === "vi" ? "Đề tài & Nghiên cứu" : "Personal Projects"}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab("research")}
                className="text-xs font-medium text-[#B45309] dark:text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer no-print"
              >
                <span>{lang === "vi" ? "Xem toàn bộ dự án" : "View all projects"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-6">
              {research.map((res) => (
                <div
                  key={res.id}
                  className={clsx(
                    "p-6 rounded-2xl border transition-all duration-200 break-inside-avoid",
                    themeA
                      ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] shadow-sm hover:border-[#B45309]/50"
                      : "bg-white/5 border-white/10 hover:border-[#00D4FF]/30"
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h4 className="text-base sm:text-lg font-bold text-[#1A1108] dark:text-[#EDE8E1]">
                      {t(res.title)}
                    </h4>
                    {res.date && (
                      <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {res.date}
                      </span>
                    )}
                  </div>

                  {res.publication && (
                    <p className="text-xs font-medium text-[#B45309] dark:text-[#D97706] mb-2.5">
                      📖 {t(res.publication)}
                    </p>
                  )}

                  {res.abstract && (
                    <p className="text-sm text-[#66584B] dark:text-[#9E9382] leading-relaxed mb-3">
                      {t(res.abstract)}
                    </p>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-dashed border-[#E5DECE]/60 dark:border-[#3A3228]/60 text-xs">
                    <div className="flex items-center gap-2 text-stone-500 font-mono">
                      <span>{res.authors?.join(", ")}</span>
                    </div>

                    {(res.link || res.documentPath) && (
                      <a
                        href={res.link || getAssetUrl(res.documentPath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#B45309] dark:text-[#D97706] hover:underline cursor-pointer"
                      >
                        <span>{lang === "vi" ? "Mở tài liệu / Bài báo" : "View Publication"}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Section: HỌC VẤN (EDUCATION) */}
          <div id="cv-education" className="scroll-mt-24">
            <div className="flex items-center gap-2 pb-3 mb-6 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60">
              <GraduationCap className="w-5 h-5 text-[#B45309] dark:text-[#D97706]" />
              <h3
                className={clsx(
                  "text-xl font-bold uppercase tracking-wider",
                  themeA ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                )}
              >
                {lang === "vi" ? "Học vấn" : "Education"}
              </h3>
            </div>

            <div className="space-y-6">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className={clsx(
                    "p-6 rounded-2xl border transition-all duration-200 break-inside-avoid",
                    themeA
                      ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] shadow-sm hover:border-[#B45309]/50"
                      : "bg-white/5 border-white/10 hover:border-[#00D4FF]/30"
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B45309] dark:text-[#D97706]">
                      {t(edu.institution)}
                    </h4>
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {edu.startDate} — {edu.endDate || (lang === "vi" ? "Hiện tại" : "Present")}
                    </span>
                  </div>

                  <div className="text-lg font-bold text-[#1A1108] dark:text-[#EDE8E1] mb-2 flex items-center gap-2 flex-wrap">
                    <span>{t(edu.title)}</span>
                    {edu.gpa && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>

                  {edu.description && (
                    <p className="text-sm text-[#66584B] dark:text-[#9E9382] leading-relaxed mb-3">
                      {t(edu.description)}
                    </p>
                  )}

                  {edu.field && (
                    <div className="text-xs text-[#8C7E72] dark:text-[#8E8375] font-mono">
                      📚 {t(edu.field)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 6. Section: CHỨNG CHỈ TIÊU BIỂU (CERTIFICATIONS) */}
          <div id="cv-certifications" className="scroll-mt-24">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#B45309] dark:text-[#D97706]" />
                <h3
                  className={clsx(
                    "text-xl font-bold uppercase tracking-wider",
                    themeA ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                  )}
                >
                  {lang === "vi" ? "Chứng chỉ tiêu biểu" : "Certifications"}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab("skills")}
                className="text-xs font-medium text-[#B45309] dark:text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer no-print"
              >
                <span>
                  {lang === "vi"
                    ? `Xem toàn bộ ${certificates.length} chứng chỉ`
                    : `View all ${certificates.length} certificates`}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredCerts.map((cert) => (
                <div
                  key={cert.id}
                  className={clsx(
                    "p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between break-inside-avoid",
                    themeA
                      ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] shadow-sm hover:border-[#B45309]/50"
                      : "bg-white/5 border-white/10 hover:border-[#00D4FF]/30"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-[#B45309] dark:text-[#D97706]">
                        {cert.date}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium">
                        {lang === "vi" ? "Hợp lệ" : "Valid"}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#1A1108] dark:text-[#EDE8E1] mb-1 leading-snug">
                      {t(cert.title)}
                    </h4>

                    <p className="text-xs text-[#8C7E72] dark:text-[#8E8375] mb-2 font-medium">
                      {t(cert.issuer)}
                    </p>

                    {cert.description && (
                      <p className="text-xs text-[#66584B] dark:text-[#9E9382] line-clamp-2 leading-relaxed mb-3">
                        {t(cert.description)}
                      </p>
                    )}
                  </div>

                  {(cert.verify_url || cert.credentialUrl) && (
                    <div className="pt-3 border-t border-dashed border-[#E5DECE]/60 dark:border-[#3A3228]/60 no-print">
                      <a
                        href={cert.verify_url || cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B45309] dark:text-[#D97706] hover:underline"
                      >
                        <span>{lang === "vi" ? "Xác thực trực tuyến" : "Verify Credential"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7. Section: KỸ NĂNG CHUYÊN MÔN (SKILLS & METHODS) */}
          <div id="cv-skills" className="scroll-mt-24 break-inside-avoid">
            <div className="flex items-center gap-2 pb-3 mb-6 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60">
              <Sparkles className="w-5 h-5 text-[#B45309] dark:text-[#D97706]" />
              <h3
                className={clsx(
                  "text-xl font-bold uppercase tracking-wider",
                  themeA ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
                )}
              >
                {lang === "vi" ? "Kỹ năng chuyên môn" : "Skills & Methods"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((sk) => (
                <div
                  key={sk.id}
                  className={clsx(
                    "p-4 rounded-xl border transition-colors",
                    themeA
                      ? "bg-white/70 dark:bg-[#1E1A14]/70 border-[#E5DECE] dark:border-[#3A3228]"
                      : "bg-white/5 border-white/10"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-[#1A1108] dark:text-[#EDE8E1]">
                      {t(sk.name)}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[#B45309] dark:text-[#D97706] font-semibold">
                      {sk.level}
                    </span>
                  </div>

                  <p className="text-xs text-[#8C7E72] dark:text-[#8E8375] mb-2">
                    {t(sk.category)}
                  </p>

                  {sk.description && (
                    <p className="text-xs text-[#66584B] dark:text-[#9E9382] leading-relaxed">
                      {t(sk.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            CỘT PHỤ (RIGHT / STICKY SIDEBAR - 4 COLUMNS)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 no-print">
          {/* Profile Card */}
          <div
            className={clsx(
              "rounded-2xl p-6 border text-center transition-all duration-300",
              themeA
                ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] shadow-md shadow-[#B45309]/5"
                : "bg-[#141414] border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
            )}
          >
            {/* Avatar */}
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#B45309] shadow-lg">
              <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-amber-200 flex items-center justify-center text-white font-bold text-2xl font-playfair">
                TKO
              </div>
            </div>

            <h3
              className={clsx(
                "text-xl font-bold tracking-tight mb-1",
                themeA ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
              )}
            >
              {displayName}
            </h3>

            <p className="text-xs font-semibold text-[#B45309] dark:text-[#D97706] mb-2 leading-relaxed">
              {lang === "vi"
                ? "Nghiên cứu Tôn giáo & Nhân học Văn hóa"
                : "Religious Studies & Cultural Anthropology"}
            </p>

            <div className="flex items-center justify-center gap-1.5 text-xs text-[#8C7E72] dark:text-[#8E8375] mb-5">
              <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
              <span>{displayLocation}</span>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handlePrint}
                className={clsx(
                  "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm",
                  themeA
                    ? "bg-[#B45309] text-white hover:bg-[#92400e]"
                    : "bg-[#00D4FF] text-black hover:bg-[#38bdf8] font-mono shadow-[0_0_12px_rgba(0,212,255,0.3)]"
                )}
              >
                <Printer className="w-4 h-4" />
                <span>{lang === "vi" ? "In bản in CV (Print / PDF)" : "Print CV as PDF"}</span>
              </button>

              <a
                href="mailto:kimoanh2726@gmail.com"
                className={clsx(
                  "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors",
                  themeA
                    ? "border-[#E5DECE] dark:border-[#3A3228] bg-[#FAF7F2] dark:bg-[#25201B] text-[#1A1108] dark:text-[#EDE8E1] hover:border-[#B45309]"
                    : "border-white/10 bg-white/5 text-stone-200 hover:border-white/20"
                )}
              >
                <Mail className="w-4 h-4 text-[#B45309]" />
                <span>kimoanh2726@gmail.com</span>
              </a>
            </div>

            {/* Quick social icon row (y hệt thiennguyen.dev) */}
            <div className="flex items-center justify-center gap-3 pt-5 mt-5 border-t border-[#E5DECE]/60 dark:border-[#3A3228]/60 text-[#8C7E72] dark:text-[#8E8375]">
              <a
                href="https://github.com/kimoanh2726-cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:text-[#B45309] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:text-[#B45309] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="https://scholar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:text-[#B45309] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Google Scholar"
              >
                <BookOpen className="w-4 h-4" />
              </a>

              <a
                href="mailto:kimoanh2726@gmail.com"
                className="p-2 rounded-lg hover:text-[#B45309] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>

              <button
                onClick={handlePrint}
                className="p-2 rounded-lg hover:text-[#B45309] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title={lang === "vi" ? "Tải / In CV" : "Download / Print CV"}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table of Contents (Mục lục dính - TOC) */}
          <div
            className={clsx(
              "rounded-2xl p-5 border transition-colors",
              themeA
                ? "bg-white/80 dark:bg-[#1E1A14]/80 border-[#E5DECE] dark:border-[#3A3228]"
                : "bg-[#141414] border-white/10"
            )}
          >
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60">
              <Compass className="w-4 h-4 text-[#B45309] dark:text-[#D97706]" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1108] dark:text-[#EDE8E1]">
                {lang === "vi" ? "Mục lục hồ sơ (TOC)" : "Table of Contents"}
              </h4>
            </div>

            <nav className="space-y-1">
              {tocItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={clsx(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer",
                      isActive
                        ? themeA
                          ? "bg-[#FAF7F2] dark:bg-[#25201B] text-[#B45309] dark:text-[#D97706] font-bold border-l-2 border-[#B45309]"
                          : "bg-white/10 text-[#00D4FF] font-bold border-l-2 border-[#00D4FF]"
                        : "text-[#66584B] dark:text-[#9E9382] hover:bg-stone-50 dark:hover:bg-stone-900 hover:text-[#1A1108] dark:hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={clsx(isActive ? "text-[#B45309] dark:text-[#D97706]" : "opacity-60")}>
                        {item.icon}
                      </span>
                      <span>{t(item.label)}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#B45309] dark:text-[#D97706]" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
