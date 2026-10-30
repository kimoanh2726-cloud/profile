/**
 * Script: check-build-output.ts
 * ================================
 * Quét thư mục .next/static và public để đảm bảo:
 *   1. Không có file private nào từ /documents bị copy sang build
 *   2. Không có số điện thoại lọt vào bundle JS/HTML
 *   3. Không có mục "private" nào xuất hiện trong JSON/JS bundle
 *
 * Chạy: npm run check-build
 * Thường dùng trong CI sau khi `npm run build`.
 */

import fs from "fs";
import path from "path";

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
function success(text: string) { console.log(`  ${GREEN}✅ ${text}${RESET}`); }
function warn(text: string)    { console.log(`  ${YELLOW}⚠️  ${text}${RESET}`); }
function errorMsg(text: string){ console.log(`  ${RED}❌ ${text}${RESET}`); }

// ─── Config ─────────────────────────────────────────────────────────

const PROJECT_ROOT = (() => {
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
})();

const BUILD_DIR       = path.join(PROJECT_ROOT, ".next");
const PUBLIC_DIR      = path.join(PROJECT_ROOT, "public");
const DOCUMENTS_DIR   = path.join(PROJECT_ROOT, "documents");

/**
 * Các pattern nhạy cảm cần tìm trong bundle:
 * - Số điện thoại VN (0[0-9]{9})
 * - Chuỗi "visibility":"private"
 * - Chuỗi "phone":"..."
 */
const SENSITIVE_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  {
    pattern: /\b0[0-9]{9}\b/,
    label: "Số điện thoại VN (10 chữ số bắt đầu 0)",
  },
  {
    pattern: /"visibility"\s*:\s*"private"/,
    label: 'Thuộc tính "visibility":"private" trong bundle',
  },
  {
    pattern: /"phone"\s*:\s*"[^"]+"/,
    label: 'Trường "phone" trong bundle',
  },
  {
    pattern: /0[689]\d{2}[\s\-]?\d{3}[\s\-]?\d{3}/,
    label: "Mẫu số điện thoại có dấu gạch/khoảng trắng",
  },
];

// ─── Helper ─────────────────────────────────────────────────────────

function walkFiles(dir: string, exts: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

function relativePath(p: string): string {
  return p.replace(PROJECT_ROOT, "").replace(/\\/g, "/");
}

// ─── Kiểm tra 1: /documents không bị copy sang public/ ──────────────

function checkDocumentsNotInPublic(): boolean {
  let ok = true;
  header("Kiểm tra /documents không lọt vào /public");

  if (!fs.existsSync(PUBLIC_DIR)) {
    success("Thư mục /public không tồn tại — OK");
    return true;
  }

  // Kiểm tra xem có thư mục documents/ nào trong public không
  const publicDocDir = path.join(PUBLIC_DIR, "documents");
  if (fs.existsSync(publicDocDir)) {
    errorMsg(`Thư mục documents/ tồn tại trong /public — RỦI RO BẢO MẬT!`);
    errorMsg(`  Hãy xóa: ${relativePath(publicDocDir)}`);
    ok = false;
  } else {
    success("Không có thư mục documents/ trong /public");
  }

  // Kiểm tra file PDF/DOCX/JPG private trong public
  const privateDocFiles = walkFiles(DOCUMENTS_DIR, [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]);
  if (privateDocFiles.length > 0) {
    const publicFiles = walkFiles(PUBLIC_DIR, [".pdf", ".doc", ".docx"]);
    for (const docFile of privateDocFiles) {
      const filename = path.basename(docFile);
      const found = publicFiles.find((f) => path.basename(f) === filename);
      if (found) {
        errorMsg(`File private đã lọt vào /public: ${relativePath(found)}`);
        ok = false;
      }
    }
  }

  if (ok) success("Không có file private nào lọt vào /public");
  return ok;
}

// ─── Kiểm tra 2: Bundle JS không chứa dữ liệu nhạy cảm ─────────────

function checkBundleForSensitiveData(): boolean {
  let ok = true;
  header("Kiểm tra bundle JS không chứa dữ liệu nhạy cảm");

  if (!fs.existsSync(BUILD_DIR)) {
    warn("Thư mục .next/ không tồn tại — chạy `npm run build` trước");
    return true;  // Không lỗi, chỉ bỏ qua
  }

  const jsFiles = walkFiles(path.join(BUILD_DIR, "static"), [".js"]);
  const htmlFiles = walkFiles(BUILD_DIR, [".html"]);
  const filesToCheck = [...jsFiles, ...htmlFiles];

  if (filesToCheck.length === 0) {
    warn("Không tìm thấy file JS/HTML trong .next/ — có thể build chưa xong");
    return true;
  }

  console.log(`  Đang quét ${filesToCheck.length} file...`);

  let issueCount = 0;
  for (const file of filesToCheck) {
    let content: string;
    try {
      content = fs.readFileSync(file, "utf-8");
    } catch {
      continue;  // File binary, bỏ qua
    }

    for (const { pattern, label } of SENSITIVE_PATTERNS) {
      if (pattern.test(content)) {
        errorMsg(`[${relativePath(file)}] Tìm thấy dữ liệu nhạy cảm: ${label}`);
        issueCount++;
        ok = false;
      }
    }
  }

  if (ok) {
    success(`Quét ${filesToCheck.length} file — Không tìm thấy dữ liệu nhạy cảm`);
  } else {
    errorMsg(`Tìm thấy ${issueCount} vấn đề bảo mật trong bundle`);
  }
  return ok;
}

// ─── Kiểm tra 3: public/ chỉ chứa file được phép ───────────────────

function checkPublicOnlyAllowedFiles(): boolean {
  header("Kiểm tra /public chỉ chứa file được phép");

  if (!fs.existsSync(PUBLIC_DIR)) {
    success("Thư mục /public không tồn tại — OK");
    return true;
  }

  // Các extension không nên có trong public (trừ khi là public intentionally)
  const sensitiveExts = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
  const publicFiles = walkFiles(PUBLIC_DIR, sensitiveExts);

  if (publicFiles.length === 0) {
    success("Không có file nhạy cảm (PDF/DOC/XLS) trong /public");
    return true;
  }

  // Cảnh báo nhưng không lỗi — có thể là file được phép public
  for (const file of publicFiles) {
    warn(`File nhạy cảm trong /public: ${relativePath(file)} — Hãy xác nhận đây là file public có chủ đích`);
  }
  return true;  // Chỉ warn, không lỗi
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}║  PROFILE HUB — Kiểm tra bảo mật build       ║${RESET}`);
  console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════╝${RESET}`);

  const results = [
    checkDocumentsNotInPublic(),
    checkBundleForSensitiveData(),
    checkPublicOnlyAllowedFiles(),
  ];

  header("KẾT QUẢ");
  const allOk = results.every(Boolean);

  if (allOk) {
    console.log(`  ${GREEN}${BOLD}✅ BUILD OUTPUT AN TOÀN — Không tìm thấy dữ liệu nhạy cảm${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`  ${RED}${BOLD}❌ PHÁT HIỆN VẤN ĐỀ BẢO MẬT — Hãy kiểm tra và sửa trước khi deploy!${RESET}\n`);
    process.exit(1);
  }
}

main();
