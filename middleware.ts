import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Danh sách các pattern dò quét mã độc / lỗ hổng tự động (Malicious Scanners / Botnet Probes)
 * Chặn ngay tại tầng Edge Middleware để tiết kiệm tài nguyên máy chủ.
 */
const MALICIOUS_PATTERNS = [
  // Quét file cấu hình & mã nguồn nhạy cảm
  /\.(env|git|svn|hg|bak|backup|old|save|swp|DS_Store)/i,
  // Quét các bảng điều khiển CMS/DB phổ biến (WordPress, phpMyAdmin, v.v.)
  /(wp-admin|wp-login|wp-includes|xmlrpc\.php|phpmyadmin|pma|adminer|actuator|\.aws|\.ssh|eval-stdin)/i,
  // Tấn công Directory Traversal (duyệt thư mục trái phép)
  /(\.\.|\%2e\%2e)/i,
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Chặn các yêu cầu quét lỗ hổng botnet
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse("Access Denied", {
        status: 403,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  }

  // 2. Chặn tuyệt đối mọi truy cập vào thư mục tài liệu /documents/
  if (pathname.startsWith("/documents")) {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  // 3. Tiến hành xử lý request bình thường
  const response = NextResponse.next();

  // 4. Bổ sung các HTTP Security Headers nâng cao
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Áp dụng middleware cho mọi route, trừ static assets của Next.js
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
