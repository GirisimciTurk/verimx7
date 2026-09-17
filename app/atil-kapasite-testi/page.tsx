import type { Metadata } from "next";

import HashAnchor from "@/components/HashAnchor";
import Simulation from "@/components/Simulation";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import TestLibrary from "@/components/TestLibrary";
import { ROUTES, SITE_URL, TEST_ANCHORS } from "@/lib/site";
import { TESTS, TOTAL_QUESTIONS } from "@/lib/test-library-data";

const description =
  "Beş kaynak alanında beş karar: kurumu siz yönetin, verim endeksinizi, kazanç eğrinizi ve kaçırdığınız fırsatları görün. Altı testlik kütüphaneyle mevcut durumunuzu ölçün.";

export const metadata: Metadata = {
  title: "Verim Simülasyonu ve Test Kütüphanesi",
  description,
  alternates: { canonical: ROUTES.test },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${ROUTES.test}`,
    title: "Verim Simülasyonu · Verimx7",
    description,
    siteName: "Verimx7 Verimetri",
    locale: "tr_TR",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
};

/** Simülasyon bir araç; arama sonuçlarında böyle görünsün. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Verim Simülasyonu",
  url: `${SITE_URL}${ROUTES.test}`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "tr-TR",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
  provider: { "@id": `${SITE_URL}/#kurum` },
  description,
};

/** Altı test, kırk beş soru — sayfa metni sayıları veriden alır. */
const numberWords: Record<number, string> = { 5: "Beş", 6: "Altı", 7: "Yedi", 8: "Sekiz" };
const testCount = numberWords[TESTS.length] ?? String(TESTS.length);

export default function SimulationPage() {
  return (
    <>
      <HashAnchor />
      <SiteNav />

      <main id="icerik">
        <header
          id={TEST_ANCHORS.simulation}
          style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "48px var(--page-pad) var(--space-8)" }}
        >
          <span className="tag tag-outline" style={{ marginBottom: "var(--space-4)" }}>
            Verim Simülasyonu
          </span>
          <h1
            style={{
              fontSize: "clamp(30px, 4vw, 48px)",
              lineHeight: 1.06,
              margin: "var(--space-4) 0 var(--space-3)",
              maxWidth: "20em",
            }}
          >
            Kurumu siz yönetin, sonucu birlikte görelim
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--color-neutral-800)", maxWidth: "44em", margin: 0 }}>
            Beş kaynak alanında beş karar. Her seçim bir sonraki durumu değiştirir; hiçbir yol
            diğerinin aynısı değildir. Sonunda verim endeksiniz, kazanç eğriniz ve kaçırdığınız
            fırsatlar önünüze gelir. Simülasyon tarayıcınızda çalışır; kararlarınız kaydedilmez.
          </p>
        </header>

        <Simulation />

        <section id={TEST_ANCHORS.library} className="page-sec" style={{ display: "grid", gap: "var(--space-8)", scrollMarginTop: 104 }}>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <span className="tag tag-outline" style={{ justifySelf: "start" }}>
              Test kütüphanesi
            </span>
            <h2 style={{ fontSize: 36, margin: 0, maxWidth: "24em" }}>
              {testCount} test, {TOTAL_QUESTIONS} soru
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--color-neutral-800)", maxWidth: "44em", margin: 0 }}>
              Simülasyon karar alışkanlığınızı gösterir; testler mevcut durumunuzu ölçer. Her test tek
              başına alınabilir, sonuç anında çıkar. Yanıtlar tarayıcınızda kalır.
            </p>
          </div>

          <TestLibrary />
        </section>
      </main>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
