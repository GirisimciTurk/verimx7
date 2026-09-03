import "server-only";

/**
 * Kayan pencere hız sınırlayıcı.
 *
 * Bellek içidir: tek örnek (instance) başına çalışır. Sunucusuz ortamda her
 * örnek kendi sayacını tutar, bu yüzden mutlak bir tavan değil kaba bir
 * kötüye kullanım freni sağlar. Trafik arttığında Upstash/Redis gibi
 * paylaşımlı bir sayaca geçilmelidir.
 *
 * IP tespiti bilinçli olarak temkinli: ters vekil başlıkları istemci
 * tarafından uydurulabilir. TRUST_PROXY açıkça ayarlanmadığı sürece
 * başlıklara güvenilmez ve sınır "güvenilmez kaynak" moduna düşer.
 */

type Bucket = { hits: number[]; lastSeen: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/** En az son görülen kovayı at (LRU). Süresi dolmuşları önce temizle. */
function evictOne(now: number, windowHint: number): void {
  let oldestKey: string | undefined;
  let oldestSeen = Infinity;

  for (const [key, bucket] of buckets) {
    // Penceresi çoktan dolmuş kovalar bedava yer açar.
    if (now - bucket.lastSeen > windowHint) {
      buckets.delete(key);
      return;
    }
    if (bucket.lastSeen < oldestSeen) {
      oldestSeen = bucket.lastSeen;
      oldestKey = key;
    }
  }

  if (oldestKey !== undefined) buckets.delete(oldestKey);
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= MAX_KEYS) evictOne(now, windowMs);
    bucket = { hits: [], lastSeen: now };
    buckets.set(key, bucket);
  }

  bucket.lastSeen = now;
  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= limit) {
    const oldestHit = bucket.hits[0]!;
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldestHit + windowMs - now) / 1000)),
    };
  }

  bucket.hits.push(now);
  return { ok: true, remaining: limit - bucket.hits.length, retryAfterSeconds: 0 };
}

/* ── İstemci kimliği ───────────────────────────────────────────────────── */

/**
 * TRUST_PROXY, uygulamanın önünde başlıkları YENİDEN YAZAN bir ters vekil
 * bulunduğunda açılır:
 *   TRUST_PROXY=vercel      → x-vercel-forwarded-for
 *   TRUST_PROXY=cloudflare  → cf-connecting-ip
 *   TRUST_PROXY=1           → x-forwarded-for'un SAĞDAN 1. değeri
 *   TRUST_PROXY=2           → sağdan 2. değer (iki vekil zinciri) …
 *
 * Neden sağdan: x-forwarded-for'un soluna istemci istediğini yazabilir.
 * Güvenilir olan, kendi vekilinizin eklediği en sağdaki değerlerdir.
 */
const TRUST_PROXY = process.env.TRUST_PROXY?.trim().toLowerCase() ?? "";

export type ClientIdentity = {
  /** Hız sınırı anahtarı. */
  key: string;
  /** Kaynak gerçekten güvenilir bir vekilden mi geldi? */
  trusted: boolean;
  /** Günlüğe/e-postaya yazılacak, insan okuyabilir değer. */
  display: string;
};

export function clientIdentity(headers: Headers): ClientIdentity {
  if (!TRUST_PROXY) {
    // Vekil yapılandırılmamış: başlıklar güvenilmez. Tek bir "unknown"
    // kovasına düşüp bütün ziyaretçileri birbirine kilitlemek yerine
    // durumu çağırana bildiririz; uç nokta kendi kararını verir.
    return { key: "untrusted", trusted: false, display: "doğrulanmadı" };
  }

  const pick = (value: string | null): string | undefined => {
    const v = value?.trim();
    return v ? v : undefined;
  };

  if (TRUST_PROXY === "vercel") {
    const ip = pick(headers.get("x-vercel-forwarded-for")) ?? pick(headers.get("x-real-ip"));
    if (ip) return { key: `ip:${ip}`, trusted: true, display: ip };
  }

  if (TRUST_PROXY === "cloudflare") {
    const ip = pick(headers.get("cf-connecting-ip"));
    if (ip) return { key: `ip:${ip}`, trusted: true, display: ip };
  }

  const hops = Number.parseInt(TRUST_PROXY, 10);
  if (Number.isInteger(hops) && hops > 0) {
    const chain = (headers.get("x-forwarded-for") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const ip = chain[chain.length - hops];
    if (ip) return { key: `ip:${ip}`, trusted: true, display: ip };
  }

  // TRUST_PROXY ayarlı ama beklenen başlık gelmedi: yapılandırma hatası.
  return { key: "untrusted", trusted: false, display: "doğrulanmadı" };
}
