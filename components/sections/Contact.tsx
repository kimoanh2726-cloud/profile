"use client";

import React, { useState } from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { useTheme } from "../theme/ThemeProvider";
import type { Profile } from "@/lib/schema";
import {
  Mail,
  Copy,
  Check,
  Github,
  Linkedin,
  BookOpen,
  GraduationCap,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export function Contact({ profile }: { profile: Profile }) {
  const { theme, lang, t } = useTheme();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${profile.email}`;
  };

  const socialItems = [
    {
      name: "GitHub",
      href: profile.social?.github,
      icon: <Github className="w-5 h-5" />,
      desc: { vi: "Mã nguồn & dự án số hóa", en: "Code & digital projects" },
    },
    {
      name: "LinkedIn",
      href: profile.social?.linkedin,
      icon: <Linkedin className="w-5 h-5" />,
      desc: { vi: "Kết nối học thuật & nghề nghiệp", en: "Professional network" },
    },
    {
      name: "ORCID",
      href: profile.social?.orcid,
      icon: <BookOpen className="w-5 h-5" />,
      desc: { vi: "Định danh tác giả nghiên cứu", en: "Researcher identifier" },
    },
    {
      name: "Google Scholar",
      href: profile.social?.scholar,
      icon: <GraduationCap className="w-5 h-5" />,
      desc: { vi: "Trích dẫn & công bố", en: "Citations & publications" },
    },
  ].filter((item) => !!item.href);

  return (
    <SectionWrapper
      id="contact"
      number="06"
      title={{ vi: "Liên hệ & Kết nối", en: "Contact & Connect" }}
      subtitle={{
        vi: "Sẵn sàng trao đổi về các dự án nghiên cứu, học bổng hoặc cộng tác học thuật",
        en: "Open for discussions on research initiatives, scholarships, or academic collaborations",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Main Email Action Card */}
        <div
          className={`p-8 md:p-10 rounded-2xl border text-center transition-all ${
            theme === "a"
              ? "bg-white dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] shadow-sm"
              : "bg-[#141414] border-white/10"
          }`}
        >
          <div
            className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${
              theme === "a"
                ? "bg-[#FAF7F2] dark:bg-[#2F2922] text-[#B45309] dark:text-[#D97706]"
                : "bg-white/5 text-[#00D4FF]"
            }`}
          >
            <Mail className="w-6 h-6" />
          </div>

          <h3
            className={`text-xl md:text-2xl font-bold mb-2 ${
              theme === "a"
                ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                : "font-be-vietnam text-white"
            }`}
          >
            {lang === "vi" ? "Gửi thư điện tử trực tiếp" : "Send Direct Email"}
          </h3>

          <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6">
            {lang === "vi"
              ? "Để hạn chế thư rác, vui lòng liên hệ qua địa chỉ email chính thức bên dưới:"
              : "To prevent spam, please reach out via my direct academic email below:"}
          </p>

          {/* Email Box & Buttons (Obfuscated against automated bots) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={mounted ? `mailto:${profile.email}` : "#contact"}
              onClick={handleEmailClick}
              aria-label={lang === "vi" ? `Gửi email tới ${profile.email}` : `Send email to ${profile.email}`}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
                theme === "a"
                  ? "bg-[#B45309] hover:bg-[#92400E] text-white"
                  : "bg-[#00D4FF] hover:bg-[#38E1FF] text-black font-semibold shadow-[0_0_20px_rgba(0,212,255,0.4)]"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{mounted ? profile.email : profile.email.replace("@", " [at] ")}</span>
            </a>

            <button
              onClick={copyEmail}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${
                theme === "a"
                  ? "border-[#E5DECE] dark:border-[#3A3228] bg-[#FAF7F2] dark:bg-[#2A241F] text-[#1A1108] dark:text-[#EDE8E1] hover:bg-[#F2ECE1]"
                  : "border-white/10 bg-white/5 text-stone-200 hover:bg-white/10"
              }`}
              title="Sao chép địa chỉ email"
              aria-label="Sao chép địa chỉ email"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">
                    {lang === "vi" ? "Đã sao chép!" : "Copied!"}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 opacity-70" />
                  <span>{lang === "vi" ? "Sao chép" : "Copy"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-5 rounded-xl border flex items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 ${
                theme === "a"
                  ? "bg-white dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] hover:border-[#B45309]/50 shadow-sm"
                  : "bg-[#141414] border-white/10 hover:border-[#00D4FF]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg ${
                    theme === "a"
                      ? "bg-[#FAF7F2] dark:bg-[#2F2922] text-[#B45309]"
                      : "bg-white/5 text-[#00D4FF]"
                  }`}
                >
                  {item.icon}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      theme === "a"
                        ? "text-[#1A1108] dark:text-[#EDE8E1]"
                        : "text-white"
                    }`}
                  >
                    {item.name}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {t(item.desc)}
                  </p>
                </div>
              </div>

              <ExternalLink className="w-4 h-4 opacity-50 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
