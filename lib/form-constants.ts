/**
 * Formların paylaştığı saf sabitler ve hafif istemci kontrolleri.
 *
 * Neden ayrı dosya: lib/validation.ts zod'u içeri alıyor. Formlar oradan
 * tek bir sabit için import ettiğinde zod'un tamamı (~90 KB gzip) ana
 * sayfanın istemci paketine giriyordu. Nihai doğrulama zaten sunucuda
 * yapılıyor; istemcide yalnızca erken geri bildirim gerekiyor.
 */

export const RESOURCE_AREAS = [
  "İnsan Kaynağı",
  "Fiziksel Alan ve Bina",
  "Makine ve Teçhizat",
  "Doğal ve Stratejik Kaynak",
  "Teknoloji",
] as const;

export type ResourceArea = (typeof RESOURCE_AREAS)[number];

/* ── Hafif istemci kontrolleri ─────────────────────────────────────────── */

/** Sunucudaki zod şemasıyla aynı sınırlar; mesajlar da aynı metin. */
export const FIELD_RULES = {
  name: { min: 2, max: 120, label: "Ad soyad" },
  org: { min: 2, max: 160, label: "Kurum adı" },
  detail: { min: 20, max: 4000, label: "Açıklama" },
} as const;

export function checkText(
  value: string,
  rule: { min: number; max: number; label: string },
): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return `${rule.label} alanı zorunludur.`;
  if (trimmed.length < rule.min) return `${rule.label} en az ${rule.min} karakter olmalıdır.`;
  if (trimmed.length > rule.max) return `${rule.label} en fazla ${rule.max} karakter olabilir.`;
  return undefined;
}

export function checkEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "E-posta adresi zorunludur.";
  if (trimmed.length > 160) return "E-posta adresi çok uzun.";
  // Kasten geniş: amaç yazım hatasını yakalamak, geçerli adresi elemek değil.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(trimmed)) {
    return "Geçerli bir e-posta adresi girin.";
  }
  return undefined;
}

export function checkPhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "Telefon numarası zorunludur.";
  if (trimmed.length > 24) return "Telefon numarası çok uzun.";
  if (!/^[+()\d\s.-]+$/u.test(trimmed)) {
    return "Telefon numarası yalnızca rakam ve + ( ) - . boşluk içerebilir.";
  }
  if ((trimmed.match(/\d/g) ?? []).length < 10) {
    return "Telefon numarası en az 10 rakam içermelidir.";
  }
  return undefined;
}
