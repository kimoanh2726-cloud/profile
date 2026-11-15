/**
 * Certificate utilities — Client & Server safe (no fs/path/yaml dependencies)
 */

export interface CertificateStatus {
  id: string;
  title: string;
  status: "valid" | "expiring-soon" | "expired";
  daysUntilExpiry?: number;
  expiryDate?: string;
}

export interface CertItemLike {
  id: string;
  title: { vi: string; en: string };
  expiryDate?: string;
  no_expiry?: boolean;
  credentialUrl?: string;
  verify_url?: string;
  credentialId?: string;
  credential_id?: string;
}

/**
 * Kiểm tra trạng thái hết hạn của chứng chỉ.
 * - "expiring-soon" = còn ≤ warningDays ngày (mặc định 60)
 * - "expired"       = đã qua ngày hết hạn
 * - no_expiry: true → luôn "valid"
 */
export function checkCertificateExpiry(
  cert: CertItemLike,
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
export function getCertVerifyUrl(cert: CertItemLike): string | undefined {
  return cert.verify_url ?? cert.credentialUrl;
}

/** Lấy mã xác minh chứng chỉ (ưu tiên credential_id, rồi credentialId) */
export function getCertCredentialId(cert: CertItemLike): string | undefined {
  return cert.credential_id ?? cert.credentialId;
}

/**
 * Trả về URL asset có kèm basePath khi deploy GitHub Pages subpath
 */
export function getAssetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//") ||
    url.startsWith("#") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${basePath}${cleanUrl}`;
}
