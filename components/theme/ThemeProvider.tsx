"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type Theme = "a" | "b";
export type Lang = "vi" | "en";
export type ColorMode = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
  t: (text: { vi: string; en?: string } | undefined) => string;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("a");
  const [lang, setLangState] = useState<Lang>("vi");
  const [colorMode, setColorModeState] = useState<ColorMode>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize from URL query params or localStorage
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlTheme = searchParams.get("theme") as Theme | null;
      const urlLang = searchParams.get("lang") as Lang | null;
      const urlMode = (searchParams.get("mode") || searchParams.get("colorMode")) as ColorMode | null;

      const storedTheme = (localStorage.getItem("profile_theme") as Theme) || null;
      const storedLang = (localStorage.getItem("profile_lang") as Lang) || null;
      const storedMode = (localStorage.getItem("profile_mode") as ColorMode) || null;

      const initialTheme: Theme =
        urlTheme === "a" || urlTheme === "b"
          ? urlTheme
          : storedTheme === "a" || storedTheme === "b"
          ? storedTheme
          : "a";

      const initialLang: Lang =
        urlLang === "vi" || urlLang === "en"
          ? urlLang
          : storedLang === "vi" || storedLang === "en"
          ? storedLang
          : "vi";

      let initialMode: ColorMode;
      if (urlMode === "light" || urlMode === "dark") {
        initialMode = urlMode;
      } else if (storedMode === "light" || storedMode === "dark") {
        initialMode = storedMode;
      } else {
        // Theme A defaults to light; Theme B defaults to dark
        initialMode = initialTheme === "b" ? "dark" : "light";
      }

      setThemeState(initialTheme);
      setLangState(initialLang);
      setColorModeState(initialMode);
      setMounted(true);
    } catch {
      setMounted(true);
    }
  }, []);

  // Update HTML tag attributes and localStorage whenever state changes
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);
    root.setAttribute("data-mode", colorMode);
    root.setAttribute("lang", lang);

    if (colorMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (mounted) {
      try {
        localStorage.setItem("profile_theme", theme);
        localStorage.setItem("profile_lang", lang);
        localStorage.setItem("profile_mode", colorMode);

        // Keep URL search params updated without full reload
        const url = new URL(window.location.href);
        url.searchParams.set("theme", theme);
        url.searchParams.set("lang", lang);
        url.searchParams.set("mode", colorMode);
        window.history.replaceState({}, "", url.toString());
      } catch {
        // Ignore localStorage / URL sync errors if sandboxed
      }
    }
  }, [theme, lang, colorMode, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    // When switching theme, adjust default color mode if user hasn't explicitly set one
    setColorModeState((prevMode) => {
      if (newTheme === "b" && prevMode === "light") return "dark";
      if (newTheme === "a" && prevMode === "dark") return "light";
      return prevMode;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "a" ? "b" : "a"));
    setColorModeState((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "vi" ? "en" : "vi"));
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorModeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const t = useCallback(
    (text: { vi: string; en?: string } | undefined): string => {
      if (!text) return "";
      if (lang === "en" && text.en) return text.en;
      return text.vi || "";
    },
    [lang]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        lang,
        setLang,
        toggleLang,
        colorMode,
        setColorMode,
        toggleColorMode,
        t,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
