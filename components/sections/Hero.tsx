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
  ArrowDown,
  ExternalLink,
} from "lucide-react";

export function Hero({ profile }: { profile: Profile }) {
  const { theme, lang, t } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [avatarError, setAvatarError] = useState(false);

  // Compute initials for placeholder
  const initials = "NMT";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const lineVariants = {
    hidden: {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      y: 20,
      opacity: 0,
    },
    visible: {
      clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
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
      name: "ORCID",
      href: profile.social?.orcid,
      icon: <BookOpen className="w-4 h-4" />,
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
      className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background ambient effect */}
      {theme === "b" && (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00D4FF]/5 rounded-full blur-[140px] animate-pulse duration-[6000ms]" />
          <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#00D4FF]/3 rounded-full blur-[100px]" />
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full text-center">
        <motion.div
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? undefined : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          className="flex flex-col items-center"
        >
          {/* Avatar or Initials Placeholder */}
          <motion.div
            variants={shouldReduceMotion ? undefined : lineVariants}
            className="mb-8"
          >
            <div
              className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 3xl:w-48 3xl:h-48 rounded-full p-1.5 flex items-center justify-center transition-all ${
                theme === "a"
                  ? "bg-[#FAF7F2] dark:bg-[#25201B] border-2 border-[#B45309] shadow-md"
                  : "bg-[#141414] border-2 border-[#00D4FF] shadow-[0_0_24px_rgba(0,212,255,0.3)]"
              }`}
            >
              {profile.avatar && !avatarError ? (
                <div className="relative w-full h-full rounded-full overflow-hidden">
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
                  className={`w-full h-full rounded-full flex flex-col items-center justify-center font-bold select-none ${
                    theme === "a"
                      ? "bg-[#FAF7F2] dark:bg-[#2D2821] text-[#B45309] dark:text-[#D97706] font-playfair"
                      : "bg-[#0A0A0A] text-[#00D4FF] font-be-vietnam font-extrabold"
                  }`}
                >
                  <span className="text-xl sm:text-2xl md:text-3xl 3xl:text-4xl tracking-widest">
                    {initials}
                  </span>
                  <span className="text-[9px] sm:text-[10px] 3xl:text-xs uppercase font-mono tracking-wider opacity-60">
                    Portfolio
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Name Header */}
          <motion.div
            variants={shouldReduceMotion ? undefined : lineVariants}
            className="overflow-hidden mb-3"
          >
            <h1
              className={`text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl 3xl:text-8xl font-bold tracking-tight ${
                theme === "a"
                  ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                  : "font-be-vietnam text-white"
              }`}
            >
              {t(profile.name)}
            </h1>
          </motion.div>

          {/* Subtitle / Title */}
          <motion.div
            variants={shouldReduceMotion ? undefined : lineVariants}
            className="overflow-hidden mb-6"
          >
            <p
              className={`text-base sm:text-lg md:text-xl 3xl:text-3xl font-medium max-w-2xl 3xl:max-w-4xl mx-auto leading-relaxed ${
                theme === "a"
                  ? "text-[#B45309] dark:text-[#D97706]"
                  : "text-[#00D4FF]"
              }`}
            >
              {t(profile.title)}
            </p>
          </motion.div>

          {/* Short Bio */}
          <motion.div
            variants={shouldReduceMotion ? undefined : lineVariants}
            className="overflow-hidden mb-8 max-w-2xl 3xl:max-w-4xl mx-auto"
          >
            <p
              className={`text-sm sm:text-base 3xl:text-xl leading-relaxed ${
                theme === "a"
                  ? "text-[#66584B] dark:text-[#9E9382]"
                  : "text-stone-300"
              }`}
            >
              {profile.bio_lengths
                ? lang === "vi"
                  ? profile.bio_lengths.vi.short || profile.bio_lengths.vi.medium || t(profile.bio)
                  : profile.bio_lengths.en?.short || profile.bio_lengths.en?.medium || t(profile.bio)
                : t(profile.bio)}
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={shouldReduceMotion ? undefined : lineVariants}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  theme === "a"
                    ? "bg-white dark:bg-[#25201B] border border-[#E5DECE] dark:border-[#3A3228] text-[#1A1108] dark:text-[#EDE8E1] hover:border-[#B45309] hover:text-[#B45309] shadow-sm"
                    : "bg-white/5 border border-white/10 text-stone-200 hover:border-[#00D4FF]/60 hover:text-[#00D4FF]"
                }`}
                aria-label={item.name}
              >
                {item.icon}
                <span>{item.name}</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={shouldReduceMotion ? undefined : lineVariants}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#research"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
                theme === "a"
                  ? "bg-[#B45309] hover:bg-[#92400E] text-white"
                  : "bg-[#00D4FF] hover:bg-[#38E1FF] text-black font-semibold shadow-[0_0_20px_rgba(0,212,255,0.4)]"
              }`}
            >
              <span>{lang === "vi" ? "Xem nghiên cứu" : "View Research"}</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all border ${
                theme === "a"
                  ? "border-[#E5DECE] dark:border-[#3A3228] bg-white dark:bg-[#25201B] text-[#1A1108] dark:text-[#EDE8E1] hover:bg-[#FAF7F2] dark:hover:bg-[#2F2922]"
                  : "border-white/15 bg-white/5 text-stone-200 hover:bg-white/10 hover:border-white/30"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{lang === "vi" ? "Liên hệ" : "Get in Touch"}</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
