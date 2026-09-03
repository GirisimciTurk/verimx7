import { NextResponse } from "next/server";

import { BodyTooLarge, guard, readJson } from "@/lib/api-guard";
import { compute, sectorLabel } from "@/lib/engine";
import { deliverLead, hasDeliveryChannel, type LeadPayload } from "@/lib/leads";
import { CONTACT, formatPercent, formatTL } from "@/lib/site";
import { CHOICES } from "@/lib/test-config";
import { fieldErrors, reportRequestSchema } from "@/lib/validation";

/**
 * Ayrıntılı rapor talebi.
 *
 * Testin kendisi kayıt tutmaz; ziyaretçi e-posta bırakıp raporu talep ettiğinde
 * girdiler, hesaplanan sonuç ve formül sürümü birlikte kaydedilir. Formül
 * sürümünün saklanması, sonraki bir sürüm yayımlandığında bu hesabın nasıl
 * üretildiğinin yeniden kurulabilmesi içindir (Mimari-Plan §4.4).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** E-posta + 12 girdi; 8 KB bol bir tavan. */
const MAX_BODY = 8 * 1024;

export async function POST(request: Request) {
  const gate = guard(request, "rapor", {
    perClient: { limit: 5, windowMs: 10 * 60_000 },
    global: { limit: 40, windowMs: 10 * 60_000 },
  });
  if (!gate.ok) {
    return NextResponse.json(
      {
        error: `Kısa sürede çok fazla talep gönderildi. ${gate.retryAfterSeconds} saniye sonra tekrar deneyin.`,
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

  const parsed = reportRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Talep doğrulanamadı.", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const { email, input, website } = parsed.data;

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (process.env.NODE_ENV === "production" && !hasDeliveryChannel()) {
    console.error("[verimx7] Teslim kanalı yapılandırılmadığı için rapor talebi reddedildi.");
    return NextResponse.json(
      {
        error: `Talep şu anda alınamıyor. ${CONTACT.email} adresine yazarsanız raporu elle iletiriz.`,
      },
      { status: 503 },
    );
  }

  const result = compute(input);
  const systems = [
    input.systems.erp && "ERP",
    input.systems.ticket && "Ticket / iş akışı",
    input.systems.hr && "İK / bordro",
    input.systems.calendar && "Kurumsal takvim",
  ].filter(Boolean) as string[];

  // Günlüklerde kişisel veri yerine anılacak kısa referans.
  const ref = crypto.randomUUID().slice(0, 8);

  const lead: LeadPayload = {
    kind: "rapor",
    ref,
    title: `Atıl Kapasite Testi rapor talebi — ${formatTL(result.total)}`,
    fields: [
      { label: "E-posta", value: email },
      { label: "Kurum tipi", value: sectorLabel(input.sector) },
      { label: "Tahmini yıllık atıl kapasite", value: formatTL(result.total) },
      { label: "Personel maliyetine oranı", value: formatPercent(result.ratio * 100) },
      { label: "Zaman kaybı", value: formatTL(result.time) },
      { label: "Eşleşme kaybı", value: formatTL(result.match) },
      { label: "Kadro kaybı", value: formatTL(result.staff) },
      { label: "Formül sürümü", value: result.formulaVersion },
      { label: "S01 Çalışan sayısı", value: `${input.emp} kişi` },
      { label: "S02 Kişi başı aylık maliyet", value: formatTL(input.cost) },
      { label: "S03 Kontrol alanı", value: CHOICES.span[input.span]! },
      { label: "S04 Onay katmanı", value: `${input.layers} adım` },
      { label: "S05 Haftalık toplantı", value: `${input.meet} saat` },
      { label: "S06 Kararsız biten toplantı", value: CHOICES.dec[input.dec]! },
      { label: "S07 Yapısal fazla mesai", value: `%${input.overtime}` },
      { label: "S08 Gönüllü devir", value: `%${input.turnover}` },
      { label: "S09 Boş kadro süresi", value: CHOICES.vac[input.vac]! },
      { label: "S10 Yeniden yapılan iş", value: `%${input.rework}` },
      { label: "S11 Verime ulaşma süresi", value: CHOICES.ramp[input.ramp]! },
      { label: "S12 Sistem kaynakları", value: systems.length ? systems.join(", ") : "Yok" },
      { label: "Ölçülebilirlik", value: `${result.measurableLabel} (${result.measurableCount}/4)` },
      { label: "Aydınlatma onayı", value: "Verildi" },
    ],
    raw: { email, input, result },
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
      { error: `Talebiniz iletilemedi. Lütfen ${CONTACT.email} adresine yazın. Hata referansı: ${ref}` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
