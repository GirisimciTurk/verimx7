"use client";

import { useId, useState } from "react";

type Metric = {
  name: string;
  from: string;
  to: string;
  note: string;
  /** Çubuk genişliği — temsili. */
  width: string;
};

type Case = {
  key: string;
  tab: string;
  scale: string;
  title: string;
  story: string;
  result: string;
  resultLabel: string;
  source: string;
  metrics: readonly [Metric, Metric, Metric];
};

/**
 * Sektör vakaları. TEMSİLİ örneklerdir; gerçek müşteri verisi değildir ve
 * sayfada böyle etiketlenir. Rakamlar yöntemi anlatmak için seçilmiştir.
 */
const CASES: readonly Case[] = [
  {
    key: "uretim",
    tab: "Sanayi / üretim",
    scale: "Otomotiv yan sanayi · 1.400 çalışan · 2 vardiya",
    title: "Yeni hat yatırımı yapmadan çıktı artışı",
    story:
      "Talep artınca gündem yeni pres hattıydı. Envanter çıkarınca kaybın büyük bölümünün kalıp değişimi ve plansız duruşta olduğu görüldü.",
    result: "+%18",
    resultLabel: "aynı hatta aylık çıktı artışı",
    source: "MES + ERP verisi",
    metrics: [
      { name: "Ekipman etkinliği (OEE)", from: "%61", to: "%74", note: "boşta geçen sürenin üçte biri geri alındı", width: "63%" },
      { name: "Kalıp değişim süresi", from: "46 dk", to: "28 dk", note: "hazırlık işleri hat dışına taşındı", width: "72%" },
      { name: "Fazla mesai oranı", from: "%11,3", to: "%6,2", note: "çıktı artarken mesai düştü", width: "58%" },
    ],
  },
  {
    key: "tarim",
    tab: "Tarım ve doğal kaynak",
    scale: "Sulu tarım işletmesi · 4.200 dekar",
    title: "Aynı arazi, aynı su hakkı, daha yüksek net gelir",
    story:
      "Verim düşüklüğü toprağa bağlanıyordu. Ölçüm, sulama zamanlaması ve hasat kaybının asıl kalem olduğunu gösterdi.",
    result: "+%22",
    resultLabel: "dekar başına net gelir",
    source: "Sayaç + hasat kayıtları",
    metrics: [
      { name: "Sulama suyu (m³/dekar)", from: "620", to: "455", note: "zamanlama nem verisine bağlandı", width: "68%" },
      { name: "Hasat kaybı", from: "%8,4", to: "%4,9", note: "ekip planı ve makine ayarı", width: "70%" },
      { name: "Makine boş çalışma", from: "310 saat", to: "170 saat", note: "rota ve görev eşleştirme", width: "64%" },
    ],
  },
  {
    key: "hizmet",
    tab: "Hizmet / kurumsal ofis",
    scale: "Kurumsal hizmet · 860 çalışan · 6 lokasyon",
    title: "Kadro büyütmeden iş hacmi artışı",
    story:
      "Yeni işe alım talebi vardı. Onay katmanları ve toplantı yükü çıkarıldığında mevcut kadronun kapasitesi ortaya çıktı.",
    result: "+%16",
    resultLabel: "aynı kadroyla tamamlanan iş hacmi",
    source: "İş akışı + takvim verisi",
    metrics: [
      { name: "Onay katmanı sayısı", from: "5", to: "3", note: "yetki eşikleri yeniden yazıldı", width: "60%" },
      { name: "Toplantı yükü oranı", from: "%18,4", to: "%12,1", note: "haftalık ritim sadeleşti", width: "66%" },
      { name: "Süreç döngü süresi", from: "11,6 gün", to: "7,9 gün", note: "bekleme adımları kaldırıldı", width: "68%" },
    ],
  },
];

/** "Sektörünüzde neye benziyor?" — sekmeli temsili vaka kartı. */
export default function CaseStudy() {
  const [active, setActive] = useState(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const current = CASES[active]!;

  return (
    <>
      <div
        role="tablist"
        aria-label="Sektör"
        style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}
      >
        {CASES.map((c, i) => (
          <button
            key={c.key}
            id={`${uid}-tab-${c.key}`}
            className="stab"
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const next = (active + (e.key === "ArrowRight" ? 1 : CASES.length - 1)) % CASES.length;
              setActive(next);
              document.getElementById(`${uid}-tab-${CASES[next]!.key}`)?.focus();
            }}
          >
            {c.tab}
          </button>
        ))}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${current.key}`}
        className="split-vaka"
      >
        <div
          className="card elev-sm"
          style={{
            background: "var(--color-accent-900)",
            color: "var(--color-accent-100)",
            padding: "var(--space-8)",
            gap: "var(--space-6)",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <span
              style={{
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-accent-300)",
              }}
            >
              {current.scale}
            </span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 26, lineHeight: 1.2 }}>
              {current.title}
            </span>
            <span style={{ fontSize: 15, lineHeight: 1.55, color: "var(--color-accent-200)" }}>
              {current.story}
            </span>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 52,
                lineHeight: 1,
                color: "var(--color-accent-300)",
              }}
            >
              {current.result}
            </div>
            <div style={{ fontSize: 14, color: "var(--color-accent-200)", marginTop: "var(--space-2)" }}>
              {current.resultLabel}
            </div>
          </div>
        </div>

        <div
          className="card elev-sm"
          style={{ background: "var(--color-surface)", padding: "var(--space-8)", gap: "var(--space-6)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: "var(--space-4)",
              flexWrap: "wrap",
            }}
          >
            <span className="card-kicker">Baz dönem → altı ay sonra</span>
            <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>{current.source}</span>
          </div>

          <div style={{ display: "grid", gap: "var(--space-6)" }}>
            {current.metrics.map((m) => (
              <div key={m.name} style={{ display: "grid", gap: "var(--space-2)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "var(--space-4)",
                    fontSize: 15,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{m.name}</span>
                  <span style={{ whiteSpace: "nowrap" }}>
                    <span style={{ color: "var(--color-neutral-700)" }}>{m.from}</span>{" "}
                    <span style={{ color: "var(--color-neutral-700)" }} aria-hidden="true">
                      →
                    </span>
                    <span className="sr-only">sonra</span>{" "}
                    <strong style={{ color: "var(--color-accent-2-700)", fontSize: 17 }}>{m.to}</strong>
                  </span>
                </div>
                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "var(--color-neutral-200)",
                    overflow: "hidden",
                  }}
                  aria-hidden="true"
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      background: "var(--color-accent-2)",
                      width: m.width,
                      transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />
                </div>
                <div style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>{m.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
