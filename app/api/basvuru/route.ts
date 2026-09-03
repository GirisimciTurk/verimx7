import { NextResponse } from "next/server";

import { BodyTooLarge, guard, readJson } from "@/lib/api-guard";
import { deliverLead, hasDeliveryChannel, type LeadPayload } from "@/lib/leads";
import { CONTACT } from "@/lib/site";
import { applicationSchema, fieldErrors } from "@/lib/validation";

/** Değerlendirme başvurusu formu. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Açıklama alanı 4000 karaktere kadar; 16 KB güvenli bir tavan. */
const MAX_BODY = 16 * 1024;

export async function POST(request: Request) {
  const gate = guard(request, "basvuru", {
    perClient: { limit: 5, windowMs: 10 * 60_000 },
    // IP doğrulanamıyorsa site geneli tavan: meşru kullanımı kesmez,
    // otomatik gönderimi frenler.
    global: { limit: 40, windowMs: 10 * 60_000 },
  });
  if (!gate.ok) {
    return NextResponse.json(
      {
        error: `Kısa sürede çok fazla başvuru gönderildi. ${gate.retryAfterSeconds} saniye sonra tekrar deneyin.`,
      },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await readJson(request, MAX_BODY);
  } catch (error) {
    if (error instanceof BodyTooLarge) {
      return NextResponse.json({ error: "İstek gövdesi çok büyük." }, { status: 413 });
    }
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Formda eksik veya hatalı alanlar var.", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Bot tuzağı doldurulmuşsa sessizce başarı döndür: bot geri bildirim almasın.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  // Hiçbir teslim kanalı yoksa "aldık" demek yerine doğrudan iletişime yönlendir.
  if (process.env.NODE_ENV === "production" && !hasDeliveryChannel()) {
    console.error(
      "[verimx7] Teslim kanalı yapılandırılmadığı için başvuru reddedildi. " +
        "RESEND_API_KEY+LEAD_TO_EMAIL, LEAD_WEBHOOK_URL veya LEAD_LOG_DIR ayarlayın.",
    );
    return NextResponse.json(
      {
        error: `Form şu anda hizmet dışı. Başvurunuzu ${CONTACT.email} adresine veya WhatsApp hattımıza iletebilirsiniz.`,
      },
      { status: 503 },
    );
  }

  // Günlüklerde kişisel veri yerine anılacak kısa referans.
  const ref = crypto.randomUUID().slice(0, 8);

  const lead: LeadPayload = {
    kind: "basvuru",
    ref,
    title: `Değerlendirme başvurusu — ${data.org}`,
    fields: [
      { label: "Ad soyad", value: data.name },
      { label: "Kurum", value: data.org },
      { label: "E-posta", value: data.email },
      { label: "Telefon", value: data.phone },
      { label: "Kaynak alanı", value: data.area },
      { label: "Açıklama", value: data.detail },
      { label: "Aydınlatma onayı", value: "Verildi" },
      { label: "Ticari ileti izni", value: data.marketingConsent ? "Verildi" : "Verilmedi" },
    ],
    raw: {
      name: data.name,
      org: data.org,
      email: data.email,
      phone: data.phone,
      area: data.area,
      detail: data.detail,
      consent: true,
      marketingConsent: data.marketingConsent,
    },
    meta: {
      receivedAt: new Date().toISOString(),
      ip: gate.identity.display,
      userAgent: request.headers.get("user-agent") ?? "—",
      referer: request.headers.get("referer"),
    },
  };

  const delivery = await deliverLead(lead);

  if (!delivery.delivered && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error: `Başvurunuz iletilemedi. Lütfen ${CONTACT.email} adresine yazın veya WhatsApp hattımızdan ulaşın. Hata referansı: ${ref}`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
