/**
 * Site geneli sabitler: marka, iletişim, gezinme ve kanonik adres.
 *
 * Kanonik adres tek yerden gelir. Yayına almadan önce ortam değişkenini
 * gerçek alan adıyla ayarlayın:  NEXT_PUBLIC_SITE_URL=https://alanadiniz.com
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://verimx7.com";

/** Sondaki eğik çizgi olmadan, mutlak URL üretiminde kullanılan taban adres. */
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

export const BRAND = "Verimx7";
export const BRAND_LEGAL = "Verimx7 Teknolojileri";
export const PARENT_LEGAL = "DEV YAPIMCILIK YAYINCILIK SAN. TİC. LTD. ŞTİ.";

/**
 * Sayısal reklam iddialarının anahtarı.
 *
 * İş Planı §8.3 (iddia yönetimi) şirketin kendi bağlayıcı kuralı:
 *   1. Hiçbir iddia genel bir paydaya bağlanmaz; payda daima ölçülen dar süreçtir.
 *   2. Yayımlanan her oran, örneklem sayısı + baz dönem tanımı + ortalama/medyan
 *      ayrımıyla birlikte verilir.
 *   3. En iyi vaka ortalama gibi sunulmaz.
 *   4. Her iddianın dayanağı olan ham ölçümler dosyalanır ve ibraz edilebilir.
 * 6502 sayılı Kanun ve Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği
 * uyarınca ispat yükü reklam verendedir.
 *
 * `sevenfold` (7 kat / %700 verim artışı) VARSAYILAN OLARAK KAPALI: markanın
 * adında geçse de, sitede yayımlanabilmesi için hangi metrikte, hangi paydada
 * ve hangi baz döneme göre ölçüldüğünü gösteren bir dayanak dosyası gerekir.
 * Dosya hazır olduğunda burayı true yapın ve app/page.tsx içindeki
 * `SEVENFOLD_STAT` bloğundaki payda metnini gerçek ölçüme göre yazın.
 */
export const CLAIMS = {
  sevenfold: false,
} as const;

export const TAGLINE =
  "Organizasyonel verimetri — atıl kaynakların ölçülebilir katma değere dönüştürülmesi.";

/**
 * Yasal künye. Tanıtım sitesi de olsa, ticari iletişimde bulunan bir işletmenin
 * kim olduğu siteden anlaşılabilmelidir; KVKK m.10 aydınlatması da veri
 * sorumlusunun kimliğini ve tebligata esas adresini ister.
 *
 * YAYIN ÖNCESİ ZORUNLU: aşağıdaki yer tutucuların tamamı doldurulmalıdır.
 * Boş kaldığı sürece alt bilgide "[DOLDURULACAK: …]" olarak görünür — bu,
 * eksikliği gizlememek için bilinçli bir tercihtir.
 */
export const LEGAL_ENTITY = {
  tradeName: "[DOLDURULACAK: tam ticari unvan]",
  address: "[DOLDURULACAK: tebligata esas açık adres]",
  mersis: "[DOLDURULACAK: MERSİS numarası]",
  taxOffice: "[DOLDURULACAK: vergi dairesi ve vergi numarası]",
  tradeRegistry: "[DOLDURULACAK: ticaret sicil numarası]",
  kep: "[DOLDURULACAK: KEP adresi]",
  /** KVKK m.11 başvurularının yapılacağı resmî adres. */
  kvkkEmail: "[DOLDURULACAK: KVKK başvuru e-posta adresi]",
} as const;

/** Bir künye alanı hâlâ yer tutucu mu? */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("[DOLDURULACAK");
}

/** Telif satırında kullanılan kuruluş yılı. Statik prerender'da donmaz. */
export const FOUNDED_YEAR = 2026;

export const CONTACT = {
  email: "bilgi@girisimciturk.com",
  whatsappNumber: "+90 544 694 32 78",
  whatsappHref: "https://wa.me/905446943278",
  offices: [
    { city: "Ankara", phone: "+90 850 241 70 00", href: "tel:+908502417000" },
    { city: "İstanbul", phone: "+90 212 963 70 00", href: "tel:+902129637000" },
    { city: "Boston", phone: "+1 617 833 1218", href: "tel:+16178331218" },
  ],
} as const;

export const GROUP_LINKS = [
  { label: "Girişimci Türk", href: "https://girisimciturk.com" },
  { label: "depremTek Market", href: "https://depremtek.market" },
] as const;

/** Ana sayfa içi bölüm çapaları. */
export const SECTIONS = {
  alanlar: "alanlar",
  model: "model",
  olcum: "olcum",
  teslimat: "teslimat",
  ekip: "ekip",
  basvuru: "basvuru",
} as const;

export const ROUTES = {
  home: "/",
  test: "/atil-kapasite-testi",
  dashboard: "/pano",
  kvkk: "/kvkk-aydinlatma-metni",
  privacy: "/gizlilik-ve-veri-guvenligi",
  cookies: "/cerez-politikasi",
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Papatya menüsünde vurgulu (CTA) görünür. */
  cta?: boolean;
  /** Bu rota açıkken "burada" olarak işaretlenir. */
  matchPath?: string;
};

/**
 * Papatya menüsü tam sekiz yuvaya göre konumlandırılmıştır
 * (globals.css içindeki .daisy-item:nth-of-type kuralları).
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Ne yapıyoruz", href: `${ROUTES.home}#${SECTIONS.alanlar}` },
  { label: "Model", href: `${ROUTES.home}#${SECTIONS.model}` },
  { label: "Ölçüm", href: `${ROUTES.home}#${SECTIONS.olcum}` },
  { label: "Teslimat", href: `${ROUTES.home}#${SECTIONS.teslimat}` },
  { label: "Ekip", href: `${ROUTES.home}#${SECTIONS.ekip}` },
  { label: "Atıl Kapasite Testi", href: ROUTES.test, matchPath: ROUTES.test },
  { label: "Pano", href: ROUTES.dashboard, matchPath: ROUTES.dashboard },
  { label: "Başvuru", href: `${ROUTES.home}#${SECTIONS.basvuru}`, cta: true },
];

/**
 * Türkçe sayı biçimlendirme.
 *
 * Bilerek Intl kullanılmıyor. Aynı sayı hem sunucuda hem tarayıcıda basılıyor;
 * Node kurulumunda tam ICU yoksa (küçültülmüş imajlar, bazı konteynerler)
 * sunucu "56,603,520", tarayıcı "56.603.520" üretir ve React hidrasyon
 * uyuşmazlığı verir. Elle gruplama her ortamda aynı sonucu garanti eder.
 */
export function groupTR(value: number): string {
  const rounded = Math.round(value);
  const digits = Math.abs(rounded).toString();
  let out = "";
  for (let i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ".";
    out += digits[i];
  }
  return rounded < 0 ? `-${out}` : out;
}

/** Ondalıklı gösterim: 51.84 → "51,8" */
export function decimalTR(value: number, digits = 1): string {
  return value.toFixed(digits).replace(".", ",");
}

export function formatTL(value: number): string {
  return `${groupTR(value)} ₺`;
}

export function formatPercent(value: number, digits = 1): string {
  return `%${decimalTR(value, digits)}`;
}
