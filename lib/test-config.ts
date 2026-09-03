/**
 * Atıl Kapasite Testi'nin PAYLAŞILAN yapılandırması.
 *
 * Burada yalnızca arayüzün bilmesi gereken şeyler var: soru metinleri,
 * kaydırıcı sınırları, seçenek etiketleri ve sonuç tipi. Hesaplama
 * KATSAYILARI burada değil — onlar lib/engine.ts içinde, sunucuda kalır.
 */

export const FORMULA_VERSION = "v1.0";

export const LIMITS = {
  emp: { min: 20, max: 5000, step: 10, default: 320 },
  cost: { min: 15_000, max: 250_000, step: 1_000, default: 62_000 },
  layers: { min: 1, max: 10, step: 1, default: 5 },
  meet: { min: 2, max: 25, step: 1, default: 9 },
  overtime: { min: 0, max: 40, step: 1, default: 12 },
  turnover: { min: 2, max: 45, step: 1, default: 14 },
  rework: { min: 0, max: 40, step: 1, default: 8 },
} as const;

export type SectorKey =
  | "holding"
  | "bakanlik"
  | "belediye"
  | "ppp"
  | "uretim"
  | "lojistik"
  | "saglik"
  | "perakende";

export type SectorDef = { key: SectorKey; label: string };

/** Kurum tipi seçenekleri. Çarpanları engine.ts bilir, arayüz bilmez. */
export const SECTORS: readonly SectorDef[] = [
  { key: "holding", label: "Holdingler ve büyük ölçekli şirketler" },
  { key: "bakanlik", label: "Bakanlıklar ve bağlı kurumlar" },
  { key: "belediye", label: "Belediyeler ve iştirakleri" },
  { key: "ppp", label: "Kamu–özel ortaklıkları (PPP)" },
  { key: "uretim", label: "Üretim" },
  { key: "lojistik", label: "Lojistik" },
  { key: "saglik", label: "Özel sağlık kuruluşları" },
  { key: "perakende", label: "Perakende zincirleri" },
] as const;

export const DEFAULT_SECTOR: SectorKey = "holding";

export function sectorLabel(key: SectorKey): string {
  return (SECTORS.find((s) => s.key === key) ?? SECTORS[0]!).label;
}

/* ── Dört seçenekli soruların etiketleri ───────────────────────────────── */

export const CHOICES = {
  span: ["1–3 kişi", "4–7 kişi", "8–12 kişi", "12+ kişi"],
  dec: ["%10'dan az", "%10–25", "%25–50", "%50'den fazla"],
  vac: ["30 günden az", "30–60 gün", "60–120 gün", "120+ gün"],
  ramp: ["30 günden az", "30–90 gün", "90–180 gün", "180+ gün"],
} as const;

export const SYSTEM_OPTIONS = [
  { key: "erp", label: "ERP" },
  { key: "ticket", label: "Ticket / iş akışı" },
  { key: "hr", label: "İK / bordro" },
  { key: "calendar", label: "Kurumsal takvim" },
] as const;

export type SystemKey = (typeof SYSTEM_OPTIONS)[number]["key"];

/* ── Test girdisi ve sonucu ────────────────────────────────────────────── */

export type TestValues = {
  emp: number;
  cost: number;
  span: number;
  layers: number;
  meet: number;
  dec: number;
  overtime: number;
  turnover: number;
  vac: number;
  rework: number;
  ramp: number;
  systems: Record<SystemKey, boolean>;
  sector: SectorKey;
};

export const DEFAULT_VALUES: TestValues = {
  emp: LIMITS.emp.default,
  cost: LIMITS.cost.default,
  span: 1,
  layers: LIMITS.layers.default,
  meet: LIMITS.meet.default,
  dec: 1,
  overtime: LIMITS.overtime.default,
  turnover: LIMITS.turnover.default,
  vac: 1,
  rework: LIMITS.rework.default,
  ramp: 1,
  systems: { erp: true, ticket: false, hr: true, calendar: false },
  sector: DEFAULT_SECTOR,
};

export type TestResult = {
  formulaVersion: string;
  annualPayroll: number;
  time: number;
  match: number;
  staff: number;
  total: number;
  ratio: number;
  capped: boolean;
  sector: SectorKey;
  sectorLabel: string;
  measurableCount: number;
  measurableLabel: string;
  measurableNote: string;
};
