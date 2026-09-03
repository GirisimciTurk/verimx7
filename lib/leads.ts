import "server-only";

import { CONTACT } from "./site";

/**
 * Talep (lead) teslimi.
 *
 * Site tek bir depoya bağlanmaz; yapılandırılmış her kanala paralel gönderir:
 *
 *   1. E-posta   — RESEND_API_KEY + LEAD_TO_EMAIL   (Resend REST API, SDK gerekmez)
 *   2. Webhook   — LEAD_WEBHOOK_URL                 (CRM / Zapier / Make / n8n)
 *   3. Dosya     — LEAD_LOG_DIR                     (kendi sunucunuzda çalışıyorsanız)
 *
 * Hiçbir kanal yapılandırılmamışsa üretimde talep KABUL EDİLMEZ: ziyaretçiye
 * "aldık" demek ama kaydı hiçbir yere yazmamak, en kötü hata biçimidir.
 * Bunun yerine doğrudan e-posta/WhatsApp'a yönlendirilir.
 */

export type LeadKind = "basvuru" | "rapor";

export type LeadPayload = {
  kind: LeadKind;
  /** Günlüklerde kişisel veri yerine anılacak kısa referans. */
  ref?: string;
  /** Türkçe başlık — e-posta konusu ve webhook özetinde kullanılır. */
  title: string;
  /** Sıralı alan listesi; e-posta gövdesi bu sırayla üretilir. */
  fields: Array<{ label: string; value: string }>;
  /** Ham veri — webhook tüketicileri için. */
  raw: Record<string, unknown>;
  meta: {
    receivedAt: string;
    ip: string;
    userAgent: string;
    referer: string | null;
  };
};

export type DeliveryResult = {
  delivered: boolean;
  channels: string[];
  errors: string[];
};

function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

export function hasDeliveryChannel(): boolean {
  return Boolean(
    (env("RESEND_API_KEY") && env("LEAD_TO_EMAIL")) || env("LEAD_WEBHOOK_URL") || env("LEAD_LOG_DIR"),
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml(lead: LeadPayload): string {
  const rows = lead.fields
    .map(
      (f) =>
        `<tr><td style="padding:6px 14px 6px 0;vertical-align:top;color:#575070;white-space:nowrap">${escapeHtml(
          f.label,
        )}</td><td style="padding:6px 0;vertical-align:top;color:#1c1730;white-space:pre-wrap">${escapeHtml(
          f.value,
        )}</td></tr>`,
    )
    .join("");

  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#1c1730">
<h2 style="margin:0 0 16px;font-size:20px;color:#46237c">${escapeHtml(lead.title)}</h2>
<table style="border-collapse:collapse">${rows}</table>
<hr style="margin:24px 0;border:0;border-top:1px solid #e6e1f2" />
<p style="font-size:12px;color:#6f6885;margin:0">
Alındı: ${escapeHtml(lead.meta.receivedAt)}<br />
IP: ${escapeHtml(lead.meta.ip)}<br />
Tarayıcı: ${escapeHtml(lead.meta.userAgent)}<br />
Kaynak: ${escapeHtml(lead.meta.referer ?? "—")}
</p>
</div>`;
}

function renderText(lead: LeadPayload): string {
  const rows = lead.fields.map((f) => `${f.label}: ${f.value}`).join("\n");
  return `${lead.title}\n\n${rows}\n\n---\nAlındı: ${lead.meta.receivedAt}\nIP: ${lead.meta.ip}\nTarayıcı: ${lead.meta.userAgent}\nKaynak: ${lead.meta.referer ?? "—"}\n`;
}

async function sendEmail(lead: LeadPayload): Promise<void> {
  const apiKey = env("RESEND_API_KEY");
  const to = env("LEAD_TO_EMAIL");
  if (!apiKey || !to) throw new Error("email kanalı yapılandırılmadı");

  const from = env("LEAD_FROM_EMAIL") ?? `Verimx7 <onboarding@resend.dev>`;
  const replyTo = lead.fields.find((f) => f.label === "E-posta")?.value;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      subject: lead.title,
      html: renderHtml(lead),
      text: renderText(lead),
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

async function sendWebhook(lead: LeadPayload): Promise<void> {
  const url = env("LEAD_WEBHOOK_URL");
  if (!url) throw new Error("webhook kanalı yapılandırılmadı");

  const secret = env("LEAD_WEBHOOK_SECRET");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "X-Verimx7-Secret": secret } : {}),
    },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Webhook ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

async function appendToFile(lead: LeadPayload): Promise<void> {
  const dir = env("LEAD_LOG_DIR");
  if (!dir) throw new Error("dosya kanalı yapılandırılmadı");

  // Sunucusuz ortamda dosya sistemi kalıcı değildir; bu kanal yalnızca
  // kendi sunucunuzda (VPS / konteyner) anlamlıdır.
  const { mkdir, appendFile } = await import("node:fs/promises");
  const { join } = await import("node:path");

  await mkdir(dir, { recursive: true });
  const day = lead.meta.receivedAt.slice(0, 10);
  await appendFile(join(dir, `${lead.kind}-${day}.jsonl`), `${JSON.stringify(lead)}\n`, "utf8");
}

export async function deliverLead(lead: LeadPayload): Promise<DeliveryResult> {
  const ref = lead.ref ?? "-";
  const tasks: Array<{ name: string; run: () => Promise<void> }> = [];

  if (env("RESEND_API_KEY") && env("LEAD_TO_EMAIL")) tasks.push({ name: "email", run: () => sendEmail(lead) });
  if (env("LEAD_WEBHOOK_URL")) tasks.push({ name: "webhook", run: () => sendWebhook(lead) });
  if (env("LEAD_LOG_DIR")) tasks.push({ name: "file", run: () => appendToFile(lead) });

  // Yapılandırılmış kanal yoksa: üretimde uç nokta bu durumu 503 ile
  // karşılar ve buraya hiç gelinmez. Geliştirmede yerel kolaylık olsun diye
  // yük konsola yazılır — bu yolun ÜRETİMDE çalışmaması bilinçlidir.
  if (tasks.length === 0) {
    console.warn(
      `[verimx7] Teslim kanalı yapılandırılmadı (${lead.kind}/${ref}). ` +
        `Yayına almadan önce RESEND_API_KEY+LEAD_TO_EMAIL, LEAD_WEBHOOK_URL veya LEAD_LOG_DIR ayarlayın. ` +
        `İletişim: ${CONTACT.email}`,
    );
    if (process.env.NODE_ENV !== "production") {
      console.info(`[verimx7:lead:dev]`, JSON.stringify(lead));
    }
    return { delivered: false, channels: [], errors: ["yapılandırılmış kanal yok"] };
  }

  const settled = await Promise.allSettled(tasks.map((t) => t.run()));

  const channels: string[] = [];
  const errors: string[] = [];
  settled.forEach((r, i) => {
    if (r.status === "fulfilled") channels.push(tasks[i]!.name);
    else errors.push(`${tasks[i]!.name}: ${r.reason instanceof Error ? r.reason.message : String(r.reason)}`);
  });

  if (channels.length === 0) {
    // Günlüğe KİŞİSEL VERİ YAZILMAZ. Uygulama günlükleri genellikle
    // erişimi geniş, saklama süresi tanımsız ve KVKK aydınlatma metninde
    // sayılmamış bir yerdir; başvurunun tamamını oraya düşürmek veri
    // minimizasyonuna aykırıdır. Yalnızca teşhis için gereken iz kalır.
    console.error(
      `[verimx7] Talep hiçbir kanala teslim edilemedi. tür=${lead.kind} ref=${ref}`,
      errors,
    );
  } else if (errors.length > 0) {
    console.warn(`[verimx7] Bazı kanallar başarısız oldu (ref=${ref}):`, errors);
  }

  return { delivered: channels.length > 0, channels, errors };
}
