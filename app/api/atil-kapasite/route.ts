import { NextResponse } from "next/server";

import { BodyTooLarge, guard, readJson } from "@/lib/api-guard";
import { quickEstimate } from "@/lib/engine";
import { calcRequestSchema } from "@/lib/validation";

/**
 * Hızlı tahmin uç noktası.
 *
 * Mimari-Plan §4.3: hesaplama motoru sunucuda çalışır. Katsayılar şirketin
 * varlığıdır ve istemciye gönderilmez — bu uç nokta yalnızca yuvarlanmış
 * sonucu döndürür.
 *
 * Bu istek KAYDEDİLMEZ. Girdiler hiçbir yere yazılmaz. (Simülasyon sayfası
 * bu ucu kullanmaz; simülasyon ve testler tarayıcıda çalışır, yalnızca
 * rapor talebi kaydedilir — bkz. /api/rapor.)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Geçerli gövde ~100 bayt; 4 KB bol bir tavan. */
const MAX_BODY = 4 * 1024;

export async function POST(request: Request) {
  // Kaydırıcılar hareket ettikçe istek gelir; sınır cömert ama sonsuz değil.
  const gate = guard(request, "calc", {
    perClient: { limit: 240, windowMs: 60_000 },
    global: { limit: 6_000, windowMs: 60_000 },
  });
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen biraz bekleyin." },
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

  const parsed = calcRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Girdiler geçerli aralıkta değil." }, { status: 422 });
  }

  const { emp, revenueMn, cost } = parsed.data.input;
  return NextResponse.json(
    { mode: "quick", ...quickEstimate(emp, revenueMn, cost) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
