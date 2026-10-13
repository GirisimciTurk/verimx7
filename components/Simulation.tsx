"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { SIMULATION_SECTORS, checkEmail, type SimulationSectorKey } from "@/lib/form-constants";
import {
  AREA_KEYS,
  AREA_NAMES,
  RESULT_BANDS,
  SIMULATION_SECTOR_DEFS,
  STAGE_NAMES,
  START_AREA_SCORE,
  START_INDEX,
  START_NODE,
  STEP_NOTES,
  STRONG_NOTES,
  TREE,
  WEAK_NOTES,
  bandFor,
  type AreaKey,
  type NodeKey,
} from "@/lib/simulation-data";
import { BRAND, ROUTES, SECTIONS, decimalTR } from "@/lib/site";

type PathStep = { area: string; label: string; effect: string };

type Snapshot = {
  node: NodeKey;
  idx: number;
  cash: number;
  series: number[];
  areas: Record<AreaKey, number>;
  path: PathStep[];
  missed: string[];
  done: boolean;
};

type State = Snapshot & {
  sector: SimulationSectorKey | null;
  hist: Snapshot[];
};

function freshAreas(): Record<AreaKey, number> {
  return {
    insan: START_AREA_SCORE,
    mekan: START_AREA_SCORE,
    makine: START_AREA_SCORE,
    tek: START_AREA_SCORE,
    dogal: START_AREA_SCORE,
  };
}

function initialState(): State {
  return {
    sector: null,
    node: START_NODE,
    idx: START_INDEX,
    cash: 0,
    series: [0],
    areas: freshAreas(),
    path: [],
    missed: [],
    done: false,
    hist: [],
  };
}

function snapshot(s: State): Snapshot {
  return {
    node: s.node,
    idx: s.idx,
    cash: s.cash,
    series: s.series.slice(),
    areas: { ...s.areas },
    path: s.path.slice(),
    missed: s.missed.slice(),
    done: s.done,
  };
}

/** İşaretli milyon ₺ gösterimi: +18,5 mn ₺ / −34 mn ₺ */
function mn(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${decimalTR(Math.abs(value))} mn ₺`;
}

/**
 * Gösterilen endeksi hedefe doğru yumuşatır. "Hareketi azalt" tercihinde
 * doğrudan hedefe atlar.
 */
function useTween(target: number): number {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = target;
      setValue(target);
      return;
    }
    let raf = 0;
    const tick = () => {
      const next = current.current + (target - current.current) * 0.14;
      if (Math.abs(target - next) < 0.08) {
        current.current = target;
        setValue(target);
        return;
      }
      current.current = next;
      setValue(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return value;
}

const CHART_W = 560;
const CHART_H = 180;
const CHART_PAD = 14;
const CHART_XPAD = 12;

function cashChart(series: number[]) {
  const min = Math.min(0, ...series);
  const max = Math.max(10, ...series);
  const y = (v: number) => CHART_PAD + ((max - v) / (max - min)) * (CHART_H - CHART_PAD * 2);
  const x = (i: number) =>
    series.length < 2 ? CHART_W / 2 : CHART_XPAD + i * ((CHART_W - CHART_XPAD * 2) / (series.length - 1));
  const last = series.length - 1;
  const dots = series.map((v, i) => ({
    x: x(i).toFixed(1),
    y: y(v).toFixed(1),
    left: i === last ? "auto" : i === 0 ? "0px" : `${((x(i) / CHART_W) * 100).toFixed(2)}%`,
    right: i === last ? "0px" : "auto",
    tx: i === 0 || i === last ? "none" : "translateX(-50%)",
    ta: (i === 0 ? "left" : i === last ? "right" : "center") as "left" | "right" | "center",
    label: i === 0 ? "başlangıç" : STAGE_NAMES[i - 1]!,
  }));
  return {
    points: series.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" "),
    dots,
    zeroY: y(0).toFixed(1),
  };
}

/** Beş eksenli radar: yukarıdan saat yönünde İnsan, Mekân, Makine, Teknoloji, Doğal kaynak. */
const RADAR_DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [0.951, -0.309],
  [0.588, 0.809],
  [-0.588, 0.809],
  [-0.951, -0.309],
];

function radarPoints(areas: Record<AreaKey, number>): string {
  return AREA_KEYS.map((k, i) => {
    const r = (areas[k] / 100) * 95;
    return `${(120 + RADAR_DIRS[i]![0] * r).toFixed(1)},${(120 + RADAR_DIRS[i]![1] * r).toFixed(1)}`;
  }).join(" ");
}

const RADAR_RINGS = [
  "120,25 210.3,90.6 175.9,196.9 64.1,196.9 29.7,90.6",
  "120,48.75 187.7,98 161.9,177.6 78.1,177.6 52.3,98",
  "120,72.5 165.2,105.3 147.9,158.4 92.1,158.4 74.8,105.3",
  "120,96.25 142.6,112.7 134,139.2 106,139.2 97.4,112.7",
] as const;

const RADAR_SPOKES = [
  [120, 25],
  [210.3, 90.6],
  [175.9, 196.9],
  [64.1, 196.9],
  [29.7, 90.6],
] as const;

type MailStatus = "idle" | "sending" | "sent";

/**
 * Verim Simülasyonu.
 *
 * Tamamen tarayıcıda çalışır; hiçbir karar sunucuya gitmez. Yalnızca sonuç
 * ekranındaki rapor talebi (e-posta + sonuç özeti) /api/rapor'a gönderilir.
 */
export default function Simulation() {
  const [s, setS] = useState<State>(initialState);
  const disp = useTween(s.idx);
  const resultRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const [mail, setMail] = useState("");
  const [mailConsent, setMailConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [mailStatus, setMailStatus] = useState<MailStatus>("idle");
  const [mailError, setMailError] = useState("");

  // Sonuç ekranı açılınca başlığına kaydır; kararlar arasında kaydırma yok.
  useEffect(() => {
    if (!s.done) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [s.done]);

  function begin(sector: SimulationSectorKey) {
    setS({ ...initialState(), sector });
    // Dar ekranda sektör kartları ekranın altında kalır; oyun alanı görünür
    // değilse ona kaydır. Geniş ekranda zaten görünürdür, kaydırma yapılmaz.
    requestAnimationFrame(() => {
      const el = playRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function choose(i: number) {
    setS((prev) => {
      if (!prev.sector || prev.done) return prev;
      const node = TREE[prev.node];
      const c = node.ch[i]!;
      const f = SIMULATION_SECTOR_DEFS[prev.sector].f;
      const areas = { ...prev.areas };
      for (const k of AREA_KEYS) {
        const delta = c.a[k];
        if (delta !== undefined) areas[k] = Math.max(4, Math.min(100, areas[k] + delta));
      }
      const cash = prev.cash + c.c * f;
      return {
        ...prev,
        hist: prev.hist.concat([snapshot(prev)]),
        idx: Math.max(6, Math.min(100, prev.idx + c.i)),
        cash,
        series: prev.series.concat([cash]),
        areas,
        path: prev.path.concat([{ area: node.area, label: c.t, effect: c.w }]),
        missed: c.m ? prev.missed.concat([c.m]) : prev.missed,
        node: c.to === "end" ? prev.node : c.to,
        done: c.to === "end",
      };
    });
  }

  function undo() {
    setS((prev) => {
      const last = prev.hist[prev.hist.length - 1];
      if (!last) return prev;
      return { ...prev, ...last, hist: prev.hist.slice(0, -1) };
    });
  }

  function restart() {
    setS(initialState());
    setMail("");
    setMailConsent(false);
    setMailStatus("idle");
    setMailError("");
  }

  /* ── türetilen değerler ── */
  const sector = s.sector ? SIMULATION_SECTOR_DEFS[s.sector] : SIMULATION_SECTOR_DEFS.sanayi;
  const node = TREE[s.node];
  const band = bandFor(RESULT_BANDS, s.idx);
  const sorted = AREA_KEYS.slice().sort((a, b) => s.areas[a] - s.areas[b]);
  const weak = sorted[0]!;
  const strong = sorted[sorted.length - 1]!;
  const diff = s.idx - sector.bench;
  const benchNote =
    diff >= 8
      ? "Sektör ortalamasının belirgin biçimde üzerindesiniz."
      : diff >= 0
        ? "Sektör ortalamasının hemen üzerindesiniz."
        : diff > -10
          ? "Sektör ortalamasının biraz altında kaldınız."
          : "Sektör ortalamasının altında kaldınız; kayıp büyük ölçüde ölçülmeyen alanlarda.";
  const chart = cashChart(s.series);
  const shownIdx = Math.round(disp);
  const weakLower = AREA_NAMES[weak].toLocaleLowerCase("tr-TR");
  const strongLower = AREA_NAMES[strong].toLocaleLowerCase("tr-TR");

  async function sendReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = checkEmail(mail) ?? (mailConsent ? undefined : "Aydınlatma metni onayı gereklidir.");
    if (problem) {
      setMailError(problem);
      return;
    }
    if (!s.sector) return;

    setMailStatus("sending");
    setMailError("");
    try {
      const response = await fetch("/api/rapor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mail.trim().toLowerCase(),
          consent: true,
          website,
          simulation: {
            sector: s.sector,
            index: Math.round(s.idx),
            band: band[2],
            cashMn: Math.round(s.cash * 10) / 10,
            path: s.path,
            missed: s.missed,
            weakest: AREA_NAMES[weak],
            strongest: AREA_NAMES[strong],
          },
        }),
      });
      if (response.ok) {
        setMailStatus("sent");
        return;
      }
      const payload = (await response.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
      setMailError(payload.fields?.email ?? payload.error ?? "Talep gönderilemedi. Lütfen tekrar deneyin.");
      setMailStatus("idle");
    } catch {
      setMailError("Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.");
      setMailStatus("idle");
    }
  }

  /* ── 1. Sektör seçimi ── */
  if (!s.sector) {
    return (
      <section className="page-sec" aria-labelledby={`${uid}-pick`}>
        <h2 id={`${uid}-pick`} style={{ fontSize: 28, margin: "0 0 var(--space-3)" }}>
          Hangi kurumu yöneteceksiniz?
        </h2>
        <p style={{ fontSize: 16, color: "var(--color-neutral-700)", margin: "0 0 var(--space-6)" }}>
          Seçtiğiniz alan, karşınıza çıkacak durumların ölçeğini belirler.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {SIMULATION_SECTORS.map((key) => {
            const def = SIMULATION_SECTOR_DEFS[key];
            return (
              <button key={key} className="sec-card" type="button" onClick={() => begin(key)}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--color-accent-800)" }}>
                  {def.label}
                </span>
                <span style={{ fontSize: 15, color: "var(--color-neutral-700)" }}>{def.note}</span>
                <span style={{ fontSize: 13, color: "var(--color-accent-700)", fontWeight: 600 }}>Başla →</span>
              </button>
            );
          })}
        </div>
        <div
          className="washed"
          style={{
            position: "relative",
            marginTop: "var(--space-8)",
            borderRadius: "calc(var(--radius-lg) * 1.2)",
            overflow: "hidden",
            height: 260,
          }}
        >
          <Image
            src="/img/bos_fabrika.jpg"
            alt="Tavanı ışıklıklı, bomboş ve geniş bir fabrika holü"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1120px"
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>
    );
  }

  /* ── 2. Oyun ── */
  if (!s.done) {
    return (
      <section ref={playRef} className="page-sec sim-grid" aria-label="Simülasyon">
        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          <ol className="sim-rail" aria-label="Aşamalar" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {STAGE_NAMES.map((name, i) => {
              const state = i + 1 < node.stage ? "done" : i + 1 === node.stage ? "now" : "next";
              return (
                <li key={name} className="rail-dot" data-state={state} aria-current={state === "now" ? "step" : undefined}>
                  <div className="rail-bar" aria-hidden="true" />
                  <span className="rail-name">{name}</span>
                </li>
              );
            })}
          </ol>

          <div
            key={s.node}
            className="node-card card elev-sm"
            style={{
              background: "var(--color-surface)",
              padding: "var(--space-8)",
              gap: "var(--space-4)",
              borderRadius: "calc(var(--radius-lg) * 1.2)",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)" }}>
              <span className="tag tag-accent-2">{node.area}</span>
              <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>Aşama {node.stage} / 5</span>
            </div>
            <h2 style={{ fontSize: 27, lineHeight: 1.25, margin: 0 }}>{node.title}</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--color-neutral-800)", margin: 0 }}>{node.text}</p>
          </div>

          <div key={`${s.node}-ch`} style={{ display: "grid", gap: "var(--space-3)" }} role="group" aria-label="Kararınız">
            {node.ch.map((c, i) => (
              <button key={c.t} className="ch" type="button" onClick={() => choose(i)}>
                <span style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.35 }}>{c.t}</span>
                <span style={{ fontSize: 14, color: "var(--color-neutral-700)" }}>{c.w}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
            <button className="ghost" type="button" onClick={undo} disabled={s.hist.length === 0}>
              ← Son kararı geri al
            </button>
            <button className="ghost" type="button" onClick={restart}>
              Baştan başla
            </button>
          </div>
        </div>

        <aside className="sim-aside" aria-label="Durum">
          <div className="card elev-md" style={{ background: "var(--color-accent-900)", color: "var(--color-accent-100)", gap: "var(--space-4)" }} aria-live="polite">
            <span style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent-300)" }}>
              Verim endeksi
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 54, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {shownIdx}
              </span>
              <span style={{ fontSize: 15, color: "var(--color-accent-200)" }}>
                {s.path.length ? `${s.path.length} karar` : "başlangıç"}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "color-mix(in srgb, var(--color-accent-100) 22%, transparent)", overflow: "hidden" }} aria-hidden="true">
              <div style={{ height: "100%", borderRadius: 999, background: "var(--color-accent-300)", width: `${s.idx}%`, transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "var(--space-3)", paddingTop: "var(--space-2)", borderTop: "1px solid var(--color-accent-800)" }}>
              <span style={{ fontSize: 14, color: "var(--color-accent-200)" }}>Birikimli etki</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontVariantNumeric: "tabular-nums" }}>{mn(s.cash)}</span>
            </div>
          </div>

          <div className="card elev-sm" style={{ gap: "var(--space-4)" }}>
            <span className="card-kicker">Kaynak alanları</span>
            {AREA_KEYS.map((k) => (
              <div key={k} style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 14 }}>
                  <span>{AREA_NAMES[k]}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--color-neutral-700)" }}>{Math.round(s.areas[k])}</span>
                </div>
                <div className="hudbar" aria-hidden="true">
                  <div className="hudfill" style={{ width: `${s.areas[k]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    );
  }

  /* ── 3. Sonuç ── */
  return (
    <section className="page-sec" style={{ display: "grid", gap: "var(--space-8)" }} aria-label="Simülasyon sonucu">
      <div ref={resultRef} className="sim-result-hero card elev-lg" style={{ scrollMarginTop: 104 }}>
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <span style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent-300)" }}>
            {sector.label} · sonuç
          </span>
          <span className="sim-score" style={{ fontVariantNumeric: "tabular-nums" }}>{shownIdx}</span>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 26, color: "var(--color-accent-300)" }}>{band[2]}</span>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--color-accent-200)", margin: 0 }}>{band[3]}</p>
        </div>
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, color: "var(--color-accent-200)" }}>Birikimli etki</span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 38 }}>{mn(s.cash)}</span>
          </div>
          <div style={{ display: "grid", gap: "var(--space-3)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-accent-800)" }}>
            <span style={{ fontSize: 13, color: "var(--color-accent-300)" }}>Sektör ortalaması ile</span>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span>Siz</span>
                <span>{Math.round(s.idx)}</span>
              </div>
              <div style={{ height: 14, borderRadius: 999, background: "color-mix(in srgb, var(--color-accent-100) 20%, transparent)", overflow: "hidden" }} aria-hidden="true">
                <div style={{ height: "100%", borderRadius: 999, background: "var(--color-accent-300)", width: `${s.idx}%`, transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }} />
              </div>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--color-accent-200)" }}>
                <span>{sector.label} ortalaması</span>
                <span>{sector.bench}</span>
              </div>
              <div style={{ height: 14, borderRadius: 999, background: "color-mix(in srgb, var(--color-accent-100) 20%, transparent)", overflow: "hidden" }} aria-hidden="true">
                <div style={{ height: "100%", borderRadius: 999, background: "color-mix(in srgb, var(--color-accent-100) 45%, transparent)", width: `${sector.bench}%` }} />
              </div>
            </div>
            <span style={{ fontSize: 14, color: "var(--color-accent-200)" }}>{benchNote}</span>
          </div>
        </div>
      </div>

      <div className="sim-result-charts">
        <div className="card elev-sm" style={{ gap: "var(--space-6)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)" }}>
            <span className="card-kicker">Kazanç eğrisi</span>
            <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>aşama aşama birikimli etki</span>
          </div>
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H + 6}`} style={{ width: "100%", height: "auto" }} role="img" aria-label={`Kazanç eğrisi: ${s.series.map((v) => mn(v)).join(", ")}`}>
            <line x1="0" y1={chart.zeroY} x2={CHART_W} y2={chart.zeroY} stroke="var(--color-divider)" strokeWidth="1" />
            <polyline className="cash-line" points={chart.points} fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            {chart.dots.map((d) => (
              <circle key={d.label} cx={d.x} cy={d.y} r="5" fill="var(--color-accent)" />
            ))}
          </svg>
          <div style={{ position: "relative", height: 32, fontSize: 11, color: "var(--color-neutral-600)" }} aria-hidden="true">
            {chart.dots.map((d) => (
              <span
                key={d.label}
                style={{ position: "absolute", top: 0, left: d.left, right: d.right, transform: d.tx, width: 72, textAlign: d.ta, lineHeight: 1.25 }}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>

        <div className="card elev-sm" style={{ gap: "var(--space-4)" }}>
          <span className="card-kicker">Beş alan</span>
          <svg
            viewBox="-74 -10 388 258"
            style={{ width: "100%", height: "auto" }}
            role="img"
            aria-label={`Kaynak alanları: ${AREA_KEYS.map((k) => `${AREA_NAMES[k]} ${Math.round(s.areas[k])}`).join(", ")}`}
          >
            {RADAR_RINGS.map((pts) => (
              <polygon key={pts} points={pts} fill="none" stroke="var(--color-divider)" strokeWidth="1" />
            ))}
            {RADAR_SPOKES.map(([x, y]) => (
              <line key={`${x}-${y}`} x1="120" y1="120" x2={x} y2={y} stroke="var(--color-divider)" />
            ))}
            <polygon className="radar-shape" points={radarPoints(s.areas)} fill="color-mix(in srgb, var(--color-accent) 22%, transparent)" stroke="var(--color-accent)" strokeWidth="2.5" />
            <text x="120" y="12" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--color-neutral-800)">İnsan</text>
            <text x="220" y="86" textAnchor="start" fontSize="12" fontWeight="600" fill="var(--color-neutral-800)">Mekân</text>
            <text x="186" y="220" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--color-neutral-800)">Makine</text>
            <text x="56" y="220" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--color-neutral-800)">Teknoloji</text>
            <text x="20" y="86" textAnchor="end" fontSize="12" fontWeight="600" fill="var(--color-neutral-800)">Doğal kaynak</text>
          </svg>
        </div>
      </div>

      <div className="sim-result-half">
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          <h3 style={{ margin: 0, fontSize: 26 }}>İzlediğiniz yol</h3>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--space-3)" }}>
            {s.path.map((p, i) => (
              <li key={`${i}-${p.label}`} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-4)", alignItems: "start", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-divider)" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 14, color: "var(--color-accent-700)", paddingTop: 3 }}>{p.area}</span>
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.35 }}>{p.label}</span>
                  <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>{p.effect}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          <h3 style={{ margin: 0, fontSize: 26 }}>Kaçırdığınız fırsatlar</h3>
          {s.missed.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--space-3)" }}>
              {s.missed.map((m) => (
                <li key={m} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-3)", alignItems: "start", padding: "var(--space-4)", background: "var(--color-accent-100)", borderRadius: "var(--radius-lg)" }}>
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)", marginTop: 7 }} />
                  <span style={{ fontSize: 15, lineHeight: 1.5 }}>{m}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--color-neutral-800)", padding: "var(--space-4)", background: "var(--color-accent-2-100)", borderRadius: "var(--radius-lg)" }}>
              Her aşamada ölçümü aksiyona bağladınız. Gerçek hayatta zor olan kısım burası: ölçüm
              çıktıktan sonra karar vermek.
            </p>
          )}
        </div>
      </div>

      <div className="sim-result-diag card elev-md">
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <span className="card-kicker">Size özel teşhis önerisi</span>
          <h3 style={{ margin: 0, fontSize: 30 }}>Önce {weakLower} alanını ölçelim</h3>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--color-neutral-800)", margin: 0, maxWidth: "48em" }}>
            Simülasyonda en çok kaybı {weakLower} alanında bıraktınız; en güçlü tarafınız {strongLower} oldu.
            Beş günlük teşhis, bu iki alanın gerçek verisiyle başlar: zayıf alanda kaybın büyüklüğünü
            çıkarır, güçlü alanda kazanımı sözleşmeye yazılabilir hâle getirir.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "var(--space-4)" }}>
          {[
            { k: "En zayıf alan", v: AREA_NAMES[weak], n: WEAK_NOTES[weak] },
            { k: "En güçlü alan", v: AREA_NAMES[strong], n: STRONG_NOTES[strong] },
            { k: "Önerilen ilk adım", v: AREA_NAMES[weak], n: STEP_NOTES[weak] },
          ].map((c) => (
            <div key={c.k} className="card" style={{ background: "var(--color-bg)", gap: "var(--space-2)" }}>
              <span style={{ fontSize: 13, color: "var(--color-accent-700)", fontWeight: 600 }}>{c.k}</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 22 }}>{c.v}</span>
              <span style={{ fontSize: 14, color: "var(--color-neutral-700)" }}>{c.n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sim-result-share">
        <div className="card elev-lg" style={{ background: "var(--color-bg)", border: "1px solid var(--color-accent-200)", borderRadius: "calc(var(--radius-lg) * 1.3)", padding: "var(--space-8)", gap: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
            <span className="nav-brand" style={{ fontSize: 22 }}>{BRAND}</span>
            <Image src="/logo-mark.png" alt="" width={44} height={44} style={{ objectFit: "contain" }} />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 64, lineHeight: 1, color: "var(--color-accent-800)" }}>{Math.round(s.idx)}</span>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "var(--color-accent-2-700)" }}>{band[2]}</span>
          <dl style={{ display: "grid", gap: "var(--space-2)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--color-divider)", fontSize: 14, color: "var(--color-neutral-800)", margin: 0 }}>
            {[
              ["Kurum", sector.label],
              ["Birikimli etki", mn(s.cash)],
              ["Kaçırılan fırsat", `${s.missed.length} kalem`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)" }}>
                <dt>{k}</dt>
                <dd style={{ margin: 0 }}>{v}</dd>
              </div>
            ))}
          </dl>
          <span style={{ fontSize: 12, color: "var(--color-neutral-600)" }}>Ekran görüntüsü alıp paylaşabilirsiniz.</span>
        </div>

        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          <h3 style={{ margin: 0, fontSize: 26 }}>Detaylı raporu isteyin</h3>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--color-neutral-800)", margin: 0 }}>
            Bu simülasyon temsili katsayılarla çalışır. Kendi verinizle kurulmuş hâlini ve beş günlük
            teşhis kapsamını e-posta ile gönderiyoruz.
          </p>
          {mailStatus === "sent" ? (
            <div role="status" style={{ padding: "var(--space-6)", background: "var(--color-accent-2-100)", borderRadius: "var(--radius-lg)", display: "grid", gap: "var(--space-2)" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "var(--color-accent-2-800)" }}>Talebiniz alındı</span>
              <span style={{ fontSize: 15, color: "var(--color-neutral-800)" }}>
                Simülasyon sonucunuz ve teşhis kapsamı {mail.trim().toLowerCase()} adresine gönderilecek.
              </span>
            </div>
          ) : (
            <form onSubmit={sendReport} noValidate style={{ display: "grid", gap: "var(--space-3)" }}>
              <label className="sr-only" htmlFor={`${uid}-mail`}>
                E-posta adresi
              </label>
              <input
                id={`${uid}-mail`}
                className="input"
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="ad.soyad@kurum.com"
                value={mail}
                onChange={(e) => {
                  setMail(e.target.value);
                  if (mailError) setMailError("");
                }}
                aria-invalid={mailError ? true : undefined}
              />
              {/* Bot tuzağı — gerçek kullanıcı görmez. */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
                <label htmlFor={`${uid}-website`}>Web sitesi</label>
                <input id={`${uid}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <label style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start", fontSize: 14, lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={mailConsent}
                  onChange={(e) => {
                    setMailConsent(e.target.checked);
                    if (mailError) setMailError("");
                  }}
                  style={{ marginTop: 3, width: 18, height: 18, flex: "none", accentColor: "var(--color-accent)" }}
                />
                <span>
                  KVKK kapsamındaki{" "}
                  <Link href={ROUTES.kvkk} target="_blank">
                    Aydınlatma Metnini
                  </Link>{" "}
                  okudum, onaylıyorum. *
                </span>
              </label>
              <button className="btn btn-primary" type="submit" disabled={mailStatus === "sending"} style={{ justifySelf: "start" }}>
                {mailStatus === "sending" ? "Gönderiliyor…" : "Raporu gönder"}
              </button>
              <span role="alert" aria-live="assertive" style={{ fontSize: 13, color: "var(--color-accent-800)" }}>
                {mailError}
              </span>
              <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>Adresiniz yalnızca bu rapor için kullanılır.</span>
            </form>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", paddingTop: "var(--space-2)" }}>
            <button className="ghost" type="button" onClick={restart}>
              Farklı bir yol dene
            </button>
            <Link className="btn btn-secondary" href={`${ROUTES.home}#${SECTIONS.basvuru}`}>
              Değerlendirme başvurusu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
