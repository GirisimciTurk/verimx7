/**
 * Test kütüphanesi — altı test, kırk beş soru.
 *
 * Her sorunun dört seçeneği olgunluk sırasıyla dizilidir (0 → 3). Puan,
 * seçilen seçeneklerin toplamının azami puana oranıdır. Testler tarayıcıda
 * puanlanır; hiçbir yanıt sunucuya gönderilmez.
 */

import type { Band } from "./simulation-data";

export type TestKey = "t-insan" | "t-mekan" | "t-makine" | "t-tek" | "t-dogal" | "t-olcum";

export type TestDef = {
  k: TestKey;
  /** Ad. */
  n: string;
  /** Kısa açıklama. */
  d: string;
  /** Test tamamlanınca gösterilen öneri. */
  rec: string;
  /** [soru, [seçenek × 4]] */
  q: ReadonlyArray<readonly [string, readonly [string, string, string, string]]>;
};

/** Seçenek başına azami puan. */
export const MAX_OPTION_SCORE = 3;

export const TESTS: readonly TestDef[] = [
  {
    k: "t-insan",
    n: "İnsan kaynağı",
    d: "Kadro, zaman ve yetkinlik kullanımı",
    rec: "Rol bazlı zaman ölçümü ile başlayın; iki haftalık veri kadro kararlarını değiştirir.",
    q: [
      ["Kadronun asıl işe ayırdığı zamanı biliyor musunuz?", ["Hiç ölçülmedi", "Yönetici tahmini var", "Birim bazında ölçülüyor", "Rol bazında sistemden ölçülüyor"]],
      ["Toplantı yükü nasıl takip ediliyor?", ["Bilinmiyor", "Şikâyet gelince bakılıyor", "Takvim verisinden aylık ölçülüyor", "Hedefi var ve izleniyor"]],
      ["Bir karar kaç onay katmanından geçiyor?", ["Beş ve üzeri", "Dört", "Üç", "İki ve altı, yetki eşikleri yazılı"]],
      ["Ayrılma nedenleri ne kadar biliniyor?", ["Kayıt tutulmuyor", "Çıkış görüşmesi yapılıyor", "Nedenler sınıflandırılıyor", "Kök nedene göre aksiyon alınıyor"]],
      ["Fazla mesai nasıl yönetiliyor?", ["Ölçülmüyor", "Bordrodan görülüyor", "Birim bazında izleniyor", "Nedenine göre analiz ediliyor"]],
      ["Yeni işe alım kararı neye dayanıyor?", ["Talep beyanına", "Bütçe uygunluğuna", "İş yükü analizine", "Kapasite ölçümü olmadan onaylanmıyor"]],
      ["Yetkinlik–görev uyumu izleniyor mu?", ["Bakılmıyor", "Performans görüşmesinde konuşuluyor", "Yetkinlik envanteri var", "Envanter görev dağıtımında kullanılıyor"]],
      ["Devredilebilir işler tanımlı mı?", ["Bilinmiyor", "Kısmen biliniyor", "Listelenmiş", "Listelenmiş ve düzenli devrediliyor"]],
    ],
  },
  {
    k: "t-mekan",
    n: "Mekân ve alan",
    d: "Metrekare, doluluk ve atıl alan",
    rec: "Doluluk sayacı ve alan envanteri dört haftada çıkar; kiralama kararını erteletir.",
    q: [
      ["Alan envanteriniz güncel mi?", ["Yok", "Metrekare biliniyor", "Birim bazlı dağılım var", "Kullanım oranıyla birlikte güncel"]],
      ["Doluluk nasıl ölçülüyor?", ["Ölçülmüyor", "Göz kararı", "Dönemsel sayım", "Sürekli sayaç verisi"]],
      ["Depo ve arşiv alanı incelendi mi?", ["İncelenmedi", "Dolu görünüyor", "Devir hızı biliniyor", "Atıl bölüm gelirleştirildi"]],
      ["Yeni alan kararı neye dayanıyor?", ["İhtiyaç beyanına", "Bütçeye", "Doluluk verisine", "Doluluk ve esnek çalışma senaryosuna"]],
      ["Çalışma düzeni hangi aşamada?", ["Tamamen sabit masa", "Kısmi hibrit", "Paylaşımlı masa düzeni", "Talebe göre dinamik yerleşim"]],
      ["Alan maliyeti nasıl hesaplanıyor?", ["Hesaplanmıyor", "Toplam kira biliniyor", "Birimlere dağıtılıyor", "Çıktı başına maliyet olarak izleniyor"]],
      ["Kullanılmayan alan gelirleştirildi mi?", ["Düşünülmedi", "Gündemde", "Bir bölümü kiralandı", "Sistematik olarak yönetiliyor"]],
    ],
  },
  {
    k: "t-makine",
    n: "Makine ve ekipman",
    d: "Etkinlik, duruş ve yatırım kararı",
    rec: "Duruş kaydını dijitalleştirip OEE hesabı kurun; yatırım kararı çoğu kez ertelenir.",
    q: [
      ["Ekipman etkinliği (OEE) hesaplanıyor mu?", ["Hesaplanmıyor", "Elle, dönemsel", "Hatta sürekli hesaplanıyor", "Hedefe bağlı izleniyor"]],
      ["Duruş kayıtları nasıl tutuluyor?", ["Tutulmuyor", "Kâğıt üzerinde", "Dijital, nedeniyle birlikte", "Dijital ve kök neden analizli"]],
      ["Bakım yaklaşımınız nedir?", ["Arıza sonrası", "Takvime bağlı", "Duruma bağlı", "Veriye dayalı kestirimci"]],
      ["Hazırlık ve kalıp değişim süresi?", ["Ölçülmüyor", "Ölçülüyor", "Hat dışına taşındı", "Standartlaştı ve izleniyor"]],
      ["Az çalışan ekipman biliniyor mu?", ["Bilinmiyor", "Fark ediliyor", "Çalışma saatleri raporlanıyor", "Elden çıkarma veya havuzlama kararı verildi"]],
      ["Yatırım kararı neye dayanıyor?", ["Talep beyanına", "Bütçe uygunluğuna", "Kapasite analizine", "OEE ve senaryo analizine"]],
      ["Yedek parça stoğu nasıl yönetiliyor?", ["Takip edilmiyor", "Listeleniyor", "Kritiklik sınıflaması var", "Devir hızı ve maliyet izleniyor"]],
    ],
  },
  {
    k: "t-tek",
    n: "Teknoloji ve veri",
    d: "Sistemler, entegrasyon ve karar verisi",
    rec: "Mevcut sistemleri tek panoya bağlamak beş gün sürer; yeni yazılım almadan önce yapılır.",
    q: [
      ["Metrikleriniz nereden geliyor?", ["Elle hesaplanıyor", "Kısmen sistemden", "Çoğu sistemden", "Tamamı sistemden"]],
      ["Sistemler birbirine bağlı mı?", ["Hiçbiri birbirine bakmıyor", "İkili entegrasyonlar var", "Ortak veri katmanı var", "Tek panoda birleşiyor"]],
      ["Lisans envanteri var mı?", ["Yok", "Var ama güncel değil", "Güncel", "Kullanım oranıyla izleniyor"]],
      ["Yönetim raporu ne kadar gecikmeli?", ["Bir ay ve üzeri", "Haftalık", "Günlük", "Gerçek zamanlı"]],
      ["Veriyi kim görüyor?", ["Sadece üst yönetim", "Birim yöneticileri", "Ekip liderleri", "Kararı veren herkes, eşik uyarılı"]],
      ["Tekrarlayan işler otomatik mi?", ["Elle işler baskın", "Bazı işler otomatik", "Tekrarlayan işler otomatik", "Süreçler uçtan uca otomatik"]],
      ["Veri kalitesi kontrol ediliyor mu?", ["Edilmiyor", "Hata fark edilince düzeltiliyor", "Düzenli kontrol var", "Kalite kuralları otomatik işliyor"]],
      ["Yeni yazılım kararı neye dayanıyor?", ["İhtiyaç beyanına", "Satıcı sunumuna", "Mevcut kullanım analizine", "Kullanım ve süreç analizine"]],
    ],
  },
  {
    k: "t-dogal",
    n: "Doğal kaynak",
    d: "Enerji, su, atık ve rezerv",
    rec: "Süreç bazında sayaç kurulumu üç hafta; tüketimin nerede oluştuğunu görünür kılar.",
    q: [
      ["Enerji tüketimi hangi ayrıntıda ölçülüyor?", ["Yalnızca toplam fatura", "Bina bazında", "Süreç bazında", "Süreç bazında ve hedefli"]],
      ["Su tüketimi nasıl izleniyor?", ["Ölçülmüyor", "Toplam sayaç", "Birim bazında", "Birim bazında ve hedefli"]],
      ["Atık ve yan ürün ne oluyor?", ["Bertaraf ediliyor", "Kısmen ayrıştırılıyor", "Bir bölümü satılıyor", "Gelir kalemi olarak yönetiliyor"]],
      ["Tedarik sözleşmeleri nasıl yenileniyor?", ["Otomatik devam ediyor", "Dönemsel pazarlıkla", "Tüketim verisiyle", "Tüketim ve piyasa senaryosuyla"]],
      ["Kayıp oranı (hasat, üretim, dağıtım)?", ["Bilinmiyor", "Tahmini", "Ölçülüyor", "Ölçülüyor ve hedefe bağlı"]],
      ["Arazi veya rezerv kullanımı planlı mı?", ["Envanter yok", "Envanter var", "Verim haritası var", "Verim haritasına göre planlanıyor"]],
      ["Sürdürülebilirlik hedefi var mı?", ["Yok", "Beyan düzeyinde", "Ölçülen hedefler var", "Sözleşme ve prim hedeflerine bağlı"]],
    ],
  },
  {
    k: "t-olcum",
    n: "Ölçüm olgunluğu",
    d: "Baz dönem, formül ve doğrulama",
    rec: "Baz dönemi dondurup formülü yazılı hâle getirin; primli model ancak bundan sonra kurulabilir.",
    q: [
      ["Baz dönem nasıl belirleniyor?", ["Tanımlanmıyor", "Sonradan tahmin ediliyor", "Proje başında tanımlanıyor", "Dondurulup yazılı hâle getiriliyor"]],
      ["Metrik formülleri nerede duruyor?", ["Yazılı değil", "Sunumda", "Dokümante edilmiş", "Sürümlenmiş ve sözleşme eki"]],
      ["Veri kaynağı nedir?", ["Beyan", "Elle tutulan tablolar", "Sistem dışa aktarımı", "Doğrudan sistem bağlantısı"]],
      ["Sonuç kim tarafından doğrulanıyor?", ["Doğrulanmıyor", "İç ekip", "Yönetim veya müşteri", "Bağımsız doğrulayıcı"]],
      ["Aksiyonların sahibi belirli mi?", ["Belirsiz", "Birim düzeyinde", "Kişi düzeyinde", "Kişi, tarih ve beklenen etkiyle"]],
      ["Ölçüm aksiyona bağlanıyor mu?", ["Rapor raflarda kalıyor", "Bazı aksiyonlar başlıyor", "Aksiyon planı yürüyor", "Sonuç yeniden ölçülüyor"]],
      ["Kişisel veri nasıl işleniyor?", ["Kişi bazlı skor üretiliyor", "Kişi bazlı veri tutuluyor", "Rol bazında toplulaştırılıyor", "Kişi kimliği hiç tutulmuyor"]],
      ["Gözden geçirme ritmi nedir?", ["Yok", "Yıllık", "Çeyreklik", "Aylık, eşik uyarılı"]],
    ],
  },
];

export const TEST_BANDS: readonly Band[] = [
  [0, 35, "Ölçüm öncesi", "Bu alanda kararlar sezgiyle veriliyor; önce ölçüm altyapısı kurulur."],
  [35, 60, "Kısmi görünürlük", "Bazı göstergeler var ama karar verisi bütün değil."],
  [60, 80, "Ölçüm disiplini", "Ölçüm çalışıyor; kazanım aksiyona bağlandığında hızlanır."],
  [80, 101, "Verimetrik yönetim", "Bu alan veriyle yönetiliyor; kazanım sözleşmeye yazılabilir."],
];

export const TOTAL_QUESTIONS = TESTS.reduce((sum, t) => sum + t.q.length, 0);
