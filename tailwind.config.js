/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "360px",
        "3xl": "1920px", // Full HD / Standard TV (1080p)
        "4xl": "2560px", // 2K QHD / Large TV
        "5xl": "3840px", // 4K UHD TV
      },
      colors: {
        // ── Gradient tím-xanh chủ đạo ──
        primary: {
          50:  "#f0e7ff",
          100: "#d4bfff",
          200: "#b794ff",
          300: "#9a68ff",
          400: "#8347ff",
          500: "#6d28d9", // Tím chính
          600: "#5b21b6",
          700: "#4c1d95",
          800: "#3b0f7a",
          900: "#2a0960",
        },
        accent: {
          50:  "#e0f7fa",
          100: "#b2ebf2",
          200: "#80deea",
          300: "#4dd0e1",
          400: "#26c6da",
          500: "#06b6d4", // Cyan accent
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        // ── Dark theme backgrounds ──
        dark: {
          50:  "#f8fafc",
          100: "#1e293b",
          200: "#1a1f35",
          300: "#151929",
          400: "#111422",
          500: "#0d101b", // Nền chính dark
          600: "#0a0c15",
          700: "#070910",
          800: "#04060b",
          900: "#020307",
        },
        glass: {
          white: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.12)",
          hover: "rgba(255, 255, 255, 0.15)",
        },
        // ── CSS Custom Properties Themes ──
        "theme-bg": "var(--color-bg)",
        "theme-surface": "var(--color-surface)",
        "theme-surface-hover": "var(--color-surface-hover)",
        "theme-text": "var(--color-text)",
        "theme-muted": "var(--color-text-muted)",
        "theme-accent": "var(--color-accent)",
        "theme-accent-hover": "var(--color-accent-hover)",
        "theme-border": "var(--color-border)",
        "theme-border-subtle": "var(--color-border-subtle)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        playfair: ["var(--font-heading)", "Georgia", "serif"],
        "be-vietnam": ["var(--font-body)", "system-ui", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        newsreader: ["var(--font-newsreader)", "Georgia", "serif"],
        fraunces: ["var(--font-fraunces)", "Georgia", "serif"],
        lora: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-heading)", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #6d28d9 0%, #06b6d4 50%, #8347ff 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(109,40,217,0.1) 0%, rgba(6,182,212,0.1) 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(109, 40, 217, 0.3), 0 0 60px rgba(6, 182, 212, 0.15)",
        "glow-sm": "0 0 10px rgba(109, 40, 217, 0.2)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite alternate",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow-pulse": {
          "0%": { boxShadow: "0 0 20px rgba(109, 40, 217, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(6, 182, 212, 0.4)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
