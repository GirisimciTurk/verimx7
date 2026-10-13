"use client";

import Image from "next/image";
import { useId, useState } from "react";

type Page = {
  no: string;
  title: string;
  hint: string;
  pages: string;
  desc: string;
  bullets: readonly [string, string, string];
};

const PAGES: readonly Page[] = [
  {
    no: "01",
    title: "Yönetici özeti",
    hint: "tek sayfa",
    pages: "Sayfa 1 / 24",
    desc: "Tek sayfada durum: en büyük üç kayıp kalemi, TL karşılığı ve ilk 30 günde başlanacak işler. Yönetim kuruluna doğrudan sunulabilir.",
    bullets: [
      "Atıl kapasitenin TL karşılığı ve hesap yöntemi",
      "En büyük üç kayıp kalemi, büyüklük sırasıyla",
      "İlk 30 günde başlanacak üç aksiyon",
    ],
  },
  {
    no: "02",
    title: "Kaynak envanteri",
    hint: "birim bazlı",
    pages: "Sayfa 2–9 / 24",
    desc: "Elinizde ne olduğunun birim bazlı dökümü: kadro, alan, makine, teknoloji ve doğal kaynak. Kullanım oranıyla birlikte.",
    bullets: [
      "Birim ve rol bazlı kadro kullanım oranı",
      "Alan ve ekipmanın fiili kullanım süresi",
      "Lisans, abonelik ve kapasite fazlası kalemler",
    ],
  },
  {
    no: "03",
    title: "Kayıp haritası",
    hint: "nerede, ne kadar, neden",
    pages: "Sayfa 10–15 / 24",
    desc: "Kaybın nerede oluştuğu, ne kadar olduğu ve nedeni. Her kalem sistemden gelen veriye referanslı.",
    bullets: [
      "Kayıp kaleminin bulunduğu süreç ve birim",
      "Aylık ve yıllık TL büyüklüğü",
      "Kök neden ve veri kaynağı referansı",
    ],
  },
  {
    no: "04",
    title: "Aksiyon listesi",
    hint: "sahip ve süre ile",
    pages: "Sayfa 16–21 / 24",
    desc: "Yapılacak işler; her biri bir sahibe, bir süreye ve beklenen etkiye bağlı. Uygulama planının iskeleti budur.",
    bullets: [
      "Aksiyon, sahibi ve hedef tarih",
      "Beklenen etki aralığı ve dayanağı",
      "Bağımlılıklar ve karar gerektiren noktalar",
    ],
  },
  {
    no: "05",
    title: "Ölçüm protokolü",
    hint: "doğrulama takvimi",
    pages: "Sayfa 22–24 / 24",
    desc: "Sonucun nasıl ölçüleceğinin yazılı hâli. Sözleşme eki olarak imzalanır; başarı primi bu protokole bağlanır.",
    bullets: [
      "Baz dönem tanımı ve dondurma tarihi",
      "Metrik formülleri ve veri kaynakları",
      "Doğrulama takvimi ve itiraz yolu",
    ],
  },
];

/** "Elinize ne geçiyor?" — teşhis dosyasının bölüm seçicisi ve önizlemesi. */
export default function ReportPreview() {
  const [active, setActive] = useState(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const page = PAGES[active]!;

  return (
    <div className="split-b">
      <div>
        <h2 className="lp-h2">Elinize ne geçiyor?</h2>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: "var(--color-neutral-800)", maxWidth: "24em" }}>
          Beş günün çıktısı somut: yönetime sunulabilir bir teşhis dosyası.
        </p>
        <div role="tablist" aria-label="Rapor bölümleri" style={{ display: "grid", gap: "var(--space-2)", marginTop: "var(--space-6)" }}>
          {PAGES.map((p, i) => (
            <button
              key={p.no}
              id={`${uid}-tab-${p.no}`}
              className="rpg"
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${uid}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                e.preventDefault();
                const next = (active + (e.key === "ArrowDown" ? 1 : PAGES.length - 1)) % PAGES.length;
                setActive(next);
                document.getElementById(`${uid}-tab-${PAGES[next]!.no}`)?.focus();
              }}
            >
              <span style={{ fontWeight: 600 }}>
                {p.no} · {p.title}
              </span>
              <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>{p.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${page.no}`}
        className="card elev-md"
        style={{ background: "var(--color-bg)", padding: 0, overflow: "hidden", minHeight: 420 }}
      >
        <div
          style={{
            background: "var(--color-accent-900)",
            color: "var(--color-accent-100)",
            padding: "var(--space-4) var(--space-6)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 20 }}>{page.title}</span>
          <span style={{ fontSize: 12, color: "var(--color-accent-300)" }}>{page.pages}</span>
        </div>
        <div style={{ padding: "var(--space-6)", display: "grid", gap: "var(--space-4)" }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--color-neutral-800)" }}>{page.desc}</p>
          <ul style={{ display: "grid", gap: "var(--space-3)", listStyle: "none", padding: 0, margin: 0 }}>
            {page.bullets.map((b) => (
              <li key={b} style={{ display: "flex", gap: "var(--space-3)", alignItems: "baseline" }}>
                <span
                  aria-hidden="true"
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent-2)", flex: "none" }}
                />
                <span style={{ fontSize: 15 }}>{b}</span>
              </li>
            ))}
          </ul>
          <div
            className="washed"
            style={{
              position: "relative",
              height: 150,
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              marginTop: "var(--space-2)",
            }}
          >
            <Image
              src="/img/rapor.jpg"
              alt="Teşhis dosyasından örnek bir analiz sayfası görünümü"
              fill
              sizes="(max-width: 1080px) 100vw, 560px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
