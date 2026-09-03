import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL, ROUTES, CONTACT, BRAND, PARENT_LEGAL } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Verimx7 KVKK aydınlatma metni: web formlarında toplanan kişisel veriler, işleme amaçları, hukuki sebepler, saklama süreleri, aktarım ve KVKK m.11 hakları.",
  alternates: { canonical: `${SITE_URL}${ROUTES.kvkk}` },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <SiteNav />

      <main id="icerik">
        <article className="prose">
          <p className="meta">Son güncelleme: 3 Eylül 2026 · Sürüm 1.0</p>

          <div className="card">
            <p className="card-kicker">Yayın öncesi tamamlanacak</p>
            <h2 className="card-title">Bu metinde doldurulmayı bekleyen alanlar var</h2>
            <p className="card-body">
              Aşağıdaki metinde{" "}
              <strong className="tag tag-accent">[DOLDURULACAK: ...]</strong> biçiminde işaretlenmiş
              yerler bulunmaktadır. Bunlar; veri sorumlusunun tam ticari unvanı, sicil ve adres
              bilgileri, resmî başvuru kanalları, site formu kayıtlarının kesin saklama süreleri ve
              yurt dışına aktarımda kullanılacak hizmet sağlayıcıların nihai listesi gibi, yayın
              anında kesinleşmesi gereken bilgilerdir.
              Bu alanlar doldurulmadan metin, {"6698 sayılı Kanun'un"} m.10 kapsamındaki aydınlatma
              yükümlülüğünü tam olarak karşılamaz.
            </p>
          </div>

          <h1>KVKK Aydınlatma Metni</h1>

          <p className="lead">
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu {"(“KVKK”)"} m.10 ve
            Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ
            uyarınca, bu internet sitesini ziyaret eden ve sitedeki formlar aracılığıyla bizimle
            iletişime geçen kişileri bilgilendirmek amacıyla hazırlanmıştır.
          </p>

          <p>
            Metin iki farklı ilişkiyi ayrı ayrı ele alır: (1) bu sitedeki formlar üzerinden
            topladığımız kişisel veriler — bu verilerde <strong>veri sorumlusu biziz</strong>; (2)
            müşteri kurumlarla yürüttüğümüz Organizasyonel Verimetri projelerinde işlenen veriler —
            bu verilerde veri sorumlusu <strong>müşteri kurumdur</strong>, {BRAND} ise{" "}
            <strong>veri işleyen</strong> sıfatıyla hareket eder.
          </p>

          <h2>1. Veri sorumlusunun kimliği</h2>

          <p>
            KVKK m.3 uyarınca veri sorumlusu, kişisel verilerin işleme amaçlarını ve vasıtalarını
            belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek
            veya tüzel kişidir. Bu site üzerinden toplanan kişisel veriler bakımından veri
            sorumlusu aşağıdaki tüzel kişidir.
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Bilgi</th>
                  <th>İçerik</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Marka</td>
                  <td>{BRAND} — Organizasyonel Verimetri</td>
                </tr>
                <tr>
                  <td>Tam ticari unvan</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: veri sorumlusunun tam ticari unvanı]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>VERBİS kaydı</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: Veri Sorumluları Sicil Bilgi Sistemi (VERBİS) kayıt durumu ve
                      varsa sicil numarası]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>MERSİS / vergi numarası</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: MERSİS numarası, vergi dairesi ve vergi numarası]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Açık adres</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: tebligata esas açık adres]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>KEP adresi</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: kayıtlı elektronik posta (KEP) adresi]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Başvuru e-postası</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: KVKK başvuruları için kullanılacak resmî e-posta adresi]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Genel iletişim</td>
                  <td>
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{" "}
                    <a href={CONTACT.whatsappHref} rel="noopener noreferrer" target="_blank">
                      WhatsApp {CONTACT.whatsappNumber}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Ofisler</td>
                  <td>
                    {CONTACT.offices.map((o) => `${o.city} ${o.phone}`).join(" · ")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-muted">
            Bu site bir {PARENT_LEGAL} iştirakidir. Genel iletişim kanalları bilgi almak için
            kullanılabilir; ancak KVKK m.11 kapsamındaki resmî başvurular için 12.1. bölümde
            belirtilen usule uyulması gerekir.
          </p>

          <h2>2. İşlenen kişisel veri kategorileri</h2>

          <p>
            Bu sitede yalnızca aşağıda sayılan veriler işlenir; gizli bir profil çıkarımı, üçüncü
            taraf veri zenginleştirmesi veya reklam kimliği eşleştirmesi yapılmaz. Formlarda,
            aşağıda sayılanların dışında sizden bilgi isteyen bir alan bulunmaz. Bunun tek
            istisnası, otomatik gönderimleri elemek için kullanılan ve ekranda görünmeyen bot
            tuzağı alanıdır: gerçek kullanıcılar bu alanı görmez ve dolduramaz, bu nedenle kişisel
            veri içermez; dolu geldiğinde gönderim kayıt oluşturulmadan elenir.
          </p>

          <h3>2.1. Değerlendirme başvurusu formu</h3>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Veri kategorisi</th>
                  <th>İşlenen veriler</th>
                  <th>Kaynak</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kimlik</td>
                  <td>Ad ve soyad</td>
                  <td>Formu dolduran kişi</td>
                </tr>
                <tr>
                  <td>İletişim</td>
                  <td>Telefon numarası, e-posta adresi</td>
                  <td>Formu dolduran kişi</td>
                </tr>
                <tr>
                  <td>Mesleki deneyim</td>
                  <td>
                    Kurum / şirket adı (kişinin çalıştığı veya temsil ettiği kurumu göstermesi
                    ölçüsünde kişisel veri niteliği taşır)
                  </td>
                  <td>Formu dolduran kişi</td>
                </tr>
                <tr>
                  <td>Müşteri işlem</td>
                  <td>
                    Seçilen kaynak alanı (İnsan Kaynağı · Fiziksel Alan ve Bina · Makine ve Teçhizat
                    · Doğal ve Stratejik Kaynak · Teknoloji), serbest metin açıklama, aydınlatma
                    onayı kaydı, varsa ticari ileti izni kaydı, talep tarihi
                  </td>
                  <td>Formu dolduran kişi ve sistem kaydı</td>
                </tr>
                <tr>
                  <td>İşlem güvenliği</td>
                  <td>
                    IP adresi, tarayıcı bilgisi (user-agent), yönlendiren adres (referer), sunucu
                    zaman damgası ve teslim kayıtları
                  </td>
                  <td>Teknik olarak otomatik üretilir</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Serbest metin açıklama alanına yalnızca talebinizi anlamamız için gereken bilgileri
            yazmanızı rica ederiz. Bu alana sağlık verisi, ceza mahkûmiyeti bilgisi, sendika üyeliği
            gibi KVKK m.6 kapsamındaki <strong>özel nitelikli kişisel verileri</strong> ve üçüncü
            kişilere ait kimlik bilgilerini yazmayınız. Bu tür verileri talep etmiyoruz ve
            işlemiyoruz; sehven iletilmesi hâlinde ilgili kısım imha edilir.
          </p>

          <h3>2.2. Atıl Kapasite Testi</h3>

          <p>
            Atıl Kapasite Testi, girdileri sunucuda hesaplayıp sonucu tarayıcınıza geri döndüren bir
            hesaplama aracıdır. <strong>Test istekleri kaydedilmez ve saklanmaz.</strong> Test
            girdileri kimlik bilgisi içermez; on iki sorunun yanıtı olarak verilen çalışan sayısı,
            kişi başı ortalama maliyet, kurum tipi, onay katmanı sayısı ve toplantı yükü gibi
            kuruma ait işletme parametrelerinden oluşur. Testi ad, e-posta veya başka bir kimlik
            bilgisi vermeden tamamlayabilirsiniz. Ana sayfadaki hızlı tahmin aracı da aynı şekilde
            çalışır: çalışan sayısı, yıllık ciro ve kişi başı maliyet sunucuda hesaplanır, istek
            kaydedilmez.
          </p>

          <p>
            Hesaplama isteklerinde, kısa sürede gönderilen aşırı sayıda isteği frenlemek için IP
            adresi üzerinden çalışan bir sayaç tutulur. Bu sayaç yalnızca sunucu belleğinde ve
            geçici olarak durur; kalıcı bir kayda dönüşmez.
          </p>

          <h3>2.3. Ayrıntılı raporu e-posta ile alma</h3>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Veri kategorisi</th>
                  <th>İşlenen veriler</th>
                  <th>Kaynak</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>İletişim</td>
                  <td>Raporun gönderileceği e-posta adresi</td>
                  <td>Talebi ileten kişi</td>
                </tr>
                <tr>
                  <td>Müşteri işlem</td>
                  <td>
                    Rapora esas test girdileri, bu girdilerle hesaplanan sonuç, hesaplamada
                    kullanılan formül sürümü, aydınlatma onayı kaydı, talep tarihi ve gönderim
                    kaydı
                  </td>
                  <td>Talebi ileten kişi ve sistem kaydı</td>
                </tr>
                <tr>
                  <td>İşlem güvenliği</td>
                  <td>
                    IP adresi, tarayıcı bilgisi (user-agent), yönlendiren adres (referer), sunucu
                    zaman damgası
                  </td>
                  <td>Teknik olarak otomatik üretilir</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Testin kendisi kaydedilmezken, ayrıntılı rapor talebi kaydedilir: raporu size
            iletebilmek ve gönderdiğimizi ispatlayabilmek için e-posta adresiniz ile rapora esas
            girdilerin birlikte saklanması gerekir. Hesaplanan sonuç ve formül sürümü de aynı
            kayıtta tutulur; böylece formülün sonraki bir sürümü yayımlandığında size iletilen
            rakamın hangi sürümle üretildiği sonradan gösterilebilir.
          </p>

          <h2>3. Kişisel verilerin işlenme amaçları</h2>

          <ul>
            <li>
              <strong>Ön görüşme talebinin değerlendirilmesi:</strong> başvurunuzun alınması,
              kurumunuzun ve seçtiğiniz kaynak alanının kapsamımıza uygunluğunun incelenmesi,
              sizinle iletişime geçilerek ön görüşmenin planlanması.
            </li>
            <li>
              <strong>Teklif hazırlanması ve sözleşme öncesi süreç:</strong> talebinize uygun
              kapsam, süre ve bedelin belirlenmesi, teklifin iletilmesi, sorularınızın
              yanıtlanması.
            </li>
            <li>
              <strong>Ayrıntılı test raporunun iletilmesi:</strong> talep ettiğiniz raporun
              hesaplanarak bildirdiğiniz e-posta adresine gönderilmesi ve gönderimin
              doğrulanması.
            </li>
            <li>
              <strong>Form kötüye kullanımının önlenmesi ve bilgi güvenliği:</strong> otomatik
              (bot) gönderimlerin engellenmesi, istek hızının sınırlanması, spam ve kötüye
              kullanımın tespiti, sistem ve ağ güvenliğinin sağlanması.
            </li>
            <li>
              <strong>Kayıtların ispat amacıyla saklanması:</strong> talep, onay ve gönderim
              kayıtlarının, olası bir uyuşmazlıkta hakkın tesisi, kullanılması veya korunması için
              muhafazası.
            </li>
            <li>
              <strong>Hukuki yükümlülüklerin yerine getirilmesi:</strong> KVKK, ticari elektronik
              ileti mevzuatı ile vergi ve ticaret mevzuatından doğan yükümlülüklerin yerine
              getirilmesi, yetkili kamu kurum ve kuruluşlarının usulüne uygun taleplerinin
              karşılanması.
            </li>
            <li>
              <strong>Yalnızca açık rıza vermeniz hâlinde:</strong> tanıtım, bülten ve etkinlik
              duyurularının ticari elektronik ileti olarak gönderilmesi.
            </li>
          </ul>

          <p>
            Bu amaçların hiçbiri, kişi bazlı performans değerlendirmesi, profilleme veya otomatik
            karar verme içermez. Formunuzu bir yazılım tek başına değerlendirip sizin aleyhinize
            sonuç doğuracak bir karar üretmez; talepler bir insan tarafından incelenir.
          </p>

          <h2>4. İşleme amaçları ve hukuki sebepler</h2>

          <p>
            Her işleme faaliyeti, {"KVKK'nın"} 5. maddesinde sayılan şartlardan en az birine
            dayanır. Amaç ile hukuki sebep eşleşmesi aşağıdaki tabloda gösterilmiştir.
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>İşleme amacı</th>
                  <th>Veri kategorileri</th>
                  <th>Hukuki sebep (KVKK)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Başvurunun değerlendirilmesi, ön görüşmenin planlanması, teklif hazırlanması</td>
                  <td>Kimlik, İletişim, Mesleki deneyim, Müşteri işlem</td>
                  <td>
                    m.5/2-c — bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması
                  </td>
                </tr>
                <tr>
                  <td>Ayrıntılı test raporunun hazırlanıp e-posta ile iletilmesi</td>
                  <td>İletişim, Müşteri işlem</td>
                  <td>
                    m.5/2-c — sözleşmenin kurulmasıyla doğrudan doğruya ilgili olması (talep
                    ettiğiniz hizmetin ifası)
                  </td>
                </tr>
                <tr>
                  <td>
                    Form kötüye kullanımının önlenmesi, hız sınırlama, bot filtresi, sistem
                    güvenliği
                  </td>
                  <td>İşlem güvenliği</td>
                  <td>
                    m.5/2-f — ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla
                    veri sorumlusunun meşru menfaati
                  </td>
                </tr>
                <tr>
                  <td>
                    Talep, onay ve gönderim kayıtlarının uyuşmazlık ihtimaline karşı saklanması
                  </td>
                  <td>Kimlik, İletişim, Müşteri işlem, İşlem güvenliği</td>
                  <td>
                    m.5/2-e — bir hakkın tesisi, kullanılması veya korunması için veri işlemenin
                    zorunlu olması
                  </td>
                </tr>
                <tr>
                  <td>
                    Mevzuattan doğan saklama, bilgi verme ve yetkili kurum taleplerini karşılama
                    yükümlülükleri
                  </td>
                  <td>Kimlik, İletişim, Müşteri işlem, İşlem güvenliği</td>
                  <td>m.5/2-ç — veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi</td>
                </tr>
                <tr>
                  <td>Ticari elektronik ileti (bülten, tanıtım, etkinlik duyurusu) gönderimi</td>
                  <td>İletişim (ad soyad ve e-posta / telefon)</td>
                  <td>
                    m.5/1 — açık rıza; ayrıca 6563 sayılı Kanun kapsamında alınan onay
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Açık rızaya dayanan tek işleme faaliyeti ticari elektronik ileti gönderimidir. Diğer
            işlemeler açık rızaya değil, tabloda gösterilen kanuni şartlara dayanır; bu nedenle
            ticari ileti izni vermemeniz başvurunuzun değerlendirilmesini engellemez.
          </p>

          <h2>5. Kişisel verilerin toplanma yöntemi</h2>

          <p>
            Kişisel verileriniz, bu internet sitesindeki formlar aracılığıyla{" "}
            <strong>tamamen otomatik olmayan ya da kısmen otomatik yollarla, elektronik ortamda</strong>{" "}
            ve doğrudan sizden toplanır. Verileri siz girersiniz; sizden istemediğimiz hiçbir bilgi
            arka planda toplanmaz. Bunun tek istisnası, her HTTP isteğinde teknik olarak oluşan
            işlem güvenliği verileridir (IP adresi, tarayıcı bilgisi, yönlendiren adres, zaman
            damgası).
          </p>

          <p>
            Site üzerinde veri toplama üç noktada gerçekleşir: değerlendirme başvurusu formu,
            ayrıntılı rapor talebi formu ve —yalnızca kimlik bilgisi içermeyen teknik kayıt
            düzeyinde— sunucu güvenlik kayıtları. Bunların dışında, telefon, WhatsApp veya e-posta
            yoluyla bizimle doğrudan iletişime geçmeniz hâlinde, bu kanallarda paylaştığınız
            veriler de aynı amaçlar ve hukuki sebepler çerçevesinde işlenir.
          </p>

          <h2>6. Kişisel verilerin aktarımı</h2>

          <h3>6.1. Yurt içinde aktarım</h3>

          <p>
            Kişisel verileriniz üçüncü kişilere satılmaz, kiralanmaz ve pazarlama amacıyla
            paylaşılmaz. Aktarım yalnızca aşağıdaki hâllerde ve amaçla sınırlı olarak yapılır:
          </p>

          <ul>
            <li>
              <strong>Barındırma ve altyapı hizmeti sağlayıcıları:</strong> sitenin çalışması ve
              form isteklerinin işlenmesi için.
            </li>
            <li>
              <strong>E-posta gönderim hizmeti sağlayıcısı:</strong> başvuru bildirimlerinin ve
              talep ettiğiniz raporun iletilmesi için.
            </li>
            <li>
              <strong>Müşteri ilişkileri yönetimi (CRM) veya iş akışı sistemi:</strong> talebin
              kayda alınması ve takibi için.
            </li>
            <li>
              <strong>Hukuki ve mali danışmanlar, denetçiler:</strong> yalnızca gerektiği ölçüde ve
              sır saklama yükümlülüğü altında.
            </li>
            <li>
              <strong>Yetkili kamu kurum ve kuruluşları ile adli merciler:</strong> mevzuata uygun
              ve usulüne göre yapılmış talepler üzerine.
            </li>
          </ul>

          <p>
            Bu aktarımlar KVKK m.8 kapsamında, ilgili maddede aranan şartlar çerçevesinde yapılır.
            Hizmet sağlayıcılarla, veri işleyen sıfatıyla hareket ettiklerini ve talimatlarımız
            dışına çıkmayacaklarını düzenleyen yazılı sözleşmeler akdedilir.
          </p>

          <h3>6.2. Yurt dışına aktarım</h3>

          <p>
            Kullandığımız barındırma ve e-posta gönderim hizmetlerinin bir kısmı yurt dışında
            yerleşik sağlayıcılar tarafından sunulabilir. Bu durumda kişisel verileriniz yurt dışına
            aktarılmış olur ve aktarımın <strong>KVKK m.9</strong> kapsamında değerlendirilmesi
            zorunludur: aktarım, yeterlilik kararı bulunan bir ülkeye yapılması hâlinde doğrudan;
            yeterlilik kararı yoksa {"Kanun'da"} sayılan uygun güvencelerden birinin (bağlayıcı
            şirket kuralları, standart sözleşme, taahhütname vb.) sağlanması hâlinde; bunlar da
            yoksa yalnızca {"Kanun'un"} öngördüğü arızi hâller çerçevesinde yapılabilir. Bağlayıcı
            şirket kuralları ve taahhütname için Kurul onayı aranır; standart sözleşme ise
            imzalanmasından itibaren beş iş günü içinde Kişisel Verileri Koruma Kurumuna
            bildirilir.
          </p>

          <p>
            <strong className="tag tag-accent">
              [DOLDURULACAK: kullanılacak barındırma ve e-posta gönderim sağlayıcılarının unvanları,
              sunucu lokasyonları, aktarımın KVKK m.9 kapsamındaki hukuki dayanağı (yeterlilik
              kararı / standart sözleşme / diğer uygun güvence) ve varsa Kuruma bildirim durumu]
            </strong>
          </p>

          <p className="text-muted">
            Bu bilgi yayın öncesinde netleştirilecek ve bu bölüm sağlayıcı adları ile birlikte
            güncellenecektir. Yurt dışına aktarım yapılmayacaksa bu bölüm buna göre
            düzeltilecektir.
          </p>

          <h2>7. Saklama süreleri</h2>

          <p>
            Kişisel verileriniz, işlendikleri amaç için gerekli olan süre boyunca ve ilgili
            mevzuatta öngörülen asgari sürelerden az olmamak üzere saklanır. Sürenin sona ermesi
            veya işleme sebeplerinin ortadan kalkması hâlinde veriler, KVKK m.7 uyarınca silinir,
            yok edilir veya anonim hâle getirilir ve gerektiğinde imha tutanağı düzenlenir.
          </p>

          <h3>7.1. Site formları üzerinden toplanan veriler</h3>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Veri</th>
                  <th>Saklama süresi</th>
                  <th>Gerekçe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Değerlendirme başvurusu kayıtları</td>
                  <td>Talebin sonuçlanmasından itibaren 2 yıl</td>
                  <td>Talebin takibi, tekrar başvurularda süreklilik, ispat</td>
                </tr>
                <tr>
                  <td>Sözleşme kurulması hâlinde ilgili kayıtlar</td>
                  <td>
                    Sözleşme ilişkisinin sona ermesinden itibaren ilgili mevzuattaki zamanaşımı ve
                    saklama süreleri boyunca
                  </td>
                  <td>
                    Türk Ticaret Kanunu, Vergi Usul Kanunu ve Türk Borçlar Kanunu kaynaklı saklama
                    ve ispat yükümlülükleri
                  </td>
                </tr>
                <tr>
                  <td>Ayrıntılı rapor talepleri (e-posta + test girdileri)</td>
                  <td>Raporun iletilmesinden itibaren 2 yıl</td>
                  <td>Gönderimin ispatı, tekrar taleplerin karşılanması</td>
                </tr>
                <tr>
                  <td>Aydınlatma onayı kayıtları</td>
                  <td>İlgili talep kaydı ile aynı süre</td>
                  <td>Aydınlatma yükümlülüğünün yerine getirildiğinin ispatı</td>
                </tr>
                <tr>
                  <td>Ticari elektronik ileti onay kayıtları</td>
                  <td>Onayın geçerliliğini yitirmesinden itibaren 3 yıl</td>
                  <td>
                    Ticari İletişim ve Ticari Elektronik İletiler Hakkında Yönetmelik uyarınca onay
                    kayıtlarının saklanması
                  </td>
                </tr>
                <tr>
                  <td>
                    Sunucu ve altyapı güvenlik kayıtları (IP, user-agent, referer, zaman damgası)
                  </td>
                  <td>Kayıt tarihinden itibaren 1 yıl</td>
                  <td>Kötüye kullanımın tespiti ve bilgi güvenliği</td>
                </tr>
                <tr>
                  <td>Atıl Kapasite Testi istekleri</td>
                  <td>Saklanmaz</td>
                  <td>Hesaplama yapılır, sonuç döndürülür, istek kaydedilmez</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Bir form gönderimine iliştirilen teknik kayıt (IP adresi, tarayıcı bilgisi, yönlendiren
            adres ve zaman damgası) o talep kaydının ayrılmaz parçasıdır ve tabloda gösterilen bir
            yıllık süreye değil, ait olduğu talep kaydının saklama süresine tabidir. Bir yıllık
            süre, herhangi bir forma bağlı olmayan sunucu ve altyapı güvenlik kayıtları için
            geçerlidir.
          </p>

          <p className="text-muted">
            <strong className="tag tag-accent">
              [DOLDURULACAK: site formu kayıtları için kesin saklama süreleri]
            </strong>{" "}
            Yukarıdaki tabloda gösterilen iki yıllık ve bir yıllık süreler, kurumsal saklama
            politikamızın önerilen değerleridir; yayın öncesinde kesinleştirilecek ve Gizlilik ve
            veri güvenliği sayfasındaki saklama tablosuyla birebir eşitlenecektir. Ticari
            elektronik ileti onay kayıtları için gösterilen üç yıllık süre ise mevzuatla
            belirlenmiştir ve kurumsal tercihe bağlı değildir.
          </p>

          <h3>7.2. Müşteri projelerinde işlenen veriler</h3>

          <p>
            Aşağıdaki süreler, müşteri kurumla yürütülen Organizasyonel Verimetri projelerinde
            geçerlidir ve veri işleyen sıfatımızla, müşterinin talimatları ve imzalanan veri işleyen
            sözleşmesi çerçevesinde uygulanır.
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Veri katmanı</th>
                  <th>Saklama süresi</th>
                  <th>Gerekçe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ham müşteri verisi</td>
                  <td>Proje süresi + 6 ay</td>
                  <td>Hesaplamaların doğrulanabilmesi ve proje kapanış kontrolleri</td>
                </tr>
                <tr>
                  <td>Analiz katmanı (toplulaştırılmış tablolar)</td>
                  <td>Proje süresi + 12 ay</td>
                  <td>Ölçüm sonuçlarının izlenebilirliği ve karşılaştırma</td>
                </tr>
                <tr>
                  <td>Raporlar ve ölçüm dayanakları</td>
                  <td>10 yıl</td>
                  <td>Sözleşmesel ispat yükümlülüğü</td>
                </tr>
                <tr>
                  <td>Anonim benchmark kayıtları</td>
                  <td>Süresiz</td>
                  <td>
                    Geri döndürülemez şekilde anonimleştirildiğinden kişisel veri niteliği taşımaz
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>8. Müşteri projelerinde veri mimarisi ve rollerin ayrımı</h2>

          <p>
            Bir müşteri kurumla proje yürüttüğümüzde, o kurumun çalışanlarına ilişkin veriler
            bakımından <strong>veri sorumlusu müşteri kurumdur</strong>; {BRAND}{" "}
            <strong>veri işleyen</strong> sıfatıyla ve yalnızca müşterinin yazılı talimatı
            doğrultusunda hareket eder. Proje başlamadan önce yazılı bir veri işleyen sözleşmesi
            imzalanması zorunludur. Müşteri kurumun kendi çalışanlarına yönelik aydınlatma
            yükümlülüğü kendisine aittir.
          </p>

          <ul>
            <li>
              Analiz, <strong>birim ve rol bazında toplulaştırılmış veriyle</strong> yapılır. Kişi
              bazlı kimlik hiçbir tabloda tutulmaz; en küçük tanecik roldür ve rol seviyesinde takma
              ad kullanılır.
            </li>
            <li>
              <strong>Kişi bazlı performans izleme yapılmaz.</strong> Bu, ürünün kapsam dışı
              bıraktığı bir işlevdir; müşteri talep etse dahi sağlanmaz.
            </li>
            <li>
              Her müşteri için <strong>ayrı veri şeması ve ayrı erişim yetkisi</strong> tanımlanır;
              veriler aktarım sırasında ve dinlenme hâlinde şifrelenir.
            </li>
            <li>
              Tüm veri erişimleri loglanır; saklama süresi dolan veriler için imha tutanağı
              düzenlenir.
            </li>
            <li>
              Anonim karşılaştırma (benchmark) havuzuna yalnızca sektör, çalışan sayısı bandı,
              fonksiyon, metrik adı, metrik değeri ve ölçüm dönemi geçer. Bir sektör-ölçek
              hücresinde <strong>en az 5 farklı müşteri</strong> birikmeden değer yayımlanmaz; bu
              eşik, tekil bir kurumun veya kişinin geri çıkarılmasını engeller.
            </li>
          </ul>

          <h2>9. Veri güvenliği</h2>

          <p>
            KVKK m.12 uyarınca, kişisel verilerin hukuka aykırı olarak işlenmesini ve erişilmesini
            önlemek ile muhafazasını sağlamak amacıyla uygun güvenlik düzeyini temin etmeye yönelik
            teknik ve idari tedbirler alınır: aktarımda ve dinlenme hâlinde şifreleme, yetki
            matrisine dayalı erişim kontrolü, erişim loglaması, en az veri ilkesi, gizlilik
            taahhütnameleri, hizmet sağlayıcılarla yazılı sözleşmeler ve saklama süresi dolan
            verilerin düzenli imhası. Ayrıntılar için{" "}
            <Link href={ROUTES.privacy}>Gizlilik ve veri güvenliği</Link> sayfasına bakabilirsiniz.
          </p>

          <h2>10. Çerezler ve izleme</h2>

          <p>
            Bu sitede <strong>üçüncü taraf analitik aracı, reklam pikseli veya izleme çerezi
            bulunmamaktadır</strong>; yalnızca sitenin çalışması için teknik olarak zorunlu
            çerez/yerel depolama kullanılabilir ve yazı tipleri kendi sunucumuzdan servis edildiği
            için tarayıcınızdan üçüncü taraf font sağlayıcılarına istek gitmez. Ayrıntı için{" "}
            <Link href={ROUTES.cookies}>Çerez politikası</Link> sayfasına bakınız.
          </p>

          <h2>11. Ticari elektronik ileti</h2>

          <p>
            Başvuru formundaki <strong>ticari ileti izni, aydınlatma onayından ayrı bir kutudur ve
            tamamen isteğe bağlıdır.</strong> Bu kutuyu işaretlememeniz başvurunuzun
            değerlendirilmesini hiçbir şekilde etkilemez; talebiniz, izin verip vermediğinize
            bakılmaksızın aynı şekilde incelenir ve yanıtlanır.
          </p>

          <p>
            İzin vermeniz hâlinde tanıtım, bülten ve etkinlik duyuruları 6563 sayılı Elektronik
            Ticaretin Düzenlenmesi Hakkında Kanun ve ilgili mevzuat çerçevesinde gönderilir. Onay
            kaydınız, mevzuatın öngördüğü şekilde İleti Yönetim Sistemine{" "}
            {"(“İYS”)"} yüklenir ve gönderimler {"İYS'de"} kayıtlı onay durumu kontrol edilerek
            yapılır.
          </p>

          <p>
            İzninizi dilediğiniz zaman, hiçbir gerekçe göstermeden ve ücretsiz olarak geri
            alabilirsiniz. Bunun için her iletinin içinde yer alan ret bağlantısını kullanabilir,{" "}
            {"İYS"} üzerinden onayınızı kaldırabilir veya{" "}
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> adresine talebinizi
            iletebilirsiniz. Ret talebiniz, mevzuat uyarınca bize ulaşmasını izleyen üç iş günü
            içinde işleme alınır; bu tarihten sonra size ticari elektronik ileti gönderilmez. İznin
            geri alınması, başvurunuzun
            değerlendirilmesine ve sözleşmesel iletişime ilişkin zorunlu bildirimlere etki
            etmez.
          </p>

          <h2>12. İlgili kişi olarak haklarınız</h2>

          <p>
            KVKK m.11 uyarınca, veri sorumlusuna başvurarak kendinizle ilgili olarak aşağıdaki
            haklara sahipsiniz:
          </p>

          <ol>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
            <li>
              Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp
              kullanılmadığını öğrenme,
            </li>
            <li>
              Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri
              bilme,
            </li>
            <li>
              Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların
              düzeltilmesini isteme,
            </li>
            <li>
              KVKK m.7 çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme,
            </li>
            <li>
              Düzeltme, silme veya yok etme işlemlerinin, kişisel verilerinizin aktarıldığı üçüncü
              kişilere bildirilmesini isteme,
            </li>
            <li>
              İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle
              aleyhinize bir sonucun ortaya çıkmasına itiraz etme,
            </li>
            <li>
              Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız
              hâlinde zararın giderilmesini talep etme.
            </li>
          </ol>

          <p>
            Açık rızaya dayanan işlemeler bakımından, rızanızı dilediğiniz zaman geri alma hakkınız
            da bulunmaktadır. Geri alma, o ana kadar rızaya dayalı olarak yapılmış işlemelerin
            hukuka uygunluğunu etkilemez. KVKK m.28 kapsamına giren hâllerde bu haklar
            uygulanmayabilir.
          </p>

          <h3>12.1. Başvuru usulü</h3>

          <p>
            Haklarınızı kullanmak için, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ
            uyarınca aşağıdaki kanallardan birini kullanabilirsiniz:
          </p>

          <ul>
            <li>Islak imzalı dilekçenizi şahsen veya noter aracılığıyla adresimize iletmek,</li>
            <li>
              Kayıtlı elektronik posta (KEP) adresiniz üzerinden KEP adresimize göndermek,
            </li>
            <li>Güvenli elektronik imza veya mobil imza ile imzalayarak göndermek,</li>
            <li>
              Daha önce bize bildirdiğiniz ve sistemimizde kayıtlı bulunan elektronik posta
              adresinizi kullanarak göndermek.
            </li>
          </ul>

          <p>
            Başvurunuzda; adınız ve soyadınız, yazılı başvuruda imzanız, Türkiye Cumhuriyeti kimlik
            numaranız (yabancılar için uyruğunuz, pasaport numaranız veya kimlik numaranız),
            tebligata esas yerleşim yeri veya iş yeri adresiniz, varsa bildirime esas elektronik
            posta adresiniz, telefon ve faks numaranız ile talep konusunun açıkça yer alması
            gerekir. Konuya ilişkin bilgi ve belgeler başvuruya eklenmelidir.
          </p>

          <p>
            Başvurunuz, talebin niteliğine göre en kısa sürede ve <strong>en geç otuz gün içinde</strong>{" "}
            ücretsiz olarak sonuçlandırılır. İşlemin ayrıca bir maliyet gerektirmesi hâlinde,
            Kişisel Verileri Koruma Kurulunca belirlenen tarifedeki ücret alınabilir. Başvurunuzun
            reddedilmesi, verilen yanıtın yetersiz bulunması veya süresinde yanıt verilmemesi
            hâlinde KVKK m.14 uyarınca, yanıtımızı öğrendiğiniz tarihten itibaren otuz ve her
            hâlde başvuru tarihinden itibaren altmış gün içinde Kişisel Verileri Koruma Kuruluna
            şikâyette bulunma hakkınız saklıdır.
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Başvuru kanalı</th>
                  <th>Adres</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Yazılı başvuru adresi</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: tebligata esas açık adres]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>KEP adresi</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: kayıtlı elektronik posta (KEP) adresi]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Sistemde kayıtlı e-posta ile başvuru</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: KVKK başvuruları için kullanılacak resmî e-posta adresi]
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-muted">
            Resmî başvuru kanalları yayınlanana kadar, konuya ilişkin sorularınızı{" "}
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> adresine iletebilirsiniz. Bu
            adres bilgilendirme içindir; Tebliğ anlamında usulüne uygun bir başvuru için yukarıdaki
            kanalların kullanılması gerekir.
          </p>

          <h2>13. Metindeki değişiklikler</h2>

          <p>
            Bu aydınlatma metni, mevzuattaki değişiklikler ile hizmet ve veri işleme
            süreçlerimizdeki güncellemeler doğrultusunda revize edilebilir. Güncel sürüm her zaman
            bu sayfada yayımlanır; sayfanın en üstündeki tarih ve sürüm numarası son güncellemeyi
            gösterir. Esaslı değişikliklerde, iletişim izni bulunan kişiler ayrıca
            bilgilendirilir.
          </p>

          <div className="hr" />

          <p>
            Veri güvenliğine ilişkin teknik ve idari tedbirlerin ayrıntısı için{" "}
            <Link href={ROUTES.privacy}>Gizlilik ve veri güvenliği</Link> sayfasını, çerez
            kullanımı için <Link href={ROUTES.cookies}>Çerez politikası</Link> sayfasını
            inceleyebilirsiniz.
          </p>

          <p>
            <Link className="btn btn-secondary" href={ROUTES.privacy}>
              Gizlilik ve veri güvenliği
            </Link>
          </p>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
