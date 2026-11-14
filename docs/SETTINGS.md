# Settings System — Hướng dẫn thêm Setting mới

> Settings Panel được thiết kế theo kiến trúc **registry-driven**: mọi control trong Panel được tự động render từ một mảng khai báo trong `lib/settings/registry.ts`. Thêm setting mới **chỉ cần 3 bước** (không hard-code UI).

---

## Kiến trúc tổng quan

```
lib/settings/
├── defaults.ts     ← Zod schema + types + getDefaultSettings()
├── registry.ts     ← SETTINGS_REGISTRY[] — nguồn sự thật duy nhất
├── storage.ts      ← load/save/clear localStorage (SSR-safe)
└── apply.ts        ← applySettingsToDOM() + ANTI_FLASH_SCRIPT

components/settings/
├── SettingsProvider.tsx   ← Context, MotionConfig, persist & apply
├── SettingsPanel.tsx      ← Drawer (desktop) / Bottom sheet (mobile)
├── SettingsGroup.tsx      ← Render một nhóm từ registry
└── controls/
    ├── Toggle.tsx
    ├── Select.tsx
    └── ColorPicker.tsx

hooks/useSettings.ts   ← re-export useSettings() từ SettingsProvider
```

---

## Thêm setting mới trong 3 bước

### Bước 1 — Khai báo kiểu & giá trị mặc định

Mở [`lib/settings/defaults.ts`](../lib/settings/defaults.ts) và thêm field vào `SettingsSchema`:

```ts
// Ví dụ: setting bật/tắt hiệu ứng confetti
export const SettingsSchema = z.object({
  // ... các field hiện có ...
  showConfetti: z.boolean().default(false),   // ← THÊM VÀO ĐÂY
});
```

> **Lưu ý:** Luôn dùng `.default(...)` để không phá dữ liệu đã lưu của người dùng cũ.

---

### Bước 2 — Khai báo trong registry

Mở [`lib/settings/registry.ts`](../lib/settings/registry.ts) và thêm object vào `SETTINGS_REGISTRY`:

```ts
export const SETTINGS_REGISTRY: SettingDef[] = [
  // ... các entry hiện có ...

  {
    id: "showConfetti",           // phải khớp với tên field ở Bước 1
    group: "motion",              // nhóm: appearance | motion | display | certificates | accessibility | advanced
    type: "toggle",               // loại control: toggle | select | color
    labelVi: "Hiệu ứng confetti",
    labelEn: "Confetti Effect",
    descriptionVi: "Tung giấy vụn khi hover vào nút CTA",  // tuỳ chọn
    descriptionEn: "Throws confetti when hovering CTA buttons",
    default: false,
    // Áp dụng tức thì qua DOM attribute (tuỳ chọn):
    applyToDOM: (val, root) => {
      root.setAttribute("data-confetti", val ? "true" : "false");
    },
    // Hiển thị control chỉ khi animation đang bật (tuỳ chọn):
    showWhen: (s) => s.animationsEnabled !== false,
  },
];
```

**Các loại control:**

| `type`    | Props bắt buộc thêm              | Hiển thị                                  |
|-----------|----------------------------------|-------------------------------------------|
| `toggle`  | —                                | Switch on/off                             |
| `select`  | `options: SelectOption[]`        | Button group (≤3) hoặc dropdown (>3)      |
| `color`   | —                                | Swatch preset + custom color picker       |

**Bridged settings** (giá trị sống ở ThemeProvider, không phải SettingsContext):

```ts
{
  id: "theme",
  bridgedTo: "theme",   // "theme" | "lang" | "colorMode"
  // Panel sẽ tự đọc/ghi qua ThemeProvider setters
}
```

---

### Bước 3 — Chạy lại dev server

```powershell
# PowerShell
npm run dev
```

**Vậy là xong.** Setting mới sẽ tự xuất hiện trong Panel dưới đúng nhóm đã khai báo. Không cần sửa thêm bất kỳ file UI nào.

---

## CSS data-attribute (nếu cần áp style ngay)

Nếu `applyToDOM` đặt một attribute lên `<html>`, thêm CSS rule tương ứng vào [`app/globals.css`](../app/globals.css):

```css
/* Ví dụ cho showConfetti */
[data-confetti="false"] .confetti-trigger {
  pointer-events: none;
  opacity: 0.5;
}
```

---

## Anti-flash script

Nếu setting ảnh hưởng đến giao diện ngay khi tải trang (tránh "nháy" sai theme), thêm logic đọc localStorage vào `ANTI_FLASH_SCRIPT` trong [`lib/settings/apply.ts`](../lib/settings/apply.ts):

```js
// Trong ANTI_FLASH_SCRIPT (plain JS, không dùng TypeScript/import):
apply('data-confetti', s.showConfetti, false);
```

---

## Checklist kiểm thử thủ công

Sau khi thêm setting mới, kiểm tra:

- [ ] Setting xuất hiện đúng nhóm trong Panel
- [ ] Thay đổi value → áp dụng ngay (live preview)
- [ ] Tải lại trang → value giữ nguyên (localStorage persist)
- [ ] "Đặt lại mặc định" → trả về giá trị default
- [ ] Xuất JSON → có field mới; Nhập lại → load đúng
- [ ] Mobile (bottom sheet) → hiển thị và hoạt động bình thường
- [ ] Tab/Shift+Tab trong Panel → không thoát khỏi focus trap
- [ ] `showWhen` (nếu có) → ẩn/hiện đúng điều kiện

