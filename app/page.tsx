import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ApplicationForm from "@/components/ApplicationForm";
import CaseStudy from "@/components/CaseStudy";
import Comparison from "@/components/Comparison";
import HashAnchor from "@/components/HashAnchor";
import HeroTyping from "@/components/HeroTyping";
import QuickEstimate from "@/components/QuickEstimate";
import ReportPreview from "@/components/ReportPreview";
import SideForm from "@/components/SideForm";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { quickEstimate } from "@/lib/engine";
import { QUICK_LIMITS } from "@/lib/form-constants";
import { BRAND, CLAIMS, ROUTES, SECTIONS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: ROUTES.home },
};

const QUICK_DEFAULTS = {
  emp: QUICK_LIMITS.emp.default,
  revenueMn: QUICK_LIMITS.revenueMn.default,
  cost: QUICK_LIMITS.cost.default,
};

/** Ne yapıyoruz — beş verimetri alanı. */
const AREAS = [
  {
    title: "İnsan Kaynağı Verimetrisi",
    body: "Yetkinlik–görev uyumu ve gizli kapasite",
    src: "/img/ekip_ofis.jpg",
    alt: "Açık ofiste bilgisayar başında çalışan, yer yer boş masaların göründüğü ekip",
  },
  {
    title: "Fiziksel Alan ve Bina Verimetrisi",
    body: "Yeniden konfigürasyon ve kapasite artışı",
    src: "/img/bos_ofis.jpg",
    alt: "Kullanılmayan, boş ve aydınlık bir ofis katı",
  },
  {
    title: "Makine ve Teçhizat Verimetrisi",
    body: "Duruş, düşük çalışma ve konumlandırma analizi",
    src: "/img/makine_salonu.jpg",
    alt: "Sıra sıra eski makinelerin durduğu, çalışmayan bir makine salonu",
  },
  {
    title: "Doğal ve Stratejik Kaynak Verimetrisi",
    body: "Atıl rezervlerin ekonomik değere dönüşümü",
    src: "/img/tarla.jpg",
    alt: "Hasattan sonra boş kalmış tarlaların kuşbakışı görünümü",
  },
  {
    title: "Teknoloji Verimetrisi",
    body: "Aynı teknolojiyle daha fazla verim",
    src: "/img/veri_merkezi.jpg",
    alt: "Sıra sıra sunucu dolaplarının bulunduğu bir veri merkezi",
  },
] as const;

/** Verimx7 modeli — yedi katman (yedincisi ayrı kartta). */
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

/** Artış yoksa prim yok — dört ilke. */
const RISK_CARDS = [
  { head: "Sabit", title: "Teşhis ücreti", body: "Beş günde rapor. Sonuç beğenilmezse süreç orada biter." },
  { head: "Primli", title: "Uygulama bedeli", body: "Ağırlığı doğrulanan artışa bağlı başarı primidir." },
  { head: "Formül", title: "Sözleşme eki", body: "Baz dönem, metrik ve hesap yöntemi imza öncesi yazılır." },
] as const;

/** Kapsam — üç aşama. */
const PACKAGES = [
  {
    stage: "Aşama 1",
    title: "Teşhis",
    time: "5 gün",
    items: ["Kaynak envanteri", "Kayıp haritası", "Aksiyon listesi", "Ölçüm protokolü"],
    note: "Tek başına alınabilir.",
  },
  {
    stage: "Aşama 2",
    title: "Uygulama",
    time: "3–6 ay",
    items: [
      "Aksiyonların yürütülmesi",
      "Birim liderleriyle haftalık ritim",
      "Kaynak yeniden eşleştirme",
      "Doğrulama ölçümü",
    ],
    note: "Bedelin ağırlığı başarı primi.",
    highlight: true,
  },
  {
    stage: "Aşama 3",
    title: "İzleme",
    time: "abonelik",
    items: ["Aylık veri akışı", "Eşik aşımı uyarıları", "Çeyreklik gözden geçirme"],
  },
] as const;

/** Kimler için çalışıyoruz. */
const AUDIENCES = [
  { head: "Kamu", body: "Bakanlıklar ve bağlı kurumlar" },
  { head: "Yerel", body: "Belediyeler ve iştirakleri" },
  { head: "Sanayi", body: "Üretim tesisleri ve holdingler" },
  { head: "Tarım", body: "Arazi ve doğal kaynak işletmeleri" },
  { head: "PPP", body: "Kamu–özel ortaklıkları" },
] as const;

/** "Masaya genelde şu üç cümleyle geliyorlar." */
const SITUATIONS = [
  {
    quote: "“Ekip yetmiyor, kadro büyütmemiz gerek.”",
    body: "Önce mevcut kadronun ne kadarının asıl işe gittiğini ölçüyoruz. Onay katmanı ve toplantı yükü çıktığında genelde kadro yetiyor.",
    src: "/img/toplanti.jpg",
    alt: "Toplantı masasında dizüstü bilgisayarların başında not alan eller",
  },
  {
    quote: "“Kapasiteyi artırmak için yeni yatırım şart.”",
    body: "Mevcut hattın gerçek etkinliğini ölçüyoruz. Duruş ve hazırlık kayıpları alındığında yatırım kararı çoğu zaman erteleniyor.",
    src: "/img/uretim_hatti.jpg",
    alt: "Makinelerle dolu geniş bir üretim tesisi",
  },
  {
    quote: "“Verimsizlik var ama nerede olduğunu bilmiyoruz.”",
    body: "Beş günde kayıp haritası çıkıyor: hangi süreçte, ne kadar, hangi veriye dayanarak. Tartışma oradan sonra somutlaşıyor.",
    src: "/img/analiz_ekrani.jpg",
    alt: "Grafiklerin açık olduğu bir ekranda verileri inceleyen ekip",
  },
] as const;

/** Sık sorulanlar. %700 maddesi CLAIMS.sevenfold ile birlikte açılır. */
const FAQ: ReadonlyArray<{ q: string; a: string; claim?: boolean }> = [
  {
    q: "Bu gerçekten oluyor mu, yoksa slayt mı kalıyor?",
    a: "Ölçüm bizim tablomuzdan değil, sizin kendi sisteminizden çıkıyor. Baz dönem sözleşme imzalanmadan donduruluyor, metrik ve formül sözleşme eki oluyor. Doğrulanan artış olmazsa başarı primi tahakkuk etmiyor — iddiayı biz taşıyoruz.",
  },
  {
    q: "%700 nasıl mümkün olabilir?",
    a: "Tek bir metrikte değil. Bu oran, atıl kaynağın gelirleştirilmesiyle uzun vadede ölçülen toplam katma değeri anlatıyor. Altı aylık uygulama sonunda gördüğümüz tipik bant %12–40’tır; sayfadaki hesap aracı da o bandı kullanıyor.",
    claim: true,
  },
  {
    q: "Ne kadar sürüyor, ekibimizden ne istiyorsunuz?",
    a: "Ön görüşme 1 saat, kapsam 3 gün, veri toplama 4 gün, teşhis raporu 5 gün. Uygulama 3–6 ay, doğrulama 2 hafta. Sizden istediğimiz, birim liderlerinin haftada bir saatlik katılımı ve mevcut sistem verisine okuma erişimi.",
  },
  {
    q: "Verimizi kim görecek?",
    a: "Kişi bazlı kimlik hiçbir tabloda tutulmuyor; en küçük tanecik roldür. Her müşteri için ayrı şema, uçtan uca şifreleme, erişim logu ve proje sonunda imha tutanağı uygulanıyor.",
  },
  {
    q: "Bunu kendi ekibimiz yapamaz mı?",
    a: "Çoğu kurumda yapabilir. Eksik olan genellikle bilgi değil, ölçüm disiplini ve şablon: baz dönemin dondurulması, kaybın tek tek sahiplendirilmesi ve sonucun aynı formülle yeniden ölçülmesi. İsterseniz yöntemi ekibinize devrediyoruz.",
  },
  {
    q: "Ekip direnç gösterirse ne olur?",
    a: "Aksiyonlar birim liderleriyle birlikte yazılıyor, tepeden dayatılmıyor. Kişi bazlı performans skoru üretmiyoruz; ölçüm rol ve süreç seviyesinde kalıyor. Direncin en büyük kaynağı olan “bu benim işimi tehdit ediyor” algısını böyle kırıyoruz.",
  },
];

const SECURITY_TAGS = [
  "Veri minimizasyonu",
  "Rol bazlı toplulaştırma",
  "Müşteriye özel şema",
  "Uçtan uca şifreleme",
  "Erişim logları",
  "İmha tutanağı",
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
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Teşhis (5 gün)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Uygulama (3–6 ay)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "İzleme aboneliği" } },
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.filter((f) => !f.claim || CLAIMS.sevenfold).map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  const quick = quickEstimate(QUICK_DEFAULTS.emp, QUICK_DEFAULTS.revenueMn, QUICK_DEFAULTS.cost);

  return (
    <>
      <HashAnchor />
      <SiteNav />
      <SideForm />

      <main id="icerik">
        {/* ── Başlık ────────────────────────────────────────────────── */}
        <section className="lp-sec" style={{ paddingTop: 56, paddingBottom: 40 }}>
          <span className="tag tag-outline" style={{ marginBottom: "var(--space-4)" }}>
            {BRAND} Teknolojileri
          </span>
          <HeroTyping />
          <p style={{ fontSize: 20, lineHeight: 1.5, maxWidth: "30em", color: "var(--color-neutral-800)", margin: 0 }}>
            İnsan, mekân, makine, teknoloji ve doğal kaynaklarda ölçülebilir verim artışı
          </p>
        </section>

        {/* ── Hızlı tahmin + görsel ─────────────────────────────────── */}
        <section className="lp-sec hero-grid">
          <QuickEstimate
            defaults={QUICK_DEFAULTS}
            initial={{ ratio: quick.ratio, value: quick.value, payroll: quick.payroll }}
          />
          <div className="hero-photo">
            <Image
              src="/img/atil_bina.jpg"
              alt="Camları kırık, kullanılmayan çok katlı büyük bir bina cephesi"
              fill
              priority
              sizes="(max-width: 1080px) calc(100vw - 56px), 540px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>

        {/* ── Geniş bant görsel ─────────────────────────────────────── */}
        <section className="lp-sec" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div
            className="washed"
            style={{ position: "relative", height: 380, borderRadius: "var(--radius-lg)", overflow: "hidden" }}
          >
            <Image
              src="/img/bos_fabrika.jpg"
              alt="Tavanı ışıklıklı, bomboş ve geniş bir fabrika holü"
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
                Kurumların kaynaklarının %30–60&rsquo;ı atıl. Biz o kısmı katma değere
                çeviriyoruz.
              </p>
            </div>
            <div style={{ display: "grid", gap: "var(--space-4)" }}>
              {/* %700 — lib/site.ts içindeki CLAIMS.sevenfold ile açılıp kapanır. */}
              {CLAIMS.sevenfold && (
                <div>
                  <div className="stat-v">%700</div>
                  <div className="stat-l">hedeflenen verim artışı</div>
                </div>
              )}
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
            <p style={{ margin: 0, maxWidth: "30em", fontSize: 16, color: "var(--color-neutral-700)" }}>
              Kamu kurumları ve büyük ölçekli işletmelerin gizli kalmış kapasitelerini ortaya
              çıkarıyor ve geliştiriyoruz.
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
                  <p style={{ margin: 0, fontSize: 15, color: "var(--color-neutral-700)" }}>{area.body}</p>
                </div>
              </article>
            ))}

            <article
              className="card tilt-card"
              style={{ background: "var(--color-accent)", color: "var(--color-bg)", padding: "var(--space-6) var(--space-4)" }}
            >
              <h3 style={{ fontSize: 20, margin: "0 0 var(--space-4)", color: "var(--color-bg)" }}>
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
          <p style={{ fontSize: 17, color: "var(--color-neutral-700)", marginBottom: "var(--space-8)" }}>
            Yedi katmanlı verimetri metodolojisi.
          </p>

          <ol className="grid-4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {LAYERS.map((layer, index) => (
              <li key={layer} className="card tilt-card step-card">
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 30, lineHeight: 1, color: "var(--color-accent)" }}>
                  {index + 1}
                </span>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{layer}</span>
              </li>
            ))}
            <li className="card tilt-card step-wide" style={{ background: "var(--color-accent-2)", color: "var(--color-bg)" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 30, lineHeight: 1 }}>7</span>
              <span style={{ fontSize: 17, fontWeight: 600 }}>Sürekli izleme, raporlama ve geliştirme</span>
              <span style={{ fontSize: 13, opacity: 0.9 }}>
                Aylık veri akışı, pano ve eşik aşımı uyarıları ile abonelik olarak sürer.
              </span>
            </li>
          </ol>

          <div
            className="washed"
            style={{
              position: "relative",
              height: 300,
              borderRadius: "calc(var(--radius-lg) * 1.2)",
              overflow: "hidden",
              marginTop: "var(--space-6)",
            }}
          >
            <Image
              src="/img/beyaz_tahta.jpg"
              alt="Beyaz tahta başında süreci anlatan kişiyi dinleyen ekip"
              fill
              sizes="(max-width: 1200px) 100vw, 1120px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>

        {/* ── Ölçüm mimarisi ────────────────────────────────────────── */}
        <section id={SECTIONS.olcum} className="lp-sec band" style={{ paddingBottom: 40 }}>
          <p className="kicker" style={{ color: "var(--color-accent-700)", marginBottom: "var(--space-3)" }}>
            Ölçüm mimarisi
          </p>
          <h2 className="lp-h2" style={{ marginBottom: "var(--space-3)" }}>
            Tahmin değil ölçüm
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: "var(--color-neutral-800)", maxWidth: "30em", margin: 0 }}>
            Baz dönem projenin başında dondurulur. Sonuç, sizin sisteminizden, aynı formülle
            ölçülür.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-6)" }}>
            <span className="tag tag-outline">Sistem kaynaklı veri</span>
            <span className="tag tag-outline">8 hafta baz dönem</span>
            <span className="tag tag-outline">Sözleşme eki formül</span>
            <span className="tag tag-outline">Bağımsız doğrulama</span>
          </div>
        </section>

        {/* ── Vaka örneği ───────────────────────────────────────────── */}
        <section id={SECTIONS.vaka} className="lp-sec band" style={{ paddingTop: 0 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 30 }}>Sektörünüzde neye benziyor?</h3>
            <span className="tag tag-neutral">Temsili örnek · gerçek müşteri verisi değildir</span>
          </div>
          <CaseStudy />
        </section>

        {/* ── Bizsiz ve bizimle ─────────────────────────────────────── */}
        <section id={SECTIONS.karsilastirma} className="lp-sec">
          <Comparison />
        </section>

        {/* ── Artış yoksa prim yok ──────────────────────────────────── */}
        <section id={SECTIONS.risk} className="lp-sec">
          <div className="panel">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "var(--space-4)",
                marginBottom: "var(--space-6)",
              }}
            >
              <h2 className="lp-h2" style={{ margin: 0 }}>
                Artış yoksa prim yok
              </h2>
              <span style={{ fontSize: 15, color: "var(--color-neutral-700)", maxWidth: "26em" }}>
                Riski birlikte taşıyoruz; ölçüm sizin sisteminizden çıkıyor.
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {RISK_CARDS.map((card) => (
                <div key={card.title} className="card tilt-card" style={{ background: "var(--color-bg)", gap: "var(--space-2)" }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: 26, color: "var(--color-accent)" }}>
                    {card.head}
                  </span>
                  <span style={{ fontWeight: 600 }}>{card.title}</span>
                  <span className="card-body">{card.body}</span>
                </div>
              ))}
              <div className="card tilt-card" style={{ background: "var(--color-accent)", color: "var(--color-bg)", gap: "var(--space-2)" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 26 }}>Sıfır</span>
                <span style={{ fontWeight: 600 }}>Doğrulanmayan artış</span>
                <span style={{ fontSize: 14, lineHeight: 1.5 }}>Ölçüm artışı göstermiyorsa prim tahakkuk etmez.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Elinize ne geçiyor ────────────────────────────────────── */}
        <section id={SECTIONS.rapor} className="lp-sec">
          <ReportPreview />
        </section>

        {/* ── Kapsam ────────────────────────────────────────────────── */}
        <section id={SECTIONS.paketler} className="lp-sec">
          <h2 className="lp-h2">Kapsam</h2>
          <p style={{ fontSize: 17, color: "var(--color-neutral-700)", marginBottom: "var(--space-8)" }}>
            Üç aşama, ayrı ayrı alınabilir. Bedel kapsam görüşmesinde belirlenir.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {PACKAGES.map((pkg) => {
              const dark = "highlight" in pkg && pkg.highlight;
              return (
                <article
                  key={pkg.title}
                  className={`card tilt-card ${dark ? "elev-md" : "elev-sm"}`}
                  style={{
                    gap: "var(--space-4)",
                    background: dark ? "var(--color-accent-2)" : undefined,
                    color: dark ? "var(--color-bg)" : undefined,
                  }}
                >
                  <span
                    className={dark ? "tag" : "tag tag-outline"}
                    style={{
                      alignSelf: "flex-start",
                      background: dark ? "var(--color-bg)" : undefined,
                      color: dark ? "var(--color-accent-2-800)" : undefined,
                    }}
                  >
                    {pkg.stage}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 20, color: dark ? "var(--color-bg)" : undefined }}>{pkg.title}</h3>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: dark ? undefined : "var(--color-accent-700)",
                      opacity: dark ? 0.92 : undefined,
                    }}
                  >
                    {pkg.time}
                  </span>
                  <ul
                    style={{
                      display: "grid",
                      gap: "var(--space-2)",
                      fontSize: 15,
                      color: dark ? undefined : "var(--color-neutral-800)",
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {pkg.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {"note" in pkg && (
                    <span style={{ fontSize: 13, color: dark ? undefined : "var(--color-neutral-700)", opacity: dark ? 0.9 : undefined }}>
                      {pkg.note}
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Simülasyona çağrı ─────────────────────────────────────── */}
        <section className="lp-sec" style={{ paddingTop: 0 }}>
          <div className="panel-dark split-cta">
            <div>
              <p className="kicker" style={{ color: "var(--color-accent-300)" }}>
                Verim Simülasyonu
              </p>
              <h2 className="lp-h2" style={{ color: "var(--color-accent-100)" }}>
                Kaynaklarınızın gerçekte ne kadar değerli olduğunu öğrenin.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--color-accent-200)", maxWidth: "34em", margin: 0 }}>
                Beş kaynak alanında beş karar, yaklaşık üç dakika. Her seçim bir sonraki durumu
                değiştirir; sonunda verim endeksiniz, kazanç eğriniz ve kaçırdığınız fırsatlar
                önünüze gelir. Ayrıntılı rapor e-posta ile iletilir.
              </p>
            </div>
            <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: "start" }}>
              <Link
                className="btn btn-primary"
                href={ROUTES.test}
                style={{ fontSize: 16, padding: "14px 26px", background: "var(--color-accent-400)", color: "var(--color-accent-900)" }}
              >
                Simülasyona başlayın
              </Link>
            </div>
          </div>
        </section>

        {/* ── Teslimat ──────────────────────────────────────────────── */}
        <section id={SECTIONS.teslimat} className="lp-sec">
          <h2 className="lp-h2">Nasıl çalışıyoruz?</h2>
          <p style={{ fontSize: 17, color: "var(--color-neutral-700)", maxWidth: "34em", marginBottom: "var(--space-8)" }}>
            Yedi aşama, kapı kriterleriyle. Teşhis raporu tek başına alınabilir.
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
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 18, lineHeight: 1.15 }}>{stage.name}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Kimler için ───────────────────────────────────────────── */}
        <section id={SECTIONS.referanslar} className="lp-sec band">
          <h2 className="lp-h2">Kimler için çalışıyoruz</h2>
          <p style={{ fontSize: 17, color: "var(--color-neutral-700)", maxWidth: "40em", marginBottom: "var(--space-6)" }}>
            Ortak nokta ölçek değil: elinde ölçülmemiş kaynak bulunan her kurum.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
              gap: "var(--space-3)",
              marginBottom: "var(--space-8)",
            }}
          >
            {AUDIENCES.map((a) => (
              <div key={a.head} className="card tilt-card" style={{ background: "var(--color-neutral-100)", gap: "var(--space-2)" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "var(--color-accent)" }}>{a.head}</span>
                <span style={{ fontSize: 15, color: "var(--color-neutral-800)" }}>{a.body}</span>
              </div>
            ))}
          </div>

          <h3 style={{ margin: "0 0 var(--space-6)", fontSize: 26 }}>Masaya genelde şu üç cümleyle geliyorlar</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {SITUATIONS.map((s) => (
              <article key={s.quote} className="alan-card elev-sm tilt-card" style={{ background: "var(--color-bg)" }}>
                <div className="alan-media washed" style={{ height: 170 }}>
                  <Image src={s.src} alt={s.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 360px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: "var(--space-6) var(--space-4) var(--space-4)", display: "grid", gap: "var(--space-3)" }}>
                  <p style={{ margin: 0, fontSize: 18, lineHeight: 1.4, fontWeight: 600 }}>{s.quote}</p>
                  <p style={{ margin: 0, fontSize: 15, color: "var(--color-neutral-700)" }}>{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Sık sorulanlar ────────────────────────────────────────── */}
        <section id={SECTIONS.sss} className="lp-sec band">
          <div className="split-sss">
            <div>
              <h2 className="lp-h2">Sık sorulanlar</h2>
              <p style={{ fontSize: 16, color: "var(--color-neutral-700)", maxWidth: "20em" }}>
                En çok duyduğumuz itiraz: “bu gerçekten olur mu?” Cevapları burada.
              </p>
              <div
                className="washed"
                style={{
                  position: "relative",
                  borderRadius: "calc(var(--radius-lg) * 1.2)",
                  overflow: "hidden",
                  aspectRatio: "4 / 5",
                  marginTop: "var(--space-6)",
                }}
              >
                <Image
                  src="/img/istanbul_levent.jpg"
                  alt="Önde Kız Kulesi, arkada Levent gökdelenleriyle İstanbul silueti"
                  fill
                  sizes="(max-width: 1080px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div>
              {FAQ.filter((f) => !f.claim || CLAIMS.sevenfold).map((f) => (
                <details key={f.q} className="faq">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Veri güvenliği ────────────────────────────────────────── */}
        <section className="lp-sec split-b">
          <div>
            <h2 className="lp-h2">Veri güvenliği</h2>
            <p style={{ fontSize: 18, lineHeight: 1.5, paddingLeft: "var(--space-4)", borderLeft: "3px solid var(--color-accent)", margin: 0 }}>
              Kişi bazlı kimlik hiçbir tabloda tutulmaz. En küçük tanecik roldür.
            </p>
            <p style={{ marginTop: "var(--space-4)", fontSize: 15 }}>
              <Link href={ROUTES.privacy}>Gizlilik ve veri güvenliği politikası →</Link>
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {SECURITY_TAGS.map((tag) => (
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
                Ön görüşme 1 saattir. Karar verici katılımı ve bütçe aralığının doğrulanması,
                sonraki aşamaya geçişin kapı kriteridir.
              </p>
              <div className="card" style={{ background: "var(--color-neutral-100)", marginTop: "var(--space-6)" }}>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, faqJsonLd]) }}
      />
    </>
  );
}
