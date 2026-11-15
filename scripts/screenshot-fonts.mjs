import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'screenshots');
const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/16bd878e-7346-499d-be93-9e6f3d7a0a6b/screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

const FONTS = [
  {
    id: 'garamond',
    name: '1. Cormorant Garamond + Lora',
    style: 'Bản thảo & Hàn lâm Cổ điển (Academic Archive)',
    filename: 'font-1-garamond.png',
  },
  {
    id: 'newsreader',
    name: '2. Newsreader + Be Vietnam Pro',
    style: 'Báo chí & Tạp chí Nhân văn (Editorial Journal)',
    filename: 'font-2-newsreader.png',
  },
  {
    id: 'fraunces',
    name: '3. Fraunces + Be Vietnam Pro',
    style: 'Thủ công Đương đại & Điền dã (Artisanal & Warm)',
    filename: 'font-3-fraunces.png',
  },
  {
    id: 'playfair',
    name: '4. Playfair Display + Be Vietnam Pro',
    style: 'Sang trọng & Hiện đại (Modern Prestige)',
    filename: 'font-4-playfair.png',
  },
];

async function capture() {
  console.log('🚀 Khởi động Playwright để chụp 4 phong cách phông chữ...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 2, // Retina sharpness
  });
  const page = await context.newPage();

  for (const font of FONTS) {
    console.log(`\n📸 Đang chụp: ${font.name} (${font.style})...`);
    await page.goto(`http://localhost:3000/?theme=a&mode=light`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Thiết lập thuộc tính data-font và kích hoạt cập nhật
    await page.evaluate((fontId) => {
      document.documentElement.setAttribute('data-font', fontId);
      // Áp dụng class css trực tiếp nếu cần
      document.documentElement.style.setProperty(
        '--font-heading',
        fontId === 'garamond'
          ? 'var(--font-cormorant)'
          : fontId === 'newsreader'
          ? 'var(--font-newsreader)'
          : fontId === 'fraunces'
          ? 'var(--font-fraunces)'
          : 'var(--font-playfair)'
      );
      document.documentElement.style.setProperty(
        '--font-body',
        fontId === 'garamond' ? 'var(--font-lora)' : 'var(--font-be-vietnam)'
      );
    }, font.id);

    // Chờ 1.5s để font chữ render đầy đủ và animation ổn định
    await page.waitForTimeout(1800);

    const localOut = path.join(SCREENSHOTS_DIR, font.filename);
    const artifactOut = path.join(ARTIFACTS_DIR, font.filename);

    await page.screenshot({ path: localOut, fullPage: false });
    fs.copyFileSync(localOut, artifactOut);
    console.log(`  ✅ Đã lưu ảnh: ${font.filename}`);
  }

  await browser.close();
  console.log('\n🎉 Hoàn thành chụp ảnh 4 bộ phông chữ!');
}

capture().catch((err) => {
  console.error('Lỗi khi chụp ảnh:', err);
  process.exit(1);
});
