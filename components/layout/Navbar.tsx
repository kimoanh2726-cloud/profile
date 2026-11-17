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
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export function Navbar({ name, activeTab = "overview", onSelectTab }: NavbarProps) {
  const { theme, lang, t } = useTheme();
  const themeA = theme === "a";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const gearButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { id: "overview", label: { vi: "Tổng quan", en: "Overview" } },
    { id: "timeline", label: { vi: "Hồ sơ", en: "Profile" } },
    { id: "research", label: { vi: "Dự án", en: "Projects" } },
    { id: "skills", label: { vi: "Kỹ năng", en: "Skills" } },
    { id: "contact", label: { vi: "Liên hệ", en: "Contact" } },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  const settingsLabel = lang === "vi" ? "Cài đặt" : "Settings";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? themeA
              ? "bg-[#FAF7F2]/90 dark:bg-[#1C1814]/90 backdrop-blur-md border-b border-[#E5DECE] dark:border-[#3A3228] shadow-sm"
              : "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 3xl:px-12 h-14 sm:h-16 md:h-20 3xl:h-24 flex items-center justify-between gap-4">
          {/* Brand / Logo — Bấm vào quay về trang chủ (Overview) */}
          <button
            onClick={() => handleTabClick("overview")}
            className={clsx(
              "font-bold tracking-tight text-sm sm:text-base md:text-lg 3xl:text-2xl transition-colors hover:opacity-80 text-left cursor-pointer",
              themeA
                ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                : "font-be-vietnam text-white"
            )}
          >
            <span>{t(name)}</span>
          </button>

          {/* Desktop & TV Tab Links với In Đậm & Gạch Chân trượt */}
          <nav className="hidden lg:flex items-center gap-6 3xl:gap-10" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabClick(link.id)}
                  className={clsx(
                    "relative py-1.5 text-xs 3xl:text-base uppercase tracking-wider transition-all duration-200 select-none cursor-pointer",
                    isActive
                      ? themeA
                        ? "font-bold text-[#B45309] dark:text-[#D97706]"
                        : "font-bold text-[#00D4FF]"
                      : themeA
                        ? "font-medium text-[#66584B] hover:text-[#B45309] dark:text-[#9E9382] dark:hover:text-[#D97706]"
                        : "font-medium text-stone-300 hover:text-[#00D4FF]"
                  )}
                >
                  <span>{t(link.label)}</span>

                  {/* Thanh gạch chân mượt mà (Animated Active Underline) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className={clsx(
                        "absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full",
                        themeA
                          ? "bg-[#B45309] dark:bg-[#D97706]"
                          : "bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"
                      )}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Theme Controls + Gear + Mobile Toggle */}
          <div className="flex items-center gap-1.5 3xl:gap-3">
            <ThemeToggle />

            {/* Gear button — desktop & TV */}
            <motion.button
              ref={gearButtonRef}
              onClick={() => setSettingsPanelOpen(true)}
              aria-label={settingsLabel}
              aria-haspopup="dialog"
              aria-expanded={settingsPanelOpen}
              whileHover={{ rotate: 45 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={clsx(
                "hidden md:flex p-2 3xl:p-3 rounded-lg transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                themeA
                  ? "text-[#66584B] hover:text-[#B45309] hover:bg-amber-50 dark:text-[#9E9382] dark:hover:bg-[#2A2218]"
                  : "text-stone-300 hover:text-[#00D4FF] hover:bg-white/5"
              )}
            >
              <Settings className="w-4 h-4 3xl:w-6 3xl:h-6" />
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
            className={clsx(
              "lg:hidden border-b px-4 py-4 space-y-2",
              themeA
                ? "bg-[#FAF7F2] dark:bg-[#1C1814] border-[#E5DECE] dark:border-[#3A3228]"
                : "bg-[#0A0A0A] border-white/10"
            )}
          >
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabClick(link.id)}
                  className={clsx(
                    "flex items-center justify-between py-2.5 px-3 rounded-lg text-sm transition-all w-full text-left cursor-pointer",
                    isActive
                      ? themeA
                        ? "font-bold text-[#B45309] dark:text-[#D97706] bg-amber-500/10 border-l-4 border-[#B45309] dark:border-[#D97706]"
                        : "font-bold text-[#00D4FF] bg-[#00D4FF]/10 border-l-4 border-[#00D4FF]"
                      : themeA
                        ? "font-medium text-[#1A1108] dark:text-[#EDE8E1] hover:text-[#B45309]"
                        : "font-medium text-stone-200 hover:text-[#00D4FF]"
                  )}
                >
                  <span>{t(link.label)}</span>
                  {isActive && (
                    <span
                      className={clsx(
                        "w-2 h-2 rounded-full",
                        themeA ? "bg-[#B45309] dark:bg-[#D97706]" : "bg-[#00D4FF]"
                      )}
                    />
                  )}
                </button>
              );
            })}

            {/* Gear button — mobile menu */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSettingsPanelOpen(true);
              }}
              className={clsx(
                "flex items-center gap-2 py-2 px-3 text-sm font-medium w-full rounded-lg transition-colors cursor-pointer",
                themeA
                  ? "text-[#66584B] dark:text-[#9E9382] hover:text-[#B45309] hover:bg-amber-50/50"
                  : "text-stone-300 hover:text-[#00D4FF] hover:bg-white/5"
              )}
            >
              <Settings className="w-4 h-4" />
              {settingsLabel}
            </button>
          </div>
        )}
      </header>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        triggerRef={gearButtonRef}
      />
    </>
  );
}
