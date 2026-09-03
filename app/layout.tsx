import type { Metadata, Viewport } from "next";
import { Baloo_2, Figtree } from "next/font/google";

import "./globals.css";
import {
  BRAND,
  BRAND_LEGAL,
  CONTACT,
  PARENT_LEGAL,
  ROUTES,
  SITE_URL,
  TAGLINE,
} from "@/lib/site";

/**
 * Yazı tipleri derleme sırasında indirilip kendi alan adımızdan servis edilir:
 * tarayıcıdan Google'a istek gitmez, CSP dar kalır, çerez politikası dürüst olur.
 *
 * Caprasimo'da ğ/ş/İ yok; Baloo 2 aynı display sesini tam Türkçe kapsamıyla taşır.
 */
const baloo = Baloo_2({
  // latin + latin-ext: gövde metninin çoğu latin dosyasından geliyor;
  // yalnızca latin-ext istendiğinde o dosya preload edilmiyordu.
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-baloo",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

const description =
  "Kurumların atıl organizasyonel kapasitesini ölçer, TL karşılığını hesaplar ve sahada uygulayarak ortadan kaldırırız. Sonuç, dondurulmuş baz döneme göre aynı formülle yeniden ölçülür.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} Verimetri — Atıl kapasiteyi ölçüp katma değere çeviriyoruz`,
    template: `%s · ${BRAND}`,
  },
  description,
  applicationName: BRAND,
  authors: [{ name: BRAND_LEGAL }],
  publisher: PARENT_LEGAL,
  keywords: [
    "organizasyonel verimlilik",
    "verimetri",
    "atıl kapasite",
    "süreç madenciliği",
    "organizasyon danışmanlığı",
    "kontrol alanı analizi",
    "toplantı yükü",
    "operasyonel sadeleştirme",
    "verimlilik ölçümü",
  ],
  alternates: { canonical: ROUTES.home },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: `${BRAND} Verimetri`,
    title: `${BRAND} Verimetri — Atıl kapasiteyi ölçüp katma değere çeviriyoruz`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} Verimetri`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#7c4dcf",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/** Arama motorlarına kurum kimliğini veren yapılandırılmış veri. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#kurum`,
  name: `${BRAND} Verimetri`,
  alternateName: BRAND_LEGAL,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.png`,
  image: `${SITE_URL}/opengraph-image.png`,
  description: TAGLINE,
  email: CONTACT.email,
  parentOrganization: { "@type": "Organization", name: PARENT_LEGAL },
  areaServed: [{ "@type": "Country", name: "Türkiye" }],
  /**
   * Tek bir merkez adres. Önceden üç şehir için eksik PostalAddress dizisi
   * veriliyordu; streetAddress/postalCode olmadan bunlar geçersiz sayılır.
   * Açık adres LEGAL_ENTITY'de netleşince streetAddress + postalCode eklenir.
   */
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ankara",
    addressCountry: "TR",
  },
  contactPoint: CONTACT.offices.map((o) => ({
    "@type": "ContactPoint",
    telephone: o.phone,
    contactType: "sales",
    areaServed: o.city === "Boston" ? "US" : "TR",
    availableLanguage: ["tr", "en"],
  })),
  sameAs: ["https://girisimciturk.com", "https://depremtek.market"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#site`,
  url: SITE_URL,
  name: `${BRAND} Verimetri`,
  inLanguage: "tr-TR",
  publisher: { "@id": `${SITE_URL}/#kurum` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${baloo.variable} ${figtree.variable}`}>
      <body>
        <a className="skip-link" href="#icerik">
          İçeriğe geç
        </a>
        {children}
        <script
          type="application/ld+json"
          // İçerik derleme zamanında sabittir; kullanıcı girdisi içermez.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />
      </body>
    </html>
  );
}
