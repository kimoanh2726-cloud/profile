/**
 * Data Loader — Đọc tất cả file YAML từ /data và parse thành object TypeScript
 * ===============================================================================
 * File này là cầu nối giữa dữ liệu YAML (nguồn sự thật) và code TypeScript.
 * Được dùng bởi: web portfolio, script xuất CV/PDF, và script validate.
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import {
  ProfileSchema,
  EducationSchema,
  ExperienceSchema,
  SkillsSchema,
  ResearchSchema,
  CertificatesSchema,
  LinksSchema,
  loadTagDefinitions,
  type ProfileHub,
  type Profile,
  type EducationItem,
  type ExperienceItem,
  type SkillItem,
  type ResearchItem,
  type CertificateItem,
  type LinkItem,
  type TagDefinition,
} from "./schema";

// ─── Đường dẫn ──────────────────────────────────────────────────────

/** Tìm thư mục gốc dự án (nơi có package.json) */
function findProjectRoot(): string {
  let dir = process.cwd();
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      // Kiểm tra đây có phải project profile-hub không
      try {
        const pkg = JSON.parse(
          fs.readFileSync(path.join(dir, "package.json"), "utf-8")
        );
        if (pkg.name === "profile-hub") return dir;
      } catch {
        // Bỏ qua, thử thư mục cha
      }
    }
    dir = path.dirname(dir);
  }
  // Fallback: dùng cwd
  return process.cwd();
}

const PROJECT_ROOT = findProjectRoot();
const DATA_DIR = path.join(PROJECT_ROOT, "data");

// ─── Helper đọc YAML ────────────────────────────────────────────────

function readYaml<T>(filename: string): T {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    throw new Error(`❌ Không tìm thấy file: ${filepath}`);
  }
  const content = fs.readFileSync(filepath, "utf-8");
  return yaml.load(content) as T;
}

// ─── Các hàm load riêng lẻ ──────────────────────────────────────────

export function loadProfile(): Profile {
  const raw = readYaml("profile.yaml");
  return ProfileSchema.parse(raw);
}

export function loadEducation(): EducationItem[] {
  const raw = readYaml<unknown[]>("education.yaml");
  return EducationSchema.parse(raw);
}

export function loadExperience(): ExperienceItem[] {
  const raw = readYaml<unknown[]>("experience.yaml");
  return ExperienceSchema.parse(raw);
}

export function loadSkills(): SkillItem[] {
  const raw = readYaml<unknown[]>("skills.yaml");
  return SkillsSchema.parse(raw);
}

export function loadResearch(): ResearchItem[] {
  const raw = readYaml<unknown[]>("research.yaml");
  return ResearchSchema.parse(raw);
}

export function loadCertificates(): CertificateItem[] {
  const raw = readYaml<unknown[]>("certificates.yaml");
  return CertificatesSchema.parse(raw);
}

export function loadLinks(): LinkItem[] {
  const raw = readYaml<unknown[]>("links.yaml");
  return LinksSchema.parse(raw);
}

// ─── Load tags ───────────────────────────────────────────────────────

export { loadTagDefinitions } from "./schema";
export type { TagDefinition } from "./schema";

// ─── Load toàn bộ Hub ────────────────────────────────────────────────

export function loadProfileHub(): ProfileHub {
  return {
    profile: loadProfile(),
    education: loadEducation(),
    experience: loadExperience(),
    skills: loadSkills(),
    research: loadResearch(),
    certificates: loadCertificates(),
    links: loadLinks(),
  };
}

// ─── Lọc chỉ mục public & loại bỏ thông tin nhạy cảm ─────────────

/**
 * Loại bỏ các trường nhạy cảm/nội bộ (như documentPath) khỏi dữ liệu trước khi gửi tới client
 */
function sanitizePublicItem<T>(item: T): T {
  if (item && typeof item === "object" && "documentPath" in item) {
    const sanitized = { ...(item as Record<string, unknown>) };
    delete sanitized.documentPath;
    return sanitized as T;
  }
  return item;
}

export function loadPublicHub(): ProfileHub {
  const hub = loadProfileHub();

  // 1. Loại bỏ trường phone (private) khỏi profile để không bị serialize vào client payload
  const { phone: _phone, ...safeProfile } = hub.profile;

  // 2. Lọc chỉ các mục public và loại bỏ đường dẫn file nội bộ documentPath
  return {
    profile: safeProfile as Profile,
    education: hub.education
      .filter((e) => e.visibility === "public")
      .map(sanitizePublicItem),
    experience: hub.experience
      .filter((e) => e.visibility === "public")
      .map(sanitizePublicItem),
    skills: hub.skills
      .filter((e) => e.visibility === "public")
      .map(sanitizePublicItem),
    research: hub.research
      .filter((e) => e.visibility === "public")
      .map(sanitizePublicItem),
    certificates: hub.certificates
      .filter((e) => e.visibility === "public")
      .map(sanitizePublicItem),
    links: hub.links
      .filter((e) => e.visibility === "public")
      .map(sanitizePublicItem),
  };
}

// ─── Lọc theo tag ───────────────────────────────────────────────────

export function filterByTag(hub: ProfileHub, tag: string): ProfileHub {
  const hasTag = (tags: string[]) => tags.includes(tag);
  return {
    profile: hub.profile,
    education: hub.education.filter((e) => hasTag(e.tags)),
    experience: hub.experience.filter((e) => hasTag(e.tags)),
    skills: hub.skills.filter((e) => hasTag(e.tags)),
    research: hub.research.filter((e) => hasTag(e.tags)),
    certificates: hub.certificates.filter((e) => hasTag(e.tags)),
    links: hub.links.filter((e) => hasTag(e.tags)),
  };
}
