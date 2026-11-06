"use client";

import React, { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "../theme/ThemeProvider";

interface SectionWrapperProps {
  id: string;
  number?: string; // e.g. "01", "02"
  title: { vi: string; en: string };
  subtitle?: { vi: string; en: string };
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({
  id,
  number,
  title,
  subtitle,
  children,
  className = "",
}: SectionWrapperProps) {
  const { theme, t } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      id={id}
      className={`relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b ${
        theme === "a"
          ? "border-[#E5DECE]/60 dark:border-[#3A3228]/60"
          : "border-white/5"
      } ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div {...animationProps} className="mb-10 md:mb-14">
          <div className="flex items-center gap-3 mb-2">
            {number && (
              <span
                className={`section-number text-xs md:text-sm tracking-widest font-mono font-medium ${
                  theme === "a"
                    ? "text-[#B45309] dark:text-[#D97706]"
                    : "text-[#00D4FF]"
                }`}
              >
                {number}
              </span>
            )}
            <div
              className={`h-[1px] flex-1 max-w-[60px] ${
                theme === "a"
                  ? "bg-[#E5DECE] dark:bg-[#3A3228]"
                  : "bg-white/10"
              }`}
            />
          </div>

          <h2
            className={`text-2xl md:text-4xl font-bold tracking-tight ${
              theme === "a"
                ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                : "font-be-vietnam text-white"
            }`}
          >
            {t(title)}
          </h2>

          {subtitle && (
            <p
              className={`mt-2 text-sm md:text-base max-w-2xl ${
                theme === "a"
                  ? "text-[#66584B] dark:text-[#9E9382]"
                  : "text-[#8E8E8E]"
              }`}
            >
              {t(subtitle)}
            </p>
          )}
        </motion.div>

        <motion.div {...animationProps}>{children}</motion.div>
      </div>
    </section>
  );
}
