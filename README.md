# Verimx7 — Organizasyonel Verimetri tanıtım sitesi

**Verimx7 Teknolojileri**'nin B2B tanıtım sitesi. Kurumların atıl kaynaklarını
(insan kaynağı, fiziksel alan, makine ve teçhizat, doğal ve stratejik kaynak,
teknoloji) ölçülebilir katma değere dönüştüren "organizasyonel verimetri"
hizmetini anlatır; ziyaretçiyi bir **Atıl Kapasite Testi** üzerinden nitelikli
bir değerlendirme başvurusuna taşır.

Bu site bir **DEV YAPIMCILIK YAYINCILIK SAN. TİC. LTD. ŞTİ.** iştirakidir.

---

## Sayfalar ve uçlar

### Sayfalar

| Yol | Ne yapar |
|---|---|
| `/` | Ana sayfa: hizmet, kaynak alanları, model, ölçüm, teslimat, ekip ve değerlendirme başvurusu formu |
| `/atil-kapasite-testi` | 12 soruluk kendi kendine değerlendirme; sonuç sunucuda hesaplanır |
| `/pano` | Örnek gösterge panosu — **demo/örnek veridir**, gerçek müşteri verisi değildir |
| `/kvkk-aydinlatma-metni` | 6698 sayılı KVKK m.10 kapsamında aydınlatma metni |
| `/gizlilik-ve-veri-guvenligi` | Gizlilik ve veri güvenliği politikası, hizmetin veri mimarisi |
| `/cerez-politikasi` | Çerez politikası |

### API uçları

| Uç | Ne yapar | Kayıt tutar mı |
|---|---|---|
| `POST /api/atil-kapasite` | Test girdilerini alır, `lib/engine.ts` ile hesaplar, sonucu döner. `mode: "quick"` (ana sayfadaki üç girdilik hızlı tahmin) ve `mode: "full"` (12 soruluk test) destekler | **Hayır.** Hesaplanıp geri döner, hiçbir yere yazılmaz. Kimlik verisi içermez |
| `POST /api/basvuru` | Değerlendirme başvurusu: ad soyad, telefon, e-posta, kurum adı, kaynak alanı, açıklama, aydınlatma onayı (zorunlu), ticari ileti izni (ayrı ve opsiyonel) | Evet — yapılandırılan kanallara iletilir |
| `POST /api/rapor` | Ayrıntılı raporun e-posta ile istenmesi: e-posta adresi + test girdileri + aydınlatma onayı | Evet — yapılandırılan kanallara iletilir |

Kaydedilen taleplerde teknik olarak ayrıca IP adresi, tarayıcı bilgisi
(user-agent), referans (referer) ve zaman damgası yer alır.

Üç uç da IP başına hız sınırına tabidir (`lib/ratelimit.ts`): form uçlarında
10 dakikada 5 istek, hesaplama ucunda dakikada 240 istek. Sınır aşıldığında
`429` ve `Retry-After` başlığı döner. Doğrulama hatası `422`, bozuk gövde
`400` verir.

---

## Gereksinimler

- **Node.js 20.9+** — Next.js 16 bu sürümü zorunlu kılar (`next` komutu daha
  eski bir sürümde başlamadan hata verir), tercih değildir.
- npm (depoda `package-lock.json` bulunur)

Yığın: **Next.js 16 (App Router)** · **React 19** · **TypeScript (strict)** ·
**düz CSS** (Tailwind kullanılmaz — tüm stil `app/globals.css` içindeki CSS
değişkenleriyle kurulur) · **zod** ile doğrulama.

## Kurulum

```bash
npm install
cp .env.example .env.local     # değerleri doldurun
npm run dev                    # http://localhost:3000
```

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm run start` | Derlenmiş çıktıyı sunar (`build` sonrası çalışır) |
| `npm run typecheck` | `tsc --noEmit` — tip denetimi, çıktı üretmez |


> Depoda ESLint kurulu değildir; Next.js 16 ile `next lint` komutu da kaldırıldı.
> İstenirse `npm i -D eslint eslint-config-next` kurulup `"lint": "eslint ."`
> script'i eklenebilir. Tip denetimi `npm run typecheck` ile yapılır ve
> `npm run build` sırasında da çalışır.

---

## Ortam değişkenleri

Tamamı ve açıklamaları için `.env.example` dosyasına bakın.

| Değişken | Zorunlu mu | Ne işe yarar |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Zorunlu** | Kanonik adres; `lib/site.ts` içindeki `SITE_URL` bundan okunur ve `metadataBase`, canonical, Open Graph / Twitter kart adresleri ile JSON-LD adresleri bu değerden üretilir (`app/sitemap.ts` / `app/robots.ts` eklendiğinde onlar da aynı değeri kullanır). Ayarlanmazsa `https://verimx7.com` varsayılanına düşer |
| `RESEND_API_KEY` | E-posta kanalı için zorunlu | Resend API anahtarı; talep e-postalarını gönderir |
| `LEAD_TO_EMAIL` | E-posta kanalı için zorunlu | Taleplerin düşeceği adres(ler); virgülle çoklu |
| `LEAD_FROM_EMAIL` | Opsiyonel (üretimde önerilir) | Doğrulanmış gönderen adresi. Boşsa Resend'in test göndericisine (`onboarding@resend.dev`) düşer |
| `LEAD_WEBHOOK_URL` | Opsiyonel | CRM / Zapier / Make / n8n uçları; talebin tamamı JSON olarak POST edilir |
| `LEAD_WEBHOOK_SECRET` | Opsiyonel | Tanımlıysa `X-Verimx7-Secret` başlığıyla gönderilir; alıcı uç sahte talepleri eler |
| `LEAD_LOG_DIR` | Opsiyonel | Talepleri sunucuda JSONL dosyasına yazar. Yalnızca kendi sunucunuzda anlamlıdır; sunucusuz ortamda dosya sistemi kalıcı değildir |

**En az bir teslim kanalı** (`RESEND_API_KEY` + `LEAD_TO_EMAIL`,
`LEAD_WEBHOOK_URL` veya `LEAD_LOG_DIR`) yapılandırılmadan üretimde form
uçları **503** döner ve ziyaretçi doğrudan iletişim kanallarına yönlendirilir
(`/api/basvuru` e-posta ve WhatsApp'a, `/api/rapor` e-postaya). Kanal
yapılandırılmış ama hiçbiri teslim edememişse yanıt **502** olur. Talebi almış
gibi görünüp hiçbir yere yazmamak kabul edilmez.

Geliştirme ortamında (`NODE_ENV !== "production"`) bu kapılar çalışmaz: kanal
yoksa talep sunucu konsoluna yazılır ve uç `ok` döner. Bu yalnızca yerel
geliştirme kolaylığıdır, teslim güvencesi değildir.

---

## Yayına almadan önce — kontrol listesi

- [ ] **`NEXT_PUBLIC_SITE_URL` gerçek alan adına ayarlandı.** Sondaki eğik çizgi
      olmadan, `https://` dahil. Derleme sonrası bir sayfanın kaynağında
      `<link rel="canonical">` ve `og:image` adreslerinin doğru alan adını
      gösterdiğini gözle doğrulayın.
- [ ] **En az bir talep teslim kanalı yapılandırıldı ve GERÇEKTEN TEST EDİLDİ.**
      Üretim ortamında formu bir kez doldurup gönderin; e-posta kutusuna /
      CRM'e / log dizinine kaydın düştüğünü görün. Aynı testi `/api/rapor`
      için de yapın. Kanalın "yapılandırılmış" olması yetmez, **teslim
      edildiği görülmelidir.**
- [ ] **Hukuki metinlerdeki `[DOLDURULACAK]` yer tutucuları dolduruldu.**
      Şunlar mutlaka gerçek bilgiyle değiştirilmelidir: veri sorumlusunun tam
      ticari unvanı; VERBİS (Veri Sorumluları Sicil Bilgi Sistemi) kayıt
      durumu ve varsa sicil numarası; MERSİS numarası, vergi dairesi ve vergi
      numarası; tebligata esas açık adres; KEP adresi; KVKK m.11 haklarına
      ilişkin (m.13 usulüne göre yapılacak) ilgili kişi başvurularının
      iletileceği resmî e-posta adresi; barındırma ve e-posta gönderim
      sağlayıcılarının unvanları ile sunucu / veri merkezi konumları;
      yurt dışına aktarım varsa hukuki dayanağı; kullanılan CRM ürünü ve
      konumu; analiz ortamının barındırma konumu; site başvuru kayıtlarının
      saklama süresi.
      Kontrol: `grep -rn "DOLDURULACAK" app/`  — **çıktı boş olmalıdır.**
- [ ] **Ticari iddiaların dayanak dosyası hazırlandı** (İş Planı §8.3, iddia
      yönetimi). Sitede yayımlanan her oranın yanında **örneklem büyüklüğü,
      baz dönem ve ortalama/medyan ayrımı** açıkça belirtilmelidir. En iyi vaka
      ortalama gibi sunulamaz. Ham ölçümler dosyalanır ve talep halinde
      gösterilebilir durumda tutulur. Dayanağı olmayan sayı yayımlanmaz.
- [ ] **`/pano` sayfasının örnek/demo veri olduğu açıkça etiketli.** Sayfanın
      üstünde, ekran görüntüsü alındığında da görünecek biçimde. Gerçek müşteri
      verisi izlenimi vermemelidir.
- [ ] **Test motorunun sonuç aralığı gözden geçirildi.** `lib/engine.ts` uç
      girdilerde sonucu %45 tavanına doğru sıkıştırır; yayımlanan tahminlerin
      İş Planı §2.3 (%15–30) aralığıyla tutarlı kaldığını doğrulayın.
- [ ] **Google Search Console doğrulaması yapıldı ve sitemap gönderildi.**
      Doğrulama yöntemi olarak DNS TXT kaydı veya HTML dosyası tercih edin;
      `Content-Security-Policy` üçüncü taraf script'e izin vermiyor.
- [ ] **`robots.txt` ve `sitemap.xml` çıktısı kontrol edildi.**
      `app/robots.ts` ve `app/sitemap.ts` bu uçları üretir. Yayın sonrası
      `curl https://alanadiniz.com/sitemap.xml` ile hukuki metinler dahil tüm
      sayfaların listelendiğini ve alan adının doğru olduğunu doğrulayın.
- [ ] **Güvenlik başlıkları canlıda doğrulandı** (`next.config.ts`): CSP,
      HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
      `Permissions-Policy`. Konsolda CSP ihlali olmamalıdır.
- [ ] **Ticari ileti izni akışı doğrulandı.** Aydınlatma onayı ile ticari ileti
      izni **ayrı** kutulardır ve öyle kalmalıdır. Pazarlama iletisi
      gönderilecekse 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında
      Kanun ve ilgili yönetmelik gereği onayların **İYS'ye (İleti Yönetim
      Sistemi)** yüklenmesi ve iletilerde çıkış (ret) yolunun bulunması
      zorunludur.
- [ ] **`.env` / `.env.local` dosyalarının repoya işlenmediği doğrulandı**
      (`.gitignore` kapsıyor) ve sırlar yalnızca barındırma sağlayıcısının
      ortam değişkeni panosunda tutuluyor.

---

## Dağıtım

### Vercel (önerilen)

1. Depoyu Vercel'e bağlayın. Framework otomatik olarak Next.js algılanır; ek
   yapılandırma gerekmez.
2. Project Settings → Environment Variables altına `.env.example` içindeki
   değişkenleri girin. `LEAD_LOG_DIR` **kullanmayın** — sunucusuz ortamda
   dosya sistemi kalıcı değildir, yazılan talep kaybolur. E-posta ve/veya
   webhook kanalını tercih edin.
3. `NEXT_PUBLIC_SITE_URL` değerini production ortamı için gerçek alan adına,
   preview ortamı için preview adresine ayarlayın.
4. Alan adını bağlayın, HTTPS'in ve `www` → kök yönlendirmesinin çalıştığını
   doğrulayın.
5. Dağıtım sonrası formu canlıda bir kez gönderip teslimi doğrulayın.

### Kendi sunucunuzda

```bash
npm ci

# NEXT_PUBLIC_SITE_URL DERLEME ZAMANINDA gömülür: build komutunun önünde
# verilmezse kanonik adres, sitemap ve Open Graph adresleri varsayılan
# alan adıyla derlenir ve start sırasında düzeltilemez.
NEXT_PUBLIC_SITE_URL=https://alanadiniz.com npm run build

npm run start          # varsayılan olarak 3000 portunu dinler
```

- Süreci bir servis yöneticisiyle (systemd, pm2) kalıcı hale getirin.
- Önüne bir **ters vekil** (nginx / Caddy) koyun: TLS sonlandırması orada
  yapılır, istekler `127.0.0.1:3000` adresine iletilir.
- **`TRUST_PROXY` ayarlayın.** Ters vekil başlıkları istemci tarafından
  uydurulabildiği için kod, açıkça izin verilmedikçe onlara güvenmez:

  | Ortam | Değer | Okunan başlık |
  |---|---|---|
  | Vercel | `TRUST_PROXY=vercel` | `x-vercel-forwarded-for` |
  | Cloudflare önünde | `TRUST_PROXY=cloudflare` | `cf-connecting-ip` |
  | nginx / Caddy (tek vekil) | `TRUST_PROXY=1` | `x-forwarded-for`, **sağdan** 1. değer |
  | İki vekil zinciri | `TRUST_PROXY=2` | `x-forwarded-for`, sağdan 2. değer |

  Ters vekilin ilgili başlığı **kendisinin yazdığından** emin olun (nginx:
  `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`).
  `TRUST_PROXY` boş bırakılırsa hız sınırı kişi başına değil **site geneli**
  tek kovaya düşer: meşru kullanım kesilmez ama sınır kabalaşır ve talep
  kaydındaki IP alanı "doğrulanmadı" yazar.
- **Gövde boyutu sınırını vekilde de kurun**: nginx `client_max_body_size 32k;`
  veya Caddy `request_body { max_size 32KB }`. Uygulama katmanı zaten
  `413` döner (calc 4 KB, başvuru 16 KB, rapor 8 KB), ama isteğin vekilde
  kesilmesi daha ucuzdur.
- `LEAD_LOG_DIR` kullanacaksanız dizini web kökünün dışında tutun, izinleri
  daraltın (`chmod 700`), yedek ve imha politikasına dahil edin: içinde
  kişisel veri vardır.
- HSTS başlığı `next.config.ts` içinde tanımlıdır; alan adında geçerli bir
  sertifika olmadan yayına almayın.

---

## Mimari notlar

**Hesaplama motoru neden sunucuda?**
`lib/engine.ts` `server-only` ile işaretlidir ve istemciye hiç gönderilmez.
Katsayı tablosu (sektör çarpanları, kayıp payları, tavan eğrisi) şirketin
varlığıdır: bugün sektör varsayımıdır, benchmark havuzu doldukça gerçek
değerlerle değiştirilecektir. Tarayıcıya konulan bir formül, kopyalanabilir bir
formüldür. Bu yüzden test girdileri `POST /api/atil-kapasite` ile gönderilir,
geriye yalnızca sonuç döner.

**Formül neden sürümlü?**
`FORMULA_VERSION` sabiti her hesabın çıktısında yer alır (hem `quick` hem
`full` yanıtında) ve rapor talebi kaydıyla birlikte saklanır. Sonuca bağlı
ücretlendirmede tartışmayı bitiren tek teknik tedbir budur (Mimari-Plan §4.4):
bir müşterinin **baz dönemi hangi formül sürümüyle hesaplandıysa,
sonuç ölçümü de aynı sürümle yapılır.** Formül güncellemesi geçmişe uygulanmaz.
Katsayılar değiştiğinde sürüm numarası yükseltilir, eski hesaplar olduğu gibi
kalır.

**Doğrulama iki taraflıdır.**
`lib/validation.ts` şemaları istemci ve sunucu tarafından paylaşılır, ancak
istemci doğrulaması yalnızca erken geri bildirim içindir; **sunucu her isteği
yeniden doğrular.** Formlarda ayrıca görünmez bir bot tuzağı alanı (`website`)
bulunur.

**Üçüncü taraf yoktur.**
Sitede analitik, reklam pikseli veya izleme çerezi yoktur — Google Analytics
dahil. `next.config.ts` içindeki CSP `default-src 'self'` ile bunu teknik olarak
da kapatır. Yazı tipleri (Baloo 2, Figtree) `next/font/google` ile **derleme
sırasında** indirilip kendi alan adımızdan servis edilir; ziyaretçinin
tarayıcısından Google Fonts'a istek gitmez (`font-src 'self' data:`). Yalnızca
teknik olarak zorunlu çerez / yerel depolama kullanılabilir; sitede çerez onay
banner'ı veya çerez tercih merkezi **yoktur** ve `/cerez-politikasi` sayfası
bunun gerekçesini açıklar.

**Mimari-Plan'dan sapma.**
Mimari-Plan §4.3 ön yüz için Tailwind öneriyordu; uygulamada düz CSS tercih
edildi. Sitede tek bir stil bağımlılığı yoktur, tüm tasarım dizgesi
`app/globals.css` içindeki CSS değişkenleriyle kurulur.

**Hizmetin veri mimarisi (müşteri projeleri).**
Sitenin kendi topladığı veriden ayrıdır ve
`/gizlilik-ve-veri-guvenligi` sayfasında anlatılır: müşteri veri sorumlusu,
Verimx7 veri işleyendir ve yazılı veri işleyen sözleşmesi zorunludur. Analiz
birim/rol bazında toplulaştırılmış veriyle yapılır; kişi bazlı kimlik hiçbir
tabloda tutulmaz, en küçük tanecik roldür ve rol seviyesinde takma ad
kullanılır. Kişi bazlı performans izleme yapılmaz — talep gelse dahi ürün
kapsamı dışıdır.

---

## Bilinen sınırlar

- **Hız sınırlayıcı bellek içidir.** `lib/ratelimit.ts` sayaçları süreç
  belleğinde tutar; her örnek (instance) kendi sayacına bakar. Tek sunucuda
  yeterlidir, çok örnekli veya sunucusuz dağıtımda mutlak bir tavan değil kaba
  bir kötüye kullanım frenidir. Trafik arttığında Upstash/Redis gibi paylaşımlı
  bir sayaca geçilmelidir.
- **Kalıcı veritabanı yoktur.** Talepler e-posta / webhook / dosya kanallarına
  iletilir; site bir depoya yazmaz. Mimari-Plan §4.3'te (Faz 2) sayılan
  Postgres + CRM'e otomatik kayıt kalemi henüz yapılmadı.
- **PDF rapor üretimi yoktur.** `/api/rapor` şu an talebi ilgili kanallara
  iletir; rapor elle hazırlanıp gönderilir. Şablondan otomatik PDF üretimi
  Mimari-Plan §4.4 uyarınca **Faz 3** kapsamındadır.
- **CRM entegrasyonu genel amaçlı bir webhook'tan ibarettir.** Fırsat takibi,
  aşama yönetimi ve iki yönlü senkron Faz 2/3 işidir.
- **`/pano` örnek veriyle çalışır.** Canlı müşteri panosu Mimari-Plan §4.5
  uyarınca **Faz 4** kapsamındadır.
- **Test katsayıları sektör varsayımıdır.** Bir sektör–ölçek hücresinde en az
  beş farklı müşteri birikmeden benchmark değeri yayımlanmaz; katsayılar o
  zamana kadar varsayım olarak kalır ve sonuçlar "tahmin" olarak sunulmalıdır.

---

## İletişim

- E-posta: **bilgi@girisimciturk.com**
- WhatsApp: **+90 544 694 32 78** — <https://wa.me/905446943278>
- Ankara: +90 850 241 70 00 · İstanbul: +90 212 963 70 00 · Boston: +1 617 833 1218

İlgili siteler: [girisimciturk.com](https://girisimciturk.com) ·
[depremtek.market](https://depremtek.market)
