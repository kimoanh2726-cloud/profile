import type { Metadata } from "next";
import {
  Playfair_Display,
  Be_Vietnam_Pro,
  Cormorant_Garamond,
  Newsreader,
  Fraunces,
  Lora,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SettingsProvider } from "@/components/settings/SettingsProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { ANTI_FLASH_SCRIPT } from "@/lib/settings/apply";

const playfair = Playfair_Display({
  subsets: ["vietnamese", "latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["vietnamese", "latin"],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: false,
});

const fraunces = Fraunces({
  subsets: ["vietnamese", "latin"],
  variable: "--font-fraunces",
  display: "swap",
  adjustFontFallback: false,
});

const lora = Lora({
  subsets: ["vietnamese", "latin"],
  variable: "--font-lora",
  display: "swap",
  adjustFontFallback: false,
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trần Kim Oanh — Religious Studies Portfolio",
  description:
    "Hồ sơ học thuật & Portfolio của Trần Kim Oanh — Sinh viên năm 3 chuyên ngành Tôn giáo học, Khoa Nhân học và Tôn giáo, Trường ĐHKHXH&NV Hà Nội (ĐHQGHN).",
  openGraph: {
    title: "Trần Kim Oanh — Religious Studies Portfolio",
    description:
      "Sinh viên năm 3 chuyên ngành Tôn giáo học, Khoa Nhân học và Tôn giáo, Trường ĐHKHXH&NV Hà Nội (ĐHQGHN).",
    images: ["/og-image.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      data-theme="a"
      data-mode="light"
      className={`${playfair.variable} ${cormorant.variable} ${newsreader.variable} ${fraunces.variable} ${lora.variable} ${beVietnamPro.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash: apply settings from localStorage before hydration */}
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
      </head>
      <body className="antialiased min-h-screen selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-100">
        <ThemeProvider>
          <SettingsProvider>
            {/* Subtle noise overlay for Theme A */}
            <div className="theme-a-noise" aria-hidden="true" />

            {/* Custom Cursor (desktop only) */}
            <CustomCursor />

            {/* Page contents */}
            {children}
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
