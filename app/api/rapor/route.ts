import { NextResponse } from "next/server";

import { BodyTooLarge, guard, readJson } from "@/lib/api-guard";
import { deliverLead, hasDeliveryChannel, type LeadPayload } from "@/lib/leads";
import { SIMULATION_SECTOR_LABELS } from "@/lib/simulation-data";
import { CONTACT, decimalTR } from "@/lib/site";
import { fieldErrors, reportRequestSchema } from "@/lib/validation";

/**
 * Simülasyon raporu talebi.
 *
 * Verim Simülasyonu tarayıcıda çalışır ve kayıt tutmaz; ziyaretçi e-posta
 * bırakıp ayrıntılı rapor istediğinde sonucun özeti (sektör, endeks, bant,
 * birikimli etki, izlenen yol, kaçırılan fırsatlar) e-posta adresiyle
 * birlikte kaydedilir. Amaç raporu iletebilmek ve gönderimi ispatlamaktır.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** E-posta + beş kararlık özet; 8 KB bol bir tavan. */
const MAX_BODY = 8 * 1024;

function signedMn(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${decimalTR(Math.abs(value))} mn ₺`;
}

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

  const { email, simulation, website } = parsed.data;

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

  // Günlüklerde kişisel veri yerine anılacak kısa referans.
  const ref = crypto.randomUUID().slice(0, 8);
  const sectorLabel = SIMULATION_SECTOR_LABELS[simulation.sector];

  const lead: LeadPayload = {
    kind: "rapor",
    ref,
    title: `Verim Simülasyonu rapor talebi — ${sectorLabel} · endeks ${simulation.index}`,
    fields: [
      { label: "E-posta", value: email },
      { label: "Kurum tipi", value: sectorLabel },
      { label: "Verim endeksi", value: `${simulation.index} / 100` },
      { label: "Bant", value: simulation.band },
      { label: "Birikimli etki", value: signedMn(simulation.cashMn) },
      { label: "En zayıf alan", value: simulation.weakest },
      { label: "En güçlü alan", value: simulation.strongest },
      ...simulation.path.map((step, i) => ({
        label: `Karar ${i + 1} · ${step.area}`,
        value: `${step.label} — ${step.effect}`,
      })),
      {
        label: "Kaçırılan fırsatlar",
        value: simulation.missed.length ? simulation.missed.join("\n") : "Yok",
      },
      { label: "Aydınlatma onayı", value: "Verildi" },
    ],
    raw: { email, simulation },
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
