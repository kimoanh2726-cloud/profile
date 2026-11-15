"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Award,
  BookOpen,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { CertificateItem } from "@/lib/schema";
import { getCertVerifyUrl, getAssetUrl } from "@/lib/cert-utils";

interface GroupedCertificatesProps {
  certificates: CertificateItem[];
  onViewImage: (cert: CertificateItem) => void;
}

interface CertGroup {
  id: string;
  titleVi: string;
  titleEn: string;
  countBadgeVi: string;
  countBadgeEn: string;
  descriptionVi: string;
  descriptionEn: string;
  icon: React.ReactNode;
  certs: CertificateItem[];
  defaultOpen?: boolean;
}

export function GroupedCertificates({
  certificates,
  onViewImage,
}: GroupedCertificatesProps) {
  const { theme, lang, t } = useTheme();
  const themeA = theme === "a";

  // Tách các chứng chỉ HP LIFE và chứng chỉ nghiên cứu khác
  const hpLifeCerts = certificates.filter(
    (c) =>
      c.id.startsWith("cert-hplife") ||
      c.issuer?.vi?.includes("HP") ||
      c.issuer?.en?.includes("HP")
  );

  const academicCerts = certificates.filter(
    (c) =>
      !c.id.startsWith("cert-hplife") &&
      !c.issuer?.vi?.includes("HP") &&
      !c.issuer?.en?.includes("HP")
  );

  const groups: CertGroup[] = [
    {
      id: "hplife",
      titleVi: "HP Foundation (HP LIFE): 32 khóa học & mô-đun bổ trợ",
      titleEn: "HP Foundation (HP LIFE): 32 Modular Courses & Digital Skills",
      countBadgeVi: `${hpLifeCerts.length} mô-đun đã hoàn thành`,
      countBadgeEn: `${hpLifeCerts.length} completed modules`,
      descriptionVi:
        "Chuỗi đào tạo năng lực số, tư duy phản biện trong kỷ nguyên AI, quản trị dự án Agile, tài chính & khởi nghiệp",
      descriptionEn:
        "Professional development track in digital skills, AI literacy, Agile management, finance & entrepreneurship",
      icon: <Award className="w-5 h-5" />,
      certs: hpLifeCerts,
      defaultOpen: true, // Mặc định mở để người dùng xem ngay
    },
    ...(academicCerts.length > 0
      ? [
          {
            id: "academic",
            titleVi: "Kỹ năng Nghiên cứu & Phương pháp Khoa học Xã hội",
            titleEn: "Research Methodology & Academic Software",
            countBadgeVi: `${academicCerts.length} chứng nhận chuyên môn`,
            countBadgeEn: `${academicCerts.length} specialized credentials`,
            descriptionVi:
              "Chứng nhận thực hành phần mềm phân tích định tính NVivo và phương pháp điền dã chuyên sâu",
            descriptionEn:
              "Certification in qualitative data analysis software (NVivo) and fieldwork research methods",
            icon: <BookOpen className="w-5 h-5" />,
            certs: academicCerts,
            defaultOpen: true,
          },
        ]
      : []),
  ];

  // Trạng thái mở/đóng từng nhóm
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    hplife: true,
    academic: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const isOpen = !!openGroups[group.id];

        return (
          <div
            key={group.id}
            className={clsx(
              "rounded-2xl border transition-all duration-300 overflow-hidden",
              themeA
                ? "bg-white dark:bg-[#1E1A14] border-[#E5DECE] dark:border-[#3A3228] shadow-sm hover:border-[#B45309]/30"
                : "bg-white/[0.03] backdrop-blur-md border-white/10 hover:border-[#00D4FF]/30"
            )}
          >
            {/* ── Header của Nhóm Gom (Accordion Bar) ── */}
            <button
              onClick={() => toggleGroup(group.id)}
              className={clsx(
                "w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors cursor-pointer",
                isOpen
                  ? themeA
                    ? "bg-[#FAF7F2]/60 dark:bg-[#251F18]/60 border-b border-[#E5DECE]/60 dark:border-[#3A3228]/60"
                    : "bg-white/[0.02] border-b border-white/5"
                  : themeA
                  ? "hover:bg-[#FAF7F2]/40 dark:hover:bg-[#251F18]/40"
                  : "hover:bg-white/[0.02]"
              )}
              aria-expanded={isOpen}
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div
                  className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors",
                    themeA
                      ? "bg-amber-500/10 text-[#B45309] dark:text-[#D97706]"
                      : "bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20"
                  )}
                >
                  {group.icon}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3
                      className={clsx(
                        "font-bold text-base sm:text-lg leading-snug",
                        themeA
                          ? "font-playfair text-[#1A1108] dark:text-[#EDE8E1]"
                          : "text-white"
                      )}
                    >
                      {lang === "vi" ? group.titleVi : group.titleEn}
                    </h3>
                    <span
                      className={clsx(
                        "text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border",
                        themeA
                          ? "bg-amber-500/10 border-amber-500/20 text-[#B45309] dark:text-[#D97706]"
                          : "bg-[#00D4FF]/10 border-[#00D4FF]/30 text-[#00D4FF]"
                      )}
                    >
                      {lang === "vi" ? group.countBadgeVi : group.countBadgeEn}
                    </span>
                  </div>

                  <p
                    className={clsx(
                      "text-xs sm:text-sm mt-1 line-clamp-1",
                      themeA ? "text-[#8C7E72] dark:text-[#8E8375]" : "text-stone-400"
                    )}
                  >
                    {lang === "vi" ? group.descriptionVi : group.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Nút bấm + / - theo phong cách tham chiếu */}
              <div
                className={clsx(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200",
                  themeA
                    ? "border-[#E5DECE] dark:border-[#3A3228] bg-white dark:bg-[#1E1A14] text-[#1A1108] dark:text-[#EDE8E1]"
                    : "border-white/10 bg-white/5 text-stone-200 hover:border-[#00D4FF]/40"
                )}
              >
                {isOpen ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </div>
            </button>

            {/* ── Danh sách chi tiết từng chứng chỉ khi mở ── */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="divide-y divide-[#E5DECE]/60 dark:divide-[#3A3228]/60">
                    {group.certs.map((cert) => {
                      // Format date: MM/YYYY
                      const parts = cert.date.split("-");
                      const dateDisplay =
                        parts.length >= 2 ? `${parts[1]}/${parts[0]}` : parts[0];

                      return (
                        <div
                          key={cert.id}
                          className={clsx(
                            "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors",
                            themeA
                              ? "hover:bg-[#FAF7F2]/50 dark:hover:bg-[#251F18]/50"
                              : "hover:bg-white/[0.02]"
                          )}
                        >
                          {/* Khối bên trái: Ảnh thu nhỏ + Thông tin chứng chỉ */}
                          <div className="flex items-center gap-4 min-w-0">
                            {/* Ảnh thu nhỏ có thể nhấp để phóng to */}
                            {cert.image ? (
                              <button
                                type="button"
                                onClick={() => onViewImage(cert)}
                                className={clsx(
                                  "relative shrink-0 w-20 sm:w-24 aspect-[4/3] rounded-lg overflow-hidden border transition-all duration-200 group cursor-pointer shadow-sm hover:scale-[1.03]",
                                  themeA
                                    ? "border-[#E5DECE] dark:border-[#3A3228]"
                                    : "border-white/10 hover:border-[#00D4FF]/40"
                                )}
                                title={
                                  lang === "vi"
                                    ? "Nhấp để xem ảnh chứng chỉ đầy đủ"
                                    : "Click to preview full certificate"
                                }
                              >
                                <Image
                                  src={getAssetUrl(cert.image) || cert.image}
                                  alt={t(cert.title)}
                                  fill
                                  sizes="96px"
                                  className="object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <span className="opacity-0 group-hover:opacity-100 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded font-mono transition-opacity">
                                    Zoom
                                  </span>
                                </div>
                              </button>
                            ) : (
                              <div
                                className={clsx(
                                  "shrink-0 w-20 sm:w-24 aspect-[4/3] rounded-lg flex items-center justify-center border font-mono text-[10px]",
                                  themeA
                                    ? "bg-amber-500/5 border-[#E5DECE] dark:border-[#3A3228] text-[#B45309]"
                                    : "bg-white/5 border-white/10 text-stone-400"
                                )}
                              >
                                Certificate
                              </div>
                            )}

                            {/* Tiêu đề & Thông tin bổ trợ */}
                            <div className="min-w-0">
                              <span
                                className={clsx(
                                  "text-[11px] font-mono font-semibold block mb-0.5",
                                  themeA
                                    ? "text-[#B45309] dark:text-[#D97706]"
                                    : "text-[#00D4FF]"
                                )}
                              >
                                {dateDisplay}
                              </span>

                              <h4
                                className={clsx(
                                  "text-sm sm:text-base font-bold leading-snug line-clamp-1 transition-colors",
                                  themeA
                                    ? "text-[#1A1108] dark:text-[#EDE8E1]"
                                    : "text-white"
                                )}
                              >
                                {cert.title.en || cert.title.vi}
                              </h4>

                              {cert.title.vi &&
                                cert.title.en &&
                                cert.title.vi !== cert.title.en && (
                                  <p
                                    className={clsx(
                                      "text-xs line-clamp-1 mt-0.5",
                                      themeA
                                        ? "text-[#8C7E72] dark:text-[#8E8375]"
                                        : "text-stone-400"
                                    )}
                                  >
                                    {cert.title.vi}
                                  </p>
                                )}

                              <p
                                className={clsx(
                                  "text-[11px] mt-1 font-mono",
                                  themeA ? "text-neutral-500" : "text-stone-500"
                                )}
                              >
                                {t(cert.issuer)}
                                {cert.credentialId && (
                                  <span className="hidden md:inline ml-2 opacity-75">
                                    · ID: {cert.credentialId.substring(0, 8)}...
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Khối bên phải: Nút Chi tiết mở modal (thay thế gọn gàng, xem ảnh + xác thực + tải PDF trong modal) */}
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => onViewImage(cert)}
                              className={clsx(
                                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer shadow-sm",
                                themeA
                                  ? "border-[#B45309] text-[#B45309] hover:bg-[#B45309] hover:text-white dark:border-[#D97706] dark:text-[#D97706] dark:hover:bg-[#D97706] dark:hover:text-black"
                                  : "border-[#00D4FF] text-[#00D4FF] hover:bg-[#00D4FF] hover:text-black shadow-[0_0_12px_rgba(0,212,255,0.2)]"
                              )}
                              title={
                                lang === "vi"
                                  ? "Xem chi tiết chứng chỉ, xác thực và tải PDF"
                                  : "View certificate details, verification, and PDF"
                              }
                            >
                              <span>{lang === "vi" ? "Chi tiết" : "Details"}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
