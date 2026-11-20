"use client";

import React, { useState, useEffect } from "react";
import type {
  Profile,
  EducationItem,
  ExperienceItem,
  ResearchItem,
  CertificateItem,
  SkillItem,
} from "@/lib/schema";
import {
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Info,
  MapPin,
  ChevronUp,
  ChevronDown,
  Bookmark,
  ExternalLink,
  Github,
  Linkedin,
  Phone,
  Mail,
  Download,
  Share2,
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
  const [activeSection, setActiveSection] = useState<string>("Information");

  // Accordion state cho từng cơ quan / công ty trong Work Experience (y hệt thiennguyen.dev)
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>({
    vass: true, // Mặc định mở mục đầu tiên
    ussh: false,
    giacngo: false,
    heritage: false,
  });

  const toggleCompany = (id: string) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Các mục trong Table of Contents (y hệt thiennguyen.dev/cv/)
  const tocItems = [
    { id: "Information", label: "Information" },
    { id: "Work-Experience", label: "Work Experience" },
    { id: "Personal-Projects", label: "Personal Projects" },
    { id: "Education", label: "Education" },
    { id: "Certifications", label: "Certifications" },
  ];

  // ScrollSpy theo dõi mục đang cuộn
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
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
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0e1225] text-[#c0c0c0] font-sans -mt-20 pt-24 pb-20 px-3 sm:px-6 lg:px-8 selection:bg-[#ef476f]/30 selection:text-white">
      {/* ── Print Stylesheet chuyên dụng ── */}
      <style jsx global>{`
        @media print {
          nav,
          header,
          footer,
          .no-print,
          #toc,
          .widget-profile {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .custom-page-cv {
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            width: 100% !important;
          }
          .custom-page-cv h1,
          .custom-page-cv h3,
          .custom-page-cv h4,
          .custom-page-cv strong,
          .custom-page-cv a {
            color: #000000 !important;
          }
          .custom-page-cv .timeline {
            border-left-color: #cccccc !important;
          }
          .company-details {
            display: block !important;
          }
        }
      `}</style>

      {/* ── BỐ CỤC 2 CỘT CHÍNH (IS-2-COLUMN LAYOUT) ── */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ══════════════════════════════════════════════════════════════════════
              CỘT CHÍNH (MAIN COLUMN - 8 COLUMNS: CARD CUSTOM-PAGE-CV)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8">
            <article className="card custom-page-cv bg-[#181c27]/80 backdrop-blur-sm border border-white/5 rounded-md p-6 sm:p-9 shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
              {/* Tên & Intro với hiệu ứng gõ chữ (Typed Cursor) */}
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Trần Kim Oanh
              </h1>

              <div className="text-[14px] leading-relaxed text-[#c0c0c0] space-y-3 mb-6">
                <p>
                  Hello, I’m Oanh, a{" "}
                  <strong className="text-white font-semibold">
                    student researcher
                  </strong>
                  <span
                    className="inline-block w-[2px] h-4 ml-0.5 bg-[#ef476f] animate-pulse align-middle"
                    aria-hidden="true"
                  />{" "}
                  based in Hanoi, Vietnam.
                  <br />
                  With a passion for Religious Studies, Cultural Anthropology,
                  and Digital Heritage, I aspire to connect traditional
                  ethnographic fieldwork with modern digital humanities, GIS,
                  and AI.
                </p>
                <p>
                  I thrive in academic research environments and believe in
                  continuous learning. I’m eager to join collaborative teams and
                  interdisciplinary projects where I can learn from scholars,
                  contribute my research skills, and enhance my abilities.
                </p>
              </div>

              {/* ──────────────────────────────────────────────────────────────────
                  1. INFORMATION SECTION (#Information)
              ────────────────────────────────────────────────────────────────── */}
              <h3
                id="Information"
                style={{ scrollMargin: "1em" }}
                className="text-[19px] font-medium text-[#ef476f] flex items-center gap-2 mb-4 mt-8 pt-2 scroll-mt-24 border-t border-white/5"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#209cee] text-white text-xs">
                  <Info className="w-3.5 h-3.5" />
                </span>
                <span>Information</span>
              </h3>

              <div className="ml-2 sm:ml-10 mr-2 sm:mr-8 mb-8 space-y-2.5 text-[14px]">
                {/* Full name */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-center">
                  <div className="sm:col-span-3 text-[#7a7a7a]">Full name</div>
                  <div className="sm:col-span-9 text-white font-medium">
                    Trần Kim Oanh
                  </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-center">
                  <div className="sm:col-span-3 text-[#7a7a7a]">Email</div>
                  <div className="sm:col-span-9">
                    <a
                      href="mailto:kimoanh2726@gmail.com"
                      className="text-[#ef476f] hover:underline"
                    >
                      kimoanh2726@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-center">
                  <div className="sm:col-span-3 text-[#7a7a7a]">Phone</div>
                  <div className="sm:col-span-9 text-[#c0c0c0]">
                    (+84) 912 345 678 (Academic contact)
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-center">
                  <div className="sm:col-span-3 text-[#7a7a7a]">Location</div>
                  <div className="sm:col-span-9 text-[#c0c0c0]">
                    Hanoi, Vietnam
                  </div>
                </div>

                {/* Languages */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-start pt-1">
                  <div className="sm:col-span-3 text-[#7a7a7a]">Languages</div>
                  <div className="sm:col-span-9">
                    <div className="flex flex-wrap gap-2">
                      {/* Vietnamese */}
                      <div className="inline-flex items-center rounded bg-[#373d48] text-[#c0c0c0] text-xs overflow-hidden border border-white/5">
                        <span className="px-2 py-1 bg-black/20 text-sm">🇻🇳</span>
                        <span
                          className="px-2.5 py-1 font-medium"
                          title="Native proficiency"
                        >
                          Vietnamese
                        </span>
                      </div>

                      {/* English */}
                      <div className="inline-flex items-center rounded bg-[#373d48] text-[#c0c0c0] text-xs overflow-hidden border border-white/5">
                        <span className="px-2 py-1 bg-black/20 text-sm">🇬🇧</span>
                        <span
                          className="px-2.5 py-1 font-medium"
                          title="Professional working proficiency — IELTS Academic 7.0"
                        >
                          English (IELTS 7.0)
                        </span>
                      </div>

                      {/* Pali */}
                      <div className="inline-flex items-center rounded bg-[#373d48] text-[#c0c0c0] text-xs overflow-hidden border border-white/5">
                        <span className="px-2 py-1 bg-black/20 text-sm">🪷</span>
                        <span
                          className="px-2.5 py-1 font-medium"
                          title="Elementary canonical scriptural reading"
                        >
                          Pali (Canonical texts)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────────────
                  2. WORK EXPERIENCE SECTION (#Work-Experience)
              ────────────────────────────────────────────────────────────────── */}
              <h3
                id="Work-Experience"
                style={{ scrollMargin: "1em" }}
                className="text-[19px] font-medium text-[#ef476f] flex items-center gap-2 mb-4 mt-8 pt-2 scroll-mt-24 border-t border-white/5"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#ef476f] text-white text-xs">
                  <Briefcase className="w-3.5 h-3.5" />
                </span>
                <span>Work Experience</span>
              </h3>

              <div className="timeline border-l border-[#434a56] ml-2 sm:ml-4 pl-4 sm:pl-5 space-y-7 mb-8">
                {/* ── Company 1: Viện Nghiên cứu Tôn giáo (VASS) ── */}
                <article className="flex items-start gap-4">
                  {/* Logo 64x64 */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm">
                    <svg
                      viewBox="0 0 48 48"
                      className="w-10 h-10 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M24 6L6 16v4h36v-4L24 6z"
                        fill="currentColor"
                        fillOpacity="0.2"
                      />
                      <path d="M10 20v18M18 20v18M26 20v18M34 20v18M38 20v18" />
                      <path d="M6 38h36v4H6v-4z" />
                    </svg>
                  </div>

                  {/* Body */}
                  <div className="w-full">
                    <div
                      className="cursor-pointer select-none group"
                      onClick={() => toggleCompany("vass")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[15px] font-bold uppercase text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                          <span>Viện Nghiên cứu Tôn giáo — VASS</span>
                          <a
                            href="https://vass.gov.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-stone-500 hover:text-white"
                            title="Visit website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium whitespace-nowrap">
                            Jan 2026 - Present
                          </span>
                          <span className="text-stone-400 group-hover:text-white transition-colors">
                            {expandedCompanies.vass ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-0.5 text-[13px] text-stone-300">
                        <span className="font-semibold text-white">
                          Trưởng nhóm điền dã
                        </span>
                        <p className="text-stone-400 text-xs">
                          Product: Khảo sát thực hành Phật giáo Theravāda tại Trà
                          Vinh & Sóc Trăng
                        </p>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {expandedCompanies.vass && (
                      <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-[#c0c0c0]">
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Dẫn đầu nhóm 5 sinh viên khảo sát thực hành Phật giáo
                            Theravāda tại 12 ngôi chùa Khmer tiêu biểu ở tỉnh Trà
                            Vinh và Sóc Trăng.
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Thu thập 40+ giờ phỏng vấn sâu với các vị sư sãi
                            (Bhikkhu), Achar và cư sĩ Khmer về biến đổi nghi lễ.
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Xây dựng cơ sở dữ liệu GIS định vị không gian 120+
                            ngôi chùa và cơ sở tín ngưỡng Khmer Nam Bộ.
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Biên soạn báo cáo thực địa phân tích mối quan hệ giữa
                            tín ngưỡng bản địa và sự thích ứng của Phật giáo.
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Keywords pills */}
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-stone-400 mr-1">
                        Keywords
                      </span>
                      {[
                        "Dân tộc học (Ethnography)",
                        "Khảo sát điền dã",
                        "GIS / QGIS",
                        "Phỏng vấn sâu",
                        "Phật giáo Theravāda",
                        "Cơ sở dữ liệu tín ngưỡng",
                      ].map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] border border-white/5"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>

                {/* ── Company 2: Khoa Nhân học và Tôn giáo (VNU-USSH) ── */}
                <article className="flex items-start gap-4">
                  {/* Logo 64x64 */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm">
                    <svg
                      viewBox="0 0 48 48"
                      className="w-10 h-10 text-sky-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M24 8l16 7-16 7-16-7 16-7z"
                        fill="currentColor"
                        fillOpacity="0.2"
                      />
                      <path d="M12 20v12c0 6 12 8 12 8s12-2 12-8V20" />
                      <circle cx="24" cy="22" r="3" />
                    </svg>
                  </div>

                  {/* Body */}
                  <div className="w-full">
                    <div
                      className="cursor-pointer select-none group"
                      onClick={() => toggleCompany("ussh")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[15px] font-bold uppercase text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                          <span>Khoa Nhân học và Tôn giáo — VNU-USSH</span>
                          <a
                            href="https://ussh.vnu.edu.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-stone-500 hover:text-white"
                            title="Visit website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium whitespace-nowrap">
                            Sep 2025 - Present
                          </span>
                          <span className="text-stone-400 group-hover:text-white transition-colors">
                            {expandedCompanies.ussh ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-0.5 text-[13px] text-stone-300">
                        <span className="font-semibold text-white">
                          Trợ giảng môn Đại cương Tôn giáo
                        </span>
                        <p className="text-stone-400 text-xs">
                          Product: Hỗ trợ giảng dạy và thiết kế bài tập điền dã
                          cho sinh viên năm nhất
                        </p>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {expandedCompanies.ussh && (
                      <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-[#c0c0c0]">
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Hỗ trợ giảng viên soạn bài giảng, tổng hợp tài liệu
                            tham khảo quốc tế và chấm bài cho 45 sinh viên năm
                            nhất.
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Thiết kế bài tập thực hành điền dã quan sát tham dự
                            tại các cơ sở tôn giáo tiêu biểu tại Hà Nội.
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Điều phối các buổi thảo luận học thuật nhóm và giải
                            đáp phương pháp nghiên cứu cho sinh viên.
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Keywords pills */}
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-stone-400 mr-1">
                        Keywords
                      </span>
                      {[
                        "Giảng dạy Đại cương Tôn giáo",
                        "Soạn bài giảng học thuật",
                        "Thiết kế bài tập điền dã",
                        "Hướng dẫn sinh viên",
                      ].map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] border border-white/5"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>

                {/* ── Company 3: Chùa Giác Ngộ ── */}
                <article className="flex items-start gap-4">
                  {/* Logo 64x64 */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm">
                    <svg
                      viewBox="0 0 48 48"
                      className="w-10 h-10 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M24 6c-4 8-12 12-12 18 0 6.6 5.4 12 12 12s12-5.4 12-12c0-6-8-10-12-18z" />
                      <circle cx="24" cy="24" r="4" fill="currentColor" />
                    </svg>
                  </div>

                  {/* Body */}
                  <div className="w-full">
                    <div
                      className="cursor-pointer select-none group"
                      onClick={() => toggleCompany("giacngo")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[15px] font-bold uppercase text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                          <span>Chùa Giác Ngộ — Quỹ Đạo Phật Ngày Nay</span>
                          <a
                            href="https://chuagiacngo.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-stone-500 hover:text-white"
                            title="Visit website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium whitespace-nowrap">
                            Mar 2025 - Dec 2025
                          </span>
                          <span className="text-stone-400 group-hover:text-white transition-colors">
                            {expandedCompanies.giacngo ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-0.5 text-[13px] text-stone-300">
                        <span className="font-semibold text-white">
                          Tình nguyện viên dịch thuật & Số hóa tư liệu
                        </span>
                        <p className="text-stone-400 text-xs">
                          Product: Biên dịch tài liệu Phật học và văn hóa cộng đồng
                        </p>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {expandedCompanies.giacngo && (
                      <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-[#c0c0c0]">
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Dịch tài liệu Phật học từ tiếng Anh sang tiếng Việt
                            cho chương trình giáo dục và xuất bản cộng đồng.
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Hỗ trợ công tác tổ chức và tiếp đón học giả tại các
                            hội thảo quốc tế về văn hóa Phật giáo.
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Keywords pills */}
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-stone-400 mr-1">
                        Keywords
                      </span>
                      {[
                        "Dịch thuật học thuật Anh - Việt",
                        "Phật học",
                        "Hoạt động cộng đồng",
                        "Số hóa văn bản",
                      ].map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] border border-white/5"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>

                {/* ── Company 4: Trung tâm Bảo tồn Di sản ── */}
                <article className="flex items-start gap-4">
                  {/* Logo 64x64 */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm">
                    <svg
                      viewBox="0 0 48 48"
                      className="w-10 h-10 text-rose-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="24" cy="24" r="16" />
                      <circle cx="24" cy="24" r="8" fill="currentColor" fillOpacity="0.2" />
                      <path d="M24 8v32M8 24h32" />
                    </svg>
                  </div>

                  {/* Body */}
                  <div className="w-full">
                    <div
                      className="cursor-pointer select-none group"
                      onClick={() => toggleCompany("heritage")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[15px] font-bold uppercase text-white group-hover:text-rose-300 transition-colors">
                          <span className="hover:underline">
                            Dự án Khảo sát Di sản Tín ngưỡng Thăng Long
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium whitespace-nowrap">
                            Jun 2024 - Oct 2024
                          </span>
                          <span className="text-stone-400 group-hover:text-white transition-colors">
                            {expandedCompanies.heritage ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-0.5 text-[13px] text-stone-300">
                        <span className="font-semibold text-white">
                          Cộng tác viên điền dã
                        </span>
                        <p className="text-stone-400 text-xs">
                          Product: Khảo sát hệ thống đền phủ và tín ngưỡng Tứ phủ Hà Nội
                        </p>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {expandedCompanies.heritage && (
                      <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-[#c0c0c0]">
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Khảo sát và ghi chép thực địa tại 15 đền phủ tín ngưỡng
                            thờ Mẫu tại khu vực nội thành Hà Nội.
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                          <span>
                            Phân loại tư liệu diễn xướng và phỏng vấn nghệ nhân
                            phục vụ nghiên cứu văn hóa dân gian.
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Keywords pills */}
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-stone-400 mr-1">
                        Keywords
                      </span>
                      {[
                        "Tín ngưỡng Tứ phủ",
                        "Di sản phi vật thể",
                        "Khảo sát thực địa",
                        "Lưu trữ tư liệu",
                      ].map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] border border-white/5"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>

              {/* ──────────────────────────────────────────────────────────────────
                  3. PERSONAL PROJECTS SECTION (#Personal-Projects)
              ────────────────────────────────────────────────────────────────── */}
              <h3
                id="Personal-Projects"
                style={{ scrollMargin: "1em" }}
                className="text-[19px] font-medium text-[#ef476f] flex items-center gap-2 mb-4 mt-8 pt-2 scroll-mt-24 border-t border-white/5"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#48c774] text-white text-xs">
                  <Star className="w-3.5 h-3.5" />
                </span>
                <span>Personal Projects</span>
              </h3>

              <div className="timeline border-l border-[#434a56] ml-2 sm:ml-4 pl-4 sm:pl-5 space-y-7 mb-8">
                {/* ── Project 1: Atlas Khmer Heritage ── */}
                <article className="flex items-start gap-4">
                  {/* Icon 64x64 */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm text-emerald-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                  </div>

                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[15px] font-bold text-white hover:text-emerald-300 transition-colors">
                        <a
                          href="https://github.com/kimoanh2726-cloud"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Atlas Bản đồ Di sản Phật giáo Khmer Nam Bộ
                        </a>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium whitespace-nowrap">
                        MAY 2026
                      </span>
                    </div>

                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#c0c0c0]">
                      Dự án bản đồ số tương tác xây dựng trên nền tảng QGIS &
                      WebGIS, lưu trữ và định vị không gian 120+ ngôi chùa Khmer
                      tại khu vực Tây Nam Bộ.
                    </p>
                  </div>
                </article>

                {/* ── Project 2: Hán Nôm Digital Archive ── */}
                <article className="flex items-start gap-4">
                  {/* Icon 64x64 */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm text-purple-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>

                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[15px] font-bold text-white hover:text-purple-300 transition-colors">
                        <a
                          href="https://github.com/kimoanh2726-cloud"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Hệ thống Số hóa & Tra cứu Tư liệu Hán Nôm Tôn giáo
                        </a>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium whitespace-nowrap">
                        DEC 2025
                      </span>
                    </div>

                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#c0c0c0]">
                      Công cụ hỗ trợ phiên âm, chú giải và lập chỉ mục văn bản Hán
                      Nôm trong các di tích tín ngưỡng dân gian vùng châu thổ sông
                      Hồng.
                    </p>
                  </div>
                </article>

                {/* ── Project 3: Youth Spirituality Survey ── */}
                <article className="flex items-start gap-4">
                  {/* Icon 64x64 */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm text-cyan-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>

                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[15px] font-bold text-white hover:text-cyan-300 transition-colors">
                        <a
                          href="https://github.com/kimoanh2726-cloud"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Khảo sát Biến đổi Tín ngưỡng trong Giới trẻ Đô thị
                        </a>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium whitespace-nowrap">
                        JUN 2025
                      </span>
                    </div>

                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#c0c0c0]">
                      Đề tài nghiên cứu khoa học sinh viên đoạt giải Nhất cấp
                      Khoa, phân tích xu hướng tìm về thiền (Mindfulness) và thực
                      hành tâm linh đương đại.
                    </p>
                  </div>
                </article>
              </div>

              {/* ──────────────────────────────────────────────────────────────────
                  4. EDUCATION SECTION (#Education)
              ────────────────────────────────────────────────────────────────── */}
              <h3
                id="Education"
                style={{ scrollMargin: "1em" }}
                className="text-[19px] font-medium text-[#ef476f] flex items-center gap-2 mb-4 mt-8 pt-2 scroll-mt-24 border-t border-white/5"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#3273dc] text-white text-xs">
                  <GraduationCap className="w-3.5 h-3.5" />
                </span>
                <span>Education</span>
              </h3>

              <div className="timeline border-l border-[#434a56] ml-2 sm:ml-4 pl-4 sm:pl-5 space-y-7 mb-8">
                <article className="flex items-start gap-4">
                  {/* Crest Logo 64x64 */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm text-blue-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-9 h-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>

                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-[15px] font-bold uppercase text-white">
                        <span className="text-xs px-2.5 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium mr-2 align-middle">
                          Sep 2023 - Present
                        </span>
                        <a
                          href="https://ussh.vnu.edu.vn"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-white"
                        >
                          VNU-USSH — ĐẠI HỌC KHOA HỌC XÃ HỘI VÀ NHÂN VĂN HÀ NỘI
                        </a>
                      </div>
                    </div>

                    <div className="mt-1 text-[14px] text-white font-medium flex items-center gap-2 flex-wrap">
                      <span>Cử nhân Tôn giáo học (Bachelor of Religious Studies)</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 font-mono font-bold">
                        GPA: 3.6 / 4.0 — Xuất sắc
                      </span>
                    </div>

                    <p className="mt-2 text-[13px] leading-relaxed text-[#c0c0c0]">
                      Nhân học Tôn giáo, Tôn giáo học So sánh, Lịch sử Tôn giáo Thế
                      giới, Phật giáo học, Kitô giáo học, Tín ngưỡng Dân gian Việt
                      Nam, Triết học Tôn giáo, Phương pháp Điền dã Dân tộc học
                      (Ethnography), Thống kê xã hội & SPSS, Hệ thống Thông tin Địa
                      lý (GIS) trong Khoa học Xã hội.
                    </p>
                  </div>
                </article>
              </div>

              {/* ──────────────────────────────────────────────────────────────────
                  5. CERTIFICATIONS SECTION (#Certifications)
              ────────────────────────────────────────────────────────────────── */}
              <h3
                id="Certifications"
                style={{ scrollMargin: "1em" }}
                className="text-[19px] font-medium text-[#ef476f] flex items-center gap-2 mb-4 mt-8 pt-2 scroll-mt-24 border-t border-white/5"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#9b51e0] text-white text-xs">
                  <Award className="w-3.5 h-3.5" />
                </span>
                <span>Certifications</span>
              </h3>

              <div className="timeline border-l border-[#434a56] ml-2 sm:ml-4 pl-4 sm:pl-5 space-y-6 mb-2">
                {/* Cert 1: Google Gemini */}
                <article className="flex items-start gap-4">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm text-amber-400">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-white">
                      <span className="text-xs px-2 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium mr-2 align-middle">
                        May 2026
                      </span>
                      <a
                        href="https://edu.google.accredible.com/7eb91c3a-f640-4c49-8cca-d3c6761b64a1#acc.r863MDLm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-white hover:text-amber-300"
                      >
                        Google Gemini Certified Educator
                      </a>
                    </h4>
                    <p className="mt-1 text-xs text-stone-400">
                      <a
                        href="https://edu.google.accredible.com/7eb91c3a-f640-4c49-8cca-d3c6761b64a1#acc.r863MDLm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ef476f] hover:underline"
                      >
                        Google for Education (Accredible: 7eb91c3a-f640-4c49-8cca-d3c6761b64a1)
                      </a>
                    </p>
                  </div>
                </article>

                {/* Cert 2: IELTS Academic 7.0 */}
                <article className="flex items-start gap-4">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm text-rose-400">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-white">
                      <span className="text-xs px-2 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium mr-2 align-middle">
                        Jan 2025
                      </span>
                      <span className="text-white">
                        IELTS Academic 7.0 (CEFR C1)
                      </span>
                    </h4>
                    <p className="mt-1 text-xs text-stone-400">
                      British Council — Listening: 7.5 | Reading: 7.5 | Writing: 6.5 | Speaking: 6.5
                    </p>
                  </div>
                </article>

                {/* Cert 3: GIS Coursera */}
                <article className="flex items-start gap-4">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm text-sky-400">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-white">
                      <span className="text-xs px-2 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium mr-2 align-middle">
                        Oct 2025
                      </span>
                      <a
                        href="https://www.coursera.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-white hover:text-sky-300"
                      >
                        GIS, Mapping, and Spatial Analysis Specialization
                      </a>
                    </h4>
                    <p className="mt-1 text-xs text-stone-400">
                      University of Toronto (Coursera)
                    </p>
                  </div>
                </article>

                {/* Cert 4: HP LIFE */}
                <article className="flex items-start gap-4">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded bg-[#202534] border border-white/10 flex-shrink-0 flex items-center justify-center p-2 shadow-sm text-emerald-400">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-white">
                      <span className="text-xs px-2 py-0.5 rounded bg-[#373d48] text-[#c0c0c0] font-medium mr-2 align-middle">
                        2026
                      </span>
                      <span className="text-white">
                        HP LIFE Professional Certification Series
                      </span>
                    </h4>
                    <p className="mt-1 text-xs text-stone-400">
                      HP Foundation (HP LIFE) — AI for Beginners, Business Email, Agile Project Management
                    </p>
                  </div>
                </article>
              </div>
            </article>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              CỘT PHỤ (STICKY SIDEBAR - 4 COLUMNS: PROFILE CARD & TOC)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 no-print order-first lg:order-last">
            {/* 1. Profile Widget Card (.widget-profile) */}
            <div className="card widget widget-profile bg-[#181c27]/80 backdrop-blur-sm border border-white/5 rounded-md p-6 text-center shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
              {/* Circular Avatar 128x128 with subtle glow */}
              <div className="relative w-28 sm:w-32 h-28 sm:h-32 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/10 shadow-lg">
                <div className="w-full h-full bg-gradient-to-tr from-amber-600 via-rose-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl font-sans">
                  TKO
                </div>
              </div>

              {/* Name & Blue Verified Badge */}
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Trần Kim Oanh
                </h2>
                {/* Verified Account Badge (SVG checkmark icon) */}
                <span
                  className="inline-flex items-center text-[#3b82f6]"
                  title="Verified Academic Profile"
                >
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>

              {/* Title / Role */}
              <p className="text-[13px] text-stone-300 font-medium mb-1">
                Religious Studies & Cultural Anthropology
              </p>

              {/* Location */}
              <p className="text-xs text-[#7a7a7a] flex items-center justify-center gap-1 mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span>Hanoi, Vietnam</span>
              </p>

              {/* Follow / Contact Button */}
              <div className="mb-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 px-6 rounded-full bg-[#373d48] hover:bg-[#434a56] text-[#c0c0c0] hover:text-white text-sm font-medium transition-colors text-center border border-white/5"
                >
                  Follow me on LinkedIn
                </a>
              </div>

              {/* Row of Icon Buttons (GitHub, LinkedIn, Phone, Email, Download) */}
              <div className="flex items-center justify-center gap-1 pt-3 border-t border-white/5 text-[#c0c0c0]">
                <a
                  href="https://github.com/kimoanh2726-cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:text-white hover:bg-white/10 transition-colors"
                  title="Github Profile"
                >
                  <Github className="w-4 h-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:text-white hover:bg-white/10 transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <a
                  href="tel:+84912345678"
                  className="p-2 rounded hover:text-white hover:bg-white/10 transition-colors"
                  title="Give me a phone call"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <a
                  href="mailto:kimoanh2726@gmail.com"
                  className="p-2 rounded hover:text-white hover:bg-white/10 transition-colors"
                  title="Send me an email"
                >
                  <Mail className="w-4 h-4" />
                </a>

                <button
                  onClick={handlePrint}
                  className="p-2 rounded hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Download CV as PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Table of Contents Card (#toc) */}
            <div
              id="toc"
              className="card widget bg-[#181c27]/80 backdrop-blur-sm border border-white/5 rounded-md p-5 shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3 px-2">
                Table of contents
              </h3>

              <ul className="space-y-1 text-[13px]">
                {tocItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(item.id);
                        }}
                        className={clsx(
                          "flex items-center justify-between px-3 py-1.5 rounded transition-colors cursor-pointer",
                          isActive
                            ? "bg-[#434a56] text-white font-medium"
                            : "text-[#c0c0c0] hover:bg-[#373d48]/50 hover:text-white"
                        )}
                      >
                        <span>{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
