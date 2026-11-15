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
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

export function Hero({ profile }: { profile: Profile }) {
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
        staggerChildren: 0.1,
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
      className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 3xl:px-12 overflow-hidden"
    >
      {/* Background ambient effect for Theme B */}
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
            className="flex items-center gap-2 mb-4"
          >
            <span
              className={clsx(
                "w-2.5 h-2.5 rounded-sm",
                themeA ? "bg-[#FF4D6D]" : "bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"
              )}
            />
            <span
              className={clsx(
                "text-xs sm:text-sm font-bold tracking-widest uppercase",
                themeA
                  ? "text-[#1A1108] dark:text-[#EDE8E1]"
                  : "text-[#00D4FF] font-mono"
              )}
            >
              {lang === "vi" ? "01 / GIỚI THIỆU" : "01 / ABOUT"}
            </span>
          </motion.div>

          {/* ── Name & Avatar Header ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 w-full mb-4"
          >
            <h1
              className={clsx(
                "text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl 3xl:text-9xl font-black tracking-tight leading-none",
                themeA
                  ? "font-be-vietnam text-[#1A1108] dark:text-[#EDE8E1]"
                  : "font-be-vietnam text-white tracking-wide"
              )}
            >
              {t(profile.name)}
            </h1>

            {/* Avatar / Initials Badge */}
            <div
              className={clsx(
                "relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl p-1 flex items-center justify-center transition-all",
                themeA
                  ? "bg-white dark:bg-[#25201B] border-2 border-black dark:border-[#3A3228] shadow-[3px_3px_0px_#1A1108]"
                  : "bg-[#141414] border-2 border-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              )}
            >
              {profile.avatar && !avatarError ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={profile.avatar}
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
                      ? "bg-[#FAF7F2] dark:bg-[#2D2821] text-[#1A1108] dark:text-[#EDE8E1]"
                      : "bg-[#0A0A0A] text-[#00D4FF] font-mono"
                  )}
                >
                  <span className="text-xl sm:text-2xl font-black tracking-wider">
                    {initials}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-mono tracking-wider opacity-60">
                    Profile
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Orientation & Subtitles ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="space-y-1.5 mb-8 max-w-3xl"
          >
            <p
              className={clsx(
                "text-base sm:text-lg md:text-xl font-bold",
                themeA
                  ? "text-[#1A1108] dark:text-[#EDE8E1]"
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
                  ? "text-neutral-700 dark:text-neutral-300 font-medium"
                  : "text-stone-300"
              )}
            >
              {lang === "vi"
                ? "Sinh viên năm 3 chuyên ngành Tôn giáo học, Khoa Nhân học và Tôn giáo tại Trường Đại học Khoa học Xã hội và Nhân văn Hà Nội (VNU-USSH, Đại học Quốc gia Hà Nội)."
                : "Third-year student majoring in Religious Studies at the Faculty of Anthropology and Religion, University of Social Sciences and Humanities, Hanoi (VNU-USSH)."}
            </p>
            <p
              className={clsx(
                "text-xs sm:text-sm font-medium",
                themeA
                  ? "text-[#B45309] dark:text-[#D97706]"
                  : "text-stone-400"
              )}
            >
              {lang === "vi"
                ? "Đang tìm kiếm cơ hội thực tập, nghiên cứu và phát triển học thuật"
                : "Actively seeking internship, research, and career development opportunities"}
            </p>
          </motion.div>

          {/* ── 4 Quick-Nav Cards (Neo-brutalist / Cyberpunk) ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8"
          >
            {/* Card 1: Học vấn */}
            <a
              href="#timeline"
              className={clsx(
                "group p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between min-h-[110px]",
                themeA
                  ? "bg-[#DDF0FF] border-[#1A1108] text-[#1A1108] shadow-[4px_4px_0px_#1A1108] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A1108]"
                  : "bg-sky-500/10 border-sky-400/30 text-sky-200 hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              )}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-3">
                <GraduationCap className="w-5 h-5" />
                <span className="font-mono">02 →</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight mb-0.5">
                  {lang === "vi" ? "Hồ sơ Học vấn" : "Academic Profile"}
                </h3>
                <p className="text-xs opacity-80 truncate">
                  {lang === "vi" ? "ĐH KHXH&NV Hà Nội" : "VNU-USSH Hanoi"}
                </p>
              </div>
            </a>

            {/* Card 2: Dự án / Nghiên cứu */}
            <a
              href="#research"
              className={clsx(
                "group p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between min-h-[110px]",
                themeA
                  ? "bg-[#FFF3B8] border-[#1A1108] text-[#1A1108] shadow-[4px_4px_0px_#1A1108] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A1108]"
                  : "bg-amber-500/10 border-amber-400/30 text-amber-200 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
              )}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-3">
                <BookOpen className="w-5 h-5" />
                <span className="font-mono">03 →</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight mb-0.5">
                  {lang === "vi" ? "Dự án Nghiên cứu" : "Research Projects"}
                </h3>
                <p className="text-xs opacity-80 truncate">
                  {lang === "vi" ? "Tôn giáo & Nhân học" : "Religion & Culture"}
                </p>
              </div>
            </a>

            {/* Card 3: Kỹ năng */}
            <a
              href="#skills"
              className={clsx(
                "group p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between min-h-[110px]",
                themeA
                  ? "bg-[#EDE5FF] border-[#1A1108] text-[#1A1108] shadow-[4px_4px_0px_#1A1108] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A1108]"
                  : "bg-purple-500/10 border-purple-400/30 text-purple-200 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(192,132,252,0.2)]"
              )}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-3">
                <Zap className="w-5 h-5" />
                <span className="font-mono">04 →</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight mb-0.5">
                  {lang === "vi" ? "Kỹ năng & Năng lực" : "Skills & Tools"}
                </h3>
                <p className="text-xs opacity-80 truncate">
                  {lang === "vi" ? "Điền dã, AI & Phân tích" : "Fieldwork, AI & Tools"}
                </p>
              </div>
            </a>

            {/* Card 4: Chứng chỉ */}
            <a
              href="#certificates"
              className={clsx(
                "group p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between min-h-[110px]",
                themeA
                  ? "bg-[#D9F7E8] border-[#1A1108] text-[#1A1108] shadow-[4px_4px_0px_#1A1108] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A1108]"
                  : "bg-emerald-500/10 border-emerald-400/30 text-emerald-200 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]"
              )}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-3">
                <Award className="w-5 h-5" />
                <span className="font-mono text-[10px] tracking-wider uppercase">
                  {lang === "vi" ? "CHỨNG CHỈ →" : "CERTS →"}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight mb-0.5">
                  {lang === "vi" ? "Chứng chỉ Quốc tế" : "Accredited Certs"}
                </h3>
                <p className="text-xs opacity-80 truncate">
                  {lang === "vi" ? "38 chứng chỉ xác thực" : "38 verified credentials"}
                </p>
              </div>
            </a>
          </motion.div>

          {/* ── Action Buttons & Socials ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="flex flex-wrap items-center gap-4 w-full"
          >
            {/* Primary Action Button (Yellow Neo) */}
            <a
              href="#contact"
              className={clsx(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-200",
                themeA
                  ? "bg-[#FFE680] text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000]"
                  : "bg-[#00D4FF] hover:bg-[#38E1FF] text-black font-mono shadow-[0_0_20px_rgba(0,212,255,0.4)]"
              )}
            >
              <span>{lang === "vi" ? "Liên hệ ngay" : "Contact Me"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Secondary Action Button (Pink Neo) */}
            <a
              href="#certificates"
              className={clsx(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-200",
                themeA
                  ? "bg-[#FF80B5] text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000]"
                  : "bg-pink-500/20 text-pink-300 border border-pink-500/40 hover:bg-pink-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)] font-mono"
              )}
            >
              <span>{lang === "vi" ? "Xem kho chứng chỉ" : "View Certificates"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Social Links */}
            <div className="flex items-center gap-2 sm:ml-auto">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "p-2.5 rounded-full text-xs transition-all",
                    themeA
                      ? "bg-white dark:bg-[#25201B] border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-black shadow-sm"
                      : "bg-white/5 border border-white/10 text-stone-200 hover:border-[#00D4FF]/60 hover:text-[#00D4FF]"
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
