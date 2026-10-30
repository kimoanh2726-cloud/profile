/**
 * Language Context — Quản lý ngôn ngữ vi/en toàn trang
 * =====================================================
 * Dùng React Context để truyền ngôn ngữ xuống mọi component.
 */

"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "vi" | "en";

interface LanguageContextType {
  locale: Locale;
  toggleLocale: () => void;
  t: (text: { vi: string; en: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("vi");

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "vi" ? "en" : "vi"));
  }, []);

  /** Helper: chọn nội dung đúng ngôn ngữ */
  const t = useCallback(
    (text: { vi: string; en: string }) => text[locale],
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage phải dùng trong LanguageProvider");
  return ctx;
}
