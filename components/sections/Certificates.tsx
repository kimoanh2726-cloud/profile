"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Award, FolderOpen, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { SectionWrapper } from "../ui/SectionWrapper";
import { FeaturedCertCard } from "../ui/FeaturedCertCard";
import { SupplementalCertCard } from "../ui/SupplementalCertCard";
import { GroupedCertificates } from "../ui/GroupedCertificates";
import { CertLightbox } from "../ui/CertLightbox";
import { TagFilter } from "../ui/TagFilter";
import { useTheme } from "../theme/ThemeProvider";
import { useSettings } from "@/hooks/useSettings";
import type { CertificateItem, TagDefinition } from "@/lib/schema";
import { checkCertificateExpiry } from "@/lib/cert-utils";

const SUPPLEMENTAL_INITIAL_COUNT = 6;

interface CertificatesProps {
  certificates: CertificateItem[];
  tagDefinitions: TagDefinition[];
  hideHeader?: boolean;
}

export function Certificates({
  certificates,
  tagDefinitions,
  hideHeader = false,
}: CertificatesProps) {
  const { theme, lang } = useTheme();
  const { settings } = useSettings();
  const themeA = theme === "a";

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [lightboxCert, setLightboxCert] = useState<CertificateItem | null>(null);
  const [lightboxPool, setLightboxPool] = useState<CertificateItem[]>([]);
  const [showAllSupplemental, setShowAllSupplemental] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const warningDays = parseInt(settings.expiryWarningDays, 10);

  // ── Filter expired based on settings ──────────────────────────────────────
  const visibleCerts = useMemo(() => {
    return certificates.filter((cert) => {
      if (cert.visibility !== "public") return false;
      const expiry = checkCertificateExpiry(cert, warningDays);
      if (expiry.status === "expired" && !settings.showExpiredCerts) return false;
      return true;
    });
  }, [certificates, settings.showExpiredCerts, warningDays]);

  // ── Split: featured vs supplemental ───────────────────────────────────────
  const featuredCerts = useMemo(() => {
    return visibleCerts
      .filter((c) => c.featured)
      .sort((a, b) => {
        // Sort by featuredOrder, then by date descending
        const oA = a.featuredOrder ?? 999;
        const oB = b.featuredOrder ?? 999;
        if (oA !== oB) return oA - oB;
        return b.date.localeCompare(a.date);
      });
  }, [visibleCerts]);

  const supplementalCerts = useMemo(() => {
    const pool = visibleCerts.filter((c) => !c.featured);
    return pool.sort((a, b) => {
      if (settings.certSortBy === "expiring") {
        const exA = checkCertificateExpiry(a, warningDays);
        const exB = checkCertificateExpiry(b, warningDays);
        return (exA.daysUntilExpiry ?? Infinity) - (exB.daysUntilExpiry ?? Infinity);
      }
      if (settings.certSortBy === "tag") {
        return (a.tags?.[0] ?? "").localeCompare(b.tags?.[0] ?? "");
      }
      return b.date.localeCompare(a.date);
    });
  }, [visibleCerts, settings.certSortBy, warningDays]);

  // ── Tag filter applies to supplemental only ───────────────────────────────
  const filteredSupplemental = useMemo(() => {
    if (!selectedTag) return supplementalCerts;
    return supplementalCerts.filter((c) => c.tags?.includes(selectedTag));
  }, [supplementalCerts, selectedTag]);

  // ── Show more/less ────────────────────────────────────────────────────────
  const displayedSupplemental = showAllSupplemental
    ? filteredSupplemental
    : filteredSupplemental.slice(0, SUPPLEMENTAL_INITIAL_COUNT);

  const hasMore = filteredSupplemental.length > SUPPLEMENTAL_INITIAL_COUNT;

  // ── Tag definitions for supplemental ──────────────────────────────────────
  const relevantTags = useMemo(() => {
    const usedTagIds = new Set<string>();
    supplementalCerts.forEach((c) => c.tags?.forEach((t) => usedTagIds.add(t)));
    return tagDefinitions.filter((t) => usedTagIds.has(t.id));
  }, [supplementalCerts, tagDefinitions]);

  // ── Lightbox handlers ─────────────────────────────────────────────────────
  const openLightbox = useCallback((cert: CertificateItem, pool: CertificateItem[]) => {
    // Only show certs that have an image in navigation pool
    setLightboxPool(pool.filter((c) => c.image));
    setLightboxCert(cert);
  }, []);

  const closeLightbox = useCallback(() => setLightboxCert(null), []);

  // ── Grid cols from settings (tự động co giãn theo Mobile, Tablet, Desktop và TV) ────
  const gridCols =
    settings.certGridCols === "2"
      ? "grid-cols-1 sm:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 5xl:grid-cols-5";

  const certContent = (
    <>
      {/* Google Drive Repository Banner */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md shadow-sm border-neutral-200/80 dark:border-neutral-800">
        <div className="flex items-center gap-3.5">
          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              themeA
                ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706]"
                : "bg-[#00D4FF]/10 text-[#00D4FF]"
            )}
          >
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>
                {lang === "vi"
                  ? "Kho lưu trữ chứng chỉ gốc (Google Drive)"
                  : "Original Credentials Repository (Google Drive)"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {lang === "vi"
                ? "Toàn bộ bản scan PDF & ảnh bằng cấp đầy đủ được đồng bộ trực tiếp từ Google Drive"
                : "Full archive of PDF scans and credential images synced directly from Google Drive"}
            </p>
          </div>
        </div>
        <a
          href="https://drive.google.com/drive/folders/1eiHNJXMydGjJnk1iSkGMNmXcTDM499Tu"
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            "inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0",
            themeA
              ? "bg-[#B45309] hover:bg-[#92400e] text-white shadow-sm hover:shadow-md"
              : "bg-[#00D4FF] hover:bg-[#00b8e6] text-black font-mono shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]"
          )}
        >
          <span>{lang === "vi" ? "Mở thư mục Drive" : "Open Drive Folder"}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      {/* ════ KHU 1: CHỨNG CHỈ NỔI BẬT ════ */}
      {featuredCerts.length > 0 && (
        <div className="mb-14 3xl:mb-20">
          <SectionSubheading theme={theme} lang={lang}>
            {lang === "vi" ? "Chứng chỉ nổi bật" : "Featured Certificates"}
          </SectionSubheading>

          <div className="grid grid-cols-1 md:grid-cols-2 4xl:grid-cols-3 gap-6 3xl:gap-8">
            {featuredCerts.map((cert) => (
              <FeaturedCertCard
                key={cert.id}
                cert={cert}
                warningDays={warningDays}
                onViewImage={(c) => openLightbox(c, featuredCerts)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ════ KHU 2: CHỨNG CHỈ BỔ TRỢ THEO NHÓM (04.2 NHÓM GOM) ════ */}
      {supplementalCerts.length > 0 && (
        <div className="mt-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={clsx(
                  "text-xs font-mono font-semibold uppercase tracking-wider",
                  themeA
                    ? "text-[#B45309] dark:text-[#D97706]"
                    : "text-[#00D4FF]"
                )}
              >
                04.2 NHÓM GOM
              </span>
            </div>
            <SectionSubheading theme={theme} lang={lang}>
              {lang === "vi"
                ? "Chứng chỉ bổ trợ theo nhóm"
                : "Grouped Supplemental Certificates"}
            </SectionSubheading>
            <p
              className={clsx(
                "text-xs sm:text-sm mt-1 max-w-2xl",
                themeA
                  ? "text-[#66584B] dark:text-[#9E9382]"
                  : "text-stone-400"
              )}
            >
              {lang === "vi"
                ? "Các khóa đào tạo kỹ năng số, quản trị và phương pháp nghiên cứu được gom gọn theo từng tổ chức cấp, kèm đường link xác thực trực tuyến"
                : "Modular training tracks in digital literacy and methodology grouped by accrediting institutions, with direct online verification links"}
            </p>
          </div>

          <GroupedCertificates
            certificates={supplementalCerts}
            onViewImage={(c) => openLightbox(c, supplementalCerts)}
          />
        </div>
      )}

      {/* Empty state when nothing at all */}
      {featuredCerts.length === 0 && supplementalCerts.length === 0 && (
        <EmptyState lang={lang} theme={theme} />
      )}
    </>
  );

  return (
    <>
      {hideHeader ? (
        <div id="certificates-section" className="space-y-6">
          {certContent}
        </div>
      ) : (
        <SectionWrapper
          id="certificates"
          number="04"
          title={{ vi: "Chứng chỉ & Văn bằng", en: "Certificates & Credentials" }}
          subtitle={{
            vi: "Các văn bằng, chứng chỉ năng lực ngôn ngữ và công nghệ được công nhận",
            en: "Accredited certifications, language proficiencies, and specialized training",
          }}
        >
          {certContent}
        </SectionWrapper>
      )}

      {/* Lightbox (outside SectionWrapper to escape z-index) */}
      <CertLightbox
        cert={lightboxCert}
        certs={lightboxPool}
        onClose={closeLightbox}
        onNavigate={setLightboxCert}
        triggerRef={triggerRef as React.RefObject<HTMLButtonElement>}
      />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────

function SectionSubheading({
  children,
  theme,
  lang: _lang,
}: {
  children: React.ReactNode;
  theme: "a" | "b";
  lang: "vi" | "en";
}) {
  return (
    <h3
      className={clsx(
        "text-lg font-semibold mb-5",
        theme === "a"
          ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
          : "text-white"
      )}
    >
      {children}
    </h3>
  );
}

function EmptyState({ lang, theme }: { lang: "vi" | "en"; theme: "a" | "b" }) {
  return (
    <div className="p-10 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 text-stone-500">
      <Award className="w-8 h-8 mx-auto mb-2 opacity-30" />
      <p className="text-sm">
        {lang === "vi"
          ? "Không có chứng chỉ phù hợp."
          : "No certificates found."}
      </p>
    </div>
  );
}
