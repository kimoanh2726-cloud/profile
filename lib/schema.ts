/**
 * Schema Zod cho Profile Hub
 * ============================
 * Đây là "hợp đồng dữ liệu" — mọi file YAML trong /data đều phải tuân theo.
 * Nếu dữ liệu sai, script validate sẽ báo lỗi và build sẽ không chạy.
 *
 * v2.0: Tag đọc từ data/tags.yaml; thêm featured/priority, credential_id,
 *       verify_url, no_expiry, description nhiều độ dài (short/medium/long).
 */

import { z } from "zod";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// ─── Load tags từ file YAML ──────────────────────────────────────────

/** Tìm thư mục gốc dự án */
function findProjectRoot(): string {
  let dir = typeof __dirname !== "undefined" ? __dirname : process.cwd();
  // Trong ESM, __dirname không tồn tại — dùng process.cwd() trực tiếp
  dir = process.cwd();
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      try {
        const pkg = JSON.parse(
          fs.readFileSync(path.join(dir, "package.json"), "utf-8")
        );
        if (pkg.name === "profile-hub") return dir;
      } catch {
        // bỏ qua
      }
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

interface TagDefinition {
  id: string;
  label: { vi: string; en: string };
}

/** Đọc danh sách tag từ data/tags.yaml */
export function loadTagDefinitions(): TagDefinition[] {
  const tagsPath = path.join(findProjectRoot(), "data", "tags.yaml");
  if (!fs.existsSync(tagsPath)) {
    throw new Error(`❌ Không tìm thấy file tags.yaml: ${tagsPath}`);
  }
  return yaml.load(fs.readFileSync(tagsPath, "utf-8")) as TagDefinition[];
}

/** Lấy danh sách ID tag hợp lệ (đọc lúc runtime) */
function getValidTagIds(): string[] {
  try {
    return loadTagDefinitions().map((t) => t.id);
  } catch {
    // Fallback khi chạy ở môi trường không có file system (edge runtime)
    return [
      "hoc-bong", "viec-lam", "hoc-thuat", "nghien-cuu", "ky-nang",
      "hoat-dong", "tinh-nguyen", "giai-thuong", "ngon-ngu", "cong-nghe", "khac",
    ];
  }
}

// ─── Các kiểu dùng chung ───────────────────────────────────────────

/** Nội dung song ngữ Việt/Anh — cả hai đều required */
export const BilingualText = z.object({
  vi: z.string().min(1, "Cần có nội dung tiếng Việt"),
  en: z.string().min(1, "Cần có nội dung tiếng Anh"),
});
export type BilingualText = z.infer<typeof BilingualText>;

/** Nội dung song ngữ — bản "en" optional (validate cảnh báo riêng) */
export const BilingualTextOptionalEn = z.object({
  vi: z.string().min(1, "Cần có nội dung tiếng Việt"),
  en: z.string().optional(),
});

/** Ngày tháng (YYYY-MM-DD hoặc YYYY-MM hoặc YYYY) */
export const DateString = z
  .string()
  .regex(
    /^\d{4}(-\d{2})?(-\d{2})?$/,
    "Ngày phải theo định dạng YYYY, YYYY-MM hoặc YYYY-MM-DD"
  );

/**
 * Tag phân loại — validate runtime từ tags.yaml.
 * Dùng z.string() + superRefine để cho phép mở rộng không cần sửa code.
 */
export const Tag = z.string().refine(
  (val) => getValidTagIds().includes(val),
  (val) => ({ message: `Tag "${val}" không tồn tại trong data/tags.yaml` })
);
export type Tag = z.infer<typeof Tag>;

/** Mức độ hiển thị */
export const Visibility = z.enum(["public", "private"]);

/** Mô tả nhiều độ dài — tất cả optional */
export const MultiLengthDescription = z.object({
  short:  z.string().optional(),   // ≤ 100 ký tự — dùng cho thẻ
  medium: z.string().optional(),   // ≤ 300 ký tự — dùng cho danh sách
  long:   z.string().optional(),   // full — dùng cho trang chi tiết
});

// ─── Profile (thông tin cá nhân) ────────────────────────────────────

export const ProfileSchema = z.object({
  schema_version: z.string().optional(),        // v2.0+: "2.0"
  id: z.literal("profile"),
  name: BilingualText,
  title: BilingualText,
  bio: BilingualText,
  /** Mô tả nhiều độ dài — bổ sung v2.0 */
  bio_lengths: z.object({
    vi: MultiLengthDescription,
    en: MultiLengthDescription,
  }).optional(),
  avatar: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),                  // Private — KHÔNG hiển thị public
  location: BilingualText.optional(),
  website: z.string().url().optional(),
  social: z
    .object({
      github:   z.string().optional(),
      linkedin: z.string().optional(),
      twitter:  z.string().optional(),
      facebook: z.string().optional(),
      orcid:    z.string().optional(),
      scholar:  z.string().optional(),
    })
    .optional(),
  /** Nội dung nổi bật hiển thị ở Hero */
  featured: z.boolean().optional(),
  priority: z.number().int().min(0).optional(),  // Thứ tự ưu tiên (nhỏ hơn = ưu tiên hơn)
});
export type Profile = z.infer<typeof ProfileSchema>;

// ─── Education (học vấn) ────────────────────────────────────────────

export const EducationItemSchema = z.object({
  id: z.string().min(1),
  title: BilingualText,
  institution: BilingualText,
  degree:      BilingualText.optional(),
  field:       BilingualText.optional(),
  startDate:   DateString,
  endDate:     DateString.optional(),
  gpa:         z.string().optional(),
  description: BilingualText.optional(),
  /** Mô tả nhiều độ dài */
  description_lengths: z.object({
    vi: MultiLengthDescription,
    en: MultiLengthDescription,
  }).optional(),
  tags:         z.array(Tag).default(["hoc-thuat"]),
  visibility:   Visibility.default("private"),
  documentPath: z.string().optional(),
  featured:     z.boolean().optional(),
  priority:     z.number().int().min(0).optional(),
});
export type EducationItem = z.infer<typeof EducationItemSchema>;

export const EducationSchema = z.array(EducationItemSchema);

// ─── Experience (kinh nghiệm) ───────────────────────────────────────

export const ExperienceItemSchema = z.object({
  id:           z.string().min(1),
  title:        BilingualText,
  organization: BilingualText,
  type:         z.enum(["work", "internship", "volunteer", "project"]),
  startDate:    DateString,
  endDate:      DateString.optional(),
  description:  BilingualText,
  description_lengths: z.object({
    vi: MultiLengthDescription,
    en: MultiLengthDescription,
  }).optional(),
  highlights:   z.array(BilingualText).optional(),
  tags:         z.array(Tag).default(["viec-lam"]),
  visibility:   Visibility.default("private"),
  documentPath: z.string().optional(),
  link:         z.string().url().optional(),
  featured:     z.boolean().optional(),
  priority:     z.number().int().min(0).optional(),
});
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

export const ExperienceSchema = z.array(ExperienceItemSchema);

// ─── Skills (kỹ năng) ───────────────────────────────────────────────

export const SkillItemSchema = z.object({
  id:       z.string().min(1),
  name:     BilingualText,
  category: BilingualText,
  level:    z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  description: BilingualText.optional(),
  description_lengths: z.object({
    vi: MultiLengthDescription,
    en: MultiLengthDescription,
  }).optional(),
  tags:       z.array(Tag).default(["ky-nang"]),
  visibility: Visibility.default("private"),
  featured:   z.boolean().optional(),
  priority:   z.number().int().min(0).optional(),
});
export type SkillItem = z.infer<typeof SkillItemSchema>;

export const SkillsSchema = z.array(SkillItemSchema);

// ─── Research (nghiên cứu & bài viết) ───────────────────────────────

export const ResearchItemSchema = z.object({
  id:    z.string().min(1),
  title: BilingualText,
  type:  z.enum([
    "paper",
    "thesis",
    "presentation",
    "blog",
    "book-chapter",
    "report",
  ]),
  abstract:    BilingualText.optional(),
  abstract_lengths: z.object({
    vi: MultiLengthDescription,
    en: MultiLengthDescription,
  }).optional(),
  authors:     z.array(z.string()).optional(),
  publication: BilingualText.optional(),
  date:        DateString,
  doi:         z.string().optional(),
  link:        z.string().url().optional(),
  tags:        z.array(Tag).default(["nghien-cuu"]),
  visibility:  Visibility.default("private"),
  documentPath: z.string().optional(),
  featured:    z.boolean().optional(),
  priority:    z.number().int().min(0).optional(),
});
export type ResearchItem = z.infer<typeof ResearchItemSchema>;

export const ResearchSchema = z.array(ResearchItemSchema);

// ─── Certificates (chứng chỉ) ──────────────────────────────────────

export const CertificateItemSchema = z.object({
  id:            z.string().min(1),
  title:         BilingualText,
  issuer:        BilingualText,
  date:          DateString,
  expiryDate:    DateString.optional(),
  /** no_expiry: true → vĩnh viễn, bỏ qua expiryDate */
  no_expiry:     z.boolean().optional(),
  credentialId:  z.string().optional(),               // Mã xác minh (alias: credential_id)
  credential_id: z.string().optional(),               // snake_case alias
  credentialUrl: z.string().url().optional(),
  verify_url:    z.string().url().optional(),          // snake_case alias
  description:   BilingualText.optional(),
  description_lengths: z.object({
    vi: MultiLengthDescription,
    en: MultiLengthDescription,
  }).optional(),
  tags:         z.array(Tag).default(["ky-nang"]),
  visibility:   Visibility.default("private"),
  documentPath: z.string().optional(),
  featured:     z.boolean().optional(),
  priority:     z.number().int().min(0).optional(),
});
export type CertificateItem = z.infer<typeof CertificateItemSchema>;

export const CertificatesSchema = z.array(CertificateItemSchema);

// ─── Links (liên kết / dự án) ──────────────────────────────────────

export const LinkItemSchema = z.object({
  id:          z.string().min(1),
  title:       BilingualText,
  url:         z.string().url(),
  type:        z.enum(["project", "portfolio", "social", "publication", "other"]),
  description: BilingualText.optional(),
  thumbnail:   z.string().optional(),
  tags:        z.array(Tag).default(["khac"]),
  visibility:  Visibility.default("private"),
  featured:    z.boolean().optional(),
  priority:    z.number().int().min(0).optional(),
});
export type LinkItem = z.infer<typeof LinkItemSchema>;

export const LinksSchema = z.array(LinkItemSchema);

// ─── Toàn bộ Hub ────────────────────────────────────────────────────

export const ProfileHubSchema = z.object({
  profile:      ProfileSchema,
  education:    EducationSchema,
  experience:   ExperienceSchema,
  skills:       SkillsSchema,
  research:     ResearchSchema,
  certificates: CertificatesSchema,
  links:        LinksSchema,
});
export type ProfileHub = z.infer<typeof ProfileHubSchema>;

// ─── TagDefinition (export cho UI) ──────────────────────────────────

export interface TagDefinition {
  id: string;
  label: { vi: string; en: string };
}

// ─── Helper: kiểm tra chứng chỉ hết hạn ────────────────────────────

export interface CertificateStatus {
  id: string;
  title: string;
  status: "valid" | "expiring-soon" | "expired";
  daysUntilExpiry?: number;
  expiryDate?: string;
}

/**
 * Kiểm tra trạng thái hết hạn của chứng chỉ.
 * - "expiring-soon" = còn ≤ warningDays ngày (mặc định 60)
 * - "expired"       = đã qua ngày hết hạn
 * - no_expiry: true → luôn "valid"
 */
export function checkCertificateExpiry(
  cert: CertificateItem,
  warningDays = 60
): CertificateStatus {
  const base: CertificateStatus = {
    id: cert.id,
    title: cert.title.vi,
    status: "valid",
  };

  // Chứng chỉ vĩnh viễn
  if (cert.no_expiry) return base;
  if (!cert.expiryDate) return base;

  const now = new Date();
  const expiry = new Date(cert.expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    ...base,
    expiryDate: cert.expiryDate,
    daysUntilExpiry: diffDays,
    status:
      diffDays < 0 ? "expired" : diffDays <= warningDays ? "expiring-soon" : "valid",
  };
}

/** Lấy URL xác minh chứng chỉ (ưu tiên verify_url, rồi credentialUrl) */
export function getCertVerifyUrl(cert: CertificateItem): string | undefined {
  return cert.verify_url ?? cert.credentialUrl;
}

/** Lấy mã xác minh chứng chỉ (ưu tiên credential_id, rồi credentialId) */
export function getCertCredentialId(cert: CertificateItem): string | undefined {
  return cert.credential_id ?? cert.credentialId;
}
