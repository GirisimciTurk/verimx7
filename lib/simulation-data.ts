/**
 * Verim Simülasyonu — içerik ve katsayılar.
 *
 * Beş kaynak alanında beş karar; her karar bir sonraki durumu belirler.
 * Simülasyon tarayıcıda çalışır ve TEMSİLİ katsayılar kullanır: burada
 * şirketin ölçüm formülü yoktur, yalnızca karar alışkanlığını gösteren bir
 * anlatı vardır. Bu yüzden veri istemciye inebilir; hızlı tahmin motoru
 * (lib/engine.ts) ise sunucuda kalır.
 *
 * Endeks 0–100 arasında bir "verim endeksi"dir; birikimli etki milyon ₺
 * cinsinden temsili bir büyüklüktür ve sektör çarpanıyla ölçeklenir.
 */

import type { SimulationSectorKey } from "./form-constants";

export type AreaKey = "insan" | "mekan" | "makine" | "tek" | "dogal";

export const AREA_KEYS: readonly AreaKey[] = ["insan", "mekan", "makine", "tek", "dogal"];

export const AREA_NAMES: Record<AreaKey, string> = {
  insan: "İnsan",
  mekan: "Mekân",
  makine: "Makine",
  tek: "Teknoloji",
  dogal: "Doğal kaynak",
};

/** Aşama sırası: her aşama bir kaynak alanıdır. */
export const STAGE_NAMES = ["İnsan", "Mekân", "Makine", "Teknoloji", "Doğal kaynak"] as const;

export type SectorDef = {
  label: string;
  note: string;
  /** Birikimli etkinin sektör çarpanı. */
  f: number;
  /** Temsili sektör ortalaması (endeks). */
  bench: number;
};

export const SIMULATION_SECTOR_DEFS: Record<SimulationSectorKey, SectorDef> = {
  sanayi: { label: "Sanayi / üretim", note: "1.400 çalışan, iki vardiya, tek tesis", f: 1, bench: 48 },
  tarim: { label: "Tarım ve doğal kaynak", note: "4.200 dekar arazi, mevsimsel kadro", f: 0.7, bench: 44 },
  hizmet: { label: "Hizmet / kurumsal ofis", note: "860 çalışan, altı lokasyon", f: 0.85, bench: 51 },
};

export const SIMULATION_SECTOR_LABELS: Record<SimulationSectorKey, string> = {
  sanayi: SIMULATION_SECTOR_DEFS.sanayi.label,
  tarim: SIMULATION_SECTOR_DEFS.tarim.label,
  hizmet: SIMULATION_SECTOR_DEFS.hizmet.label,
};

export type Choice = {
  /** Seçenek başlığı. */
  t: string;
  /** Sonucu anlatan alt satır. */
  w: string;
  /** Endekse etkisi. */
  i: number;
  /** Birikimli etkiye katkısı (milyon ₺, sektör çarpanı öncesi). */
  c: number;
  /** Alan puanlarına etkisi. */
  a: Partial<Record<AreaKey, number>>;
  /** Doluysa "kaçırılan fırsat" olarak listelenir. */
  m?: string;
  /** Sonraki düğüm; "end" simülasyonu bitirir. */
  to: NodeKey | "end";
};

export type NodeKey =
  | "s1"
  | "s2a"
  | "s2b"
  | "s2c"
  | "s3a"
  | "s3b"
  | "s3c"
  | "s4a"
  | "s4b"
  | "s4c"
  | "s5a"
  | "s5b"
  | "s5c";

export type Node = {
  stage: 1 | 2 | 3 | 4 | 5;
  area: (typeof STAGE_NAMES)[number];
  title: string;
  text: string;
  ch: readonly [Choice, Choice, Choice];
};

export const START_NODE: NodeKey = "s1";
export const START_INDEX = 42;
export const START_AREA_SCORE = 40;

export const TREE: Record<NodeKey, Node> = {
  s1: {
    stage: 1,
    area: "İnsan",
    title: "Birim müdürleri kadro istiyor",
    text: "“İş yükü arttı, on iki kişi daha lazım.” Elinizdeki tek sistem verisi şu: beş onay katmanı ve haftada kişi başı 7,4 saat toplantı.",
    ch: [
      { t: "Kadroyu onayla, hızı kaybetme", w: "Talep karşılanır, maliyet tabanı büyür.", i: -6, c: -34, a: { insan: -8 }, m: "Mevcut kadronun ne kadarının asıl işe gittiği hiç ölçülmedi.", to: "s2a" },
      { t: "İki hafta ölç: kim neye zaman harcıyor", w: "Karar gecikir, veri gelir.", i: 9, c: 18, a: { insan: 14 }, to: "s2b" },
      { t: "Önce onay katmanlarını üçe indir", w: "Kararlar hızlanır, kadro sorusu ertelenir.", i: 5, c: 12, a: { insan: 9, tek: 3 }, to: "s2c" },
    ],
  },
  s2a: {
    stage: 2,
    area: "Mekân",
    title: "Yeni kadro nereye oturacak?",
    text: "Genel müdürlük katında kırk masa boş görünüyor, ama hangi ekibin ne kadar kullandığını kimse bilmiyor.",
    ch: [
      { t: "Yeni kat kirala", w: "Sorun bugün çözülür, sabit gider kalıcı olur.", i: -7, c: -42, a: { mekan: -10 }, m: "Boş masaların gerçek doluluğu ölçülmeden yeni alan kiralandı.", to: "s3a" },
      { t: "Doluluk sayacı tak, dört hafta izle", w: "Kararı veriye bağlarsınız.", i: 8, c: 16, a: { mekan: 13 }, to: "s3b" },
      { t: "Hibrit düzene geç, masayı paylaştır", w: "Alan ihtiyacı düşer, çalışma biçimi değişir.", i: 6, c: 22, a: { mekan: 10, insan: 2 }, to: "s3b" },
    ],
  },
  s2b: {
    stage: 2,
    area: "Mekân",
    title: "Ölçüm çıktı: kadronun %22’si asıl işin dışında",
    text: "Aynı yöntemi mekâna taşımak için sayaç ve analiz bütçesi istiyorsunuz. Yönetim “bu kadar ölçüm şart mı?” diye soruyor.",
    ch: [
      { t: "Bütçeyi onayla, mekânı da ölç", w: "Ölçüm disiplini ikinci alana yayılır.", i: 7, c: 20, a: { mekan: 12 }, to: "s3b" },
      { t: "Şimdilik insanla ilgilen, mekân beklesin", w: "Odak korunur, bir alan karanlıkta kalır.", i: 2, c: 6, a: { mekan: -3 }, m: "Mekân kullanımı ölçüm dışında bırakıldı.", to: "s3a" },
      { t: "Mekân kararını birim liderlerine bırak", w: "Sahiplik artar, standart zayıflar.", i: 3, c: 10, a: { mekan: 4, insan: 4 }, to: "s3c" },
    ],
  },
  s2c: {
    stage: 2,
    area: "Mekân",
    title: "Katmanlar azaldı, bir gerçek ortaya çıktı",
    text: "Kararlar hızlanınca depo ve idari alanın yarısının yılda yalnızca iki ay kullanıldığı görüldü.",
    ch: [
      { t: "Atıl alanı başka bir işletmeye kirala", w: "Boş alan gelir kalemine döner.", i: 9, c: 36, a: { mekan: 14 }, to: "s3c" },
      { t: "Kendi operasyonuna dönüştür", w: "Kapasite içeride kullanılır.", i: 7, c: 24, a: { mekan: 11 }, to: "s3b" },
      { t: "Dokunma, esnek kalsın", w: "Rahatlık korunur, alan boş durur.", i: 0, c: -8, a: { mekan: -4 }, m: "Yılın on ayı boş kalan alan gelirleştirilmedi.", to: "s3a" },
    ],
  },
  s3a: {
    stage: 3,
    area: "Makine",
    title: "Operasyon yeni yatırım istiyor",
    text: "“Hat yetmiyor.” Mevcut ekipmanın etkinliği bugüne kadar hiç hesaplanmadı; duruş kayıtları kâğıtta.",
    ch: [
      { t: "Yatırımı onayla", w: "Kapasite artar, geri ödeme belirsiz kalır.", i: -8, c: -58, a: { makine: -9 }, m: "Ekipman etkinliği hesaplanmadan yatırım kararı verildi.", to: "s4a" },
      { t: "Duruş kayıtlarını dijitalleştir, OEE’yi hesapla", w: "Yatırım kararı iki ay erteleniyor.", i: 10, c: 26, a: { makine: 15 }, to: "s4b" },
      { t: "Vardiya planını değiştir, kapasiteyi dene", w: "Hızlı deneme, kadroya yük biner.", i: 5, c: 14, a: { makine: 8, insan: -2 }, to: "s4b" },
    ],
  },
  s3b: {
    stage: 3,
    area: "Makine",
    title: "OEE %61 çıktı",
    text: "Kaybın üçte ikisi kalıp değişimi ve plansız duruş. Rapor masada; şimdi ne yapacağınıza karar vermek gerekiyor.",
    ch: [
      { t: "Hazırlık işlerini hat dışına taşı", w: "Duruş süresi kısalır, çıktı artar.", i: 11, c: 34, a: { makine: 16 }, to: "s4b" },
      { t: "Bakımı planlıya çevir", w: "Arıza azalır, etki daha yavaş gelir.", i: 8, c: 22, a: { makine: 12 }, to: "s4c" },
      { t: "Rapor yeterli, şimdilik aksiyon yok", w: "Ölçüm var, değişiklik yok.", i: -3, c: -12, a: { makine: -5 }, m: "Ölçüm yapıldı ama hiçbir aksiyona bağlanmadı.", to: "s4a" },
    ],
  },
  s3c: {
    stage: 3,
    area: "Makine",
    title: "Makine parkının %30’u yılda 400 saatin altında çalışıyor",
    text: "Nakit rahatladı. Bu makineler bilançoda duruyor, sahada neredeyse hiç dönmüyor.",
    ch: [
      { t: "Az çalışan makineleri elden çıkar", w: "Sabit gider düşer, esneklik azalır.", i: 8, c: 30, a: { makine: 12 }, to: "s4c" },
      { t: "Ortak kullanım havuzuna aç", w: "Atıl kapasite başkasının işine yarar, gelir gelir.", i: 9, c: 28, a: { makine: 13 }, to: "s4b" },
      { t: "Yedek kalsın, dursun", w: "Risk algısı düşer, kaynak atıl kalır.", i: -2, c: -14, a: { makine: -6 }, m: "Atıl makine parkı ne satıldı ne gelirleştirildi.", to: "s4a" },
    ],
  },
  s4a: {
    stage: 4,
    area: "Teknoloji",
    title: "Üç sistem var, hiçbiri birbirine bakmıyor",
    text: "Yönetim raporu hâlâ elle hazırlanıyor ve toplantıya bir hafta gecikmeli geliyor.",
    ch: [
      { t: "Yeni bir ERP al", w: "Büyük proje başlar, mevcut sistemler yine ölçülmez.", i: -5, c: -46, a: { tek: -6 }, m: "Eldeki sistemlerin kullanım oranı ölçülmeden yenisi alındı.", to: "s5a" },
      { t: "Mevcut sistemleri tek panoya bağla", w: "Veri aynı ekranda birleşir.", i: 10, c: 24, a: { tek: 14 }, to: "s5b" },
      { t: "Elle raporu haftalıktan aylığa düşür", w: "İş yükü azalır, karar verisi yavaşlar.", i: 1, c: 4, a: { tek: -2 }, m: "Karar verisi bir ay gecikmeli hâle getirildi.", to: "s5a" },
    ],
  },
  s4b: {
    stage: 4,
    area: "Teknoloji",
    title: "Pano kuruldu, metrikler sistemden geliyor",
    text: "Lisans envanteri çıkınca 380 lisansın bir yıldır hiç açılmadığı görülüyor.",
    ch: [
      { t: "Kullanılmayan lisansları kapat", w: "Doğrudan gider düşer.", i: 9, c: 26, a: { tek: 13 }, to: "s5b" },
      { t: "Eğitimle kullanımı artır", w: "Yatırım işe yarar hâle gelir.", i: 7, c: 18, a: { tek: 10, insan: 4 }, to: "s5c" },
      { t: "Sözleşme yenilemesini bekle", w: "Bugün iş yok, fatura aynı.", i: 0, c: -10, a: { tek: -3 }, m: "Kullanılmayan lisanslar bir yıl daha ödendi.", to: "s5a" },
    ],
  },
  s4c: {
    stage: 4,
    area: "Teknoloji",
    title: "Veri akıyor: bu ekran kimde olacak?",
    text: "Bakım ve üretim verisi artık canlı. Soru teknik değil, yetki sorusu.",
    ch: [
      { t: "Birim liderlerine aç, eşik uyarısı kur", w: "Kararı veren kişi veriyi görür.", i: 11, c: 30, a: { tek: 15, insan: 5 }, to: "s5c" },
      { t: "Sadece üst yönetim görsün", w: "Kontrol artar, sahadaki karar yavaşlar.", i: 3, c: 8, a: { tek: 5 }, m: "Veri, kararı verecek kişiye hiç ulaşmadı.", to: "s5b" },
      { t: "Dışarıdan danışmana bırak", w: "Yorum gelir, yetkinlik dışarıda kalır.", i: 2, c: 6, a: { tek: 3 }, to: "s5b" },
    ],
  },
  s5a: {
    stage: 5,
    area: "Doğal kaynak",
    title: "Enerji ve su faturaları iki yılda %70 arttı",
    text: "Tüketimin hangi süreçte oluştuğu bilinmiyor; tek veri toplam fatura.",
    ch: [
      { t: "Tasarruf genelgesi yayınla", w: "Herkes uyarılır, kimse ölçmez.", i: -2, c: -6, a: { dogal: -4 }, m: "Tüketim süreç bazında hiç ölçülmedi.", to: "end" },
      { t: "Süreç bazında sayaç tak", w: "Kayıp nerede oluşuyor, görünür olur.", i: 10, c: 22, a: { dogal: 15 }, to: "end" },
      { t: "Tedarikçiyle yeniden pazarlık", w: "Birim fiyat düşer, tüketim aynı kalır.", i: 4, c: 14, a: { dogal: 6 }, to: "end" },
    ],
  },
  s5b: {
    stage: 5,
    area: "Doğal kaynak",
    title: "Ölçüm altyapısı hazır",
    text: "Su ve enerji verisi süreçlere bağlanabilir durumda. Hedef koymak artık teknik bir sorun değil.",
    ch: [
      { t: "Tüketimi birime böl, hedef koy", w: "Sorumluluk netleşir, tüketim düşer.", i: 12, c: 32, a: { dogal: 16 }, to: "end" },
      { t: "Atık ve yan ürünü gelirleştir", w: "Kayıp kalem gelir kalemine döner.", i: 10, c: 40, a: { dogal: 13 }, to: "end" },
      { t: "Şimdilik izle, hedef koymayalım", w: "Veri birikir, kimse hesap vermez.", i: 2, c: 0, a: { dogal: 2 }, m: "Ölçülen tüketim hiçbir hedefe bağlanmadı.", to: "end" },
    ],
  },
  s5c: {
    stage: 5,
    area: "Doğal kaynak",
    title: "Birimler kendi verisini görüyor",
    text: "Atık ve yan ürün akışı da ölçülebilir hâle geldi. Elinizde hem veri hem sahiplik var.",
    ch: [
      { t: "Yan ürünü satılabilir ürüne çevir", w: "Atık kalemi yeni bir gelir hattı olur.", i: 12, c: 44, a: { dogal: 17 }, to: "end" },
      { t: "Kaynak kullanımını sözleşme hedefine bağla", w: "Kazanım kalıcı hâle gelir.", i: 11, c: 34, a: { dogal: 14 }, to: "end" },
      { t: "Yeterli, buraya kadar", w: "Kazanım korunur, son adım atılmaz.", i: 4, c: 8, a: { dogal: 4 }, to: "end" },
    ],
  },
};

/** [alt sınır, üst sınır (hariç), etiket, açıklama] */
export type Band = readonly [number, number, string, string];

export const RESULT_BANDS: readonly Band[] = [
  [0, 35, "Ölçüm öncesi", "Kararlar sezgiyle veriliyor. Bu bantta önce ölçüm altyapısı kurulur; verim artışı ancak ondan sonra konuşulabilir."],
  [35, 55, "Kısmi görünürlük", "Bazı alanlar ölçülüyor, bazıları karanlıkta. Kazanç genelde ölçülen alanda birikiyor, kayıp ölçülmeyen alanda saklanıyor."],
  [55, 75, "Ölçüm disiplini", "Ölçümü aksiyona bağlamayı öğrenmiş bir kurum profili. Bu bantta artış hızlanır ve sözleşmeye yazılabilir hâle gelir."],
  [75, 101, "Verimetrik yönetim", "Kaynağın nereye gittiği biliniyor, kararlar veriyle veriliyor. Atıl kapasitenin büyük bölümü zaten gelirleştirilmiş."],
];

export function bandFor(bands: readonly Band[], value: number): Band {
  return bands.find((b) => value >= b[0] && value < b[1]) ?? bands[bands.length - 1]!;
}

export const WEAK_NOTES: Record<AreaKey, string> = {
  insan: "Kadro kararları hâlâ talebe göre veriliyor, kullanım oranına göre değil.",
  mekan: "Alanın gerçek doluluğu bilinmiyor; kira ve amortisman boşa gidiyor.",
  makine: "Ekipman etkinliği ölçülmüyor; yatırım kararları duruş verisi olmadan alınıyor.",
  tek: "Sistemler var ama veri karar verene ulaşmıyor.",
  dogal: "Enerji, su ve yan ürün akışı süreç bazında ölçülmüyor.",
};

export const STRONG_NOTES: Record<AreaKey, string> = {
  insan: "Kadronun nereye zaman harcadığı ölçülür hâle geldi.",
  mekan: "Alan kullanımı veriyle yönetiliyor, atıl metrekare gelirleşti.",
  makine: "Duruş ve hazırlık kayıpları görünür; kapasite yatırımsız açıldı.",
  tek: "Metrikler sistemden geliyor, pano karar verenin ekranında.",
  dogal: "Tüketim ve yan ürün akışı hedefe bağlı yönetiliyor.",
};

export const STEP_NOTES: Record<AreaKey, string> = {
  insan: "Rol bazlı zaman ölçümü — iki hafta.",
  mekan: "Doluluk sayacı ve alan envanteri — dört hafta.",
  makine: "Duruş kaydı dijitalleştirme ve OEE hesabı — üç hafta.",
  tek: "Mevcut sistemleri tek panoya bağlama — beş gün.",
  dogal: "Süreç bazında sayaç kurulumu — üç hafta.",
};
