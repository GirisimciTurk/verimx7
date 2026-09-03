import type { Metadata } from "next";
import Link from "next/link";

import DashboardMetrics from "@/components/DashboardMetrics";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { BRAND, ROUTES, SECTIONS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Verimetri Panosu (örnek)",
  description:
    "İzleme aboneliğinde müşteriye açılan verimetri panosunun örnek görünümü: metrik ağacı, baz döneme göre sapma, birim dağılımı ve eşik aşımı uyarıları.",
  alternates: { canonical: ROUTES.dashboard },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${ROUTES.dashboard}`,
    title: `Verimetri Panosu (örnek) · ${BRAND}`,
    description:
      "Abonelik panosunun örnek görünümü. Gösterilen tüm veriler temsilidir, gerçek bir müşteriye ait değildir.",
    siteName: `${BRAND} Verimetri`,
    locale: "tr_TR",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
};

const SIDE_LINKS = [
  { href: "#genel", label: "Genel görünüm" },
  { href: "#metrikler", label: "Metrik ağacı" },
  { href: "#birimler", label: "Birimler" },
  { href: "#uyarilar", label: "Uyarılar" },
  { href: "#veri", label: "Veri akışı" },
  { href: "#rapor", label: "Aylık rapor" },
];

const METRIC_TREE = [
  {
    name: "Toplantı yükü oranı",
    base: "%18,4",
    now: "%12,1",
    delta: "−6,3 puan",
    good: true,
    source: "Kurumsal takvim",
    gate: "Geçti",
  },
  {
    name: "Bekleme oranı",
    base: "%41,0",
    now: "%27,5",
    delta: "−13,5 puan",
    good: true,
    source: "İş akışı logları",
    gate: "Geçti",
  },
  {
    name: "Süreç döngü süresi",
    base: "11,6 gün",
    now: "7,9 gün",
    delta: "−%31,9",
    good: true,
    source: "ERP",
    gate: "Geçti",
  },
  {
    name: "Yeniden yapılan iş oranı",
    base: "%9,2",
    now: "%6,4",
    delta: "−2,8 puan",
    good: true,
    source: "Kalite kayıtları",
    gate: "Geçti",
  },
  {
    name: "Kontrol alanı",
    base: "3,9",
    now: "5,6",
    delta: "+1,7",
    good: true,
    source: "Organizasyon şeması",
    gate: "Geçti",
  },
  {
    name: "Yapısal fazla mesai",
    base: "%14,1",
    now: "%11,8",
    delta: "−2,3 puan",
    good: true,
    source: "Bordro",
    gate: "Geçti",
  },
  {
    name: "Gönüllü devir oranı",
    base: "%16,8",
    now: "%17,9",
    delta: "+1,1 puan",
    good: false,
    source: "İK kayıtları",
    gate: "Geçti",
  },
  {
    name: "Verime ulaşma süresi",
    base: "—",
    now: "96 gün",
    delta: "ölçülemez",
    good: null,
    source: "Performans kayıtları",
    gate: "Baz veri eksik",
  },
] as const;

const UNITS = [
  { name: "Operasyon", fte: "412", idle: "9,4 mn ₺", share: "%34", loss: "Bekleme / onay süresi" },
  { name: "Satış ve saha", fte: "188", idle: "6,1 mn ₺", share: "%22", loss: "Toplantı fazlası" },
  { name: "Mali işler", fte: "74", idle: "4,7 mn ₺", share: "%17", loss: "Yeniden yapılan iş" },
  {
    name: "Teknoloji",
    fte: "96",
    idle: "4,1 mn ₺",
    share: "%15",
    loss: "Yetkinlik–görev uyumsuzluğu",
  },
  {
    name: "Destek fonksiyonları",
    fte: "61",
    idle: "3,3 mn ₺",
    share: "%12",
    loss: "Yapısal fazla mesai",
  },
] as const;

export default function DashboardPage() {
  return (
    <>
      <div className="dash">
        <aside className="dash-side">
        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 19, color: "var(--color-accent-100)" }}>
            {BRAND}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-accent-300)", marginTop: 2 }}>
            Verimetri panosu
          </div>
        </div>

        <nav style={{ display: "grid", gap: 2 }} aria-label="Pano bölümleri">
          {SIDE_LINKS.map((link, index) => (
            <a
              key={link.href}
              className="side-a"
              href={link.href}
              aria-current={index === 0 ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ marginTop: "auto", display: "grid", gap: "var(--space-2)" }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent-300)",
            }}
          >
            Baz dönem
          </span>
          <span style={{ fontSize: 13, color: "var(--color-accent-200)" }}>
            Oca 2025 – Ara 2025
            <br />
            dondurulmuş · imzalı özet
          </span>
          <span className="tag tag-accent-2" style={{ justifySelf: "start" }}>
            Formül v1.3
          </span>
          <Link
            href={ROUTES.home}
            style={{ fontSize: 13, color: "var(--color-accent-300)", marginTop: "var(--space-3)" }}
          >
            ← Tanıtım sayfası
          </Link>
        </div>
      </aside>

        {/* SiteNav <main> dışında: banner landmark'ı içerik landmark'ının
            içine gömülmesin. Görsel konumu değişmiyor. */}
        <div className="dash-col">
          <SiteNav />

          <main className="dash-main" id="icerik">
        {/* Bu sayfanın tamamı örnektir; ziyaretçinin bunu kaçırmaması gerekir. */}
        <div
          role="note"
          className="card"
          style={{
            background: "var(--color-accent-100)",
            marginTop: "var(--space-6)",
            marginBottom: "var(--space-8)",
            gap: "var(--space-2)",
          }}
        >
          <span className="card-kicker" style={{ color: "var(--color-accent-800)" }}>
            Örnek pano
          </span>
          <span className="card-body" style={{ opacity: 1 }}>
            Bu sayfadaki tüm rakamlar, kurum adı ve uyarılar <strong>temsilidir</strong> ve
            gerçek bir müşteriye ait değildir. İzleme aboneliğinde panonun ne gösterdiğini
            anlatmak için hazırlanmıştır. Kendi kurumunuz için{" "}
            <Link href={`${ROUTES.home}#${SECTIONS.basvuru}`}>değerlendirme başvurusu</Link>{" "}
            yapabilir veya <Link href={ROUTES.test}>Atıl Kapasite Testini</Link>{" "}
            çalıştırabilirsiniz.
          </span>
        </div>

        <header
          id="genel"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "var(--space-8)",
            flexWrap: "wrap",
            marginBottom: "var(--space-8)",
          }}
        >
          {/* minWidth:0 + wrap olmadan bu esnek satır 320px'te taşıyordu:
              esnek çocuk min-content genişliğinin altına inemez. */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--space-4)",
              flexWrap: "wrap",
              minWidth: 0,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                flex: "none",
                background: "var(--color-accent-200)",
                color: "var(--color-accent-800)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-heading)",
                fontSize: 17,
              }}
            >
              ÖK
            </div>
            <div style={{ minWidth: 0, flex: "1 1 240px" }}>
              <span className="tag tag-neutral" style={{ maxWidth: "100%" }}>
                Örnek Kurum A.Ş. · Üretim · 1.000–2.500 çalışan
              </span>
              <h1 style={{ fontSize: 38, margin: "var(--space-3) 0 var(--space-2)" }}>
                Organizasyonel atıl kapasite
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-neutral-700)",
                  margin: 0,
                  maxWidth: "52em",
                }}
              >
                Sonuç dönemi ölçümü baz dönemle aynı formül, aynı sistem ve aynı sorgu ile
                yapılır. Metrikler birim iş başına ifade edilir; hacim değişimi
                karşılaştırmayı bozmaz.
              </p>
            </div>
          </div>
        </header>

        <DashboardMetrics />

        {/* ── Metrik ağacı ───────────────────────────────────────────── */}
        <section id="metrikler" style={{ marginTop: "var(--space-8)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "var(--space-6)",
              marginBottom: "var(--space-4)",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 25 }}>Metrik ağacı — baz döneme göre sapma</h2>
            <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>
              Kalite kapısını geçmeyen metrik prim hesabına girmez
            </span>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Metrik</th>
                  <th scope="col">Baz</th>
                  <th scope="col">Güncel</th>
                  <th scope="col">Sapma</th>
                  <th scope="col">Kaynak</th>
                  <th scope="col">Kalite kapısı</th>
                </tr>
              </thead>
              <tbody>
                {METRIC_TREE.map((row) => (
                  <tr key={row.name}>
                    <th scope="row" style={{ fontWeight: 600, textAlign: "left" }}>
                      {row.name}
                    </th>
                    <td>{row.base}</td>
                    <td>{row.now}</td>
                    <td
                      className={row.good === null ? "text-muted" : undefined}
                      style={{
                        color:
                          row.good === true
                            ? "var(--color-accent-2-800)"
                            : row.good === false
                              ? "var(--color-accent-800)"
                              : undefined,
                      }}
                    >
                      {row.delta}
                    </td>
                    <td className="text-muted">{row.source}</td>
                    <td>
                      <span
                        className={row.gate === "Geçti" ? "tag tag-accent-2" : "tag tag-accent"}
                      >
                        {row.gate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Birimler ───────────────────────────────────────────────── */}
        <section
          id="birimler"
          style={{
            marginTop: "var(--space-8)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "var(--space-6)",
            alignItems: "start",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: "0 0 var(--space-4)", fontSize: 25 }}>
              Atıl kapasitenin birim dağılımı
            </h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Birim</th>
                    <th scope="col">FTE</th>
                    <th scope="col">Atıl kapasite</th>
                    <th scope="col">Payı</th>
                    <th scope="col">Baskın kayıp</th>
                  </tr>
                </thead>
                <tbody>
                  {UNITS.map((unit) => (
                    <tr key={unit.name}>
                      <th scope="row" style={{ fontWeight: 600, textAlign: "left" }}>
                        {unit.name}
                      </th>
                      <td>{unit.fte}</td>
                      <td>{unit.idle}</td>
                      <td>{unit.share}</td>
                      <td className="text-muted">{unit.loss}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ background: "var(--color-accent-2-100)", gap: "var(--space-3)" }}>
            <span className="card-kicker" style={{ color: "var(--color-accent-2-800)" }}>
              Sektör benchmark
            </span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, lineHeight: 1.1 }}>
              Havuz: 7 müşteri
            </span>
            <span className="card-body" style={{ opacity: 1 }}>
              Sektör–ölçek bandınızda beş müşteri eşiği aşıldığı için karşılaştırma
              yayımlanabilir. Toplantı yükü oranınız bant medyanının 4,2 puan altında.
            </span>
          </div>
        </section>

        {/* ── Uyarılar ───────────────────────────────────────────────── */}
        <section
          id="uyarilar"
          style={{
            marginTop: "var(--space-8)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          <div className="card" style={{ background: "var(--color-accent-100)", gap: "var(--space-2)" }}>
            <span className="card-kicker" style={{ color: "var(--color-accent-800)" }}>
              Eşik aşımı · 04.08.2026
            </span>
            <span className="card-title">Gönüllü devir oranı baz dönemin üzerine çıktı</span>
            <span className="card-body" style={{ opacity: 1 }}>
              Operasyon biriminde son üç ayda 11 gönüllü ayrılma. Kadro kaybı kaleminin
              prim hesabındaki etkisi yeniden değerlendirilmeli.
            </span>
            <span className="card-meta">Sahip: Proje lideri · Aksiyon kütüphanesi #K-07</span>
          </div>
          <div className="card" style={{ background: "var(--color-neutral-100)", gap: "var(--space-2)" }}>
            <span className="card-kicker">Kapsam dışı olay · 19.07.2026</span>
            <span className="card-title">Mali işlerde yeniden yapılanma bildirildi</span>
            <span className="card-body" style={{ opacity: 1 }}>
              Sözleşme kuralı gereği ilgili metrikler bu dönem için prim hesabından
              çıkarıldı; ölçüm devam ediyor.
            </span>
            <span className="card-meta">Onay: Metodoloji direktörü</span>
          </div>
        </section>

        {/* ── Veri akışı ─────────────────────────────────────────────── */}
        <section
          id="veri"
          style={{
            marginTop: "var(--space-8)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          <div className="card" style={{ background: "var(--color-surface)" }}>
            <span className="card-kicker">Veri akışı</span>
            <span className="card-title">Otomatik · aylık</span>
            <span className="card-body" style={{ opacity: 1 }}>
              ERP, ticket ve bordro dışa aktarımları şema doğrulamasından geçti. Son alım:
              01.08.2026.
            </span>
          </div>
          <div className="card" style={{ background: "var(--color-surface)" }}>
            <span className="card-kicker">İzolasyon</span>
            <span className="card-title">Müşteriye özel şema</span>
            <span className="card-body" style={{ opacity: 1 }}>
              Kişi bazlı kimlik tutulmaz; en küçük tanecik roldür ve rol seviyesinde takma
              ad kullanılır.
            </span>
          </div>
          <div className="card" style={{ background: "var(--color-surface)" }}>
            <span className="card-kicker">Saklama</span>
            <span className="card-title">Ham veri: 6 ay</span>
            <span className="card-body" style={{ opacity: 1 }}>
              Analiz katmanı 12 ay, rapor dayanakları 10 yıl. İmha tutanağı otomatik
              üretilir.
            </span>
          </div>
        </section>

        {/* ── Aylık rapor ────────────────────────────────────────────── */}
        <section
          id="rapor"
          className="panel-dark"
          style={{
            marginTop: "var(--space-6)",
            padding: "var(--space-8)",
            borderRadius: "calc(var(--radius-lg) * 1.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-8)",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 var(--space-2)", fontSize: 25, color: "var(--color-accent-100)" }}>
              Aylık rapor, formül sürümü v1.3 ile hesaplanır
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: "var(--color-accent-200)",
                maxWidth: "46em",
              }}
            >
              Metrik sapmaları, birim dağılımı ve eşik aşımı notları her ay aynı formülle
              üretilir. Baz dönem formülü proje boyunca değişmez; bu, sonuca bağlı
              ücretlendirmede tartışmayı bitiren tek teknik tedbirdir.
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              className="btn btn-primary"
              href={`${ROUTES.home}#${SECTIONS.basvuru}`}
              style={{
                background: "var(--color-accent-300)",
                color: "var(--color-accent-900)",
                fontSize: 15,
                padding: "13px 24px",
              }}
            >
              Aboneliğe geçmek için başvurun
            </Link>
            <Link href={ROUTES.test} style={{ color: "var(--color-accent-300)", fontSize: 14 }}>
              Testi çalıştır
            </Link>
          </div>
        </section>
          </main>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
