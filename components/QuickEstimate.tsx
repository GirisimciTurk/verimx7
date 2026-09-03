"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { useCalc } from "@/lib/use-calc";
import { ROUTES, decimalTR, groupTR } from "@/lib/site";

export type QuickResult = { ratio: number; value: number; payroll: number };

type Props = {
  defaults: { emp: number; revenueMn: number; cost: number };
  initial: QuickResult;
};

/**
 * Ana sayfadaki üç girdilik hızlı tahmin kartı.
 *
 * Sunucu varsayılan girdilerin sonucunu basar; kaydırıcı oynatıldığında
 * sonuç sunucudan yeniden istenir (katsayılar istemciye inmez).
 */
export default function QuickEstimate({ defaults, initial }: Props) {
  const [emp, setEmp] = useState(defaults.emp);
  const [revenueMn, setRevenueMn] = useState(defaults.revenueMn);
  const [cost, setCost] = useState(defaults.cost);
  const ids = { emp: useId(), rev: useId(), cost: useId() };

  const { data, pending } = useCalc<QuickResult>("quick", { emp, revenueMn, cost }, initial);

  const ratioLabel = `%${decimalTR(data.ratio * 100)}`;
  const valueLabel = `${decimalTR(data.value / 1e6)} mn ₺`;

  return (
    <div
      className="card elev-md"
      style={{
        background: "var(--color-surface)",
        padding: "var(--space-8)",
        gap: "var(--space-6)",
        borderRadius: "calc(var(--radius-lg) * 1.25)",
      }}
    >
      <div style={{ display: "grid", gap: "var(--space-1)" }}>
        <span className="card-kicker">Hızlı tahmin</span>
        <span style={{ fontSize: 15, color: "var(--color-neutral-700)" }}>
          Üç girdiyle, personel maliyetinizin ne kadarının çıktı üretmeyen işe
          gittiğine dair kaba bir büyüklük tahmini.
        </span>
      </div>

      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <label htmlFor={ids.emp} style={{ display: "grid", gap: "var(--space-2)" }}>
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontSize: 14,
            }}
          >
            <span>Çalışan sayısı</span>
            <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {groupTR(emp)} kişi
            </span>
          </span>
          <input
            id={ids.emp}
            className="rng"
            type="range"
            min={20}
            max={5000}
            step={10}
            value={emp}
            onChange={(e) => setEmp(Number(e.target.value))}
          />
        </label>

        <label htmlFor={ids.rev} style={{ display: "grid", gap: "var(--space-2)" }}>
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontSize: 14,
            }}
          >
            <span>Yıllık ciro</span>
            <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {groupTR(revenueMn)} mn ₺
            </span>
          </span>
          <input
            id={ids.rev}
            className="rng"
            type="range"
            min={50}
            max={10000}
            step={50}
            value={revenueMn}
            onChange={(e) => setRevenueMn(Number(e.target.value))}
          />
        </label>

        <label htmlFor={ids.cost} style={{ display: "grid", gap: "var(--space-2)" }}>
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontSize: 14,
            }}
          >
            <span>Kişi başı aylık personel maliyeti</span>
            <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
              {groupTR(cost)} ₺
            </span>
          </span>
          <input
            id={ids.cost}
            className="rng"
            type="range"
            min={15000}
            max={250000}
            step={1000}
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </label>
      </div>

      <div
        aria-live="polite"
        style={{
          display: "grid",
          gap: 1,
          background: "var(--color-accent-200)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          opacity: pending ? 0.72 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          style={{
            background: "var(--color-accent-900)",
            padding: "var(--space-4) var(--space-6)",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent-300)",
            }}
          >
            Atıl payın personel maliyetine oranı
          </div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 34,
              lineHeight: 1.1,
              color: "var(--color-accent-100)",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {ratioLabel}
          </div>
        </div>
        <div
          style={{
            background: "var(--color-accent-900)",
            padding: "var(--space-4) var(--space-6)",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent-300)",
            }}
          >
            Tahmini yıllık atıl kapasite
          </div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 34,
              lineHeight: 1.1,
              color: "var(--color-accent-100)",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {valueLabel}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          flexWrap: "wrap",
        }}
      >
        <Link className="btn btn-primary" href={ROUTES.test}>
          12 soruluk teste geç
        </Link>
        <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>
          Sektör varsayımıyla hesaplanır, teşhis yerine geçmez. Gerçek büyüklük
          kurum sistemlerinizden gelen veriyle ölçülür.
        </span>
      </div>
    </div>
  );
}
