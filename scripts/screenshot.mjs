/**
 * Chụp ảnh màn hình 4 chế độ: Theme A desktop/mobile + Theme B desktop/mobile
 */
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'screenshots');
const BASE_URL = 'http://localhost:3000';

const SHOTS = [
  {
    file: 'theme-a-desktop-light.png',
    url: `${BASE_URL}/?theme=a&lang=vi&mode=light`,
    viewport: { width: 1440, height: 900 },
    label: 'Theme A — Học thuật | Desktop Light'
  },
  {
    file: 'theme-a-mobile-light.png',
    url: `${BASE_URL}/?theme=a&lang=vi&mode=light`,
    viewport: { width: 390, height: 844 },
    label: 'Theme A — Học thuật | Mobile Light'
  },
  {
    file: 'theme-b-desktop-dark.png',
    url: `${BASE_URL}/?theme=b&lang=vi&mode=dark`,
    viewport: { width: 1440, height: 900 },
    label: 'Theme B — Tối giản tối | Desktop Dark'
  },
  {
    file: 'theme-b-mobile-dark.png',
    url: `${BASE_URL}/?theme=b&lang=vi&mode=dark`,
    viewport: { width: 390, height: 844 },
    label: 'Theme B — Tối giản tối | Mobile Dark'
  },
  {
    file: 'theme-a-desktop-dark.png',
    url: `${BASE_URL}/?theme=a&lang=en&mode=dark`,
    viewport: { width: 1440, height: 900 },
    label: 'Theme A — Học thuật | Desktop Dark (EN)'
  },
  {
    file: 'theme-b-desktop-light.png',
    url: `${BASE_URL}/?theme=b&lang=en&mode=light`,
    viewport: { width: 1440, height: 900 },
    label: 'Theme B — Tối giản | Desktop Light (EN)'
  },
];

async function run() {
  console.log('🎬 Khởi động Playwright...');
  const browser = await chromium.launch({ headless: true });

  for (const shot of SHOTS) {
    console.log(`📸 Chụp: ${shot.label}`);
    const context = await browser.newContext({ viewport: shot.viewport });
    const page = await context.newPage();

    try {
      await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 30000 });
      // Chờ fonts load + animations settle
      await page.waitForTimeout(1500);

      const outPath = path.join(SCREENSHOTS_DIR, shot.file);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`  ✅ Lưu: screenshots/${shot.file}`);
    } catch (err) {
      console.log(`  ❌ Lỗi: ${err.message}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('\n✅ Hoàn thành! Ảnh lưu tại /screenshots/');
}

run().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

