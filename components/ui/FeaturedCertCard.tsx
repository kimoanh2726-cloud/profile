"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ExternalLink, FileText, Image as ImageIcon,
  CheckCircle2, Clock, AlertCircle, ArrowUpRight
} from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useSettings } from "@/hooks/useSettings";
import type { CertificateItem } from "@/lib/schema";
import { checkCertificateExpiry, getCertVerifyUrl, getAssetUrl } from "@/lib/cert-utils";

interface FeaturedCertCardProps {
  cert: CertificateItem;
  warningDays?: number;
  onViewImage: (cert: CertificateItem) => void;
}

export function FeaturedCertCard({
  cert,
  warningDays = 60,
  onViewImage,
}: FeaturedCertCardProps) {
  const { theme, lang, t } = useTheme();
  const { settings } = useSettings();
  const imgButtonRef = useRef<HTMLDivElement>(null);
  const expiryStatus = checkCertificateExpiry(cert, warningDays);
  const verifyUrl = getCertVerifyUrl(cert);
  const themeA = theme === "a";

  const showImage = settings.certShowImage && cert.image;
  const showRelated = settings.certShowRelatedProject && cert.relatedProject;

  // Format date as MM/YYYY
  const dateParts = cert.date.split("-");
  const dateLabel = dateParts.length >= 2 ? `${dateParts[1]}/${dateParts[0]}` : dateParts[0];

  return (
    <motion.div
      whileHover={settings.animationsEnabled ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={clsx(
        "group relative flex flex-col rounded-2xl overflow-hidden border transition-shadow duration-300",
        themeA
          ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] hover:shadow-xl hover:shadow-[#B45309]/10"
          : "bg-[#141414] border-white/10 hover:border-[#00D4FF]/30 hover:shadow-[0_12px_40px_rgba(0,212,255,0.12)]"
      )}
    >
      {/* ── Image area ── */}
      {showImage ? (
        <div
          ref={imgButtonRef}
          role="button"
          tabIndex={0}
          onClick={() => onViewImage(cert)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onViewImage(cert); } }}
          aria-label={`${lang === "vi" ? "Xem ảnh chứng chỉ" : "View certificate image"}: ${t(cert.title)}`}
          className="relative cursor-pointer overflow-hidden aspect-[16/9] bg-stone-100 dark:bg-stone-900"
        >
          <Image
            src={cert.image!}
            alt={`${t(cert.title)} — ${t(cert.issuer)}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {/* Hover overlay hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
            <span className="text-white text-sm font-medium flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full">
              <ImageIcon className="w-3.5 h-3.5" />
              {lang === "vi" ? "Xem ảnh" : "View image"}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            "aspect-[16/9] flex items-center justify-center",
            themeA ? "bg-[#FAF7F2] dark:bg-[#231E18]" : "bg-[#1A1A1A]"
          )}
        >
          <ImageIcon className={clsx("w-10 h-10 opacity-20", themeA ? "text-[#B45309]" : "text-[#00D4FF]")} />
        </div>
      )}

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={clsx("text-xs font-bold tracking-wide", themeA ? "text-[#B45309] dark:text-[#D97706]" : "text-[#00D4FF]")}>
            {dateLabel}
          </span>
          <span className={clsx("text-xs", themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-500")}>
            {t(cert.issuer)}
          </span>
          {cert.durationHours && (
            <span className={clsx("text-xs", themeA ? "text-[#8C7E72]" : "text-stone-500")}>
              · {cert.durationHours} {lang === "vi" ? "giờ" : "hrs"}
            </span>
          )}

          {/* Status chip — only if has expiry */}
          {cert.expiryDate && !cert.no_expiry && (
            <StatusChip status={expiryStatus.status} daysUntilExpiry={expiryStatus.daysUntilExpiry} lang={lang} theme={theme} />
          )}
        </div>

        {/* Title */}
        <h3 className={clsx(
          "text-xl font-bold leading-snug mb-3",
          themeA ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"
        )}>
          {t(cert.title)}
        </h3>

        {/* Description */}
        {cert.description && (
          <p className={clsx("text-sm mb-3 leading-relaxed", themeA ? "text-[#66584B] dark:text-[#9E9382]" : "text-stone-400")}>
            {t(cert.description)}
          </p>
        )}

        {/* Related project */}
        {showRelated && (
          <div className={clsx("mb-3 pb-3 border-b", themeA ? "border-[#E5DECE]/60 dark:border-[#3A3228]/60" : "border-white/5")}>
            <p className={clsx("text-xs mb-1", themeA ? "text-[#8C7E72]" : "text-stone-500")}>
              {lang === "vi" ? "Dự án liên quan:" : "Related project:"}
            </p>
            {cert.relatedProject?.url ? (
              <a
                href={cert.relatedProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  "inline-flex items-center gap-1 text-sm font-medium hover:underline underline-offset-2",
                  themeA ? "text-[#B45309] dark:text-[#D97706]" : "text-[#00D4FF]"
                )}
              >
                {lang === "vi" ? cert.relatedProject.title_vi : (cert.relatedProject.title_en ?? cert.relatedProject.title_vi)}
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </a>
            ) : (
              <span className={clsx("text-sm", themeA ? "text-[#1A1108] dark:text-[#EDE8E1]" : "text-stone-300")}>
                {lang === "vi" ? cert.relatedProject!.title_vi : (cert.relatedProject!.title_en ?? cert.relatedProject!.title_vi)}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {cert.image && (
            <ActionButton
              onClick={() => onViewImage(cert)}
              theme={theme}
              variant="outline"
              icon={<ImageIcon className="w-3.5 h-3.5" />}
            >
              {lang === "vi" ? "Xem ảnh chứng chỉ" : "View Certificate"}
            </ActionButton>
          )}
          {verifyUrl && (
            <ActionButton
              href={verifyUrl}
              theme={theme}
              variant="outline"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              {lang === "vi" ? "Xác thực" : "Verify"}
            </ActionButton>
          )}
          {cert.pdfUrl && (
            <ActionButton
              href={getAssetUrl(cert.pdfUrl)}
              theme={theme}
              variant="ghost"
              icon={<FileText className="w-3.5 h-3.5" />}
            >
              {lang === "vi" ? "Mở PDF gốc" : "Open PDF"}
            </ActionButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shared sub-components ─────────────────────────────────────────────────

function StatusChip({
  status,
  daysUntilExpiry,
  lang,
  theme,
}: {
  status: "valid" | "expiring-soon" | "expired";
  daysUntilExpiry?: number;
  lang: "vi" | "en";
  theme: "a" | "b";
}) {
  const themeA = theme === "a";
  if (status === "expired") {
    return (
      <span className={clsx(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
        themeA
          ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
          : "bg-red-950/40 text-red-400 border border-red-500/30"
      )}>
        <AlertCircle className="w-3 h-3" />
        {lang === "vi" ? "Hết hạn" : "Expired"}
      </span>
    );
  }
  if (status === "expiring-soon") {
    return (
      <span className={clsx(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
        themeA
          ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
          : "bg-amber-950/40 text-amber-400 border border-amber-500/30"
      )}>
        <Clock className="w-3 h-3" />
        {lang === "vi" ? `Sắp hết hạn (${daysUntilExpiry}d)` : `Expiring (${daysUntilExpiry}d)`}
      </span>
    );
  }
  return (
    <span className={clsx(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
      themeA
        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
        : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
    )}>
      <CheckCircle2 className="w-3 h-3" />
      {lang === "vi" ? "Hợp lệ" : "Valid"}
    </span>
  );
}

function ActionButton({
  children,
  onClick,
  href,
  theme,
  variant,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  theme: "a" | "b";
  variant: "outline" | "ghost";
  icon?: React.ReactNode;
}) {
  const themeA = theme === "a";
  const cls = clsx(
    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
    variant === "outline"
      ? themeA
        ? "border border-[#B45309]/40 dark:border-[#D97706]/30 text-[#B45309] dark:text-[#D97706] hover:bg-[#B45309]/5"
        : "border border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/5"
      : themeA
        ? "text-[#8C7E72] dark:text-[#8E8375] hover:text-[#1A1108] dark:hover:text-[#EDE8E1] hover:bg-[#F0E9DF] dark:hover:bg-[#2A2218]"
        : "text-stone-500 hover:text-stone-200 hover:bg-white/5"
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {icon}{children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {icon}{children}
    </button>
  );
}

// Export StatusChip for reuse in supplemental card
export { StatusChip };

