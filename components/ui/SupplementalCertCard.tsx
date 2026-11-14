"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useSettings } from "@/hooks/useSettings";
import type { CertificateItem } from "@/lib/schema";
import { checkCertificateExpiry, getCertVerifyUrl } from "@/lib/cert-utils";
import { StatusChip } from "./FeaturedCertCard";

interface SupplementalCertCardProps {
  cert: CertificateItem;
  warningDays?: number;
  viewMode?: "grid" | "list";
  onViewImage?: (cert: CertificateItem) => void;
}

export function SupplementalCertCard({
  cert,
  warningDays = 60,
  viewMode = "grid",
  onViewImage,
}: SupplementalCertCardProps) {
  const { theme, lang, t } = useTheme();
  const { settings } = useSettings();
  const expiryStatus = checkCertificateExpiry(cert, warningDays);
  const verifyUrl = getCertVerifyUrl(cert);
  const themeA = theme === "a";
  const showImage = settings.certShowImage && cert.image;

  // Date: MM/YYYY
  const dateParts = cert.date.split("-");
  const dateLabel = dateParts.length >= 2 ? `${dateParts[1]}/${dateParts[0]}` : dateParts[0];

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={settings.animationsEnabled ? { x: 4 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={clsx(
          "flex items-center gap-4 py-3 border-b transition-colors",
          themeA
            ? "border-[#E5DECE]/60 dark:border-[#3A3228]/60 hover:bg-[#FAF7F2] dark:hover:bg-[#2A2218]"
            : "border-white/5 hover:bg-white/3"
        )}
      >
        {/* Thumbnail */}
        {showImage && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => onViewImage?.(cert)}
            onKeyDown={(e) => { if (e.key === "Enter") onViewImage?.(cert); }}
            className="shrink-0 w-14 h-10 rounded overflow-hidden cursor-pointer"
          >
            <Image
              src={cert.image!}
              alt={t(cert.title)}
              width={56}
              height={40}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className={clsx("text-sm font-semibold truncate", themeA ? "text-[#1A1108] dark:text-[#EDE8E1]" : "text-white")}>
            {t(cert.title)}
          </p>
          <p className={clsx("text-xs truncate", themeA ? "text-[#8C7E72]" : "text-stone-500")}>
            {t(cert.issuer)} · {dateLabel}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {cert.expiryDate && !cert.no_expiry && (
            <StatusChip status={expiryStatus.status} daysUntilExpiry={expiryStatus.daysUntilExpiry} lang={lang} theme={theme} />
          )}
          {verifyUrl && (
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Verify ${t(cert.title)}`}
              className={clsx("p-1.5 rounded transition-colors", themeA ? "text-[#B45309] hover:bg-amber-50 dark:hover:bg-amber-950/30" : "text-[#00D4FF] hover:bg-[#00D4FF]/10")}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  // Grid mode
  return (
    <motion.div
      whileHover={settings.animationsEnabled ? { y: -3 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={clsx(
        "group relative flex flex-col rounded-xl overflow-hidden border transition-shadow duration-300",
        themeA
          ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] hover:shadow-lg hover:shadow-[#B45309]/8"
          : "bg-[#141414] border-white/8 hover:border-[#00D4FF]/25 hover:shadow-[0_8px_24px_rgba(0,212,255,0.08)]"
      )}
    >
      {/* Thumbnail (small) */}
      {showImage && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => onViewImage?.(cert)}
          onKeyDown={(e) => { if (e.key === "Enter") onViewImage?.(cert); }}
          className="relative cursor-pointer overflow-hidden aspect-[16/7]"
          aria-label={`${lang === "vi" ? "Xem ảnh" : "View image"}: ${t(cert.title)}`}
        >
          <Image
            src={cert.image!}
            alt={t(cert.title)}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span className={clsx("text-[11px] font-bold tracking-wide", themeA ? "text-[#B45309] dark:text-[#D97706]" : "text-[#00D4FF]")}>
            {dateLabel}
          </span>
          {cert.expiryDate && !cert.no_expiry && (
            <StatusChip status={expiryStatus.status} daysUntilExpiry={expiryStatus.daysUntilExpiry} lang={lang} theme={theme} />
          )}
        </div>

        {/* Title */}
        <h4 className={clsx(
          "text-sm font-semibold leading-snug mb-1 line-clamp-2",
          themeA ? "text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
        )}>
          {t(cert.title)}
        </h4>

        {/* Issuer */}
        <p className={clsx("text-xs mb-3", themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-500")}>
          {t(cert.issuer)}
        </p>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {cert.image && onViewImage && (
            <button
              onClick={() => onViewImage(cert)}
              className={clsx(
                "text-[11px] px-2.5 py-1 rounded border transition-colors",
                themeA
                  ? "border-[#E5DECE] dark:border-[#3A3228] text-[#8C7E72] dark:text-[#9E9382] hover:border-[#B45309]/40 hover:text-[#B45309]"
                  : "border-white/10 text-stone-500 hover:border-[#00D4FF]/30 hover:text-[#00D4FF]"
              )}
            >
              {lang === "vi" ? "Xem ảnh ↗" : "View ↗"}
            </button>
          )}
          {verifyUrl && (
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                "text-[11px] px-2.5 py-1 rounded border transition-colors inline-flex items-center gap-1",
                themeA
                  ? "border-[#B45309]/30 text-[#B45309] dark:text-[#D97706] hover:bg-amber-50 dark:hover:bg-amber-950/20"
                  : "border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/5"
              )}
            >
              {lang === "vi" ? "Xác thực" : "Verify"}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

