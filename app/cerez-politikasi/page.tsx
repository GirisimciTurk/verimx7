import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL, ROUTES, CONTACT, PARENT_LEGAL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "Bu sitede üçüncü taraf analitik, reklam pikseli veya izleme çerezi yoktur. Kullanılabilecek zorunlu teknolojiler, onay banner’ının neden bulunmadığı ve tarayıcı ayarları.",
  alternates: { canonical: `${SITE_URL}${ROUTES.cookies}` },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <SiteNav />

      <main id="icerik">
        <article className="prose">
          <p className="meta">Son güncelleme: 3 Eylül 2026 · Sürüm 1.0</p>

          <h1>Çerez Politikası</h1>

          <p className="lead">
            {
              "Bu metin, Verimx7 tanıtım sitesinde hangi çerezlerin ve benzeri teknolojilerin kullanıldığını, neden kullanıldığını ve bunları nasıl yönetebileceğinizi açıklar. Kısa cevap: bu sitede üçüncü taraf analitik aracı, reklam pikseli veya izleme çerezi yoktur."
            }
          </p>

          {/* ── yayın öncesi tamamlanacak alanlar ─────────────────────── */}
          <aside className="card">
            <span className="card-kicker">Uyarı — yayın öncesi tamamlanacak</span>
            <p className="card-title">Bu metinde doldurulmayı bekleyen alanlar var</p>
            <p className="card-body">
              {
                "Aşağıdaki künye ve başvuru bilgileri henüz kesinleşmediği için yer tutucu olarak bırakılmıştır. Site yayına alınmadan önce bu alanlar gerçek bilgilerle doldurulacaktır."
              }
            </p>
            <ul>
              <li>
                <strong className="tag tag-accent">
                  [DOLDURULACAK: veri sorumlusunun tam ticari unvanı]
                </strong>
              </li>
              <li>
                <strong className="tag tag-accent">
                  [DOLDURULACAK: Veri Sorumluları Sicili (VERBİS) kayıt durumu ve varsa sicil
                  numarası]
                </strong>
              </li>
              <li>
                <strong className="tag tag-accent">
                  [DOLDURULACAK: MERSİS numarası, vergi dairesi ve vergi numarası]
                </strong>
              </li>
              <li>
                <strong className="tag tag-accent">
                  [DOLDURULACAK: yazılı başvuru için açık adres]
                </strong>
              </li>
              <li>
                <strong className="tag tag-accent">[DOLDURULACAK: KEP adresi]</strong>
              </li>
              <li>
                <strong className="tag tag-accent">
                  [DOLDURULACAK: ilgili kişi başvuruları için resmi e-posta adresi]
                </strong>
              </li>
              <li>
                <strong className="tag tag-accent">
                  [DOLDURULACAK: barındırma (hosting) sağlayıcısının unvanı ve sunucu konumu]
                </strong>
              </li>
            </ul>
          </aside>

          {/* ── 1 ─────────────────────────────────────────────────────── */}
          <h2>1. Çerez nedir, benzer teknolojiler nedir?</h2>

          <p>
            {
              "Çerez (cookie), ziyaret ettiğiniz bir web sitesinin tarayıcınız aracılığıyla cihazınıza kaydettiği küçük bir metin dosyasıdır. Tarayıcı, aynı siteye yaptığınız sonraki isteklerde bu dosyayı geri gönderir. Böylece site, isteğin daha önce hangi oturuma ait olduğunu anlayabilir."
            }
          </p>

          <p>
            {
              "Çerezler süresine göre ikiye ayrılır: oturum çerezleri tarayıcı kapatıldığında silinir, kalıcı çerezler belirlenen süre boyunca cihazda kalır. Kaynağına göre de ikiye ayrılır: birinci taraf çerezler ziyaret ettiğiniz alan adı tarafından, üçüncü taraf çerezler ise başka bir alan adı (reklam ağı, analitik sağlayıcı vb.) tarafından yerleştirilir."
            }
          </p>

          <p>
            {
              "Çerezlere benzer işlev gören başka tarayıcı teknolojileri de vardır. Bunların en yaygın ikisi şunlardır:"
            }
          </p>

          <ul>
            <li>
              <strong>localStorage:</strong>{" "}
              {
                "Verinin tarayıcıda kalıcı olarak saklandığı alandır. Siz silene ya da tarayıcı verilerini temizleyene kadar durur. Çerezlerin aksine her istekte otomatik olarak sunucuya gönderilmez; yalnızca sayfadaki kod okuduğunda kullanılır."
              }
            </li>
            <li>
              <strong>sessionStorage:</strong>{" "}
              {
                "Aynı mantıkla çalışır, ancak veri yalnızca o sekme açık kaldığı sürece durur. Sekme kapatıldığında silinir ve o da her istekte sunucuya gönderilmez."
              }
            </li>
          </ul>

          <p>
            {
              "Bu politikada “çerez” dediğimizde, aksi belirtilmedikçe bu benzer teknolojileri de kastediyoruz. Kişisel Verileri Koruma Kurumunun yayımladığı Çerez Uygulamaları Hakkında Rehber de bu teknolojileri aynı çerçevede değerlendirir."
            }
          </p>

          {/* ── 2 ─────────────────────────────────────────────────────── */}
          <h2>2. Bu sitede kullanılan teknolojiler</h2>

          <p>
            {
              "Aşağıdaki tablo, bu sitede kullanılabilecek teknolojilerin tamamıdır. Listede olmayan hiçbir çerez veya izleme teknolojisi kullanılmaz. Satırlardaki “kullanılması hâlinde” ve “varsa” ifadeleri şu anlama gelir: bu teknolojiler sürekli var olan, her ziyarette mutlaka çalışan unsurlar değildir. Yalnızca ilgili işlev devreye girdiğinde (örneğin bir form gönderdiğinizde) veya barındırma altyapısı gerektirdiğinde ortaya çıkarlar. Kapsamı dar tutmak yerine olabilecek en geniş hâliyle yazdık; böylece tablo, gerçekte kullanılandan az değil çok şeyi kapsar."
            }
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Ad</th>
                  <th scope="col">Tür</th>
                  <th scope="col">Amaç</th>
                  <th scope="col">Süre</th>
                  <th scope="col">Taraf</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Oturum ve güvenlik çerezi (kullanılması hâlinde)</td>
                  <td>Teknik olarak zorunlu çerez</td>
                  <td>
                    {
                      "Form gönderimlerinde isteğin bütünlüğünü doğrulamak ve oturumun güvenliğini sağlamak."
                    }
                  </td>
                  <td>Oturum süresi — tarayıcı kapatıldığında silinir</td>
                  <td>Birinci taraf (site alan adı) · Üçüncü taraf: hayır</td>
                </tr>
                <tr>
                  <td>Barındırma altyapısının yönlendirme / yük dengeleme çerezi (varsa)</td>
                  <td>Teknik olarak zorunlu çerez</td>
                  <td>
                    {
                      "İsteğin doğru sunucuya yönlendirilmesi ve sayfanın kesintisiz sunulması. İçerik okunmaz, davranış izlenmez."
                    }
                  </td>
                  <td>Oturum süresi veya kısa süreli</td>
                  <td>
                    {
                      "Site alan adı altında, barındırma sağlayıcısının altyapısı tarafından · Üçüncü taraf: hayır (pazarlama veya analitik amacı yoktur)"
                    }
                  </td>
                </tr>
                <tr>
                  <td>Atıl Kapasite Testi yanıtları (kullanılması hâlinde)</td>
                  <td>Yerel depolama (localStorage / sessionStorage)</td>
                  <td>
                    {
                      "Testteki 12 sorunun yanıtlarının sayfa yenilendiğinde veya sekme yanlışlıkla kapatıldığında kaybolmaması. Bu kopya tarayıcınızda kalır; çerez olarak sunucuya gönderilmez."
                    }
                  </td>
                  <td>
                    {
                      "sessionStorage kullanıldığında sekme kapanınca; localStorage kullanıldığında siz tarayıcı verilerini temizleyene kadar"
                    }
                  </td>
                  <td>Birinci taraf · Üçüncü taraf: hayır</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            {
              "Yerel depolama satırıyla ilgili bir noktayı açıkça belirtelim: Atıl Kapasite Testinin hesaplama motoru tarayıcınızda değil sunucuda çalışır. Bu nedenle test sırasında verdiğiniz yanıtlar, sonucu hesaplamak üzere sunucuya gönderilir. Bu istekler kayda geçirilmez; girdiler yalnızca hesap için kullanılır ve yanıt döndükten sonra saklanmaz. Yanıtlarınız ancak siz e-posta adresinizi bırakıp ayrıntılı rapor talep ederseniz kaydedilir. Yukarıdaki yerel depolama satırı, bu gönderimden ayrı olarak, yanıtların tarayıcınızda tutulan kopyasıyla ilgilidir."
            }
          </p>

          <h3>Bu sitede bulunmayanlar</h3>

          <p>
            {
              "Aşağıdakiler bilinçli olarak kullanılmamaktadır ve yukarıdaki tabloda yer almamalarının sebebi budur:"
            }
          </p>

          <ul>
            <li>
              {
                "Üçüncü taraf analitik araçları. Google Analytics dâhil hiçbir analitik hizmeti bu sitede kurulu değildir."
              }
            </li>
            <li>{"Reklam pikselleri, dönüşüm etiketleri ve yeniden pazarlama kodları."}</li>
            <li>{"Sosyal medya takip eklentileri ve gömülü izleyiciler."}</li>
            <li>
              {
                "Profilleme, davranışsal reklam veya siteler arası izleme amacıyla kullanılan çerezler."
              }
            </li>
            <li>
              {
                "Tarayıcıdan üçüncü taraflara giden yazı tipi istekleri. Sitede kullanılan Baloo 2 ve Figtree yazı tipleri kendi sunucumuzdan servis edilir; tarayıcınız Google Fonts’a veya başka bir yazı tipi sağlayıcısına istek göndermez."
              }
            </li>
          </ul>

          <p>
            {
              "Bu liste yalnızca bir taahhüt değildir; teknik olarak da uygulanır. Site, her yanıtta bir İçerik Güvenliği Politikası (CSP) başlığı gönderir ve bu başlık varsayılan olarak yalnızca kendi alan adımızdan kaynak yüklenmesine izin verir. Dışarıdan bir izleme kodu, piksel veya yazı tipi eklense bile tarayıcınız onu yüklemeyi reddeder."
            }
          </p>

          <h3>Bu sitede kullanılan teknolojilerin hukuki dayanağı</h3>

          <p>
            {
              "Tabloda yer alan teknolojiler, sitenin talep ettiğiniz işlevi yerine getirebilmesi için gereklidir. Bu nedenle 6698 sayılı Kişisel Verilerin Korunması Kanunu m.5/2-c (bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması) ve m.5/2-f (ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati) kapsamında, açık rızaya dayanmadan işlenir. Bu kapsamdaki verilerin güvenliği KVKK m.12 uyarınca alınan teknik ve idari tedbirlerle korunur."
            }
          </p>

          <p>
            {
              "Not: Formları gönderdiğinizde IP adresi, tarayıcı bilgisi (user-agent), yönlendiren adres (referer) ve zaman damgası sunucu tarafında kaydedilir. Bunlar çerez değildir; her HTTP isteğinin doğal parçasıdır ve güvenlik ile kötüye kullanımın önlenmesi amacıyla tutulur. Aynı şekilde, kısa sürede gönderilen aşırı sayıda isteği frenleyen sınırlama da çerezle değil IP adresi üzerinden çalışır ve bu sayaç yalnızca sunucu belleğinde geçici olarak tutulur. Bu konudaki ayrıntılar KVKK aydınlatma metnindedir."
            }
          </p>

          {/* ── 3 ─────────────────────────────────────────────────────── */}
          <h2>3. Neden bir çerez onay banner’ı görmüyorsunuz?</h2>

          <p>
            {
              "Açık rıza, yalnızca zorunlu olmayan çerezler için gerekir: analitik, reklam, profilleme ve izleme çerezleri bu gruba girer. Bu sitede bu türden hiçbir çerez bulunmadığı için, onayınızı isteyecek bir şey de yoktur."
            }
          </p>

          <p>
            {
              "Bu bilinçli bir tercihtir ve sırası önemlidir: onay penceresi göstermemek için izlemeyi gizlemiyoruz; izleme yapmadığımız için gösterilecek bir onay penceresi yok. Sizden rıza almadan çalıştırdığımız hiçbir izleme teknolojisi yoktur; “kabul et” demeden kapatamayacağınız bir katman da yoktur. Bu yüzden sitede bir çerez tercih merkezi arayüzü de bulunmamaktadır — yönetilecek isteğe bağlı bir çerez olmadığı için böyle bir arayüz gerçek bir seçim sunmaz, yalnızca seçim sunuyormuş görüntüsü verirdi."
            }
          </p>

          <p>
            <strong>Taahhüdümüz:</strong>{" "}
            {
              "İleride analitik, reklam veya başka bir izleme teknolojisi eklenirse, bu teknolojiler devreye alınmadan önce (i) bu sayfa güncellenir ve tablo genişletilir, (ii) açık rıza toplayan bir onay mekanizması kurulur, (iii) siz onay verene kadar ilgili çerezler yüklenmez ve çalışmaz, (iv) verdiğiniz onayı aynı kolaylıkla geri alabileceğiniz bir yol sunulur. Reddetmeniz hâlinde sitenin işlevleri kullanılabilir olmaya devam eder."
            }
          </p>

          <p>
            {
              "İzleme yapmadığımız için, tarayıcınızın gönderdiği “Do Not Track” veya benzeri izleme reddi sinyallerinin bu sitede değiştireceği bir davranış da yoktur."
            }
          </p>

          {/* ── 4 ─────────────────────────────────────────────────────── */}
          <h2>4. Tarayıcınızdan çerezleri ve site verilerini yönetme</h2>

          <p>
            {
              "Çerezleri ve yerel depolamayı her zaman tarayıcınızdan yönetebilirsiniz. Aşağıda yaygın tarayıcılardaki menü yollarını tarif ediyoruz. Tarayıcı sürümüne göre menü adları küçük farklılıklar gösterebilir; bu nedenle dış bağlantı vermek yerine izlenecek yolu yazdık."
            }
          </p>

          <h3>Google Chrome (masaüstü)</h3>
          <p>
            {
              "Sağ üstteki üç nokta menüsü → Ayarlar → Gizlilik ve güvenlik. Buradan “Üçüncü taraf çerezleri” bölümünde çerez davranışını belirleyebilir, “Tarama verilerini temizle” ile mevcut çerezleri ve site verilerini silebilirsiniz. Yalnızca bu siteye ait veriyi silmek için: Gizlilik ve güvenlik → Site ayarları → Sayfada depolanan veriler bölümünden site alan adını bulup kaldırın. Android ve iOS uygulamalarında aynı seçenekler üç nokta menüsü → Ayarlar → Gizlilik ve güvenlik altındadır."
            }
          </p>

          <h3>Safari</h3>
          <p>
            {
              "macOS’ta: menü çubuğundan Safari → Ayarlar (eski sürümlerde Tercihler) → Gizlilik. Buradan “Web sitesi verilerini yönet” ile alan adı bazında silme yapabilir, çerez engelleme seçeneklerini belirleyebilirsiniz. iPhone ve iPad’de: Ayarlar uygulaması → Safari → “Geçmişi ve web sitesi verilerini sil”; alan adı bazında silmek için Safari → Gelişmiş → Web sitesi verileri."
            }
          </p>

          <h3>Mozilla Firefox</h3>
          <p>
            {
              "Sağ üstteki menü → Ayarlar → Gizlilik ve Güvenlik. “Çerezler ve Site Verileri” bölümünden “Verileri Temizle” ile silebilir, “Verileri Yönet” ile yalnızca belirli bir alan adına ait kayıtları kaldırabilirsiniz. Aynı bölümdeki Gelişmiş İzlenme Koruması ayarları ile çerez engelleme düzeyini de seçebilirsiniz."
            }
          </p>

          <h3>Microsoft Edge</h3>
          <p>
            {
              "Sağ üstteki üç nokta menüsü → Ayarlar → Çerezler ve site izinleri → “Çerezleri ve site verilerini yönetme ve silme”. Buradan “Tüm çerezleri ve site verilerini gör” seçeneğiyle alan adı bazında silme yapabilirsiniz. Toplu temizlik için Ayarlar → Gizlilik, arama ve hizmetler → “Tarama verilerini temizle”."
            }
          </p>

          <p>
            {
              "İki noktayı hatırlatalım: (1) Site verilerini sildiğinizde, Atıl Kapasite Testine verdiğiniz yanıtların tarayıcınızda tutulan kopyası varsa o da silinir ve teste baştan başlamanız gerekir. (2) Teknik olarak zorunlu çerezleri tamamen engellerseniz form gönderimi gibi bazı işlevler çalışmayabilir. Tarayıcınızı gizli / özel pencere modunda kullanmak da bu verilerin pencere kapandığında silinmesini sağlar."
            }
          </p>

          {/* ── 5 ─────────────────────────────────────────────────────── */}
          <h2>5. Bu politikada değişiklik</h2>

          <p>
            {
              "Bu sayfayı, sitede kullanılan teknolojiler değiştiğinde güncelleriz. Her güncellemede sayfanın en üstündeki tarih ve sürüm numarası da değişir; böylece hangi metni okuduğunuzu takip edebilirsiniz."
            }
          </p>

          <ul>
            <li>
              {
                "Yazım düzeltmesi veya açıklama iyileştirmesi gibi esasa ilişkin olmayan değişiklikler için sürümün ara numarası artırılır (örneğin 1.0 → 1.1)."
              }
            </li>
            <li>
              {
                "Yeni bir çerez veya benzeri teknoloji eklenmesi, mevcut birinin amacının değişmesi ya da saklama süresinin uzaması gibi esasa ilişkin değişikliklerde ana sürüm numarası artırılır (örneğin 1.x → 2.0)."
              }
            </li>
            <li>
              {
                "Açık rıza gerektiren bir çerez eklenirse, değişiklik yürürlüğe girmeden önce onay mekanizması devreye alınır ve rızanız alınmadan ilgili çerez çalıştırılmaz."
              }
            </li>
          </ul>

          <p>
            {
              "Geçmiş sürümlerin tarihçesi bu sayfada tutulur. Yürürlükteki metin her zaman bu adreste yayımlanan güncel metindir."
            }
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Sürüm</th>
                  <th scope="col">Tarih</th>
                  <th scope="col">Değişiklik</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.0</td>
                  <td>3 Eylül 2026</td>
                  <td>İlk yayım.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── 6 ─────────────────────────────────────────────────────── */}
          <h2>6. İletişim</h2>

          <p>
            {
              "Bu politikayla ilgili sorularınız için bize ulaşabilirsiniz. Yalnızca çerezlere ilişkin bir sorunuz varsa aşağıdaki kanallar yeterlidir:"
            }
          </p>

          <ul>
            <li>
              E-posta: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              WhatsApp:{" "}
              <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                {CONTACT.whatsappNumber}
              </a>
            </li>
            {CONTACT.offices.map((office) => (
              <li key={office.city}>
                {office.city}: <a href={office.href}>{office.phone}</a>
              </li>
            ))}
          </ul>

          <p>
            {
              "6698 sayılı Kanun m.11 kapsamındaki haklarınızı kullanmak için yapacağınız resmi başvurular ise, KVKK aydınlatma metninde belirtilen usule göre aşağıdaki kanala iletilmelidir:"
            }
          </p>

          <ul>
            <li>
              <strong className="tag tag-accent">
                [DOLDURULACAK: ilgili kişi başvuruları için resmi e-posta adresi]
              </strong>
            </li>
            <li>
              <strong className="tag tag-accent">
                [DOLDURULACAK: yazılı başvuru için açık adres]
              </strong>
            </li>
            <li>
              <strong className="tag tag-accent">
                [DOLDURULACAK: KEP adresi]
              </strong>
            </li>
          </ul>

          <p className="text-muted">
            {`Bu site bir ${PARENT_LEGAL} iştirakidir.`}
          </p>

          <hr className="hr" />

          <p>
            {
              "Kişisel verilerinizin hangi amaçlarla işlendiğini, kimlere aktarıldığını, ne kadar süreyle saklandığını ve KVKK m.11 kapsamındaki haklarınızı ayrıntılı olarak aydınlatma metninde bulabilirsiniz."
            }
          </p>

          <p>
            <Link className="btn btn-primary" href={ROUTES.kvkk}>
              KVKK Aydınlatma Metni
            </Link>{" "}
            <Link className="btn btn-secondary" href={ROUTES.privacy}>
              Gizlilik ve Veri Güvenliği
            </Link>
          </p>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
