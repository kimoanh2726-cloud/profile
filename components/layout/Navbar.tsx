"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { ThemeToggle } from "../theme/ThemeToggle";
import { SettingsPanel } from "../settings/SettingsPanel";
import { Menu, X, Settings } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface NavbarProps {
  name: { vi: string; en: string };
}

export function Navbar({ name }: NavbarProps) {
  const { theme, lang, t } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const gearButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: { vi: "Về tôi", en: "About" } },
    { href: "#research", label: { vi: "Nghiên cứu", en: "Research" } },
    { href: "#timeline", label: { vi: "Quá trình", en: "Timeline" } },
    { href: "#certificates", label: { vi: "Chứng chỉ", en: "Certificates" } },
    { href: "#skills", label: { vi: "Kỹ năng", en: "Skills" } },
    { href: "#contact", label: { vi: "Liên hệ", en: "Contact" } },
  ];

  const settingsLabel = lang === "vi" ? "Cài đặt" : "Settings";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? theme === "a"
              ? "bg-[#FAF7F2]/90 dark:bg-[#1C1814]/90 backdrop-blur-md border-b border-[#E5DECE] dark:border-[#3A3228] shadow-sm"
              : "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Brand / Logo */}
          <a
            href="#hero"
            className={`font-bold tracking-tight text-base md:text-lg transition-colors hover:opacity-80 ${
              theme === "a"
                ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                : "font-be-vietnam text-white"
            }`}
          >
            <span>{t(name)}</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-wider font-medium transition-colors ${
                  theme === "a"
                    ? "text-[#66584B] hover:text-[#B45309] dark:text-[#9E9382] dark:hover:text-[#D97706]"
                    : "text-stone-300 hover:text-[#00D4FF]"
                }`}
              >
                {t(link.label)}
              </a>
            ))}
          </nav>

          {/* Theme Controls + Gear + Mobile Toggle */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />

            {/* Gear button — desktop */}
            <motion.button
              ref={gearButtonRef}
              onClick={() => setSettingsPanelOpen(true)}
              aria-label={settingsLabel}
              aria-haspopup="dialog"
              aria-expanded={settingsPanelOpen}
              whileHover={{ rotate: 45 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={clsx(
                "hidden md:flex p-2 rounded-lg transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                theme === "a"
                  ? "text-[#66584B] hover:text-[#B45309] hover:bg-amber-50 dark:text-[#9E9382] dark:hover:bg-[#2A2218]"
                  : "text-stone-300 hover:text-[#00D4FF] hover:bg-white/5"
              )}
            >
              <Settings className="w-4 h-4" />
            </motion.button>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-stone-700 dark:text-stone-200" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-b px-4 py-4 space-y-3 ${
              theme === "a"
                ? "bg-[#FAF7F2] dark:bg-[#1C1814] border-[#E5DECE] dark:border-[#3A3228]"
                : "bg-[#0A0A0A] border-white/10"
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  theme === "a"
                    ? "text-[#1A1108] dark:text-[#EDE8E1] hover:text-[#B45309]"
                    : "text-stone-200 hover:text-[#00D4FF]"
                }`}
              >
                {t(link.label)}
              </a>
            ))}

            {/* Gear button — mobile menu */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSettingsPanelOpen(true);
              }}
              className={clsx(
                "flex items-center gap-2 py-2 text-sm font-medium w-full",
                theme === "a"
                  ? "text-[#66584B] dark:text-[#9E9382] hover:text-[#B45309]"
                  : "text-stone-300 hover:text-[#00D4FF]"
              )}
            >
              <Settings className="w-4 h-4" />
              {settingsLabel}
            </button>
          </div>
        )}
      </header>

      {/* Settings Panel (portal-like, rendered after header) */}
      <SettingsPanel
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        triggerRef={gearButtonRef}
      />
    </>
  );
}
