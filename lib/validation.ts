/**
 * İstemci ve sunucunun paylaştığı doğrulama şemaları.
 * Sunucu tarafı her zaman yeniden doğrular; istemci doğrulaması yalnızca
 * kullanıcıya erken geri bildirim içindir.
 */

import { z } from "zod";

import { QUICK_LIMITS, RESOURCE_AREAS, SIMULATION_SECTORS } from "./form-constants";

export { RESOURCE_AREAS };

/* ── Hızlı tahmin girdileri ────────────────────────────────────────────── */

export const quickInputSchema = z.object({
  emp: z.number().int().min(QUICK_LIMITS.emp.min).max(QUICK_LIMITS.emp.max),
  revenueMn: z.number().int().min(QUICK_LIMITS.revenueMn.min).max(QUICK_LIMITS.revenueMn.max),
  cost: z.number().int().min(QUICK_LIMITS.cost.min).max(QUICK_LIMITS.cost.max),
});

export type QuickInput = z.infer<typeof quickInputSchema>;

export const calcRequestSchema = z.object({
  mode: z.literal("quick"),
  input: quickInputSchema,
});

/* ── Ortak alan doğrulayıcıları ────────────────────────────────────────── */

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ error: `${label} alanı zorunludur.` })
    .trim()
    .min(min, `${label} en az ${min} karakter olmalıdır.`)
    .max(max, `${label} en fazla ${max} karakter olabilir.`);

/**
 * Türkiye ve uluslararası biçimleri kabul eden geniş telefon kontrolü.
 * Amaç geçersiz girişi elemek, biçimi dayatmak değil.
 */
const phoneSchema = z
  .string({ error: "Telefon numarası zorunludur." })
  .trim()
  .min(10, "Telefon numarası eksik görünüyor.")
  .max(24, "Telefon numarası çok uzun.")
  .regex(/^[+()\d\s.-]+$/u, "Telefon numarası yalnızca rakam ve + ( ) - . boşluk içerebilir.")
  .refine((v) => (v.match(/\d/g) ?? []).length >= 10, "Telefon numarası en az 10 rakam içermelidir.");

const emailSchema = z
  .string({ error: "E-posta adresi zorunludur." })
  .trim()
  .toLowerCase()
  .min(5, "E-posta adresi eksik görünüyor.")
  .max(160, "E-posta adresi çok uzun.")
  .email("Geçerli bir e-posta adresi girin.");

const consentSchema = z.literal(true, { message: "Aydınlatma metni onayı gereklidir." });

/**
 * Bot tuzağı: gerçek kullanıcı bu alanı görmez, dolduramaz.
 *
 * Şema burada bilerek geçirgen. Doluysa istek doğrulamada reddedilmez;
 * uç nokta sessizce başarı döndürür. Bot, tuzağa düştüğünü anlayacak bir
 * hata mesajı almaz.
 */
const honeypotSchema = z.string().max(200).optional().default("");

/* ── Değerlendirme başvurusu ───────────────────────────────────────────── */

export const applicationSchema = z.object({
  name: trimmed(2, 120, "Ad soyad"),
  phone: phoneSchema,
  email: emailSchema,
  org: trimmed(2, 160, "Kurum adı"),
  area: z.enum(RESOURCE_AREAS, { message: "Bir kaynak alanı seçin." }),
  detail: trimmed(20, 4000, "Açıklama"),
  // KVKK: aydınlatma onayı ile ticari ileti izni ayrı kutulardır.
  consent: consentSchema,
  marketingConsent: z.boolean().optional().default(false),
  website: honeypotSchema,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/**
 * Yan paneldeki kısa başvuru: ad, kurum, e-posta. Ön görüşme talebi için
 * yeterli; kaynak alanı ve açıklama görüşmede alınır.
 */
export const shortApplicationSchema = z.object({
  form: z.literal("kisa"),
  name: trimmed(2, 120, "Ad soyad"),
  org: trimmed(2, 160, "Kurum adı"),
  email: emailSchema,
  consent: consentSchema,
  website: honeypotSchema,
});

export type ShortApplicationInput = z.infer<typeof shortApplicationSchema>;

/* ── Simülasyon raporu talebi ──────────────────────────────────────────── */

const shortText = (max: number) => z.string().trim().min(1).max(max);

/**
 * Simülasyon tarayıcıda çalışır; sunucu yalnızca sonucun özetini kaydeder.
 * Alanlar sınırlı ve kısa tutulur: bu bir serbest metin kanalı değildir.
 */
export const simulationSummarySchema = z.object({
  sector: z.enum(SIMULATION_SECTORS),
  index: z.number().int().min(0).max(100),
  band: shortText(60),
  /** Birikimli etki, milyon ₺ (işaretli). */
  cashMn: z.number().min(-1000).max(1000),
  path: z
    .array(
      z.object({
        area: shortText(30),
        label: shortText(120),
        effect: shortText(160),
      }),
    )
    .min(1)
    .max(5),
  missed: z.array(shortText(200)).max(5),
  weakest: shortText(30),
  strongest: shortText(30),
});

export type SimulationSummary = z.infer<typeof simulationSummarySchema>;

export const reportRequestSchema = z.object({
  email: emailSchema,
  simulation: simulationSummarySchema,
  consent: consentSchema,
  website: honeypotSchema,
});

export type ReportRequestInput = z.infer<typeof reportRequestSchema>;

/** Zod hatalarını alan adı → mesaj eşlemesine indirger. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
