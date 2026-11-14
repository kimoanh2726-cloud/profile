"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Award } from "lucide-react";
import clsx from "clsx";
import { SectionWrapper } from "../ui/SectionWrapper";
import { FeaturedCertCard } from "../ui/FeaturedCertCard";
import { SupplementalCertCard } from "../ui/SupplementalCertCard";
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
}

export function Certificates({ certificates, tagDefinitions }: CertificatesProps) {
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

  // ── Grid cols from settings ───────────────────────────────────────────────
  const gridCols =
    settings.certGridCols === "2"
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <SectionWrapper
        id="certificates"
        number="04"
        title={{ vi: "Chứng chỉ & Văn bằng", en: "Certificates & Credentials" }}
        subtitle={{
          vi: "Các văn bằng, chứng chỉ năng lực ngôn ngữ và công nghệ được công nhận",
          en: "Accredited certifications, language proficiencies, and specialized training",
        }}
      >
        {/* ════ KHU 1: CHỨNG CHỈ NỔI BẬT ════ */}
        {featuredCerts.length > 0 && (
          <div className="mb-14">
            <SectionSubheading theme={theme} lang={lang}>
              {lang === "vi" ? "Chứng chỉ nổi bật" : "Featured Certificates"}
            </SectionSubheading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* ════ KHU 2: CHỨNG CHỈ BỔ SUNG ════ */}
        {supplementalCerts.length > 0 && (
          <div>
            <SectionSubheading theme={theme} lang={lang}>
              {lang === "vi" ? "Chứng chỉ bổ sung" : "Additional Certificates"}
            </SectionSubheading>

            {/* Tag filter */}
            {relevantTags.length > 1 && (
              <div className="mb-6">
                <TagFilter
                  tags={relevantTags}
                  selectedTag={selectedTag}
                  onSelectTag={setSelectedTag}
                />
              </div>
            )}

            {/* View: list or grid */}
            {settings.certSupplementalView === "list" ? (
              <div className="mb-4">
                {displayedSupplemental.length > 0 ? (
                  displayedSupplemental.map((cert) => (
                    <SupplementalCertCard
                      key={cert.id}
                      cert={cert}
                      warningDays={warningDays}
                      viewMode="list"
                      onViewImage={cert.image ? (c) => openLightbox(c, filteredSupplemental) : undefined}
                    />
                  ))
                ) : <EmptyState lang={lang} theme={theme} />}
              </div>
            ) : (
              <div className={clsx("grid gap-5 mb-4", gridCols)}>
                {displayedSupplemental.length > 0 ? (
                  displayedSupplemental.map((cert) => (
                    <SupplementalCertCard
                      key={cert.id}
                      cert={cert}
                      warningDays={warningDays}
                      viewMode="grid"
                      onViewImage={cert.image ? (c) => openLightbox(c, filteredSupplemental) : undefined}
                    />
                  ))
                ) : <div className="col-span-full"><EmptyState lang={lang} theme={theme} /></div>}
              </div>
            )}

            {/* Show more / collapse */}
            {hasMore && (
              <div className="flex justify-center mt-2">
                <button
                  ref={triggerRef}
                  onClick={() => setShowAllSupplemental((v) => !v)}
                  className={clsx(
                    "inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full border transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                    themeA
                      ? "border-[#E5DECE] dark:border-[#3A3228] text-[#66584B] dark:text-[#9E9382] hover:bg-[#FAF7F2] dark:hover:bg-[#2A2218]"
                      : "border-white/10 text-stone-400 hover:bg-white/5"
                  )}
                >
                  {showAllSupplemental ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      {lang === "vi" ? "Thu gọn" : "Collapse"}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      {lang === "vi"
                        ? `Xem thêm ${filteredSupplemental.length - SUPPLEMENTAL_INITIAL_COUNT} chứng chỉ`
                        : `Show ${filteredSupplemental.length - SUPPLEMENTAL_INITIAL_COUNT} more`}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty state when nothing at all */}
        {featuredCerts.length === 0 && supplementalCerts.length === 0 && (
          <EmptyState lang={lang} theme={theme} />
        )}
      </SectionWrapper>

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
