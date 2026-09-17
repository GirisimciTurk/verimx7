"use client";

import { useId, useState } from "react";

import { bandFor } from "@/lib/simulation-data";
import { MAX_OPTION_SCORE, TESTS, TEST_BANDS, TOTAL_QUESTIONS, type TestKey } from "@/lib/test-library-data";

type Answers = Partial<Record<TestKey, Record<number, number>>>;

function score(testKey: TestKey, answers: Answers) {
  const test = TESTS.find((t) => t.k === testKey)!;
  const given = answers[testKey] ?? {};
  const done = Object.keys(given).length;
  const sum = Object.values(given).reduce((a, b) => a + b, 0);
  return {
    done,
    total: test.q.length,
    complete: done === test.q.length,
    pct: Math.round((sum / (test.q.length * MAX_OPTION_SCORE)) * 100),
  };
}

/**
 * Test kütüphanesi — altı test, tarayıcıda puanlanır.
 *
 * Seçenekler gerçek radyo düğmeleridir (ok tuşlarıyla gezinme, gruplama);
 * görünüm hap biçimli etiketten gelir. Yanıtlar yalnızca sayfa yaşadığı
 * sürece bellekte tutulur; sunucuya gönderilmez, tarayıcıya yazılmaz.
 */
export default function TestLibrary() {
  const [testKey, setTestKey] = useState<TestKey>(TESTS[0]!.k);
  const [answers, setAnswers] = useState<Answers>({});
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const test = TESTS.find((t) => t.k === testKey) ?? TESTS[0]!;
  const sc = score(test.k, answers);
  const band = bandFor(TEST_BANDS, sc.pct);
  const given = answers[test.k] ?? {};
  const scored = TESTS.map((t) => score(t.k, answers));
  const finished = scored.filter((x) => x.complete);
  const avg = finished.length ? Math.round(finished.reduce((a, x) => a + x.pct, 0) / finished.length) : 0;
  const nextTest = TESTS[(TESTS.indexOf(test) + 1) % TESTS.length]!;

  function answer(qi: number, oi: number) {
    setAnswers((prev) => ({ ...prev, [test.k]: { ...(prev[test.k] ?? {}), [qi]: oi } }));
  }

  function resetTest() {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[test.k];
      return next;
    });
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Testler"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {TESTS.map((t, i) => {
          const q = scored[i]!;
          const on = t.k === test.k;
          return (
            <button
              key={t.k}
              id={`${uid}-tab-${t.k}`}
              className="tpick"
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${uid}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setTestKey(t.k)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                const idx = TESTS.indexOf(t);
                const next = TESTS[(idx + (e.key === "ArrowRight" ? 1 : TESTS.length - 1)) % TESTS.length]!;
                setTestKey(next.k);
                document.getElementById(`${uid}-tab-${next.k}`)?.focus();
              }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 18, lineHeight: 1.2 }}>{t.n}</span>
              <span style={{ fontSize: 13, opacity: 0.8 }}>{t.d}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>
                {q.complete ? `tamamlandı · %${q.pct}` : `${q.done} / ${q.total} yanıt`}
              </span>
            </button>
          );
        })}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${test.k}`} className="lib-grid">
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)" }}>
            <h3 style={{ margin: 0, fontSize: 26 }}>{test.n}</h3>
            <span style={{ fontSize: 14, color: "var(--color-neutral-700)" }}>{test.q.length} soru</span>
          </div>

          {test.q.map(([question, options], qi) => (
            <fieldset key={`${test.k}-${qi}`} className="qbox">
              <legend>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 15, color: "var(--color-accent-700)" }}>{qi + 1}.</span>
                <span style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.35 }}>{question}</span>
              </legend>
              <div className="opt-grid">
                {options.map((o, oi) => (
                  <label key={o} className="opt">
                    <input
                      type="radio"
                      name={`${uid}-${test.k}-${qi}`}
                      value={oi}
                      checked={given[qi] === oi}
                      onChange={() => answer(qi, oi)}
                    />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <aside className="lib-aside" aria-label="Test durumu">
          <div className="card elev-md" style={{ background: "var(--color-accent-900)", color: "var(--color-accent-100)", gap: "var(--space-4)" }} aria-live="polite">
            <span style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-accent-300)" }}>{test.n}</span>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 46, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>%{sc.pct}</span>
              <span style={{ fontSize: 14, color: "var(--color-accent-200)" }}>
                {sc.done} / {sc.total}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "color-mix(in srgb, var(--color-accent-100) 22%, transparent)", overflow: "hidden" }} aria-hidden="true">
              <div style={{ height: "100%", borderRadius: 999, background: "var(--color-accent-300)", width: `${(sc.done / sc.total) * 100}%`, transition: "width 0.4s ease" }} />
            </div>
            {sc.complete ? (
              <div style={{ display: "grid", gap: "var(--space-2)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--color-accent-800)" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "var(--color-accent-300)" }}>{band[2]}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55, color: "var(--color-accent-200)" }}>{band[3]}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55 }}>{test.rec}</span>
              </div>
            ) : (
              <span style={{ fontSize: 13, color: "var(--color-accent-200)" }}>Tüm soruları yanıtlayınca bant yorumu ve öneri açılır.</span>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <button className="ghost" type="button" onClick={() => setTestKey(nextTest.k)}>
              {nextTest.n} testine geç
            </button>
            <button className="ghost" type="button" onClick={resetTest} disabled={sc.done === 0}>
              Bu testi sıfırla
            </button>
          </div>

          <div className="card elev-sm" style={{ gap: "var(--space-4)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)" }}>
              <span className="card-kicker">Olgunluk profili</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--color-accent-800)" }}>
                {finished.length ? `%${avg}` : "—"}
              </span>
            </div>
            {TESTS.map((t, i) => {
              const q = scored[i]!;
              return (
                <div key={t.k} style={{ display: "grid", gap: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 13 }}>
                    <span>{t.n}</span>
                    <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--color-neutral-700)" }}>
                      {q.complete ? `%${q.pct}` : "—"}
                    </span>
                  </div>
                  <div className="hudbar" aria-hidden="true">
                    <div className="hudfill" style={{ width: q.complete ? `${q.pct}%` : "0%" }} />
                  </div>
                </div>
              );
            })}
            <span style={{ fontSize: 12, color: "var(--color-neutral-600)" }}>
              {finished.length} / {TESTS.length} test tamamlandı · {TOTAL_QUESTIONS} soru
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}
