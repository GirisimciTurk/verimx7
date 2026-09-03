import type { Metadata } from "next";
import Image from "next/image";

import CapacityTest from "@/components/CapacityTest";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { compute } from "@/lib/engine";
import { ROUTES, SITE_URL } from "@/lib/site";
import { DEFAULT_VALUES } from "@/lib/test-config";

export const metadata: Metadata = {
  title: "Atıl Kapasite Testi",
  description:
    "On iki soruda kurumunuzun tahmini yıllık atıl kapasitesini TL cinsinden hesaplayın. Kontrol alanı, onay katmanı, toplantı yükü, fazla mesai ve devir girdilerinden büyüklük tahmini.",
  alternates: { canonical: ROUTES.test },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${ROUTES.test}`,
    title: "Atıl Kapasite Testi · Verimx7",
    description:
      "On iki soru, yaklaşık üç dakika. Tahmini yıllık atıl kapasitenizin TL karşılığı ve üç kaleme dağılımı.",
    siteName: "Verimx7 Verimetri",
    locale: "tr_TR",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
};

/** Test bir araç; arama sonuçlarında böyle görünsün. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Atıl Kapasite Testi",
  url: `${SITE_URL}${ROUTES.test}`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "tr-TR",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
  provider: { "@id": `${SITE_URL}/#kurum` },
  description:
    "On iki soruluk kendi kendine değerlendirme; organizasyonel atıl kapasitenin tahmini TL karşılığını hesaplar.",
};

export default function CapacityTestPage() {
  // Varsayılan girdilerin sonucu sunucuda hesaplanır: sayfa ilk boyandığında
  // sonuç paneli dolu gelir, JavaScript beklenmez.
  const initial = compute(DEFAULT_VALUES);

  return (
    <>
      <SiteNav />

      <main id="icerik" className="has-mobile-total">
        <header
          style={{
            maxWidth: "var(--page-max)",
            margin: "0 auto",
            padding: "40px var(--page-pad) var(--space-8)",
          }}
        >
          <div className="split-a" style={{ alignItems: "center" }}>
            <div>
              <span className="tag tag-outline" style={{ marginBottom: "var(--space-4)" }}>
                Atıl Kapasite Testi
              </span>
              <h1
                style={{
                  fontSize: "clamp(30px, 4vw, 48px)",
                  lineHeight: 1.05,
                  margin: "var(--space-4) 0",
                  maxWidth: "22em",
                }}
              >
                Kaynaklarınızın gerçekte ne kadar değerli olduğunu öğrenin
              </h1>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: "var(--color-neutral-800)",
                  maxWidth: "46em",
                  margin: 0,
                }}
              >
                On iki soru, yaklaşık üç dakika. Hesaplama sunucumuzda yapılır;
                girdileriniz kaydedilmez — yalnızca ayrıntılı raporu talep ederseniz
                e-posta adresinizle birlikte kaydedilir. Hesaplama katsayıları
                başlangıçta sektör varsayımıdır ve benchmark havuzu doldukça gerçek
                değerlerle değiştirilir. Sonuç bir teşhis değil, teşhis için büyüklük
                tahminidir.
              </p>
            </div>

            <div
              className="washed"
              style={{
                position: "relative",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                aspectRatio: "4 / 3",
              }}
            >
              <Image
                src="/img/genel_uretim.jpg"
                alt="Üretim ve lojistik kapasitesinin ölçüldüğü geniş kadraj tesis görünümü"
                fill
                priority
                sizes="(max-width: 1080px) 90vw, 420px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </header>

        <CapacityTest initial={initial} />
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
