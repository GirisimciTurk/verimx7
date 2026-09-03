/**
 * Atıl Kapasite Testi — hesaplama motoru.
 *
 * Mimari-Plan §4.3 gereği hesap tarayıcıda değil sunucuda çalışır: aşağıdaki
 * katsayı tablosu şirketin varlığıdır ve istemciye gönderilmez. Arayüzün
 * bilmesi gereken her şey lib/test-config.ts içindedir.
 *
 * Mimari-Plan §4.4 gereği formül sürümlenir. Bir hesabın hangi sürümle
 * yapıldığı çıktının içinde döner ve rapor talebiyle birlikte saklanır;
 * formül güncellemesi geçmişe uygulanmaz. Sonuca bağlı ücretlendirmede baz
 * dönem hangi sürümle hesaplandıysa sonuç ölçümü de o sürümle yapılır.
 *
 * Katsayılar bugün sektör varsayımıdır. Benchmark havuzu (Mimari-Plan §3.3)
 * bir sektör–ölçek hücresinde beş müşteriye ulaştığında gerçek değerlerle
 * değiştirilir ve sürüm numarası yükseltilir.
 */

import "server-only";

import {
  FORMULA_VERSION,
  LIMITS,
  SECTORS,
  sectorLabel,
  type SectorKey,
  type TestResult,
  type TestValues,
} from "./test-config";

export { FORMULA_VERSION, sectorLabel };
export type { SectorKey, TestResult, TestValues };

/* ── Kurum tipi çarpanı ────────────────────────────────────────────────── */

/**
 * Kamu tarafında karar katmanı ve mevzuat yükü daha ağır olduğu için atıl
 * kapasite payı yukarı, süreç yoğun özel sektörde referansa yakın varsayılır.
 */
const SECTOR_K: Record<SectorKey, number> = {
  holding: 1.0,
  bakanlik: 1.25,
  belediye: 1.15,
  ppp: 1.1,
  uretim: 1.0,
  lojistik: 1.05,
  saglik: 1.05,
  perakende: 1.0,
};

function sectorK(key: SectorKey): number {
  return SECTOR_K[key] ?? SECTOR_K[SECTORS[0]!.key];
}

/* ── Katsayılar ────────────────────────────────────────────────────────── */

/** Toplantıların ne kadarı kararsız bitiyor → zaman kaybı çarpanı. */
const DECISION_WASTE = [0.05, 0.18, 0.35, 0.55];
/** Kontrol alanı bandı → eşleşme kaybı payı. Hem dar hem aşırı geniş alan maliyetlidir. */
const SPAN_LOSS = [0.055, 0.022, 0.032, 0.048];
/** Boş kadro süresi bandı → kadro kaybı payı. */
const VACANCY_LOSS = [0.004, 0.009, 0.016, 0.026];
/** Verime ulaşma süresi bandı → eşleşme kaybı payı. */
const RAMP_LOSS = [0.003, 0.008, 0.015, 0.024];

/** Referans toplantı eşiği (saat/hafta). Bunun altı kayıp sayılmaz. */
const MEETING_BASELINE_HOURS = 4;
/** Haftalık çalışılabilir saat. */
const WEEKLY_HOURS = 40;
/** Toplantı saatinin geri kazanılabilir payı. */
const MEETING_RECOVERABLE = 0.5;
/**
 * Kararsız biten toplantıların kaybı, referans eşiğin ALTINDAKİ toplantı
 * saatlerinde de vardır: dört saatlik bir toplantı hacminin yarısı karar
 * üretmiyorsa bu da kayıptır. Bu kalem olmadan S06 düşük toplantı yükünde
 * hiçbir etki üretmiyordu.
 */
const DECISION_RECOVERABLE = 0.35;
/** Referans onay katmanı sayısı; fazlası kayıp sayılır. */
const LAYER_BASELINE = 3;
const LAYER_LOSS_PER_STEP = 0.015;
/**
 * Tavan, kaydırıcının üst ucuna oturtulur. Aksi hâlde 7 onay adımından
 * sonrası sonucu hiç değiştirmez ve S04'ün üst yarısı ölü bölge olur.
 */
const LAYER_LOSS_CAP = (LIMITS.layers.max - LAYER_BASELINE) * LAYER_LOSS_PER_STEP;
/** Yeniden yapılan işin maliyete dönüşen payı. */
const REWORK_RECOVERABLE = 0.3;
/** Gönüllü devrin kadro maliyetine dönüşen payı (işe alım + verim kaybı). */
const TURNOVER_COST = 0.25;
/** Yapısal fazla mesainin geri kazanılabilir payı. */
const OVERTIME_RECOVERABLE = 0.3;

/**
 * Üst sınır. İş Planı §2.3 tipik kaybı personel maliyetinin %15–30'u,
 * yatırımcı sunumu §3 ise %20–35 aralığında varsayıyor. Ham formül uç
 * girdilerde bu aralığın çok üstüne — hatta personel maliyetinin
 * tamamının üzerine — çıkabildiği için sonuç, belgelenen bandın üst ucu
 * olan %30'a yaklaşan doygun bir eğriyle sıkıştırılır.
 *
 * Bu sayı bir pazarlama tercihi değil, ispat yükü tedbiridir: sitede
 * yayımlanan hiçbir tahmin, şirketin kendi belgelerinde savunduğu bandın
 * üstüne çıkmaz (İş Planı §8.3 iddia yönetimi). Band gerçek ölçümlerle
 * güncellenirse burası da FORMULA_VERSION yükseltilerek değiştirilir.
 */
const RATIO_CEILING = 0.3;
/** Bu orana kadar formül birebir uygulanır; üstünde sıkıştırma başlar. */
const RATIO_LINEAR_UNTIL = 0.18;

/** Doygun sıkıştırma: [0, ∞) → [0, RATIO_CEILING). */
function compressRatio(raw: number): number {
  if (raw <= RATIO_LINEAR_UNTIL) return raw;
  const headroom = RATIO_CEILING - RATIO_LINEAR_UNTIL;
  const excess = raw - RATIO_LINEAR_UNTIL;
  return RATIO_LINEAR_UNTIL + headroom * (1 - Math.exp(-excess / headroom));
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function pick(table: readonly number[], index: number): number {
  return table[clamp(Math.round(index), 0, table.length - 1)]!;
}

/**
 * Yayımlanan tutarları yuvarlar. İki işi birden yapar: sonucu "tahmin"
 * gibi gösterir (kuruşu kuruşuna bir sayı, olmayan bir kesinlik iddiasıdır)
 * ve kalem dökümünden katsayıların geri çıkarılmasını bozar.
 */
function quantize(value: number): number {
  const step = value >= 1e8 ? 1e6 : value >= 1e7 ? 1e5 : value >= 1e6 ? 1e4 : 1e3;
  return Math.round(value / step) * step;
}

/* ── Ölçülebilirlik (S12) ──────────────────────────────────────────────── */

const MEASURE_LABELS = [
  "Ölçülemez",
  "Kısmen ölçülebilir",
  "Ölçülebilir",
  "Güçlü",
  "Tam kapsam",
];

const MEASURE_NOTES = [
  "Hiçbir metrik sistem kaynaklı değil. Bu durumda prim hesabına giren metrik olmaz; önce veri altyapısı kurulur.",
  "Tek sistem kaynağı var. Metriklerin çoğu beyana dayalı kalır ve başarı primi kapsamından çıkarılır.",
  "İki sistem kaynağı var. Zaman ve kadro metriklerinin bir bölümü sözleşme ekine yazılabilir.",
  "Üç sistem kaynağı var. Metrik ağacının büyük bölümü baz dönemde dondurulabilir.",
  "Dört sistem kaynağı da mevcut. Metrik ağacının tamamı sistem kaynaklı hesaplanabilir.",
];

/* ── Hesap ─────────────────────────────────────────────────────────────── */

export function compute(input: TestValues): TestResult {
  const emp = clamp(input.emp, LIMITS.emp.min, LIMITS.emp.max);
  const cost = clamp(input.cost, LIMITS.cost.min, LIMITS.cost.max);
  const layers = clamp(input.layers, LIMITS.layers.min, LIMITS.layers.max);
  const meet = clamp(input.meet, LIMITS.meet.min, LIMITS.meet.max);
  const overtime = clamp(input.overtime, LIMITS.overtime.min, LIMITS.overtime.max);
  const turnover = clamp(input.turnover, LIMITS.turnover.min, LIMITS.turnover.max);
  const rework = clamp(input.rework, LIMITS.rework.min, LIMITS.rework.max);

  const k = sectorK(input.sector);
  const annualPayroll = emp * cost * 12;

  const decF = pick(DECISION_WASTE, input.dec);
  const spanF = pick(SPAN_LOSS, input.span);
  const vacF = pick(VACANCY_LOSS, input.vac);
  const rampF = pick(RAMP_LOSS, input.ramp);

  // Zaman kaybı: toplantı fazlası + kararsız toplantı + onay katmanı + rework
  const meetingShare =
    (Math.max(0, meet - MEETING_BASELINE_HOURS) / WEEKLY_HOURS) * MEETING_RECOVERABLE;
  const decisionShare = (meet / WEEKLY_HOURS) * decF * DECISION_RECOVERABLE;
  const layerShare = Math.min(
    LAYER_LOSS_CAP,
    Math.max(0, layers - LAYER_BASELINE) * LAYER_LOSS_PER_STEP,
  );
  const reworkShare = (rework / 100) * REWORK_RECOVERABLE;
  const timeShare = (meetingShare + decisionShare + layerShare + reworkShare) * k;

  // Eşleşme kaybı: kontrol alanı + verime ulaşma süresi
  const matchShare = (spanF + rampF) * k;

  // Kadro kaybı: gönüllü devir + yapısal fazla mesai + boş kadro
  const staffShare =
    ((turnover / 100) * TURNOVER_COST + (overtime / 100) * OVERTIME_RECOVERABLE + vacF) * k;

  const rawRatio = timeShare + matchShare + staffShare;
  const ratio = compressRatio(rawRatio);
  // Sıkıştırma üç kaleme orantılı dağıtılır ki döküm toplamla tutsun.
  const scale = rawRatio > 0 ? ratio / rawRatio : 0;

  // Kalemleri nicemleyerek yayımlarız: aksi hâlde üç kalem + toplam +
  // personel maliyeti birlikte katsayı tablosunu tek denklemle geri verir.
  const time = quantize(annualPayroll * timeShare * scale);
  const match = quantize(annualPayroll * matchShare * scale);
  const staff = quantize(annualPayroll * staffShare * scale);

  const measurableCount = [
    input.systems.erp,
    input.systems.ticket,
    input.systems.hr,
    input.systems.calendar,
  ].filter(Boolean).length;

  const total = time + match + staff;

  return {
    formulaVersion: FORMULA_VERSION,
    annualPayroll,
    time,
    match,
    staff,
    total,
    // Yayımlanan oran, yayımlanan tutarlarla tutarlı olsun.
    ratio: annualPayroll > 0 ? Math.round((total / annualPayroll) * 1000) / 1000 : 0,
    /**
     * "Tavana dayandı" uyarısı yalnızca sonuç gerçekten üst banda oturduğunda
     * gösterilir. Sıkıştırmanın herhangi bir miktarda devreye girmesi tek
     * başına ölçüt değil: varsayılan girdilerde de sıkıştırma vardır ve o
     * durumda uyarı yanıltıcı olur.
     */
    capped: ratio >= RATIO_CEILING - 0.02,
    sector: input.sector,
    sectorLabel: sectorLabel(input.sector),
    measurableCount,
    measurableLabel: MEASURE_LABELS[measurableCount]!,
    measurableNote: MEASURE_NOTES[measurableCount]!,
  };
}

/**
 * Ana sayfadaki üç girdilik hızlı tahmin. Testin basitleştirilmiş halidir;
 * soru setine verilen tipik yanıtlar sabit kabul edilir.
 */
export function quickEstimate(emp: number, revenueMn: number, cost: number) {
  const e = clamp(emp, LIMITS.emp.min, LIMITS.emp.max);
  const c = clamp(cost, LIMITS.cost.min, LIMITS.cost.max);
  const revenue = clamp(revenueMn, 50, 10_000) * 1e6;

  const payroll = e * c * 12;
  const payrollShare = Math.min(0.85, payroll / Math.max(revenue, 1));
  // Büyüyen kadro ve ağırlaşan personel payı, geri kazanılabilir boşluğu artırır.
  // Tavan, testin tavanıyla aynı bandda: belgelenmemiş bir oran yayımlanmaz.
  const ratio = Math.min(
    RATIO_CEILING,
    0.11 + Math.log10(e / LIMITS.emp.min) * 0.052 + payrollShare * 0.16,
  );

  return {
    ratio: Math.round(ratio * 1000) / 1000,
    value: quantize(payroll * ratio),
    payroll,
  };
}
