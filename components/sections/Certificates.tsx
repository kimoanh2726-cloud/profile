"use client";

import React, { useState, useMemo } from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { CertCard } from "../ui/CertCard";
import { TagFilter } from "../ui/TagFilter";
import { useTheme } from "../theme/ThemeProvider";
import type { CertificateItem, TagDefinition } from "@/lib/schema";
import { checkCertificateExpiry } from "@/lib/cert-utils";
import { Award } from "lucide-react";

interface CertificatesProps {
  certificates: CertificateItem[];
  tagDefinitions: TagDefinition[];
}

export function Certificates({
  certificates,
  tagDefinitions,
}: CertificatesProps) {
  const { lang } = useTheme();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 1. Filter out expired certificates and sort by date descending
  const activeCertificates = useMemo(() => {
    return certificates
      .filter((cert) => {
        const expiry = checkCertificateExpiry(cert);
        return expiry.status !== "expired";
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [certificates]);

  // Extract all tag IDs that are actually used by active certificates
  const relevantTags = useMemo(() => {
    const usedTagIds = new Set<string>();
    activeCertificates.forEach((c) => c.tags?.forEach((t) => usedTagIds.add(t)));
    return tagDefinitions.filter((t) => usedTagIds.has(t.id));
  }, [activeCertificates, tagDefinitions]);

  // Filter by currently selected tag
  const displayedCertificates = useMemo(() => {
    if (!selectedTag) return activeCertificates;
    return activeCertificates.filter((c) => c.tags?.includes(selectedTag));
  }, [activeCertificates, selectedTag]);

  return (
    <SectionWrapper
      id="certificates"
      number="04"
      title={{ vi: "Chứng chỉ & Văn bằng", en: "Certificates & Credentials" }}
      subtitle={{
        vi: "Các văn bằng, chứng chỉ năng lực ngôn ngữ và công nghệ được công nhận",
        en: "Accredited certifications, language proficiencies, and specialized training",
      }}
    >
      {/* Tag filter bar */}
      {relevantTags.length > 0 && (
        <div className="mb-8">
          <TagFilter
            tags={relevantTags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
        </div>
      )}

      {/* Grid of certificates */}
      {displayedCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCertificates.map((cert) => (
            <CertCard key={cert.id} cert={cert} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 text-stone-500">
          <Award className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">
            {lang === "vi"
              ? "Không có chứng chỉ phù hợp với bộ lọc."
              : "No certificates found matching this tag."}
          </p>
        </div>
      )}
    </SectionWrapper>
  );
}
