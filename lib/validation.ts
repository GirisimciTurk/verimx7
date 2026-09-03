/**
 * İstemci ve sunucunun paylaştığı doğrulama şemaları.
 * Sunucu tarafı her zaman yeniden doğrular; istemci doğrulaması yalnızca
 * kullanıcıya erken geri bildirim içindir.
 */

import { z } from "zod";

import { RESOURCE_AREAS } from "./form-constants";

export { RESOURCE_AREAS };

/* ── Atıl Kapasite Testi girdileri ─────────────────────────────────────── */

export const sectorKeySchema = z.enum([
  "holding",
  "bakanlik",
  "belediye",
  "ppp",
  "uretim",
  "lojistik",
  "saglik",
  "perakende",
]);

const band = z
  .number({ error: "Seçenek eksik." })
  .int()
  .min(0)
  .max(3);

export const testInputSchema = z.object({
  emp: z.number().int().min(20).max(5000),
  cost: z.number().int().min(15000).max(250000),
  span: band,
  layers: z.number().int().min(1).max(10),
  meet: z.number().int().min(2).max(25),
  dec: band,
  overtime: z.number().int().min(0).max(40),
  turnover: z.number().int().min(2).max(45),
  vac: band,
  rework: z.number().int().min(0).max(40),
  ramp: band,
  systems: z.object({
    erp: z.boolean(),
    ticket: z.boolean(),
    hr: z.boolean(),
    calendar: z.boolean(),
  }),
  sector: sectorKeySchema,
});

export type TestInput = z.infer<typeof testInputSchema>;

export const quickInputSchema = z.object({
  emp: z.number().int().min(20).max(5000),
  revenueMn: z.number().int().min(50).max(10000),
  cost: z.number().int().min(15000).max(250000),
});

export type QuickInput = z.infer<typeof quickInputSchema>;

export const calcRequestSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("quick"), input: quickInputSchema }),
  z.object({ mode: z.literal("full"), input: testInputSchema }),
]);

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
  consent: z.literal(true, { message: "Aydınlatma metni onayı gereklidir." }),
  marketingConsent: z.boolean().optional().default(false),
  website: honeypotSchema,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/* ── Ayrıntılı rapor talebi ────────────────────────────────────────────── */

export const reportRequestSchema = z.object({
  email: emailSchema,
  input: testInputSchema,
  consent: z.literal(true, { message: "Aydınlatma metni onayı gereklidir." }),
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
