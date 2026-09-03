"use client";

import { useId, useState } from "react";

/**
 * Panonun dönem seçimine bağlı bölümü: KPI satırı ve aylık seyir grafiği.
 *
 * Buradaki seri ÖRNEK VERİDİR. Gerçek bir müşteriye ait değildir; abonelik
 * panosunun ne gösterdiğini anlatmak için hazırlanmıştır.
 */

const SERIES = [
  { label: "Eyl", v: 41.2 },
  { label: "Eki", v: 40.6 },
  { label: "Kas", v: 39.1 },
  { label: "Ara", v: 37.4 },
  { label: "Oca", v: 35.8 },
  { label: "Şub", v: 34.2 },
  { label: "Mar", v: 32.9 },
  { label: "Nis", v: 31.1 },
  { label: "May", v: 29.8 },
  { label: "Haz", v: 28.9 },
  { label: "Tem", v: 28.1 },
  { label: "Ağu", v: 27.6 },
] as const;

/** Baz dönem ortalaması (milyon ₺ / yıllıklandırılmış). */
const BASE = 41.2;

const PERIODS = [3, 6, 12] as const;
type Period = (typeof PERIODS)[number];

const MEETING: Record<Period, number> = { 3: 12.1, 6: 13.4, 12: 15.2 };
const CYCLE: Record<Period, number> = { 3: 7.9, 6: 8.6, 12: 9.8 };
const TURNOVER: Record<Period, number> = { 3: 17.9, 6: 17.2, 12: 16.9 };

const fmt1 = (n: number) => n.toFixed(1).replace(".", ",");

export default function DashboardMetrics() {
  const [period, setPeriod] = useState<Period>(12);
  const name = useId();

  const slice = SERIES.slice(SERIES.length - period);
  const max = Math.max(BASE, ...slice.map((d) => d.v)) * 1.08;
  const current = slice[slice.length - 1]!.v;
  const first = slice[0]!.v;

  const meeting = MEETING[period];
  const cycle = CYCLE[period];
  const turnover = TURNOVER[period];

  return (
    <>
      <div
        className="seg"
        role="radiogroup"
        aria-label="Gösterilecek dönem"
        style={{ marginBottom: "var(--space-8)" }}
      >
        {PERIODS.map((value) => (
          <label className="seg-opt" key={value}>
            <input
              type="radio"
              name={name}
              checked={period === value}
              onChange={() => setPeriod(value)}
            />
            Son {value} ay
          </label>
        ))}
      </div>

      <section className="grid-4" aria-label="Ana göstergeler">
        <div className="kpi">
          <span className="kpi-k">Atıl kapasite (yıllık)</span>
          <span className="kpi-v">{fmt1(current)} mn ₺</span>
          <span className="kpi-d" style={{ color: "var(--color-accent-2-800)" }}>
            −{fmt1(((first - current) / first) * 100)}% (seçili dönem) · baz: {fmt1(BASE)} mn ₺
          </span>
        </div>
        <div className="kpi">
          <span className="kpi-k">Toplantı yükü oranı</span>
          <span className="kpi-v">%{fmt1(meeting)}</span>
          <span className="kpi-d" style={{ color: "var(--color-accent-2-800)" }}>
            −{fmt1(18.4 - meeting)} puan · baz: %18,4
          </span>
        </div>
        <div className="kpi">
          <span className="kpi-k">Süreç döngü süresi</span>
          <span className="kpi-v">{fmt1(cycle)} gün</span>
          <span className="kpi-d" style={{ color: "var(--color-accent-2-800)" }}>
            −{fmt1(((11.6 - cycle) / 11.6) * 100)}% · baz: 11,6 gün
          </span>
        </div>
        <div className="kpi" style={{ background: "var(--color-accent-100)" }}>
          <span className="kpi-k" style={{ color: "var(--color-accent-800)" }}>
            Gönüllü devir oranı
          </span>
          <span className="kpi-v">%{fmt1(turnover)}</span>
          <span className="kpi-d" style={{ color: "var(--color-accent-800)" }}>
            +{fmt1(turnover - 16.8)} puan · baz: %16,8 · eşik aşımı
          </span>
        </div>
      </section>

      <section
        style={{
          marginTop: "var(--space-6)",
          background: "var(--color-surface)",
          borderRadius: "calc(var(--radius-lg) * 1.15)",
          padding: "var(--space-8)",
        }}
        aria-label="Aylık atıl kapasite seyri"
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "var(--space-6)",
            marginBottom: "var(--space-8)",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 25 }}>Aylık atıl kapasite seyri</h2>
          <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>
            Kesikli çizgi: baz dönem ortalaması · milyon ₺ / yıllıklandırılmış
          </span>
        </div>

        {/* Dar ekranda sütunlar kabın dışına taşıyordu; grafik kendi içinde
            yatay kaydırılır, sayfa gövdesi kaymaz. */}
        <div className="chart-scroll">
          <div className="chart-row">
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${(100 - (BASE / max) * 100).toFixed(1)}%`,
                borderTop: "2px dashed var(--color-neutral-500)",
              }}
            />
            {slice.map((point) => (
              <div
                key={point.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  height: "100%",
                  minWidth: 0,
                }}
              >
                {/* Etiket çubuğun tepesinde durur (kanvasın tasarımı); baz
                    dönem kesikli çizgisinin içinden geçtiğinde okunmaz
                    olmasın diye kendi zemininde ve çizginin üstünde. */}
                <span className="chart-label">{point.label}</span>
                <div
                  className="bar3d"
                  title={`${point.label}: ${fmt1(point.v)} mn ₺`}
                  style={{
                    background:
                      point.v > BASE * 0.95 ? "var(--color-neutral-400)" : "var(--color-accent)",
                    height: `${((point.v / max) * 100).toFixed(1)}%`,
                  }}
                />
                <span style={{ fontSize: 12, color: "var(--color-neutral-800)" }}>
                  {fmt1(point.v)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grafiği göremeyen ya da okuyamayan için aynı seri metin olarak.
            Sarmalayıcı div şart: <table> üzerinde overflow/clip beklendiği gibi
            çalışmıyor, caption ve tbody kaçıp sayfayı yatay taşırıyordu. */}
        <div className="sr-only">
        <table>
          <caption>Aylık atıl kapasite (milyon ₺, yıllıklandırılmış)</caption>
          <tbody>
            {slice.map((point) => (
              <tr key={point.label}>
                <th scope="row">{point.label}</th>
                <td>{fmt1(point.v)} mn ₺</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </>
  );
}
