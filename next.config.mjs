/**
 * next.config.mjs — Cấu hình Next.js cho Profile Hub
 *
 * Nguyên tắc bảo mật:
 *   - Thư mục /documents KHÔNG BAO GIỜ được serve public
 *   - Chỉ các file được tham chiếu từ mục "public" mới được copy sang public/
 *   - Tệp private (phone, bằng cấp gốc) không bao giờ lọt vào bundle
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tắt header X-Powered-By để tránh làm lộ stack công nghệ
  poweredByHeader: false,

  // Ảnh — dùng next/image để tối ưu
  images: {
    unoptimized: false,
    // Chỉ cho phép ảnh từ public/ (không từ /documents)
    formats: ["image/avif", "image/webp"],
  },

  // Headers bảo mật
  async headers() {
    return [
      {
        // Chặn mọi truy cập vào /documents qua URL
        source: "/documents/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Chặn route /documents trả về 404 luôn
  async redirects() {
    return [
      {
        source: "/documents/:path*",
        destination: "/404",
        permanent: false,
      },
    ];
  },
  // Webpack client fallback
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
