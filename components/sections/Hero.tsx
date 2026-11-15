"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "../theme/ThemeProvider";
import type { Profile } from "@/lib/schema";
import {
  Github,
  Linkedin,
  BookOpen,
  Mail,
  GraduationCap,
  Award,
  Zap,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import { getAssetUrl } from "@/lib/cert-utils";

interface HeroProps {
  profile: Profile;
  onSelectTab?: (tab: string) => void;
}

export function Hero({ profile, onSelectTab }: HeroProps) {
  const { theme, lang, t } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [avatarError, setAvatarError] = useState(false);
  const themeA = theme === "a";

  // Compute initials dynamically (vd: "Trần Kim Oanh" -> "TKO")
  const nameStr = t(profile.name);
  const initials =
    nameStr
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "TKO";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const socialLinks = [
    {
      name: "GitHub",
      href: profile.social?.github,
      icon: <Github className="w-4 h-4" />,
    },
    {
      name: "LinkedIn",
      href: profile.social?.linkedin,
      icon: <Linkedin className="w-4 h-4" />,
    },
    {
      name: "Google Scholar",
      href: profile.social?.scholar,
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ].filter((item) => !!item.href);

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center pt-28 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 3xl:px-12 overflow-hidden border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60"
    >
      {/* Background ambient lighting for Theme B */}
      {!themeA && (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00D4FF]/5 rounded-full blur-[140px] animate-pulse duration-[6000ms]" />
          <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#00D4FF]/3 rounded-full blur-[100px]" />
        </div>
      )}

      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? undefined : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          className="flex flex-col items-start text-left"
        >
          {/* ── Section Tag: 01 / GIỚI THIỆU ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="flex items-center gap-3 mb-4"
          >
            <span
              className={clsx(
                "text-xs sm:text-sm tracking-widest font-mono font-semibold",
                themeA
                  ? "text-[#B45309] dark:text-[#D97706]"
                  : "text-[#00D4FF]"
              )}
            >
              01
            </span>
            <div
              className={clsx(
                "h-[1px] w-10 sm:w-14",
                themeA
                  ? "bg-[#E5DECE] dark:bg-[#3A3228]"
                  : "bg-white/10"
              )}
            />
            <span
              className={clsx(
                "text-xs sm:text-sm tracking-widest uppercase font-medium",
                themeA
                  ? "text-[#8C7E72] dark:text-[#8E8375]"
                  : "text-stone-400 font-mono"
              )}
            >
              {lang === "vi" ? "Tổng quan" : "Overview"}
            </span>
          </motion.div>

          {/* ── Name & Avatar Header ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 w-full mb-5"
          >
            <h1
              className={clsx(
                "text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl 3xl:text-9xl font-bold tracking-tight leading-[1.08]",
                themeA
                  ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                  : "font-be-vietnam text-white"
              )}
            >
              {t(profile.name)}
            </h1>

            {/* Avatar / Initials Frame */}
            <div
              className={clsx(
                "relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl p-1.5 flex items-center justify-center transition-all duration-300",
                themeA
                  ? "bg-white dark:bg-[#1E1A14] border border-[#E5DECE] dark:border-[#3A3228] shadow-sm hover:shadow-md hover:border-[#B45309]/30"
                  : "bg-[#141414] border border-white/10 shadow-[0_0_24px_rgba(0,212,255,0.15)] hover:border-[#00D4FF]/40"
              )}
            >
              {profile.avatar && !avatarError ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={getAssetUrl(profile.avatar) || profile.avatar}
                    alt={t(profile.name)}
                    fill
                    className="object-cover"
                    onError={() => setAvatarError(true)}
                    priority
                  />
                </div>
              ) : (
                <div
                  className={clsx(
                    "w-full h-full rounded-xl flex flex-col items-center justify-center font-bold select-none",
                    themeA
                      ? "bg-[#FAF7F2] dark:bg-[#28221B] text-[#B45309] dark:text-[#D97706] font-playfair"
                      : "bg-[#0A0A0A] text-[#00D4FF] font-mono"
                  )}
                >
                  <span className="text-xl sm:text-2xl md:text-3xl tracking-wider">
                    {initials}
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest opacity-60">
                    Profile
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Subtitle / Orientation & Institution ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="space-y-2 mb-10 max-w-3xl"
          >
            <p
              className={clsx(
                "text-base sm:text-lg md:text-xl font-semibold",
                themeA
                  ? "text-[#B45309] dark:text-[#D97706]"
                  : "text-[#00D4FF]"
              )}
            >
              {lang === "vi"
                ? "Định hướng: Nghiên cứu Tôn giáo & Phân tích Văn hóa — Xã hội"
                : "Focus: Religious Studies & Socio-Cultural Analytics"}
            </p>
            <p
              className={clsx(
                "text-sm sm:text-base md:text-lg leading-relaxed",
                themeA
                  ? "text-[#66584B] dark:text-[#9E9382]"
                  : "text-stone-300"
              )}
            >
              {lang === "vi"
                ? "Sinh viên năm 3 chuyên ngành Tôn giáo học, Khoa Nhân học và Tôn giáo — Trường Đại học Khoa học Xã hội và Nhân văn Hà Nội (VNU-USSH, Đại học Quốc gia Hà Nội)."
                : "Third-year student majoring in Religious Studies at the Faculty of Anthropology and Religion, University of Social Sciences and Humanities, Hanoi (VNU-USSH)."}
            </p>
            <p
              className={clsx(
                "text-xs sm:text-sm font-medium",
                themeA
                  ? "text-[#8C7E72] dark:text-[#8E8375] italic"
                  : "text-stone-400 font-mono"
              )}
            >
              {lang === "vi"
                ? "Đang tìm kiếm cơ hội thực tập, nghiên cứu và phát triển học thuật"
                : "Actively seeking internship, research, and career development opportunities"}
            </p>
          </motion.div>

          {/* ── 4 Quick-Nav Cards (Bấm vào nhảy sang Tab tương ứng ngay lập tức) ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full mb-10"
          >
            {/* Card 1: Học vấn */}
            <a
              href="#timeline"
              onClick={(e) => {
                if (onSelectTab) {
                  e.preventDefault();
                  onSelectTab("timeline");
                }
              }}
              className={clsx(
                "group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[120px] cursor-pointer",
                themeA
                  ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] hover:border-[#B45309]/50 hover:shadow-lg hover:shadow-[#B45309]/8"
                  : "bg-white/[0.03] backdrop-blur-md border-white/10 hover:border-[#00D4FF]/40 hover:shadow-[0_8px_30px_rgba(0,212,255,0.12)]"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                    themeA
                      ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706] group-hover:bg-[#B45309] group-hover:text-white"
                      : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 group-hover:bg-[#00D4FF] group-hover:text-black"
                  )}
                >
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span
                  className={clsx(
                    "text-xs font-mono font-medium transition-transform duration-200 group-hover:translate-x-0.5",
                    themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-400"
                  )}
                >
                  02 →
                </span>
              </div>
              <div>
                <h3
                  className={clsx(
                    "font-bold text-sm sm:text-base leading-snug transition-colors",
                    themeA
                      ? "text-[#1A1108] dark:text-[#EDE8E1] group-hover:text-[#B45309] dark:group-hover:text-[#D97706]"
                      : "text-white group-hover:text-[#00D4FF]"
                  )}
                >
                  {lang === "vi" ? "Hồ sơ Học vấn" : "Academic Profile"}
                </h3>
                <p
                  className={clsx(
                    "text-xs mt-1 truncate",
                    themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-400"
                  )}
                >
                  {lang === "vi" ? "ĐH KHXH&NV Hà Nội" : "VNU-USSH Hanoi"}
                </p>
              </div>
            </a>

            {/* Card 2: Dự án Nghiên cứu */}
            <a
              href="#research"
              onClick={(e) => {
                if (onSelectTab) {
                  e.preventDefault();
                  onSelectTab("research");
                }
              }}
              className={clsx(
                "group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[120px] cursor-pointer",
                themeA
                  ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] hover:border-[#B45309]/50 hover:shadow-lg hover:shadow-[#B45309]/8"
                  : "bg-white/[0.03] backdrop-blur-md border-white/10 hover:border-[#00D4FF]/40 hover:shadow-[0_8px_30px_rgba(0,212,255,0.12)]"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                    themeA
                      ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706] group-hover:bg-[#B45309] group-hover:text-white"
                      : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 group-hover:bg-[#00D4FF] group-hover:text-black"
                  )}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <span
                  className={clsx(
                    "text-xs font-mono font-medium transition-transform duration-200 group-hover:translate-x-0.5",
                    themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-400"
                  )}
                >
                  03 →
                </span>
              </div>
              <div>
                <h3
                  className={clsx(
                    "font-bold text-sm sm:text-base leading-snug transition-colors",
                    themeA
                      ? "text-[#1A1108] dark:text-[#EDE8E1] group-hover:text-[#B45309] dark:group-hover:text-[#D97706]"
                      : "text-white group-hover:text-[#00D4FF]"
                  )}
                >
                  {lang === "vi" ? "Dự án & Đề tài" : "Projects & Research"}
                </h3>
                <p
                  className={clsx(
                    "text-xs mt-1 truncate",
                    themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-400"
                  )}
                >
                  {lang === "vi" ? "Tôn giáo & Nhân học" : "Religion & Anthropology"}
                </p>
              </div>
            </a>

            {/* Card 3: Kỹ năng & Năng lực */}
            <a
              href="#skills"
              onClick={(e) => {
                if (onSelectTab) {
                  e.preventDefault();
                  onSelectTab("skills");
                }
              }}
              className={clsx(
                "group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[120px] cursor-pointer",
                themeA
                  ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] hover:border-[#B45309]/50 hover:shadow-lg hover:shadow-[#B45309]/8"
                  : "bg-white/[0.03] backdrop-blur-md border-white/10 hover:border-[#00D4FF]/40 hover:shadow-[0_8px_30px_rgba(0,212,255,0.12)]"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                    themeA
                      ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706] group-hover:bg-[#B45309] group-hover:text-white"
                      : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 group-hover:bg-[#00D4FF] group-hover:text-black"
                  )}
                >
                  <Zap className="w-4 h-4" />
                </div>
                <span
                  className={clsx(
                    "text-xs font-mono font-medium transition-transform duration-200 group-hover:translate-x-0.5",
                    themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-400"
                  )}
                >
                  04 →
                </span>
              </div>
              <div>
                <h3
                  className={clsx(
                    "font-bold text-sm sm:text-base leading-snug transition-colors",
                    themeA
                      ? "text-[#1A1108] dark:text-[#EDE8E1] group-hover:text-[#B45309] dark:group-hover:text-[#D97706]"
                      : "text-white group-hover:text-[#00D4FF]"
                  )}
                >
                  {lang === "vi" ? "Kỹ năng & Năng lực" : "Skills & Competencies"}
                </h3>
                <p
                  className={clsx(
                    "text-xs mt-1 truncate",
                    themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-400"
                  )}
                >
                  {lang === "vi" ? "Điền dã, AI & Phân tích" : "Fieldwork, AI & Analytics"}
                </p>
              </div>
            </a>

            {/* Card 4: Chứng chỉ Quốc tế */}
            <a
              href="#certificates"
              onClick={(e) => {
                if (onSelectTab) {
                  e.preventDefault();
                  onSelectTab("certificates");
                }
              }}
              className={clsx(
                "group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[120px] cursor-pointer",
                themeA
                  ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] hover:border-[#B45309]/50 hover:shadow-lg hover:shadow-[#B45309]/8"
                  : "bg-white/[0.03] backdrop-blur-md border-white/10 hover:border-[#00D4FF]/40 hover:shadow-[0_8px_30px_rgba(0,212,255,0.12)]"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                    themeA
                      ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706] group-hover:bg-[#B45309] group-hover:text-white"
                      : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 group-hover:bg-[#00D4FF] group-hover:text-black"
                  )}
                >
                  <Award className="w-4 h-4" />
                </div>
                <span
                  className={clsx(
                    "text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full transition-transform duration-200 group-hover:translate-x-0.5",
                    themeA
                      ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706]"
                      : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                  )}
                >
                  {lang === "vi" ? "CHỨNG CHỈ →" : "CERTS →"}
                </span>
              </div>
              <div>
                <h3
                  className={clsx(
                    "font-bold text-sm sm:text-base leading-snug transition-colors",
                    themeA
                      ? "text-[#1A1108] dark:text-[#EDE8E1] group-hover:text-[#B45309] dark:group-hover:text-[#D97706]"
                      : "text-white group-hover:text-[#00D4FF]"
                  )}
                >
                  {lang === "vi" ? "Chứng chỉ Quốc tế" : "Accredited Certs"}
                </h3>
                <p
                  className={clsx(
                    "text-xs mt-1 truncate",
                    themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-400"
                  )}
                >
                  {lang === "vi" ? "38 chứng chỉ xác thực" : "38 verified credentials"}
                </p>
              </div>
            </a>
          </motion.div>

          {/* ── Action Buttons & Social Links ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="flex flex-wrap items-center gap-4 w-full"
          >
            {/* Primary Action Button */}
            <button
              onClick={() => onSelectTab?.("contact")}
              className={clsx(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm cursor-pointer",
                themeA
                  ? "bg-[#B45309] hover:bg-[#92400e] text-white hover:shadow-md"
                  : "bg-[#00D4FF] hover:bg-[#38e1ff] text-black font-semibold shadow-[0_0_20px_rgba(0,212,255,0.35)]"
              )}
            >
              <Mail className="w-4 h-4" />
              <span>{lang === "vi" ? "Liên hệ ngay" : "Contact Me"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Action Button */}
            <button
              onClick={() => onSelectTab?.("certificates")}
              className={clsx(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 border cursor-pointer",
                themeA
                  ? "border-[#E5DECE] dark:border-[#3A3228] bg-white dark:bg-[#1E1A14] text-[#1A1108] dark:text-[#EDE8E1] hover:border-[#B45309] hover:text-[#B45309] hover:bg-[#FAF7F2] dark:hover:bg-[#28221B]"
                  : "border-white/15 bg-white/5 text-stone-200 hover:border-[#00D4FF]/40 hover:text-[#00D4FF] hover:bg-white/10"
              )}
            >
              <Award className="w-4 h-4" />
              <span>{lang === "vi" ? "Xem kho chứng chỉ" : "View Certificates"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 sm:ml-auto">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "p-2.5 rounded-xl text-xs transition-all duration-200 border",
                    themeA
                      ? "border-[#E5DECE] dark:border-[#3A3228] bg-white dark:bg-[#1E1A14] text-[#66584B] dark:text-[#9E9382] hover:border-[#B45309] hover:text-[#B45309] hover:shadow-sm"
                      : "border-white/10 bg-white/5 text-stone-300 hover:border-[#00D4FF]/60 hover:text-[#00D4FF]"
                  )}
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
