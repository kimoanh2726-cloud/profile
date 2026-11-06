"use client";

import React from "react";
import { useTheme } from "../theme/ThemeProvider";
import type { CertificateItem } from "@/lib/schema";
import {
  checkCertificateExpiry,
  getCertVerifyUrl,
  getCertCredentialId,
} from "@/lib/cert-utils";
import { Award, ExternalLink, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

export function CertCard({ cert, warningDays = 60 }: { cert: CertificateItem; warningDays?: number }) {
  const { theme, lang, t } = useTheme();
  const expiryStatus = checkCertificateExpiry(cert, warningDays);
  const verifyUrl = getCertVerifyUrl(cert);
  const credentialId = getCertCredentialId(cert);

  return (
    <div
      className={`group relative p-6 rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-between hover:-translate-y-1 ${
        theme === "a"
          ? "bg-white dark:bg-[#25201B] border-[#E5DECE] dark:border-[#3A3228] hover:shadow-lg hover:border-[#B45309]/50"
          : "bg-[#141414] border-white/10 hover:border-[#00D4FF]/60 hover:shadow-[0_8px_30px_rgba(0,212,255,0.15)]"
      }`}
    >
      <div>
        {/* Header row: Icon & Status chip */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div
            className={`p-2 rounded-xl ${
              theme === "a"
                ? "bg-[#FAF7F2] dark:bg-[#2D2821] text-[#B45309] dark:text-[#D97706]"
                : "bg-white/5 text-[#00D4FF]"
            }`}
          >
            <Award className="w-5 h-5" />
          </div>

          {/* Status Chip */}
          {expiryStatus.status === "valid" ? (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                theme === "a"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              {lang === "vi" ? "Hợp lệ" : "Valid"}
            </span>
          ) : expiryStatus.status === "expiring-soon" ? (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium animate-pulse ${
                theme === "a"
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                  : "bg-amber-950/40 text-amber-400 border border-amber-500/30"
              }`}
            >
              <Clock className="w-3 h-3" />
              {lang === "vi"
                ? `Sắp hết hạn (${expiryStatus.daysUntilExpiry} ngày)`
                : `Expiring soon (${expiryStatus.daysUntilExpiry}d)`}
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3
          className={`text-lg font-bold mb-2 leading-snug ${
            theme === "a"
              ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
              : "font-be-vietnam text-white"
          }`}
        >
          {t(cert.title)}
        </h3>

        {/* Issuer */}
        <p
          className={`text-sm mb-3 font-medium ${
            theme === "a"
              ? "text-[#B45309] dark:text-[#D97706]"
              : "text-[#00D4FF]"
          }`}
        >
          {t(cert.issuer)}
        </p>

        {/* Description if present */}
        {cert.description && (
          <p
            className={`text-xs mb-4 line-clamp-2 ${
              theme === "a"
                ? "text-[#66584B] dark:text-[#9E9382]"
                : "text-stone-400"
            }`}
          >
            {t(cert.description)}
          </p>
        )}

        {/* Credential ID */}
        {credentialId && (
          <div className="mb-4">
            <span className="text-[11px] font-mono tracking-wider opacity-60">
              ID: {credentialId}
            </span>
          </div>
        )}
      </div>

      {/* Footer row: Date & Verify Link */}
      <div
        className={`pt-4 border-t flex items-center justify-between gap-2 text-xs ${
          theme === "a"
            ? "border-[#E5DECE]/60 dark:border-[#3A3228]/60 text-[#8C7E72] dark:text-[#8E8375]"
            : "border-white/5 text-stone-400"
        }`}
      >
        <span>{cert.date}</span>

        {verifyUrl && (
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 font-medium transition-colors hover:underline ${
              theme === "a"
                ? "text-[#B45309] dark:text-[#D97706]"
                : "text-[#00D4FF]"
            }`}
            aria-label={`Xác minh chứng chỉ ${t(cert.title)}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === "vi" ? "Xác minh" : "Verify"}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
