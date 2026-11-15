import type { Settings } from "./defaults";

// ─── Types ───────────────────────────────────────────────────────────────────
export type SettingGroup =
  | "appearance"
  | "motion"
  | "display"
  | "certificates"
  | "accessibility"
  | "advanced";

export type SettingType = "toggle" | "select" | "color" | "slider";

export interface SelectOption {
  value: string;
  labelVi: string;
  labelEn: string;
}

/**
 * Definition of a single setting.
 *
 * - `bridgedTo`: if set, the value lives in ThemeProvider (not SettingsContext).
 *   The panel will read/write through ThemeProvider setters instead.
 * - `applyToDOM`: called whenever the setting changes to reflect it via CSS
 *   custom properties / data-attributes on <html>.
 * - `showWhen`: predicate — if returns false, control is hidden.
 */
export interface SettingDef {
  id: string;
  group: SettingGroup;
  type: SettingType;
  labelVi: string;
  labelEn: string;
  descriptionVi?: string;
  descriptionEn?: string;
  default: unknown;
  options?: SelectOption[]; // for select type
  min?: number; // for slider type
  max?: number;
  step?: number;
  bridgedTo?: "theme" | "lang" | "colorMode"; // lives in ThemeProvider
  applyToDOM?: (value: unknown, root: HTMLElement) => void;
  showWhen?: (settings: Partial<Settings>) => boolean;
}

// ─── Group labels ─────────────────────────────────────────────────────────────
export const GROUP_LABELS: Record<SettingGroup, { vi: string; en: string }> = {
  appearance: { vi: "Giao diện", en: "Appearance" },
  motion: { vi: "Chuyển động", en: "Motion" },
  display: { vi: "Ngôn ngữ & Hiển thị", en: "Language & Display" },
  certificates: { vi: "Chứng chỉ", en: "Certificates" },
  accessibility: { vi: "Trợ năng", en: "Accessibility" },
  advanced: { vi: "Nâng cao", en: "Advanced" },
};

export const ALL_GROUPS: SettingGroup[] = [
  "appearance",
  "motion",
  "display",
  "certificates",
  "accessibility",
  "advanced",
];

// ─── Registry ────────────────────────────────────────────────────────────────
export const SETTINGS_REGISTRY: SettingDef[] = [
  // ── Appearance ──────────────────────────────────────────────────────────
  {
    id: "theme",
    group: "appearance",
    type: "select",
    labelVi: "Phong cách",
    labelEn: "Theme Style",
    default: "a",
    bridgedTo: "theme",
    options: [
      { value: "a", labelVi: "A — Học thuật", labelEn: "A — Academic" },
      { value: "b", labelVi: "B — Hiện đại", labelEn: "B — Modern" },
    ],
  },
  {
    id: "colorMode",
    group: "appearance",
    type: "select",
    labelVi: "Chế độ màu",
    labelEn: "Color Mode",
    default: "light",
    bridgedTo: "colorMode",
    options: [
      { value: "light", labelVi: "Sáng", labelEn: "Light" },
      { value: "dark", labelVi: "Tối", labelEn: "Dark" },
    ],
  },
  {
    id: "fontFamily",
    group: "appearance",
    type: "select",
    labelVi: "Bộ phông chữ",
    labelEn: "Typography Style",
    descriptionVi: "Chọn kiểu chữ thể hiện tinh thần học thuật & nghiên cứu nhân văn",
    descriptionEn: "Select typography style matching academic & humanities spirit",
    default: "garamond",
    options: [
      { value: "garamond", labelVi: "1. Garamond — Bản thảo & Hàn lâm Cổ điển", labelEn: "1. Garamond — Academic Classic" },
      { value: "newsreader", labelVi: "2. Newsreader — Tạp chí & Báo chí Nhân văn", labelEn: "2. Newsreader — Editorial & Journal" },
      { value: "fraunces", labelVi: "3. Fraunces — Thủ công Đương đại & Điền dã", labelEn: "3. Fraunces — Artisanal & Warm" },
      { value: "playfair", labelVi: "4. Playfair — Sang trọng Hiện đại", labelEn: "4. Playfair — Modern Prestige" },
    ],
    applyToDOM: (val, root) => {
      root.setAttribute("data-font", String(val));
    },
  },
  {
    id: "fontSize",
    group: "appearance",
    type: "select",
    labelVi: "Cỡ chữ",
    labelEn: "Font Size",
    default: "md",
    options: [
      { value: "sm", labelVi: "Nhỏ", labelEn: "Small" },
      { value: "md", labelVi: "Vừa", labelEn: "Medium" },
      { value: "lg", labelVi: "Lớn", labelEn: "Large" },
    ],
    applyToDOM: (val, root) => {
      root.setAttribute("data-font-size", String(val));
    },
  },
  {
    id: "contentWidth",
    group: "appearance",
    type: "select",
    labelVi: "Độ rộng nội dung",
    labelEn: "Content Width",
    default: "normal",
    options: [
      { value: "narrow", labelVi: "Hẹp", labelEn: "Narrow" },
      { value: "normal", labelVi: "Thường", labelEn: "Normal" },
      { value: "wide", labelVi: "Rộng", labelEn: "Wide" },
    ],
    applyToDOM: (val, root) => {
      root.setAttribute("data-content-width", String(val));
    },
  },
  {
    id: "cardRadius",
    group: "appearance",
    type: "select",
    labelVi: "Bo góc thẻ",
    labelEn: "Card Radius",
    default: "md",
    options: [
      { value: "none", labelVi: "Vuông", labelEn: "Square" },
      { value: "sm", labelVi: "Nhẹ", labelEn: "Slight" },
      { value: "md", labelVi: "Vừa", labelEn: "Medium" },
      { value: "lg", labelVi: "Nhiều", labelEn: "Large" },
    ],
    applyToDOM: (val, root) => {
      root.setAttribute("data-card-radius", String(val));
    },
  },
  {
    id: "accentColor",
    group: "appearance",
    type: "color",
    labelVi: "Màu nhấn",
    labelEn: "Accent Color",
    descriptionVi: "Ghi đè màu nhấn mặc định của theme",
    descriptionEn: "Override the default theme accent color",
    default: null,
    applyToDOM: (val, root) => {
      if (val && typeof val === "string") {
        root.style.setProperty("--color-accent-override", val);
        root.setAttribute("data-accent-override", "true");
      } else {
        root.style.removeProperty("--color-accent-override");
        root.removeAttribute("data-accent-override");
      }
    },
  },

  // ── Motion ──────────────────────────────────────────────────────────────
  {
    id: "animationsEnabled",
    group: "motion",
    type: "toggle",
    labelVi: "Bật animation",
    labelEn: "Enable Animations",
    default: true,
    applyToDOM: (val, root) => {
      root.setAttribute("data-animations", val ? "true" : "false");
    },
  },
  {
    id: "animationIntensity",
    group: "motion",
    type: "select",
    labelVi: "Cường độ",
    labelEn: "Intensity",
    default: "moderate",
    showWhen: (s) => s.animationsEnabled !== false,
    options: [
      { value: "subtle", labelVi: "Nhẹ", labelEn: "Subtle" },
      { value: "moderate", labelVi: "Vừa", labelEn: "Moderate" },
      { value: "full", labelVi: "Đầy đủ", labelEn: "Full" },
    ],
    applyToDOM: (val, root) => {
      root.setAttribute("data-animation-intensity", String(val));
    },
  },
  {
    id: "customCursor",
    group: "motion",
    type: "toggle",
    labelVi: "Con trỏ tùy chỉnh",
    labelEn: "Custom Cursor",
    descriptionVi: "Chỉ áp dụng trên desktop",
    descriptionEn: "Desktop only",
    default: true,
    applyToDOM: (val, root) => {
      root.setAttribute("data-custom-cursor", val ? "true" : "false");
    },
  },

  // ── Display ──────────────────────────────────────────────────────────────
  {
    id: "lang",
    group: "display",
    type: "select",
    labelVi: "Ngôn ngữ",
    labelEn: "Language",
    default: "vi",
    bridgedTo: "lang",
    options: [
      { value: "vi", labelVi: "Tiếng Việt", labelEn: "Vietnamese" },
      { value: "en", labelVi: "English", labelEn: "English" },
    ],
  },
  {
    id: "dateFormat",
    group: "display",
    type: "select",
    labelVi: "Định dạng ngày",
    labelEn: "Date Format",
    default: "absolute",
    options: [
      { value: "absolute", labelVi: "Ngày cụ thể", labelEn: "Absolute" },
      { value: "relative", labelVi: "Thời gian trước", labelEn: "Relative" },
    ],
    applyToDOM: (val, root) => {
      root.setAttribute("data-date-format", String(val));
    },
  },
  {
    id: "showSectionNumbers",
    group: "display",
    type: "toggle",
    labelVi: "Số thứ tự mục",
    labelEn: "Section Numbers",
    descriptionVi: "Hiện 01, 02… trước tiêu đề mỗi mục",
    descriptionEn: "Show 01, 02… before each section heading",
    default: true,
    applyToDOM: (val, root) => {
      root.setAttribute("data-section-numbers", val ? "true" : "false");
    },
  },

  // ── Certificates ─────────────────────────────────────────────────────────
  {
    id: "showExpiredCerts",
    group: "certificates",
    type: "toggle",
    labelVi: "Hiện chứng chỉ hết hạn",
    labelEn: "Show Expired Certificates",
    default: false,
    applyToDOM: (val, root) => {
      root.setAttribute("data-show-expired", val ? "true" : "false");
    },
  },
  {
    id: "expiryWarningDays",
    group: "certificates",
    type: "select",
    labelVi: "Cảnh báo sắp hết hạn",
    labelEn: "Expiry Warning Threshold",
    default: "60",
    options: [
      { value: "30", labelVi: "30 ngày", labelEn: "30 days" },
      { value: "60", labelVi: "60 ngày", labelEn: "60 days" },
      { value: "90", labelVi: "90 ngày", labelEn: "90 days" },
    ],
  },
  {
    id: "certSortBy",
    group: "certificates",
    type: "select",
    labelVi: "Sắp xếp theo",
    labelEn: "Sort By",
    default: "newest",
    options: [
      { value: "newest", labelVi: "Mới nhất", labelEn: "Newest" },
      { value: "expiring", labelVi: "Sắp hết hạn", labelEn: "Expiring Soon" },
      { value: "tag", labelVi: "Theo tag", labelEn: "By Tag" },
    ],
  },
  {
    id: "certSupplementalView",
    group: "certificates",
    type: "select",
    labelVi: "Kiểu hiển thị bổ sung",
    labelEn: "Supplemental View",
    default: "grid",
    options: [
      { value: "grid", labelVi: "Lưới", labelEn: "Grid" },
      { value: "list", labelVi: "Danh sách", labelEn: "List" },
    ],
    applyToDOM: (val, root) => {
      root.setAttribute("data-cert-supplemental-view", String(val));
    },
  },
  {
    id: "certGridCols",
    group: "certificates",
    type: "select",
    labelVi: "Số cột lưới bổ sung",
    labelEn: "Supplemental Grid Columns",
    default: "3",
    showWhen: (s) => (s as Record<string, unknown>).certSupplementalView !== "list",
    options: [
      { value: "2", labelVi: "2 cột", labelEn: "2 columns" },
      { value: "3", labelVi: "3 cột", labelEn: "3 columns" },
    ],
  },
  {
    id: "certShowImage",
    group: "certificates",
    type: "toggle",
    labelVi: "Hiện ảnh chứng chỉ",
    labelEn: "Show Certificate Image",
    default: true,
    applyToDOM: (val, root) => {
      root.setAttribute("data-cert-show-image", val ? "true" : "false");
    },
  },
  {
    id: "certShowRelatedProject",
    group: "certificates",
    type: "toggle",
    labelVi: "Hiện dự án liên quan",
    labelEn: "Show Related Project",
    default: true,
    applyToDOM: (val, root) => {
      root.setAttribute("data-cert-show-related", val ? "true" : "false");
    },
  },

  // ── Accessibility ────────────────────────────────────────────────────────
  {
    id: "highContrast",
    group: "accessibility",
    type: "toggle",
    labelVi: "Tương phản cao",
    labelEn: "High Contrast",
    default: false,
    applyToDOM: (val, root) => {
      root.setAttribute("data-high-contrast", val ? "true" : "false");
    },
  },
  {
    id: "reducedMotion",
    group: "accessibility",
    type: "toggle",
    labelVi: "Giảm chuyển động",
    labelEn: "Reduce Motion",
    default: false,
    applyToDOM: (val, root) => {
      root.setAttribute("data-reduced-motion", val ? "true" : "false");
    },
  },
  {
    id: "dyslexiaFont",
    group: "accessibility",
    type: "toggle",
    labelVi: "Font dễ đọc (chứng khó đọc)",
    labelEn: "Dyslexia-Friendly Font",
    default: false,
    applyToDOM: (val, root) => {
      root.setAttribute("data-dyslexia-font", val ? "true" : "false");
    },
  },
  {
    id: "enhancedFocusRing",
    group: "accessibility",
    type: "toggle",
    labelVi: "Vòng focus rõ hơn",
    labelEn: "Enhanced Focus Ring",
    default: false,
    applyToDOM: (val, root) => {
      root.setAttribute("data-focus-ring", val ? "true" : "false");
    },
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function getSettingsByGroup(group: SettingGroup): SettingDef[] {
  return SETTINGS_REGISTRY.filter((s) => s.group === group);
}

export function getSettingById(id: string): SettingDef | undefined {
  return SETTINGS_REGISTRY.find((s) => s.id === id);
}

