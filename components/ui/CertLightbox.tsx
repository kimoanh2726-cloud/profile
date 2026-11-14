"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useSettings } from "@/hooks/useSettings";
import type { CertificateItem } from "@/lib/schema";
import { getCertVerifyUrl } from "@/lib/cert-utils";

interface CertLightboxProps {
  cert: CertificateItem | null;
  certs?: CertificateItem[];   // for ← → navigation
  onClose: () => void;
  onNavigate?: (cert: CertificateItem) => void;
  triggerRef?: React.RefObject<HTMLButtonElement | HTMLDivElement>;
}

export function CertLightbox({
  cert,
  certs = [],
  onClose,
  onNavigate,
  triggerRef,
}: CertLightboxProps) {
  const { theme, lang, t } = useTheme();
  const { settings } = useSettings();
  const [zoom, setZoom] = useState(1);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const verifyUrl = cert ? getCertVerifyUrl(cert) : undefined;
  const pdfUrl = cert?.pdfUrl;
  const hasImage = !!cert?.image;

  // Current index in certs array for navigation
  const currentIndex = cert ? certs.findIndex((c) => c.id === cert.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < certs.length - 1;

  const goNext = useCallback(() => {
    if (hasNext && onNavigate) onNavigate(certs[currentIndex + 1]);
  }, [hasNext, currentIndex, certs, onNavigate]);

  const goPrev = useCallback(() => {
    if (hasPrev && onNavigate) onNavigate(certs[currentIndex - 1]);
  }, [hasPrev, currentIndex, certs, onNavigate]);

  // Keyboard handling + focus trap
  useEffect(() => {
    if (!cert) return;

    const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowRight") { goNext(); return; }
      if (e.key === "ArrowLeft") { goPrev(); return; }
      if (e.key === "+" || e.key === "=") { setZoom((z) => Math.min(z + 0.25, 3)); return; }
      if (e.key === "-") { setZoom((z) => Math.max(z - 0.25, 0.5)); return; }

      // Focus trap
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    // Lock scroll
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      triggerRef?.current?.focus();
    };
  }, [cert, onClose, goNext, goPrev, triggerRef]);

  // Reset zoom when cert changes
  useEffect(() => setZoom(1), [cert?.id]);

  const animationsEnabled = settings.animationsEnabled && !settings.reducedMotion;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const themeA = theme === "a";
  const accentText = themeA ? "text-[#B45309] dark:text-[#D97706]" : "text-[#00D4FF]";
  const btnBase = `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]`;
  const btnPrimary = themeA
    ? `${btnBase} bg-[#B45309] hover:bg-[#92400E] text-white`
    : `${btnBase} bg-[#00D4FF] hover:bg-[#00B8E0] text-black`;
  const btnSecondary = themeA
    ? `${btnBase} border border-[#E5DECE] dark:border-[#3A3228] hover:bg-[#FAF7F2] dark:hover:bg-[#2A2218] text-[#1A1108] dark:text-[#EDE8E1]`
    : `${btnBase} border border-white/15 hover:bg-white/5 text-stone-200`;

  return (
    <AnimatePresence>
      {cert && (
        <>
          {/* Overlay */}
          <motion.div
            key="lightbox-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: animationsEnabled ? 0.2 : 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="lightbox-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            variants={animationsEnabled ? dialogVariants : {}}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none`}
          >
            <div
              className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden pointer-events-auto shadow-2xl
                ${themeA
                  ? "bg-[#FAF7F2] dark:bg-[#1C1814] border border-[#E5DECE] dark:border-[#3A3228]"
                  : "bg-[#111111] border border-white/10"
                }`}
            >
              {/* ── Header ── */}
              <div className={`flex items-start justify-between gap-4 px-5 py-4 shrink-0 border-b
                ${themeA ? "border-[#E5DECE] dark:border-[#3A3228]" : "border-white/10"}`}
              >
                <div className="min-w-0">
                  <h2
                    id="lightbox-title"
                    className={`text-lg font-bold leading-snug ${themeA ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]" : "text-white"}`}
                  >
                    {t(cert.title)}
                  </h2>
                  <p className={`text-sm mt-0.5 ${accentText}`}>
                    {t(cert.issuer)}
                    {" · "}
                    {cert.date.slice(0, 7).replace("-", "/")}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Navigation arrows (only when multiple certs) */}
                  {certs.length > 1 && (
                    <>
                      <button
                        onClick={goPrev}
                        disabled={!hasPrev}
                        aria-label={lang === "vi" ? "Chứng chỉ trước" : "Previous certificate"}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-30
                          ${themeA ? "hover:bg-[#F0E9DF] dark:hover:bg-[#2A2218] text-[#1A1108] dark:text-[#EDE8E1]" : "hover:bg-white/10 text-white"}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={goNext}
                        disabled={!hasNext}
                        aria-label={lang === "vi" ? "Chứng chỉ tiếp" : "Next certificate"}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-30
                          ${themeA ? "hover:bg-[#F0E9DF] dark:hover:bg-[#2A2218] text-[#1A1108] dark:text-[#EDE8E1]" : "hover:bg-white/10 text-white"}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className={`w-px h-5 mx-1 ${themeA ? "bg-[#E5DECE] dark:bg-[#3A3228]" : "bg-white/10"}`} />
                    </>
                  )}

                  {/* Close */}
                  <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    aria-label={lang === "vi" ? "Đóng" : "Close"}
                    className={`p-1.5 rounded-lg transition-colors
                      ${themeA ? "hover:bg-[#F0E9DF] dark:hover:bg-[#2A2218] text-[#66584B] dark:text-[#9E9382]" : "hover:bg-white/10 text-stone-400"}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* ── Image area ── */}
              <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
                {hasImage ? (
                  <div className="relative flex items-center justify-center p-4 min-h-[200px]">
                    {/* Zoom controls */}
                    <div className={`absolute top-3 right-3 z-10 flex gap-1 rounded-lg p-1
                      ${themeA ? "bg-white/80 dark:bg-black/50 backdrop-blur-sm" : "bg-black/60 backdrop-blur-sm"}`}
                    >
                      <button
                        onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                        aria-label="Zoom out"
                        className={`p-1 rounded transition-colors ${themeA ? "hover:bg-black/10" : "hover:bg-white/10 text-white"}`}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className={`text-xs font-mono self-center px-1 ${themeA ? "text-[#1A1108]" : "text-white"}`}>
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                        aria-label="Zoom in"
                        className={`p-1 rounded transition-colors ${themeA ? "hover:bg-black/10" : "hover:bg-white/10 text-white"}`}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <div
                      style={{ transform: `scale(${zoom})`, transformOrigin: "center top", transition: "transform 0.2s ease" }}
                      className="w-full"
                    >
                      <Image
                        src={cert.image!}
                        alt={`${t(cert.title)} — ${t(cert.issuer)}`}
                        width={900}
                        height={600}
                        className="w-full h-auto rounded-lg object-contain"
                        priority
                        onDoubleClick={() => setZoom((z) => z < 1.5 ? 2 : 1)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={`flex flex-col items-center justify-center py-16 gap-3
                    ${themeA ? "text-[#8C7E72]" : "text-stone-500"}`}
                  >
                    <FileText className="w-12 h-12 opacity-30" />
                    <p className="text-sm">
                      {lang === "vi" ? "Không có ảnh chứng chỉ" : "No certificate image available"}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Footer ── */}
              <div className={`flex flex-wrap gap-2 items-center justify-end px-5 py-3 shrink-0 border-t
                ${themeA ? "border-[#E5DECE] dark:border-[#3A3228]" : "border-white/10"}`}
              >
                {verifyUrl && (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPrimary}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {lang === "vi" ? "Xác thực" : "Verify"}
                  </a>
                )}
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnSecondary}
                  >
                    <FileText className="w-4 h-4" />
                    {lang === "vi" ? "Mở PDF gốc" : "Open PDF"}
                  </a>
                )}
                <button onClick={onClose} className={btnSecondary}>
                  {lang === "vi" ? "Đóng" : "Close"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

