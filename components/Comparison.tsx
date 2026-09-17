"use client";

import { useId, useState } from "react";

import { BRAND, decimalTR } from "@/lib/site";

/** Temsili kurum: 1.400 çalışan, kişi başı 62.000 ₺/ay. */
const STAFF = 1400;
const MONTHLY_COST = 62_000;
/** Doğal sürüklenme: ayda 0,14 puan. */
const DRIFT_PER_MONTH = 0.14;
/** Uygulama eğrisi: 34 puana doyan üstel yaklaşım, zaman sabiti 7 ay. */
const GAIN_MAX = 34;
const GAIN_TAU = 7;
/** Çubuk ölçeği: 140 = %100 genişlik. */
const BAR_SCALE = 140;

function gainAt(month: number): number {
  return GAIN_MAX * (1 - Math.exp(-month / GAIN_TAU));
}

function simulate(months: number) {
  const without = 100 + months * DRIFT_PER_MONTH;
  const withUs = 100 + gainAt(months);
  const monthly = STAFF * MONTHLY_COST;
  let cumulative = 0;
  for (let m = 1; m <= months; m += 1) {
    cumulative += monthly * ((gainAt(m) - m * DRIFT_PER_MONTH) / 100);
  }
  return { without, withUs, cumulative };
}

/**
 * "Bizsiz ve bizimle" — ay kaydırıcısıyla temsili karşılaştırma.
 *
 * Katsayılar temsilidir ve ekranda böyle etiketlenir; hesap tarayıcıda
 * yapılır çünkü burada şirketin ölçüm formülü değil, bir anlatı vardır.
 */
export default function Comparison() {
  const [months, setMonths] = useState(12);
  const id = useId();
  const { without, withUs, cumulative } = simulate(months);

  return (
    <div className="split-b">
      <div>
        <h2 className="lp-h2">Bizsiz ve bizimle</h2>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: "var(--color-neutral-800)", maxWidth: "24em" }}>
          Aynı kadro, aynı makine, aynı bütçe. Fark, kaynağın nereye gittiğini bilmekte.
        </p>
        <label htmlFor={id} style={{ display: "grid", gap: "var(--space-2)", marginTop: "var(--space-6)", maxWidth: "22em" }}>
          <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 14 }}>
            <span>Süre</span>
            <span style={{ fontWeight: 600 }}>{months}. ay</span>
          </span>
          <input
            id={id}
            className="rng"
            type="range"
            min={1}
            max={24}
            step={1}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
        </label>
      </div>

      <div style={{ display: "grid", gap: "var(--space-4)" }} aria-live="polite">
        <div className="card" style={{ background: "var(--color-neutral-100)", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 600 }}>Bizsiz</span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 26 }}>{decimalTR(without)}</span>
          </div>
          <div
            style={{ height: 22, borderRadius: 999, background: "var(--color-neutral-200)", overflow: "hidden" }}
            aria-hidden="true"
          >
            <div
              style={{
                height: "100%",
                borderRadius: 999,
                background: "var(--color-neutral-400)",
                width: `${((without / BAR_SCALE) * 100).toFixed(1)}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>
            Doğal sürüklenme. Kayıp ölçülmediği için görünmez.
          </span>
        </div>

        <div className="card elev-md" style={{ background: "var(--color-accent-2)", color: "var(--color-bg)", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 600 }}>{BRAND} ile</span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 26 }}>{decimalTR(withUs)}</span>
          </div>
          <div
            style={{
              height: 22,
              borderRadius: 999,
              background: "color-mix(in srgb, var(--color-bg) 30%, transparent)",
              overflow: "hidden",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                height: "100%",
                borderRadius: 999,
                background: "var(--color-bg)",
                width: `${((withUs / BAR_SCALE) * 100).toFixed(1)}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span style={{ fontSize: 13, opacity: 0.92 }}>Ölçülen kayıp, aksiyona bağlanıp doğrulanıyor.</span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "var(--space-3)",
            paddingLeft: "var(--space-4)",
            borderLeft: "3px solid var(--color-accent)",
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 34, color: "var(--color-accent-700)" }}>
            {decimalTR(cumulative / 1e6)} mn ₺
          </span>
          <span style={{ fontSize: 15, color: "var(--color-neutral-800)" }}>
            birikimli fark · 1.400 çalışanlı temsili kurum
          </span>
        </div>
      </div>
    </div>
  );
}
