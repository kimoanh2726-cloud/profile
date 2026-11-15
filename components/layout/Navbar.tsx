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
  const themeA = theme === "a";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("about");
  const gearButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { href: "#about", id: "about", label: { vi: "Về tôi", en: "About" } },
    { href: "#research", id: "research", label: { vi: "Nghiên cứu", en: "Research" } },
    { href: "#timeline", id: "timeline", label: { vi: "Quá trình", en: "Timeline" } },
    { href: "#certificates", id: "certificates", label: { vi: "Chứng chỉ", en: "Certificates" } },
    { href: "#skills", id: "skills", label: { vi: "Kỹ năng", en: "Skills" } },
    { href: "#contact", id: "contact", label: { vi: "Liên hệ", en: "Contact" } },
  ];

  // ── Scrollspy: tự động nhận biết section đang xem trên màn hình ──
  useEffect(() => {
    const sectionIds = ["about", "research", "timeline", "certificates", "skills", "contact"];

    const handleScroll = () => {
      // 1. Kiểm tra trạng thái cuộn để đổi nền header
      setIsScrolled(window.scrollY > 20);

      // 2. Nếu đã cuộn sát chân trang -> kích hoạt mục cuối cùng (Liên hệ)
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 70) {
        setActiveSection("contact");
        return;
      }

      // 3. Quét vị trí các section từ dưới lên trên
      const offsetThreshold = 180;
      let current = "";

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offsetThreshold) {
            current = id;
            break;
          }
        }
      }

      // Nếu ở đầu trang (chưa cuộn tới About)
      if (!current && scrollTop < 400) {
        current = "about";
      }

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          {/* Brand / Logo */}
          <a
            href="#hero"
            className={`font-bold tracking-tight text-sm sm:text-base md:text-lg 3xl:text-2xl transition-colors hover:opacity-80 ${
              themeA
                ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                : "font-be-vietnam text-white"
            }`}
          >
            <span>{t(name)}</span>
          </a>

          {/* Desktop & TV Nav Links với hiệu ứng In Đậm & Gạch Chân */}
          <nav className="hidden lg:flex items-center gap-6 3xl:gap-10" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveSection(link.id)}
                  className={clsx(
                    "relative py-1.5 text-xs 3xl:text-base uppercase tracking-wider transition-all duration-200 select-none",
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

                  {/* Thanh gạch chân di chuyển mượt mà (Animated Active Underline) */}
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
                </a>
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
                "hidden md:flex p-2 3xl:p-3 rounded-lg transition-colors",
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
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-all",
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
                </a>
              );
            })}

            {/* Gear button — mobile menu */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSettingsPanelOpen(true);
              }}
              className={clsx(
                "flex items-center gap-2 py-2 px-3 text-sm font-medium w-full rounded-lg transition-colors",
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

      {/* Settings Panel (portal-like, rendered after header) */}
      <SettingsPanel
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        triggerRef={gearButtonRef}
      />
    </>
  );
}
