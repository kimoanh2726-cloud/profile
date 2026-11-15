"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./Navbar";
import { OverviewTab } from "../sections/OverviewTab";
import { Timeline } from "../sections/Timeline";
import { Research } from "../sections/Research";
import { Certificates } from "../sections/Certificates";
import { Skills } from "../sections/Skills";
import { Contact } from "../sections/Contact";
import { motion, AnimatePresence } from "framer-motion";
import type {
  Profile,
  EducationItem,
  ExperienceItem,
  ResearchItem,
  CertificateItem,
  TagDefinition,
  SkillItem,
} from "@/lib/schema";

export type TabId =
  | "overview"
  | "timeline"
  | "research"
  | "certificates"
  | "skills"
  | "contact";

const VALID_TABS: TabId[] = [
  "overview",
  "timeline",
  "research",
  "certificates",
  "skills",
  "contact",
];

interface TabbedPortfolioProps {
  profile: Profile;
  education: EducationItem[];
  experience: ExperienceItem[];
  research: ResearchItem[];
  certificates: CertificateItem[];
  tagDefinitions: TagDefinition[];
  skills: SkillItem[];
}

export function TabbedPortfolio({
  profile,
  education,
  experience,
  research,
  certificates,
  tagDefinitions,
  skills,
}: TabbedPortfolioProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Đồng bộ với URL hash khi tải trang hoặc khi người dùng bấm nút Back/Forward
  useEffect(() => {
    const parseHash = () => {
      const raw = window.location.hash.replace("#", "").toLowerCase();
      if (!raw) return;

      // Hỗ trợ alias
      if (raw === "about" || raw === "hero") {
        setActiveTab("overview");
      } else if (raw === "education" || raw === "experience") {
        setActiveTab("timeline");
      } else if (VALID_TABS.includes(raw as TabId)) {
        setActiveTab(raw as TabId);
      }
    };

    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const handleSelectTab = useCallback((tabId: string) => {
    const target = VALID_TABS.includes(tabId as TabId)
      ? (tabId as TabId)
      : "overview";

    setActiveTab(target);
    window.history.pushState(null, "", `#${target}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* ── Navigation Bar cố định trên đỉnh ── */}
      <Navbar
        name={profile.name}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* ── Nội dung từng Tab được chuyển tiếp mượt mà ── */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "overview" && (
              <OverviewTab
                profile={profile}
                education={education}
                experience={experience}
                research={research}
                certificates={certificates}
                onSelectTab={handleSelectTab}
              />
            )}

            {activeTab === "timeline" && (
              <div className="pt-20">
                <Timeline education={education} experience={experience} />
              </div>
            )}

            {activeTab === "research" && (
              <div className="pt-20">
                <Research items={research} />
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="pt-20">
                <Certificates
                  certificates={certificates}
                  tagDefinitions={tagDefinitions}
                />
              </div>
            )}

            {activeTab === "skills" && (
              <div className="pt-20">
                <Skills skills={skills} />
              </div>
            )}

            {activeTab === "contact" && (
              <div className="pt-20">
                <Contact profile={profile} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-200/60 dark:border-stone-800/60 py-8 px-4 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {profile.name.vi} ({profile.name.en}). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSelectTab("overview")}
              className="hover:underline cursor-pointer"
            >
              ↑ Về trang chủ (Tổng quan)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
