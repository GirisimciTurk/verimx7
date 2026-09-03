import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL, ROUTES, CONTACT, PARENT_LEGAL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik ve Veri Güvenliği Politikası",
  description:
    "Verimx7 sitesinde hangi verinin toplandığı, müşteri projelerinde uygulanan izolasyon, takma adlaştırma ve şifreleme tedbirleri ile saklama ve imha süreleri.",
  alternates: { canonical: `${SITE_URL}${ROUTES.privacy}` },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="icerik">
        <article className="prose">
          <p className="meta">Son güncelleme: 3 Eylül 2026 · Sürüm 1.0</p>

          <h1>Gizlilik ve Veri Güvenliği Politikası</h1>

          <p className="lead">
            Bu politika iki ayrı okuyucu için yazıldı: siteyi gezen ziyaretçi ve verisini bize
            teslim etmeyi değerlendiren kurumsal müşteri. Birinci bölüm bu web sitesinin ne
            topladığını, ikinci bölüm bir Organizasyonel Verimetri projesinde verinin nasıl
            ele alındığını anlatır.
          </p>

          <div className="card">
            <span className="card-kicker">Tamamlanmayı bekleyen bilgiler</span>
            <p className="card-title">Bu metinde henüz doldurulmamış alanlar var</p>
            <p className="card-body">
              Aşağıda <strong className="tag tag-accent">[DOLDURULACAK: …]</strong> biçiminde
              işaretlenmiş yerler, yayın öncesi resmî kayıtlarla teyit edilip tamamlanacaktır.
              Bu alanlar tahminle doldurulmamıştır: bilmediğimiz bir bilgiyi yazmak yerine
              boş bıraktık. İşaretli bir konuda bağlayıcı bilgiye ihtiyacınız varsa bize
              yazın, yazılı olarak yanıtlayalım.
            </p>
          </div>

          <h2>1. Kısa özet — üç cümlede</h2>

          <p>
            <strong>Ne yapıyoruz:</strong> Bu sitede yalnızca sizin doldurup gönderdiğiniz
            formların içeriğini ve bu gönderime ait teknik kaydı (IP, tarayıcı bilgisi,
            zaman damgası) alıyoruz; müşteri projelerinde ise veriyi birim ve rol bazında
            toplulaştırılmış olarak, müşteri başına ayrı ve şifreli bir ortamda işliyoruz.
          </p>
          <p>
            <strong>Ne yapmıyoruz:</strong> Kişisel veriyi satmıyor, kiralamıyor, reklam
            amacıyla paylaşmıyoruz; sitede üçüncü taraf analitik, reklam pikseli veya izleme
            çerezi çalıştırmıyoruz; müşteri projelerinde kişi bazlı performans izleme
            yapmıyoruz.
          </p>
          <p>
            <strong>Nasıl güvence altına alıyoruz:</strong> Rol dağılımı sözleşmeyle
            sabitlenir (müşteri veri sorumlusu, Verimx7 veri işleyen), tedbirler sözleşme
            ekinde yazılıdır, saklama süreleri bellidir ve süre dolduğunda imha tutanakla
            kayıt altına alınır.
          </p>

          <hr className="hr" />

          <h2>2. Site ziyaretçisinin verisi</h2>

          <p>
            Bu site bir tanıtım sitesidir. Gezinmek için hesap açmanız, form doldurmanız veya
            kimliğinizi bildirmeniz gerekmez. Veri yalnızca siz bir formu gönderdiğinizde
            oluşur.
          </p>

          <h3>2.1 Toplanan veriler</h3>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Nerede</th>
                  <th scope="col">Ne toplanır</th>
                  <th scope="col">Kaydedilir mi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Değerlendirme başvurusu formu</td>
                  <td>
                    Ad soyad, telefon, e-posta, kurum/şirket adı, seçtiğiniz kaynak alanı
                    (İnsan Kaynağı · Fiziksel Alan ve Bina · Makine ve Teçhizat · Doğal ve
                    Stratejik Kaynak · Teknoloji), serbest metin açıklamanız, aydınlatma onayı
                    ve varsa ticari ileti izniniz
                  </td>
                  <td>Evet — yapılandırılan kanallara iletilir ve saklanır</td>
                </tr>
                <tr>
                  <td>Atıl Kapasite Testi</td>
                  <td>
                    12 sorunun sayısal, bantlı veya işaretlemeli yanıtları ile seçtiğiniz
                    kurum tipi. İsim, e-posta, telefon gibi hiçbir kimlik alanı istenmez ve
                    gönderilmez
                  </td>
                  <td>
                    <strong>Hayır</strong> — yanıtlar yalnızca hesaplanır ve sonuç ekrana
                    döner; sunucuda saklanmaz
                  </td>
                </tr>
                <tr>
                  <td>Ana sayfadaki hızlı tahmin</td>
                  <td>
                    Kaydırıcılarla belirlediğiniz üç girdi: çalışan sayısı, yıllık ciro ve
                    kişi başı aylık maliyet. Kimlik alanı yoktur
                  </td>
                  <td>
                    <strong>Hayır</strong> — girdiler hesaplanmak üzere sunucuya gider, sonuç
                    geri döner ve kayıt oluşmaz
                  </td>
                </tr>
                <tr>
                  <td>{"“Ayrıntılı raporu e-posta ile al”"}</td>
                  <td>
                    E-posta adresiniz, raporun üretileceği test girdileri, bu girdilerden
                    hesaplanan sonuç, kullanılan formül sürümü ve aydınlatma onayı
                  </td>
                  <td>Evet — raporu gönderebilmek için kaydedilir ve iletilir</td>
                </tr>
                <tr>
                  <td>Kaydedilen gönderimlerde teknik olarak</td>
                  <td>
                    IP adresi, tarayıcı bilgisi (user-agent), geldiğiniz sayfa bilgisi
                    (referer) ve zaman damgası
                  </td>
                  <td>
                    Evet — yalnızca yukarıdaki kaydedilen iki gönderimle birlikte; güvenlik,
                    kötüye kullanım önleme ve ispat amacıyla
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Hesaplama isteklerinde (test ve hızlı tahmin) IP adresiniz, yalnızca aynı adresten
            gelen istek sayısını sınırlamak için sunucunun geçici belleğinde kısa süre tutulur;
            kalıcı bir kayda yazılmaz ve hesaplama girdileriyle birlikte saklanmaz.
          </p>

          <p>
            Testi doldurup göndermeniz sizi hiçbir kayda bağlamaz. Kimliğinizi bize
            bildirmeden testi çalıştırıp sonucu görebilirsiniz; kimlik verisi yalnızca
            raporu e-posta ile istediğinizde ya da başvuru formunu gönderdiğinizde oluşur.
          </p>

          <h3>2.2 Talepler nereye gider</h3>

          <p>
            Gönderdiğiniz talep, yapılandırılan kanallara iletilir: e-posta (Resend altyapısı
            üzerinden), bir CRM webhook adresi ve/veya kendi sunucumuzdaki kayıt dosyası.
            Hangi kanalların açık olduğu kurulum yapılandırmasına bağlıdır; hiçbir kanal
            açık değilse site talebi kabul etmez ve sizi doğrudan e-posta veya WhatsApp ile
            iletişime yönlendirir — {"“aldık”"} deyip kaydı hiçbir yere yazmamayı kabul
            edilebilir bir davranış saymıyoruz.
          </p>

          <h3>2.3 Üçüncü taraf izleme yoktur</h3>

          <ul>
            <li>
              Sitede <strong>üçüncü taraf analitik yoktur</strong>. Google Analytics veya
              benzeri bir ölçüm aracı kullanılmaz.
            </li>
            <li>
              <strong>Reklam pikseli, yeniden pazarlama etiketi veya izleme çerezi yoktur.</strong>{" "}
              Sizi siteler arasında takip eden hiçbir bileşen çalışmaz.
            </li>
            <li>
              Yalnızca teknik olarak zorunlu çerez veya yerel depolama kullanılabilir
              (örneğin form durumunun korunması gibi işlevsel amaçlarla). Ayrıntı için{" "}
              <Link href={ROUTES.cookies}>çerez politikamıza</Link> bakın.
            </li>
            <li>
              Yazı tipleri (Baloo 2, Figtree) <strong>kendi sunucumuzdan</strong> servis edilir.
              Tarayıcınızdan Google Fonts&nbsp;sunucularına istek gitmez.
            </li>
          </ul>

          <h3>2.4 Satmıyoruz</h3>

          <p>
            Form aracılığıyla verdiğiniz hiçbir kişisel veri satılmaz, kiralanmaz, veri
            simsarlarına devredilmez ve reklam amacıyla üçüncü taraflarla paylaşılmaz. Veri,
            yalnızca talebinizi karşılamak ve sizinle iletişim kurmak için kullanılır.
          </p>

          <h3>2.5 Ticari ileti</h3>

          <p>
            Başvuru formundaki ticari ileti izni <strong>ayrı ve opsiyonel</strong> bir
            kutudur; işaretlemeseniz de başvurunuz geçerlidir. Bu izin 6563 sayılı Elektronik
            Ticaretin Düzenlenmesi Hakkında Kanun kapsamında alınır ve{" "}
            {"İleti Yönetim Sistemi'ne (İYS)"} kaydedilir. İzni her zaman, hiçbir gerekçe
            göstermeden geri çekebilirsiniz: gönderilen iletideki ret bağlantısıyla, İYS
            üzerinden ya da aşağıdaki iletişim kanallarıyla. Aydınlatma onayı ile
            ticari ileti izni birbirinden bağımsızdır ve tek kutuda birleştirilmez.
          </p>

          <hr className="hr" />

          <h2>3. Müşteri projelerinde veri mimarisi</h2>

          <p>
            Bir Organizasyonel Verimetri projesi, kurumunuzun operasyonel verisiyle çalışır.
            Bu bölüm, o verinin bize geldikten sonra neye maruz kaldığını anlatır. Burada
            yazan tedbirler pazarlama cümlesi değildir; her projenin sözleşme ekinde
            teknik–idari tedbirler listesi olarak yazılı hale gelir.
          </p>

          <h3>3.1 Rol tanımı</h3>

          <p>
            {"KVKK'nın"} tanımlarına göre <strong>müşteri veri sorumlusudur</strong>;
            Verimx7 <strong>veri işleyendir</strong>. Yani işleme amacını ve vasıtalarını
            müşteri belirler, biz yalnızca onun talimatı doğrultusunda ve sözleşmede yazan
            sınırlar içinde işleriz. <strong>Yazılı veri işleyen sözleşmesi</strong> ve ekindeki
            teknik–idari tedbirler listesi, her projenin ön şartıdır — sözleşme imzalanmadan
            hiçbir müşteri verisi teslim alınmaz.
          </p>

          <p>
            İşlemenin hukuki dayanağını (KVKK m.5 kapsamındaki işleme şartları) müşteri
            belirler ve çalışanlarına karşı aydınlatma yükümlülüğü (KVKK m.10) müşteriye
            aittir. İlgili kişilerden gelen talepleri (KVKK m.11) müşteri karşılar; biz veri
            işleyen sıfatıyla bu talepleri karşılaması için müşteriye gereken desteği veririz
            ve bize doğrudan ulaşan talepleri gecikmeksizin müşteriye yönlendiririz.
          </p>

          <p>
            Kural olarak <strong>özel nitelikli kişisel veri (KVKK m.6) talep etmeyiz</strong>.
            Sağlık, sendika üyeliği, ceza mahkûmiyeti gibi alanlar veri talep listemizde yer
            almaz; metrik hesabı bunlara ihtiyaç duymaz.
          </p>

          <h3>3.2 Tasarımdan gelen tedbirler</h3>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Tedbir</th>
                  <th scope="col">Uygulama</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Veri minimizasyonu</td>
                  <td>
                    Veri talep listesinde yalnızca metrik hesabı için gerekli alanlar bulunur.
                    {" “Belki lazım olur”"} diye alan istenmez; listedeki her alanın karşılığı
                    olan bir metrik vardır.
                  </td>
                </tr>
                <tr>
                  <td>Toplulaştırma</td>
                  <td>
                    Veri birim ve rol bazında istenir. Kişi bazlı kayıt istisnadır ve gerekçesi
                    yazılı olarak kayda geçer. Analiz şemasındaki en küçük tanecik roldür.
                  </td>
                </tr>
                <tr>
                  <td>Takma adlaştırma</td>
                  <td>
                    Kişi bazlı kayıt zorunlu olduğunda kimlik alanları{" "}
                    <strong>giriş katmanında takma adla değiştirilir</strong>. Rol seviyesinde
                    de takma ad kullanılır. Kişi bazlı kimlik hiçbir analiz tablosunda
                    tutulmaz.
                  </td>
                </tr>
                <tr>
                  <td>İzolasyon</td>
                  <td>
                    Her müşteri için ayrı şema ve ayrı erişim yetkisi. Müşteri verileri ortak
                    bir tabloda karışmaz.
                  </td>
                </tr>
                <tr>
                  <td>Şifreleme</td>
                  <td>
                    Hem aktarım sırasında (in transit) hem de saklandığı yerde (at rest)
                    şifreleme.
                  </td>
                </tr>
                <tr>
                  <td>En az yetki</td>
                  <td>
                    Erişim, en az yetki ilkesine göre verilir. Projeye atanmamış personel o
                    projenin verisine erişemez; erişim proje bitiminde geri alınır.
                  </td>
                </tr>
                <tr>
                  <td>Erişim kaydı</td>
                  <td>
                    Tüm veri erişimleri loglanır. Kimin, ne zaman, hangi veriye eriştiği
                    sonradan gösterilebilir.
                  </td>
                </tr>
                <tr>
                  <td>İmha</td>
                  <td>
                    Saklama süreleri otomatik takip edilir; süre dolduğunda veri imha edilir ve{" "}
                    <strong>imha tutanağı</strong> düzenlenir.
                  </td>
                </tr>
                <tr>
                  <td>Anonimleştirme</td>
                  <td>
                    Benchmark havuzuna aktarım öncesinde geri döndürülemezlik testi uygulanır.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-muted">
            Bu tedbirler KVKK m.12 kapsamındaki veri güvenliğine ilişkin yükümlülükleri
            karşılamak üzere tasarlanmıştır ve proje sözleşmesinin eki olarak taahhüt edilir.
          </p>

          <hr className="hr" />

          <h2>4. Yapmadıklarımız</h2>

          <p>
            Bir güvenlik politikasının en bağlayıcı kısmı, kapsam dışında bıraktıklarıdır.
            Aşağıdakiler bizim için ticari tercih değil, ürün sınırıdır.
          </p>

          <ul>
            <li>
              <strong>Kişi bazlı performans izleme yapmayız.</strong> Bu bir özellik olarak
              geliştirilmemiştir ve <em>müşteri talep etse dahi</em> ürün kapsamı dışındadır.
              Amacımız iş yükünü azaltmaktır; çalışan puanlamak değil.
            </li>
            <li>
              <strong>Çok kiracılı (multi-tenant) tek şemada müşteri verisi tutmayız.</strong>{" "}
              Her müşterinin verisi kendi şemasında, kendi erişim yetkisiyle durur.
            </li>
            <li>
              <strong>Erken fazlarda müşteri sistemlerine canlı API entegrasyonu yazmayız.</strong>{" "}
              Veri, kontrollü dışa aktarımlarla (güvenli dosya aktarımı) alınır. Canlı bağlantı,
              ancak süreç tekrarlandığı kanıtlandıktan sonra ve ayrı bir mutabakatla gündeme
              gelir. Bu, kurumsal sistemlerinize açılan kalıcı bir kapı olmaması demektir.
            </li>
            <li>
              <strong>Veri satmayız, kiralamayız, reklam amacıyla paylaşmayız.</strong>
            </li>
            <li>
              <strong>Sitede ziyaretçi profilleme yapmayız.</strong> Üçüncü taraf analitik,
              reklam pikseli veya izleme çerezi çalıştırmayız.
            </li>
          </ul>

          <hr className="hr" />

          <h2>5. Saklama ve imha</h2>

          <p>
            Veriyi süresiz tutmak bir güvenlik açığıdır. Her veri kategorisinin saklama süresi
            önceden bellidir ve süre dolduğunda imha otomatik takip edilen bir iştir.
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Veri</th>
                  <th scope="col">Saklama süresi</th>
                  <th scope="col">Sonrası</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ham müşteri verisi (giriş katmanı)</td>
                  <td>Proje süresi + 6 ay</td>
                  <td>Kalıcı imha, imha tutanağı düzenlenir</td>
                </tr>
                <tr>
                  <td>Analiz katmanı (toplulaştırılmış, takma adlı)</td>
                  <td>Proje süresi + 12 ay</td>
                  <td>İmha</td>
                </tr>
                <tr>
                  <td>Rapor ve ölçüm dayanakları</td>
                  <td>10 yıl</td>
                  <td>Sözleşmesel ispat yükümlülüğü nedeniyle saklanır</td>
                </tr>
                <tr>
                  <td>Anonim benchmark kayıtları</td>
                  <td>Süresiz</td>
                  <td>
                    Geri döndürülemez şekilde anonimdir; kişisel veri niteliği taşımaz
                  </td>
                </tr>
                <tr>
                  <td>Site başvuru ve rapor talebi kayıtları</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: site başvuru kayıtlarının saklama süresi]
                    </strong>
                  </td>
                  <td>Süre sonunda silinir</td>
                </tr>
                <tr>
                  <td>Atıl Kapasite Testi yanıtları ve hızlı tahmin girdileri</td>
                  <td>Saklanmaz</td>
                  <td>İstek işlendikten sonra kalıcı kayıt oluşmaz</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Sözleşme sona erdiğinde müşteri, saklama sürelerinin dolmasını beklemeden imha
            talep edebilir; yasal veya sözleşmesel bir saklama yükümlülüğü bulunmayan veriler
            için bu talep karşılanır ve sonucu tutanakla bildirilir.
          </p>

          <hr className="hr" />

          <h2>6. Anonimleştirme ve benchmark havuzu</h2>

          <p>
            Karşılaştırma (benchmark) verisi, hizmetin değerinin bir parçasıdır: bir kurumun
            kendi sayısını yalnızca sektör ve ölçek emsaliyle birlikte okumak anlamlıdır. Ancak
            bu havuz, müşteri verisinin yeniden kullanıldığı bir arka kapı değildir.
          </p>

          <h3>6.1 Havuza yalnızca şunlar geçer</h3>

          <ul>
            <li>Sektör</li>
            <li>Çalışan sayısı bandı</li>
            <li>Fonksiyon</li>
            <li>Metrik adı</li>
            <li>Metrik değeri</li>
            <li>Ölçüm dönemi</li>
          </ul>

          <p>
            Müşteri adı, birim adı, rol adı, tarih hassasiyeti yüksek alanlar ve serbest metin
            havuza <strong>geçmez</strong>. Havuzdaki bir kayıttan hangi kurumun verisi olduğu
            geriye doğru bulunamaz.
          </p>

          <h3>6.2 Beş müşteri eşiği</h3>

          <p>
            Bir sektör–ölçek bandı hücresinde <strong>en az 5 farklı müşteri</strong>{" "}
            birikmeden o hücrenin değeri hiçbir raporda yayımlanmaz. Bu kural iki işi birden
            görür: istatistiksel anlamlılık sağlar ve tekilleştirme (bir hücredeki değerin tek
            bir kuruma geri bağlanması) riskine karşı koruma sunar. Eşik dolmamışsa rapor o
            hücreyi boş bırakır — tahmini bir emsal üretmeyiz.
          </p>

          <h3>6.3 Geri döndürülemezlik testi</h3>

          <p>
            Aktarım öncesinde her kayıt, geri döndürülemezlik testinden geçirilir: tekil ya da
            aşırı ayırt edici kombinasyonlar (örneğin bir sektör–ölçek hücresinde tek başına
            duran bir değer) havuza alınmaz, gerekirse bant genişletilir. Testi geçen kayıtlar
            KVKK anlamında anonim hale gelmiş sayılır ve bu nedenle süresiz saklanabilir.
          </p>

          <hr className="hr" />

          <h2>7. Çalışan şeffaflığı</h2>

          <p>
            Bu, teknik uyumun ötesinde bir gerekliliktir ve projenin ön şartlarından biridir:{" "}
            <strong>çalışanlar analizden haberdar olmalıdır.</strong>
          </p>

          <p>
            Projenin ilk toplantısında, <strong>müşteri yönetimi tarafından</strong> ve açık
            biçimde şu iki şey duyurulur:
          </p>

          <ol>
            <li>Kişi bazlı izleme yapılmamaktadır.</li>
            <li>
              Çalışmanın amacı iş yükünü azaltmak ve atıl kaynağı katma değere çevirmektir.
            </li>
          </ol>

          <p>
            Bunu bir nezaket kuralı olarak değil, projenin işleyiş şartı olarak görüyoruz.
            Duyurunun yapılmadığı projelerde veri erişimi zorlaşır, veri kalitesi düşer ve
            uygulama aşamasında direnç oluşur — yani şeffaflık, sonuçların doğruluğunun da ön
            koşuludur. Çalışanların KVKK m.11 kapsamındaki hakları müşteri (veri sorumlusu)
            nezdinde kullanılır; bu hakların kullanımını kolaylaştırmak müşterinin
            yükümlülüğüdür, biz de bunun için gereken bilgiyi sağlarız.
          </p>

          <hr className="hr" />

          <h2>8. İhlal bildirimi</h2>

          <p>
            KVKK m.12 uyarınca, işlenen kişisel verilerin kanuni olmayan yollarla başkaları
            tarafından elde edilmesi hâlinde veri sorumlusu bu durumu ilgili kişiye ve Kişisel
            Verileri Koruma {"Kurulu'na"} bildirmekle yükümlüdür. Müşteri projelerinde veri
            sorumlusu müşteri olduğu için bildirimi müşteri yapar; veri işleyen sıfatıyla bizim
            yükümlülüğümüz, ihlali tespit ettiğimiz anda <strong>gecikmeksizin</strong>{" "}
            müşteriyi bilgilendirmek ve bildirim için gereken bütün teknik bilgiyi sağlamaktır.
          </p>

          <h3>İç sürecimiz</h3>

          <ol>
            <li>
              <strong>Tespit.</strong> Erişim logları, sistem uyarıları veya bir personelin
              bildirimi üzerine olay kaydı açılır; etkilenen ortam derhal izole edilir ve
              deliller korunur.
            </li>
            <li>
              <strong>Değerlendirme.</strong> Hangi veri kategorisinin, hangi müşteriye ait
              olarak, ne kadar kişi/kayıt ölçeğinde etkilendiği; olası sonuçları ve alınan
              karşı tedbirler yazılı olarak tespit edilir.
            </li>
            <li>
              <strong>Bildirim.</strong> İlgili müşteri (veri sorumlusu) gecikmeksizin
              bilgilendirilir. {"Kurul'a"} ve ilgili kişilere yapılacak bildirim, Kurulun veri
              ihlali bildirimine ilişkin usul ve esaslarına uygun şekilde ve öngörülen sürede
              yapılır; bu bildirimin sahibi veri sorumlusudur, biz içerik ve kanıt tarafında
              destek veririz.
            </li>
            <li>
              <strong>Kapanış.</strong> Kök neden analizi yapılır, düzeltici tedbir uygulanır
              ve olay kaydı tutanakla kapatılır.
            </li>
          </ol>

          <p>
            Site tarafındaki bir ihlalde (örneğin başvuru kayıtlarını etkileyen bir olay) veri
            sorumlusu sıfatıyla bildirimi biz yaparız.
          </p>

          <hr className="hr" />

          <h2>9. Alt işleyenler ve yurt dışı aktarım</h2>

          <p>
            Hizmeti sunarken sınırlı sayıda hizmet sağlayıcıdan yararlanıyoruz. Alt işleyen
            kullanımı, veri işleyen sözleşmesinde müşterinin bilgisi dahilinde düzenlenir;
            alt işleyenlere bizim taahhüt ettiğimizle en az aynı düzeyde yükümlülük yazılı
            olarak yansıtılır.
          </p>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Alt işleyen / hizmet</th>
                  <th scope="col">Amaç</th>
                  <th scope="col">Konum</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Resend</td>
                  <td>
                    Form taleplerinin ve rapor e-postalarının iletilmesi (e-posta gönderim
                    altyapısı)
                  </td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: sunucu konumu ve aktarım hukuki dayanağı]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Barındırma (hosting) sağlayıcısı</td>
                  <td>Sitenin ve API uçlarının çalıştırılması</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: barındırma sağlayıcısının unvanı ve veri merkezi konumu]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>CRM / webhook alıcısı (yapılandırıldıysa)</td>
                  <td>Talebin satış sürecine aktarılması</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: kullanılan CRM ürünü ve konumu]
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Müşteri projesi analiz ortamı</td>
                  <td>Ham ve analiz katmanlarının barındırılması</td>
                  <td>
                    <strong className="tag tag-accent">
                      [DOLDURULACAK: analiz ortamının barındırma konumu]
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Kişisel verinin yurt dışına aktarıldığı hallerde, {"KVKK'nın"} yurt dışına
            aktarıma ilişkin hükümlerinde öngörülen hukuki dayanaklardan uygun olanı kullanılır
            ve dayanak sözleşmede açıkça belirtilir. Müşteri projelerinde aktarımın hukuki
            dayanağını belirleme yetkisi veri sorumlusu sıfatıyla müşteriye aittir; müşteri
            aksini talep ederse verinin yurt içinde tutulması yapılandırılabilir. Güncel ve
            bağlayıcı alt işleyen listesi, veri işleyen sözleşmesinin ekidir.
          </p>

          <hr className="hr" />

          <h2>10. İletişim ve güncelleme</h2>

          <h3>10.1 Veri sorumlusu kimlik bilgileri</h3>

          <p>
            Bu site bir {PARENT_LEGAL} iştirakidir. Site tarafındaki işleme faaliyetleri
            bakımından veri sorumlusuna ilişkin resmî bilgiler aşağıda tamamlanacaktır.
          </p>

          <ul>
            <li>
              Tam ticari unvan:{" "}
              <strong className="tag tag-accent">
                [DOLDURULACAK: veri sorumlusunun tam ticari unvanı]
              </strong>
            </li>
            <li>
              VERBİS (Veri Sorumluları Sicil Bilgi Sistemi) kaydı:{" "}
              <strong className="tag tag-accent">
                [DOLDURULACAK: VERBİS kayıt numarası veya kayıt yükümlülüğü durumu]
              </strong>
            </li>
            <li>
              MERSİS / vergi numarası:{" "}
              <strong className="tag tag-accent">
                [DOLDURULACAK: MERSİS ve vergi dairesi/numarası]
              </strong>
            </li>
            <li>
              Açık adres:{" "}
              <strong className="tag tag-accent">[DOLDURULACAK: açık adres]</strong>
            </li>
            <li>
              KEP adresi:{" "}
              <strong className="tag tag-accent">[DOLDURULACAK: KEP adresi]</strong>
            </li>
            <li>
              Başvurular için resmî e-posta:{" "}
              <strong className="tag tag-accent">
                [DOLDURULACAK: KVKK başvuruları için kullanılacak resmî e-posta adresi]
              </strong>
            </li>
          </ul>

          <h3>10.2 Bize ulaşın</h3>

          <p>
            Bu politikayla ilgili soru, itiraz veya bilgi talepleriniz için:
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

          <p className="text-muted">
            KVKK m.11 kapsamındaki haklarınıza ilişkin resmî başvuru yolu ve şekil şartları,{" "}
            <Link href={ROUTES.kvkk}>aydınlatma metninde</Link> ayrıca düzenlenmiştir. Yukarıdaki
            kanallar hızlı iletişim içindir; şekle bağlı resmî başvurular tamamlandığında
            duyurulacak resmî adres ve KEP üzerinden yapılır.
          </p>

          <h3>10.3 Güncelleme</h3>

          <p>
            Bu politika, hizmetin kapsamı, altyapı veya mevzuat değiştiğinde güncellenir. Her
            güncellemede sayfanın en üstündeki tarih ve sürüm numarası değiştirilir. Sürüm
            değişikliği, önceki sürümde verilen taahhütlerin geriye dönük olarak
            zayıflatılması anlamına gelmez; müşteri projelerinde bağlayıcı metin, imzalı
            sözleşme ve ekleridir. Esaslı bir değişiklik olması hâlinde aktif müşterilerimizi
            ayrıca bilgilendiririz.
          </p>

          <hr className="hr" />

          <h2>İlgili metinler</h2>

          <p>
            Bu politika tek başına aydınlatma yükümlülüğünü karşılamaz; onu tamamlayan iki metin
            vardır:
          </p>

          <ul>
            <li>
              <Link href={ROUTES.kvkk}>KVKK Aydınlatma Metni</Link> — hangi kişisel verinin hangi
              amaçla, hangi hukuki sebeple işlendiği ve KVKK m.11 kapsamındaki haklarınız.
            </li>
            <li>
              <Link href={ROUTES.cookies}>Çerez Politikası</Link> — sitede kullanılan teknik
              çerezler ve yerel depolama.
            </li>
          </ul>

          <p>
            <Link className="btn btn-primary" href={ROUTES.kvkk}>
              KVKK Aydınlatma Metni
            </Link>{" "}
            <Link className="btn btn-secondary" href={ROUTES.cookies}>
              Çerez Politikası
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
