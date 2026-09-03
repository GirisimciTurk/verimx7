import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ApplicationForm from "@/components/ApplicationForm";
import HashAnchor from "@/components/HashAnchor";
import HeroTyping from "@/components/HeroTyping";
import QuickEstimate from "@/components/QuickEstimate";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import TiltImage from "@/components/TiltImage";
import { quickEstimate } from "@/lib/engine";
import { BRAND, CLAIMS, ROUTES, SECTIONS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: ROUTES.home },
};

const QUICK_DEFAULTS = { emp: 320, revenueMn: 850, cost: 62_000 };

/** Ne yapıyoruz — beş verimetri alanı. */
const AREAS = [
  {
    title: "İnsan Kaynağı Verimetrisi",
    body: "Yetkinlik–görev uyumu ve gizli kapasite",
    src: "/img/insan1.jpg",
    alt: "Ekranlarında verimlilik grafikleri açık bir çalışma masasında oturan çalışan",
  },
  {
    title: "Fiziksel Alan ve Bina Verimetrisi",
    body: "Yeniden konfigürasyon ve kapasite artışı",
    src: "/img/sokakta.jpg",
    alt: "Kent içi toplu taşıma durağı ve dijital bilgilendirme ekranı",
  },
  {
    title: "Makine ve Teçhizat Verimetrisi",
    body: "Duruş, düşük çalışma ve konumlandırma analizi",
    src: "/img/sanayi.jpg",
    alt: "Ağır sanayi tesisinde bakım yapan teknisyen ve büyük dişli grubu",
  },
  {
    title: "Doğal ve Stratejik Kaynak Verimetrisi",
    body: "Atıl rezervlerin ekonomik değere dönüşümü",
    src: "/img/tarim1.jpg",
    alt: "Sulanan tarım arazisinde tabletle veri toplayan üretici",
  },
  {
    title: "Teknoloji Verimetrisi",
    body: "Aynı teknolojiyle daha fazla verim",
    src: "/img/ortam.jpg",
    alt: "Şehir planlama merkezinde büyük veri duvarını inceleyen ekip",
  },
] as const;

/** Verimx7 modeli — yedi katman. */
const LAYERS = [
  "Envanter çıkarma",
  "Gizli kapasite analizi",
  "Kayıp–kaçak tespiti",
  "Yeniden eşleştirme",
  "Operasyonel sadeleştirme",
  "Gelirleştirme",
] as const;

/** Teslimat mimarisi — yedi aşama ve süreleri. */
const STAGES: readonly { time: string; name: string; highlight?: boolean }[] = [
  { time: "1 saat", name: "Ön görüşme" },
  { time: "3 gün", name: "Kapsam" },
  { time: "4 gün", name: "Veri toplama" },
  { time: "5 gün", name: "Teşhis", highlight: true },
  { time: "3–6 ay", name: "Uygulama" },
  { time: "2 hafta", name: "Doğrulama" },
  { time: "sürekli", name: "İzleme" },
] as const;

/** Ölçüm mimarisi — temsili örnek. Gerçek bir müşteri vakası değildir. */
const EXAMPLE_METRICS = [
  { name: "Toplantı yükü oranı", from: "%18,4", to: "%12,1", width: "66%" },
  { name: "Süreç döngü süresi", from: "11,6 gün", to: "7,9 gün", width: "68%" },
  { name: "Yeniden yapılan iş", from: "%9,2", to: "%6,4", width: "70%" },
] as const;

const ROLES = [
  {
    initials: "MD",
    title: "Metodoloji direktörü",
    body: "Yöntemin sahibi, ölçüm formülleri, kalite",
    meta: "Organizasyon tasarımı",
  },
  {
    initials: "PL",
    title: "Proje lideri",
    body: "Tek projenin uçtan uca yürütülmesi",
    meta: "Müşteri yönetimi",
  },
  {
    initials: "KD",
    title: "Kıdemli danışman",
    body: "Teşhis ve uygulama",
    meta: "Süreç iyileştirme",
  },
  {
    initials: "VA",
    title: "Veri analisti",
    body: "Veri hattı, metrik hesaplama, panolar",
    meta: "SQL, Python",
  },
] as const;

/** Arama sonuçlarında hizmetin ne olduğunu anlatan yapılandırılmış veri. */
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Organizasyonel Verimetri",
  serviceType: "Organizasyonel verimlilik ölçümü ve uygulama danışmanlığı",
  provider: { "@id": `${SITE_URL}/#kurum` },
  areaServed: { "@type": "Country", name: "Türkiye" },
  description:
    "Kurum sistemlerinde zaten kayıtlı veriden atıl organizasyonel kapasitenin ölçülmesi, TL karşılığının hesaplanması ve sahada uygulanarak ortadan kaldırılması.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Hizmet portföyü",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Atıl Kapasite Raporu (teşhis)" },
      },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Uygulama projesi" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "İzleme aboneliği" } },
    ],
  },
};

export default function HomePage() {
  const quick = quickEstimate(
    QUICK_DEFAULTS.emp,
    QUICK_DEFAULTS.revenueMn,
    QUICK_DEFAULTS.cost,
  );

  return (
    <>
      <HashAnchor />
      <SiteNav />

      <main id="icerik">
        {/* ── Başlık ────────────────────────────────────────────────── */}
        <section className="lp-sec" style={{ paddingTop: 56, paddingBottom: 40 }}>
          <span className="tag tag-outline" style={{ marginBottom: "var(--space-4)" }}>
            {BRAND} Teknolojileri
          </span>
          <HeroTyping />
          <p
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              maxWidth: "30em",
              color: "var(--color-neutral-800)",
              margin: 0,
            }}
          >
            İnsan, mekân, makine, teknoloji ve doğal kaynaklarda ölçülebilir verim artışı
          </p>
        </section>

        {/* ── Hızlı tahmin + görsel ─────────────────────────────────── */}
        <section className="lp-sec hero-grid">
          <QuickEstimate
            defaults={QUICK_DEFAULTS}
            initial={{ ratio: quick.ratio, value: quick.value, payroll: quick.payroll }}
          />
          <TiltImage
            src="/img/ortam.jpg"
            alt="Şehir planlama ve yenilik merkezinde veri duvarını inceleyen ekip"
            priority
          />
        </section>

        {/* ── Geniş bant görsel ─────────────────────────────────────── */}
        <section className="lp-sec" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div
            className="washed"
            style={{
              position: "relative",
              height: 380,
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            <Image
              src="/img/genel_uretim.jpg"
              alt="Üretim tesisi, lojistik akışı ve kapasite artışını gösteren geniş kadraj"
              fill
              sizes="(max-width: 1200px) 100vw, 1120px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>

        {/* ── Değer önerisi ─────────────────────────────────────────── */}
        <section className="lp-sec" style={{ paddingTop: 40 }}>
          <div className="panel split-c">
            <div>
              <p className="kicker" style={{ color: "var(--color-accent-700)" }}>
                Değer önerisi
              </p>
              <p style={{ fontSize: 28, lineHeight: 1.3, maxWidth: "22em", margin: 0 }}>
                Sektör gözlemine dayalı çalışma varsayımımıza göre personel maliyetinin
                %15&ndash;30&rsquo;u çıktı üretmeyen faaliyete gidiyor. Biz o kısmı katma
                değere çeviriyoruz.
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-neutral-700)",
                  marginTop: "var(--space-4)",
                  maxWidth: "34em",
                }}
              >
                Bu aralık henüz doğrulanmamış bir çalışma varsayımıdır (İş Planı §2.3);
                her kurumda kendi sistem verisiyle yeniden hesaplanır ve ölçülen sonuç
                sözleşme ekindeki formülle raporlanır.
              </p>
            </div>
            <div style={{ display: "grid", gap: "var(--space-4)" }}>
              {/*
                SEVENFOLD_STAT — lib/site.ts içindeki CLAIMS.sevenfold ile açılır.
                Açmadan önce: hangi metrikte, hangi paydada ve hangi baz döneme
                göre 7 kat olduğu aşağıdaki metne yazılmalı ve ham ölçüm dosyası
                ibraz edilebilir durumda olmalıdır (İş Planı §8.3).
              */}
              {CLAIMS.sevenfold && (
                <div>
                  <div className="stat-v">7 kat</div>
                  <div className="stat-l">
                    hedeflenen verim artışı<sup>*</sup>
                  </div>
                </div>
              )}
              <div>
                <div className="stat-v">%15&ndash;30</div>
                <div className="stat-l">
                  personel maliyetindeki atıl pay<sup>*</sup>
                </div>
              </div>
              <div>
                <div className="stat-v" style={{ color: "var(--color-accent-2-600)" }}>
                  5 gün
                </div>
                <div className="stat-l">teşhis raporu</div>
              </div>
              <div>
                <div className="stat-v">7</div>
                <div className="stat-l">katmanlı model</div>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-neutral-700)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                <sup>*</sup> Doğrulanmamış çalışma varsayımıdır, taahhüt değildir. Her
                projede ulaşılan sonuç sözleşme ekindeki formülle hesaplanır ve
                müşterinin kendi doğrulayıcısı tarafından onaylanır.
              </p>
            </div>
          </div>
        </section>

        {/* ── Ne yapıyoruz ──────────────────────────────────────────── */}
        <section id={SECTIONS.alanlar} className="lp-sec">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 48,
              marginBottom: "var(--space-8)",
              flexWrap: "wrap",
            }}
          >
            <h2 className="lp-h2" style={{ margin: 0 }}>
              Ne yapıyoruz?
            </h2>
            <p
              style={{
                margin: 0,
                maxWidth: "30em",
                fontSize: 16,
                color: "var(--color-neutral-700)",
              }}
            >
              Kamu kurumları ve büyük ölçekli işletmelerin gizli kalmış kapasitelerini
              ortaya çıkarıyor ve geliştiriyoruz.
            </p>
          </div>

          <div className="grid-3">
            {AREAS.map((area) => (
              <article key={area.title} className="alan-card elev-sm tilt-card">
                <div className="alan-media washed">
                  <Image
                    src={area.src}
                    alt={area.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 360px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "var(--space-6) var(--space-4) var(--space-4)" }}>
                  <h3 style={{ fontSize: 20, margin: "0 0 var(--space-3)" }}>{area.title}</h3>
                  <p style={{ margin: 0, fontSize: 15, color: "var(--color-neutral-700)" }}>
                    {area.body}
                  </p>
                </div>
              </article>
            ))}

            <article
              className="card tilt-card"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-bg)",
                padding: "var(--space-6) var(--space-4)",
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  margin: "0 0 var(--space-4)",
                  color: "var(--color-bg)",
                }}
              >
                Neden {BRAND}?
              </h3>
              <div style={{ display: "grid", gap: "var(--space-3)", fontSize: 16 }}>
                {[
                  ["Proje değil", "sonuç", "satarız"],
                  ["Danışmanlık değil", "uygulama", "yaparız"],
                  ["Tahmin değil", "ölçüm", "sunarız"],
                  ["Vaat değil", "hesaplanabilir artış", "üretiriz"],
                ].map(([before, strong, after], index, all) => (
                  <div
                    key={strong}
                    style={{
                      paddingBottom: index < all.length - 1 ? "var(--space-3)" : 0,
                      borderBottom:
                        index < all.length - 1
                          ? "1px solid color-mix(in srgb, var(--color-bg) 35%, transparent)"
                          : undefined,
                    }}
                  >
                    {before} <strong>{strong}</strong> {after}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* ── Model ─────────────────────────────────────────────────── */}
        <section id={SECTIONS.model} className="lp-sec">
          <h2 className="lp-h2">{BRAND} modeli nedir?</h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--color-neutral-700)",
              marginBottom: "var(--space-8)",
            }}
          >
            Yedi katmanlı verimetri metodolojisi. Katmanlar sıralıdır; her birinin girdisi
            de çıktısı da sayısaldır.
          </p>

          <ol
            className="grid-4"
            style={{ listStyle: "none", padding: 0, margin: 0, counterReset: "layer" }}
          >
            {LAYERS.map((layer, index) => (
              <li key={layer} className="card tilt-card step-card">
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 30,
                    lineHeight: 1,
                    color: "var(--color-accent)",
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{layer}</span>
              </li>
            ))}
            <li
              className="card tilt-card"
              style={{
                background: "var(--color-accent-2)",
                color: "var(--color-bg)",
                gridColumn: "1 / -1",
              }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 30, lineHeight: 1 }}>
                7
              </span>
              <span style={{ fontSize: 17, fontWeight: 600 }}>
                Sürekli izleme, raporlama ve geliştirme
              </span>
              <span style={{ fontSize: 13, opacity: 0.9 }}>
                Aylık veri akışı, pano ve eşik aşımı uyarıları ile abonelik olarak sürer.
              </span>
            </li>
          </ol>
        </section>

        {/* ── Ölçüm mimarisi ────────────────────────────────────────── */}
        <section id={SECTIONS.olcum} className="lp-sec split-a">
          <div>
            <p className="kicker" style={{ color: "var(--color-accent-700)" }}>
              Ölçüm mimarisi
            </p>
            <h2 className="lp-h2">Tahmin değil ölçüm</h2>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.5,
                color: "var(--color-neutral-800)",
                maxWidth: "24em",
              }}
            >
              Baz dönem projenin başında dondurulur. Sonuç, aynı formül ve aynı sistemle
              ölçülür. Formül sürümlenir: baz dönem hangi sürümle hesaplandıysa sonuç
              ölçümü de o sürümle yapılır.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-2)",
                marginTop: "var(--space-6)",
              }}
            >
              <span className="tag tag-outline">Sistem kaynaklı</span>
              <span className="tag tag-outline">8 hafta baz veri</span>
              <span className="tag tag-outline">Sözleşme eki formül</span>
              <span className="tag tag-outline">Bağımsız doğrulayıcı</span>
            </div>
          </div>

          <div
            className="card elev-sm"
            style={{
              background: "var(--color-surface)",
              padding: "var(--space-8)",
              gap: "var(--space-6)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "var(--space-4)",
                flexWrap: "wrap",
              }}
            >
              <span className="card-kicker">Temsili örnek · üretim, 1.400 çalışan</span>
              <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>6 ayda</span>
            </div>

            <div style={{ display: "grid", gap: "var(--space-6)" }}>
              {EXAMPLE_METRICS.map((metric, index) => (
                <div key={metric.name} style={{ display: "grid", gap: "var(--space-2)" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      fontSize: 14,
                      gap: "var(--space-3)",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{metric.name}</span>
                    <span style={{ color: "var(--color-accent-2-700)" }}>
                      {metric.from} → {metric.to}
                    </span>
                  </div>
                  <div
                    className="exbar"
                    style={{
                      width: "100%",
                      background: "var(--color-neutral-300)",
                      color: "var(--color-neutral-800)",
                      animationDelay: `${0.05 + index * 0.12}s`,
                    }}
                  >
                    baz dönem {metric.from}
                  </div>
                  <div
                    className="exbar"
                    style={{
                      width: metric.width,
                      background: "var(--color-accent-2)",
                      color: "var(--color-bg)",
                      animationDelay: `${0.2 + index * 0.12}s`,
                    }}
                  >
                    şu an {metric.to}
                  </div>
                </div>
              ))}
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "var(--color-neutral-600)",
                lineHeight: 1.5,
              }}
            >
              Yöntemi göstermek için hazırlanmış temsili bir örnektir; belirli bir müşteri
              vakası değildir. Yayımlanan gerçek vaka sonuçları örneklem sayısı, baz dönem
              tanımı ve ortalama/medyan ayrımıyla birlikte sunulur.
            </p>
          </div>
        </section>

        {/* ── Teste çağrı ───────────────────────────────────────────── */}
        <section className="lp-sec" style={{ paddingTop: 0 }}>
          <div className="panel-dark split-c" style={{ alignItems: "center" }}>
            <div>
              <p className="kicker" style={{ color: "var(--color-accent-300)" }}>
                Atıl Kapasite Testi
              </p>
              <h2 className="lp-h2" style={{ color: "var(--color-accent-100)" }}>
                Kaynaklarınızın gerçekte ne kadar değerli olduğunu öğrenin.
              </h2>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "var(--color-accent-200)",
                  maxWidth: "34em",
                  margin: 0,
                }}
              >
                On iki soru, yaklaşık üç dakika. Kontrol alanı, onay katmanı, fazla mesai,
                devir ve toplantı yükü girdilerinden tahmini bir TL karşılığı hesaplanır;
                ayrıntılı rapor e-posta ile iletilir.
              </p>
            </div>
            <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: "start" }}>
              <Link
                className="btn btn-primary"
                href={ROUTES.test}
                style={{
                  fontSize: 16,
                  padding: "14px 26px",
                  background: "var(--color-accent-400)",
                  color: "var(--color-accent-900)",
                }}
              >
                Teste başlayın
              </Link>
              <Link href={ROUTES.dashboard} style={{ color: "var(--color-accent-300)", fontSize: 15 }}>
                Abonelik panosunu görün →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Teslimat ──────────────────────────────────────────────── */}
        <section id={SECTIONS.teslimat} className="lp-sec">
          <h2 className="lp-h2">Nasıl çalışıyoruz?</h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--color-neutral-700)",
              maxWidth: "34em",
              marginBottom: "var(--space-8)",
            }}
          >
            Yedi aşama, kapı kriterleriyle. Teşhis raporu tek başına alınabilir; devam
            etmeme hakkı sizdedir.
          </p>
          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 130px), 1fr))",
              gap: "var(--space-3)",
            }}
          >
            {STAGES.map((stage) => (
              <li
                key={stage.name}
                className="card tilt-card"
                style={{
                  background: stage.highlight ? "var(--color-accent-2)" : "var(--color-neutral-100)",
                  color: stage.highlight ? "var(--color-bg)" : undefined,
                  gap: "var(--space-2)",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: stage.highlight ? "var(--color-bg)" : "var(--color-accent-700)",
                  }}
                >
                  {stage.time}
                </span>
                <span
                  style={{ fontFamily: "var(--font-heading)", fontSize: 18, lineHeight: 1.15 }}
                >
                  {stage.name}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Ekip ──────────────────────────────────────────────────── */}
        <section id={SECTIONS.ekip} className="lp-sec">
          <div className="panel">
            <div className="split-b" style={{ alignItems: "start" }}>
              <div>
                <p className="kicker" style={{ color: "var(--color-accent-2-800)" }}>
                  Ekip ve danışmanlar
                </p>
                <h2 className="lp-h2">Yöntem kişiye değil şablona bağlıdır</h2>
                <p
                  style={{
                    fontSize: 18,
                    lineHeight: 1.5,
                    color: "var(--color-neutral-800)",
                    maxWidth: "26em",
                  }}
                >
                  Yöntem şablonlarda yaşar: veri talep listesi, analiz defteri, aksiyon
                  kütüphanesi.
                </p>
                <Link
                  className="btn btn-secondary"
                  href={`#${SECTIONS.basvuru}`}
                  style={{ marginTop: "var(--space-4)" }}
                >
                  Danışman olarak başvurun
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                  gap: "var(--space-3)",
                }}
              >
                {ROLES.map((role) => (
                  <div
                    key={role.initials}
                    className="card"
                    style={{
                      background: "var(--color-bg)",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "var(--space-3)",
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
                        letterSpacing: "0.02em",
                      }}
                    >
                      {role.initials}
                    </div>
                    <div style={{ display: "grid", gap: 2 }}>
                      <span className="card-title">{role.title}</span>
                      <span className="card-body">{role.body}</span>
                      <span className="card-meta">{role.meta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Veri güvenliği ────────────────────────────────────────── */}
        <section className="lp-sec split-b">
          <div>
            <h2 className="lp-h2">Veri güvenliği</h2>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.5,
                paddingLeft: "var(--space-4)",
                borderLeft: "3px solid var(--color-accent)",
                margin: 0,
              }}
            >
              Kişi bazlı kimlik hiçbir tabloda tutulmaz. En küçük tanecik roldür.
            </p>
            <p style={{ marginTop: "var(--space-4)", fontSize: 15 }}>
              <Link href={ROUTES.privacy}>Gizlilik ve veri güvenliği politikası →</Link>
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {[
              "Veri minimizasyonu",
              "Rol bazlı toplulaştırma",
              "Müşteriye özel şema",
              "Aktarımda ve dinlenme hâlinde şifreleme",
              "Erişim logları",
              "İmha tutanağı",
              "Kişi bazlı izleme yok",
            ].map((tag) => (
              <span key={tag} className="tag tag-neutral">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* ── Başvuru ───────────────────────────────────────────────── */}
        <section id={SECTIONS.basvuru} className="lp-sec">
          <div className="split-top">
            <div>
              <h2 className="lp-h2">Değerlendirme başvurusu</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--color-neutral-800)" }}>
                Ön görüşme 1 saattir. Karar verici katılımı ve bütçe aralığının
                doğrulanması, sonraki aşamaya geçişin kapı kriteridir.
              </p>
              <div
                className="card"
                style={{
                  background: "var(--color-neutral-100)",
                  marginTop: "var(--space-6)",
                }}
              >
                <span className="card-kicker">{BRAND} kimler için?</span>
                <div style={{ display: "grid", gap: "var(--space-2)", fontSize: 15 }}>
                  <span>Bakanlıklar ve bağlı kurumlar</span>
                  <span>Belediyeler ve iştirakleri</span>
                  <span>Holdingler ve büyük ölçekli şirketler</span>
                  <span>Kamu–özel ortaklıkları (PPP)</span>
                </div>
              </div>
            </div>

            <ApplicationForm />
          </div>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </>
  );
}
