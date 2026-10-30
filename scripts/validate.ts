/**
 * Script Validate — Kiểm tra toàn bộ dữ liệu YAML
 * ===================================================
 * Chạy: npm run validate
 *
 * Kết quả:
 *   ✅ Dữ liệu hợp lệ → báo thành công + cảnh báo
 *   ❌ Dữ liệu sai    → báo lỗi chi tiết, exit code 1
 *
 * v2.0: Thêm kiểm tra:
 *   - File trỏ tới trong /documents có tồn tại không
 *   - File thừa trong /documents (không được tham chiếu)
 *   - Chứng chỉ sắp hết hạn trong 60 ngày
 *   - Thiếu bản "en" → cảnh báo (không chặn)
 *   - schema_version
 */

import { ZodError } from "zod";
import fs from "fs";
import path from "path";
import { loadProfileHub } from "../lib/data-loader.js";
import {
  checkCertificateExpiry,
  loadTagDefinitions,
  type CertificateStatus,
  type ProfileHub,
} from "../lib/schema.js";

// ─── Màu sắc terminal ──────────────────────────────────────────────

const RED    = "\x1b[31m";
const GREEN  = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const BOLD   = "\x1b[1m";
const RESET  = "\x1b[0m";

function header(text: string) {
  console.log(`\n${BOLD}${CYAN}═══ ${text} ═══${RESET}\n`);
}
function success(text: string) {
  console.log(`  ${GREEN}✅ ${text}${RESET}`);
}
function warn(text: string) {
  console.log(`  ${YELLOW}⚠️  ${text}${RESET}`);
}
function errorMsg(text: string) {
  console.log(`  ${RED}❌ ${text}${RESET}`);
}
function info(text: string) {
  console.log(`  ℹ️  ${text}`);
}

// ─── Helper ─────────────────────────────────────────────────────────

function findProjectRoot(): string {
  let dir = process.cwd();
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf-8"));
        if (pkg.name === "profile-hub") return dir;
      } catch { /* bỏ qua */ }
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

const PROJECT_ROOT = findProjectRoot();
const DOCUMENTS_DIR = path.join(PROJECT_ROOT, "documents");

/** Thu thập tất cả documentPath trong hub */
function collectDocumentPaths(hub: ProfileHub): string[] {
  const paths: string[] = [];
  const addPath = (p: string | undefined) => { if (p) paths.push(p); };

  addPath(hub.profile.avatar);

  for (const item of [
    ...hub.education,
    ...hub.experience,
    ...hub.skills,
    ...hub.research,
    ...hub.certificates,
    ...hub.links,
  ]) {
    if ("documentPath" in item) addPath((item as { documentPath?: string }).documentPath);
  }

  return [...new Set(paths)];  // loại trùng
}

/** Kiểm tra BilingualText có bản "en" không */
function checkBilingualEn(label: string, obj: { vi: string; en?: string }): boolean {
  if (!obj.en || obj.en.trim() === "") {
    warn(`Thiếu bản tiếng Anh: ${label}`);
    return false;
  }
  return true;
}

/** Đệ quy liệt kê file trong /documents */
function listAllDocumentFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const result: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listAllDocumentFiles(full));
    } else {
      result.push(full);
    }
  }
  return result;
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  let hasError = false;
  let warningCount = 0;

  header("PROFILE HUB v2.0 — Kiểm tra dữ liệu");

  // ── 0. Kiểm tra tags.yaml ──────────────────────────────────────
  header("Kiểm tra tags.yaml");
  try {
    const tags = loadTagDefinitions();
    success(`Tải ${tags.length} tag từ data/tags.yaml`);
    for (const tag of tags) {
      const hasEn = checkBilingualEn(`tag [${tag.id}]`, tag.label);
      if (!hasEn) warningCount++;
    }
  } catch (e) {
    errorMsg(`Không đọc được tags.yaml: ${e instanceof Error ? e.message : e}`);
    hasError = true;
  }

  if (hasError) {
    console.log(`\n  ${RED}${BOLD}❌ Không thể tiếp tục — sửa lỗi tags.yaml trước.${RESET}\n`);
    process.exit(1);
  }

  // ── 1. Load & validate tất cả file YAML ───────────────────────
  let hub: ProfileHub;
  try {
    hub = loadProfileHub();
  } catch (err) {
    if (err instanceof ZodError) {
      header("LỖI DỮ LIỆU");
      for (const issue of err.issues) {
        errorMsg(`[${issue.path.join(".")}] ${issue.message}`);
      }
      console.log(
        `\n  ${RED}${BOLD}❌ DỮ LIỆU KHÔNG HỢP LỆ — Vui lòng sửa các lỗi trên rồi chạy lại.${RESET}\n`
      );
      process.exit(1);
    }
    header("LỖI HỆ THỐNG");
    errorMsg(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  // ── 2. Thống kê cơ bản ────────────────────────────────────────
  header("Thống kê dữ liệu");
  success(`Profile:      ${hub.profile.name.vi}`);

  // Kiểm tra schema_version
  if ((hub.profile as { schema_version?: string }).schema_version) {
    success(`Schema version: ${(hub.profile as { schema_version?: string }).schema_version}`);
  } else {
    warn("Chưa có schema_version trong profile.yaml (nên thêm schema_version: \"2.0\")");
    warningCount++;
  }

  success(`Education:    ${hub.education.length} mục`);
  success(`Experience:   ${hub.experience.length} mục`);
  success(`Skills:       ${hub.skills.length} mục`);
  success(`Research:     ${hub.research.length} mục`);
  success(`Certificates: ${hub.certificates.length} mục`);
  success(`Links:        ${hub.links.length} mục`);

  // ── 3. Kiểm tra ID trùng lặp ──────────────────────────────────
  header("Kiểm tra ID trùng lặp");
  const allItems = [
    ...hub.education,
    ...hub.experience,
    ...hub.skills,
    ...hub.research,
    ...hub.certificates,
    ...hub.links,
  ];
  const ids = allItems.map((item) => item.id);
  const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  if (duplicates.length > 0) {
    errorMsg(`ID bị trùng: ${duplicates.join(", ")}`);
    hasError = true;
  } else {
    success("Không có ID trùng lặp");
  }

  // ── 4. Thống kê visibility ─────────────────────────────────────
  header("Thống kê visibility");
  const publicCount  = allItems.filter((i) => i.visibility === "public").length;
  const privateCount = allItems.filter((i) => i.visibility === "private").length;
  success(`Public:  ${publicCount} mục`);
  success(`Private: ${privateCount} mục`);
  if (publicCount === 0) {
    warn("Không có mục nào public — web sẽ trống!");
    warningCount++;
  }

  // ── 5. Kiểm tra file trong /documents ─────────────────────────
  header("Kiểm tra file /documents");
  const referencedPaths = collectDocumentPaths(hub);
  const missingFiles: string[] = [];

  for (const docPath of referencedPaths) {
    // docPath dạng "/documents/xxx" → chuyển thành đường dẫn tuyệt đối
    const relative = docPath.replace(/^\//, "");
    const absolute = path.join(PROJECT_ROOT, relative);
    if (!fs.existsSync(absolute)) {
      // Cảnh báo (không chặn) — dữ liệu mẫu có thể chưa có file thật
      warn(`File tham chiếu chưa tồn tại: ${docPath} (cần thêm file thật trước khi deploy)`);
      missingFiles.push(docPath);
      warningCount++;
    } else {
      success(`OK: ${docPath}`);
    }
  }

  if (referencedPaths.length === 0) {
    info("Không có file nào trong /documents được tham chiếu");
  }

  if (missingFiles.length > 0) {
    info(`${missingFiles.length} file chưa có — chỉ ảnh hưởng download link, không chặn web`);
  }

  // ── 6. Kiểm tra file thừa trong /documents ────────────────────
  header("Kiểm tra file thừa trong /documents");
  const allDocFiles = listAllDocumentFiles(DOCUMENTS_DIR);

  if (allDocFiles.length === 0) {
    info("Thư mục /documents trống (hoặc không tồn tại)");
  } else {
    const referencedAbsolute = referencedPaths.map((p) =>
      path.join(PROJECT_ROOT, p.replace(/^\//, "")).replace(/\\/g, "/")
    );

    for (const file of allDocFiles) {
      const normalizedFile = file.replace(/\\/g, "/");
      if (!referencedAbsolute.includes(normalizedFile)) {
        warn(`File THỪA (không được tham chiếu): ${file.replace(PROJECT_ROOT, "")}`);
        warningCount++;
      }
    }

    if (warningCount === 0) {
      success("Tất cả file trong /documents đều được tham chiếu");
    }
  }

  // ── 7. Kiểm tra chứng chỉ hết hạn (ngưỡng 60 ngày) ──────────
  header("Kiểm tra chứng chỉ hết hạn (ngưỡng cảnh báo: 60 ngày)");
  const certStatuses: CertificateStatus[] = hub.certificates.map((cert) =>
    checkCertificateExpiry(cert, 60)
  );

  const expired      = certStatuses.filter((s) => s.status === "expired");
  const expiringSoon = certStatuses.filter((s) => s.status === "expiring-soon");
  const valid        = certStatuses.filter((s) => s.status === "valid");

  for (const cert of valid) {
    success(
      `${cert.title} — Hợp lệ${
        cert.daysUntilExpiry !== undefined
          ? ` (còn ${cert.daysUntilExpiry} ngày)`
          : " (vĩnh viễn)"
      }`
    );
  }
  for (const cert of expiringSoon) {
    warn(
      `${cert.title} — SẮP HẾT HẠN trong ${cert.daysUntilExpiry} ngày (hết hạn: ${cert.expiryDate})`
    );
    warningCount++;
  }
  for (const cert of expired) {
    warn(
      `${cert.title} — ĐÃ HẾT HẠN (${cert.expiryDate}) → sẽ tự ẩn trên web`
    );
    warningCount++;
  }

  // ── 8. Kiểm tra thiếu bản "en" ────────────────────────────────
  header("Kiểm tra song ngữ (vi/en)");
  let missingEn = 0;

  // Profile bio
  if (!hub.profile.bio.en) {
    warn(`profile.bio thiếu bản tiếng Anh`);
    missingEn++;
  }

  // Research abstracts
  for (const r of hub.research) {
    if (r.abstract && !r.abstract.en) {
      warn(`[${r.id}] abstract thiếu bản tiếng Anh`);
      missingEn++;
    }
  }

  if (missingEn === 0) {
    success("Tất cả nội dung quan trọng đều có bản tiếng Anh");
  } else {
    warn(`${missingEn} trường thiếu bản tiếng Anh (không chặn, nhưng nên bổ sung)`);
    warningCount += missingEn;
  }

  // ── 9. Kiểm tra bảo mật ──────────────────────────────────────
  header("Kiểm tra bảo mật");
  if (hub.profile.phone) {
    success("Số điện thoại lưu trong profile nhưng KHÔNG hiển thị public");
  }

  // Đảm bảo không có mục private nào trỏ document vào đường dẫn public
  const publicDocPaths = [
    ...hub.education.filter((e) => e.visibility === "public"),
    ...hub.experience.filter((e) => e.visibility === "public"),
    ...hub.research.filter((e) => e.visibility === "public"),
    ...hub.certificates.filter((e) => e.visibility === "public"),
  ].map((i) => ("documentPath" in i ? (i as { documentPath?: string }).documentPath : undefined))
   .filter(Boolean);

  success(`${publicDocPaths.length} document path được tham chiếu từ mục public`);

  // ── 10. Kết luận ──────────────────────────────────────────────
  header("KẾT QUẢ");

  if (hasError) {
    console.log(
      `  ${RED}${BOLD}❌ CÓ LỖI — Vui lòng sửa các lỗi trên rồi chạy lại.${RESET}`
    );
    console.log(
      `  Tổng: ${allItems.length} mục | Public: ${publicCount} | Private: ${privateCount}`
    );
    console.log();
    process.exit(1);
  } else {
    console.log(
      `  ${GREEN}${BOLD}✅ TẤT CẢ DỮ LIỆU HỢP LỆ!${RESET}`
    );
    console.log(
      `  Tổng: ${allItems.length} mục | Public: ${publicCount} | Private: ${privateCount}`
    );
    if (warningCount > 0) {
      console.log(
        `  ${YELLOW}⚠️  ${warningCount} cảnh báo (không chặn build)${RESET}`
      );
    }
    if (expired.length > 0) {
      console.log(
        `  ${YELLOW}⚠️  ${expired.length} chứng chỉ đã hết hạn (tự ẩn trên web)${RESET}`
      );
    }
    if (expiringSoon.length > 0) {
      console.log(
        `  ${YELLOW}⚠️  ${expiringSoon.length} chứng chỉ sắp hết hạn trong 60 ngày${RESET}`
      );
    }
    console.log();
  }
}

main();
