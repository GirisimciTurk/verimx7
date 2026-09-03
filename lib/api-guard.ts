import "server-only";

import { clientIdentity, rateLimit, type ClientIdentity } from "./ratelimit";

/**
 * Uç noktaların paylaştığı iki koruma: gövde boyutu ve hız sınırı.
 */

/* ── Gövde boyutu ──────────────────────────────────────────────────────── */

export class BodyTooLarge extends Error {}

/**
 * JSON gövdesini boyut sınırıyla okur.
 *
 * Content-Length varsa önce ona bakar; yoksa (chunked aktarım) akışı sayarak
 * okur ve sınırı aşınca iptal eder. Amaç, tek istekle sunucu belleğini
 * şişirmeyi engellemek.
 */
export async function readJson(request: Request, maxBytes: number): Promise<unknown> {
  const declared = request.headers.get("content-length");
  if (declared) {
    const size = Number.parseInt(declared, 10);
    if (Number.isFinite(size) && size > maxBytes) throw new BodyTooLarge();
  }

  const body = request.body;
  if (!body) {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) throw new BodyTooLarge();
    return JSON.parse(text);
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new BodyTooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(merged));
}

/* ── Hız sınırı ────────────────────────────────────────────────────────── */

export type GuardPolicy = {
  /** Vekil doğrulanmışsa kişi başına sınır. */
  perClient: { limit: number; windowMs: number };
  /**
   * Vekil doğrulanmamışsa uygulanan SİTE GENELİ sınır. IP'ye güvenemediğimiz
   * için tek kova kullanılır; meşru kullanımı kesmeyecek ama otomatik
   * kötüye kullanımı frenleyecek kadar geniş tutulmalıdır.
   */
  global: { limit: number; windowMs: number };
};

export type GuardResult = {
  ok: boolean;
  retryAfterSeconds: number;
  identity: ClientIdentity;
};

let warnedAboutProxy = false;

export function guard(request: Request, scope: string, policy: GuardPolicy): GuardResult {
  const identity = clientIdentity(request.headers);

  if (identity.trusted) {
    const result = rateLimit(
      `${scope}:${identity.key}`,
      policy.perClient.limit,
      policy.perClient.windowMs,
    );
    return { ok: result.ok, retryAfterSeconds: result.retryAfterSeconds, identity };
  }

  if (!warnedAboutProxy) {
    warnedAboutProxy = true;
    console.warn(
      "[verimx7] TRUST_PROXY ayarlı değil; istemci IP'sine güvenilmiyor. " +
        "Hız sınırı site geneli tek kovaya düştü. Ters vekil arkasındaysanız " +
        "TRUST_PROXY=vercel | cloudflare | <hop sayısı> ayarlayın.",
    );
  }

  const result = rateLimit(`${scope}:global`, policy.global.limit, policy.global.windowMs);
  return { ok: result.ok, retryAfterSeconds: result.retryAfterSeconds, identity };
}
