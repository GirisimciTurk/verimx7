/**
 * Hızlı tahmin — hesaplama motoru.
 *
 * Mimari-Plan §4.3 gereği hesap tarayıcıda değil sunucuda çalışır: aşağıdaki
 * katsayılar şirketin varlığıdır ve istemciye gönderilmez. Arayüzün bilmesi
 * gereken tek şey kaydırıcı sınırlarıdır (lib/form-constants.ts → QUICK_LIMITS).
 *
 * Mimari-Plan §4.4 gereği formül sürümlenir. Bir hesabın hangi sürümle
 * yapıldığı çıktının içinde döner; formül güncellemesi geçmişe uygulanmaz.
 *
 * Katsayılar bugün sektör varsayımıdır. Benchmark havuzu (Mimari-Plan §3.3)
 * bir sektör–ölçek hücresinde beş müşteriye ulaştığında gerçek değerlerle
 * değiştirilir ve sürüm numarası yükseltilir.
 *
 * Sürüm geçmişi:
 *   v1.0 — 12 soruluk Atıl Kapasite Testi + hızlı tahmin; tavan %30.
 *   v1.1 — Test, Verim Simülasyonu ve test kütüphanesiyle değiştirildi
 *          (17 Eylül 2026 kanvası). Hızlı tahminin tavanı kanvasla ve
 *          SSS'deki "tipik bant %12–40" ifadesiyle uyumlu olarak %42'ye
 *          çekildi.
 */

import "server-only";

import { QUICK_LIMITS } from "./form-constants";

export const FORMULA_VERSION = "v1.1";

/**
 * Üst sınır. SSS'de yayımlanan "altı aylık uygulama sonunda tipik bant
 * %12–40" ifadesi bu tavana dayanır; ikisi birlikte değiştirilir ve
 * FORMULA_VERSION yükseltilir.
 */
const RATIO_CEILING = 0.42;

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/**
 * Yayımlanan tutarları yuvarlar. İki işi birden yapar: sonucu "tahmin"
 * gibi gösterir (kuruşu kuruşuna bir sayı, olmayan bir kesinlik iddiasıdır)
 * ve katsayıların çıktıdan geri çıkarılmasını bozar.
 */
function quantize(value: number): number {
  const step = value >= 1e8 ? 1e6 : value >= 1e7 ? 1e5 : value >= 1e6 ? 1e4 : 1e3;
  return Math.round(value / step) * step;
}

export type QuickResult = {
  formulaVersion: string;
  /** Beklenen verim artışı, personel maliyetine oran (0–1). */
  ratio: number;
  /** Yıllık karşılığı, ₺. */
  value: number;
  /** Yıllık personel maliyeti, ₺. */
  payroll: number;
};

/** Ana sayfadaki üç girdilik hızlı tahmin. */
export function quickEstimate(emp: number, revenueMn: number, cost: number): QuickResult {
  const e = clamp(emp, QUICK_LIMITS.emp.min, QUICK_LIMITS.emp.max);
  const c = clamp(cost, QUICK_LIMITS.cost.min, QUICK_LIMITS.cost.max);
  const revenue = clamp(revenueMn, QUICK_LIMITS.revenueMn.min, QUICK_LIMITS.revenueMn.max) * 1e6;

  const payroll = e * c * 12;
  const payrollShare = Math.min(0.85, payroll / Math.max(revenue, 1));
  // Büyüyen kadro ve ağırlaşan personel payı, geri kazanılabilir boşluğu artırır.
  const ratio = Math.min(
    RATIO_CEILING,
    0.11 + Math.log10(e / QUICK_LIMITS.emp.min) * 0.052 + payrollShare * 0.16,
  );

  return {
    formulaVersion: FORMULA_VERSION,
    ratio: Math.round(ratio * 1000) / 1000,
    value: quantize(payroll * ratio),
    payroll,
  };
}
