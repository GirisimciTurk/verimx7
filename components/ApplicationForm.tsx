"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

import { ROUTES } from "@/lib/site";
import {
  FIELD_RULES,
  RESOURCE_AREAS,
  checkEmail,
  checkPhone,
  checkText,
} from "@/lib/form-constants";

type Status = "idle" | "sending" | "sent";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  org: "",
  area: "",
  detail: "",
  consent: false,
  marketingConsent: false,
  website: "",
};

/**
 * Değerlendirme başvurusu formu.
 *
 * Doğrulama iki kez yapılır: burada erken geri bildirim için, sunucuda ise
 * gerçek kapı olarak. KVKK gereği aydınlatma onayı ile ticari ileti izni
 * ayrı kutulardır ve ticari ileti izni zorunlu değildir.
 */
export default function ApplicationForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const uid = useId();

  /**
   * useId() çıktısı ":" gibi CSS'te geçersiz karakterler içerebilir; bu yüzden
   * odak taşımada querySelector değil getElementById kullanılır (o, seçici
   * dili beklemez). Yine de id'yi güvenli hâle getirip saklıyoruz.
   */
  const safeUid = uid.replace(/[^a-zA-Z0-9_-]/g, "");
  const field = (name: keyof typeof EMPTY) => `${safeUid}-${name}`;

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(({ [key]: _removed, ...rest }) => rest);
  }

  /**
   * İstemci tarafı ön kontrol. Nihai kapı sunucudaki zod şemasıdır
   * (app/api/basvuru); buradaki amaç yalnızca erken geri bildirim, bu yüzden
   * zod istemci paketine hiç girmez.
   */
  function validate(): Record<string, string> {
    const next: Record<string, string> = {};

    const name = checkText(values.name, FIELD_RULES.name);
    if (name) next.name = name;

    const phone = checkPhone(values.phone);
    if (phone) next.phone = phone;

    const email = checkEmail(values.email);
    if (email) next.email = email;

    const org = checkText(values.org, FIELD_RULES.org);
    if (org) next.org = org;

    if (!values.area) next.area = "Bir kaynak alanı seçin.";

    const detail = checkText(values.detail, FIELD_RULES.detail);
    if (detail) next.detail = detail;

    if (!values.consent) next.consent = "Aydınlatma metni onayı gereklidir.";

    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setFormError("Formda eksik veya hatalı alanlar var.");
      // Odağı ilk hatalı alana taşı. Alan sırası ekrandaki sırayla aynı olsun.
      const order = ["name", "phone", "email", "org", "area", "detail", "consent"];
      const first = order.find((key) => key in found);
      if (first) document.getElementById(field(first as keyof typeof EMPTY))?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/basvuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim().toLowerCase(),
          org: values.org.trim(),
          area: values.area,
          detail: values.detail.trim(),
          consent: true,
          marketingConsent: values.marketingConsent,
          website: values.website,
        }),
      });

      if (response.ok) {
        setStatus("sent");
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: Record<string, string>;
      };
      if (payload.fields) setErrors(payload.fields);
      setFormError(payload.error ?? "Başvuru gönderilemedi. Lütfen tekrar deneyin.");
      setStatus("idle");
    } catch {
      setFormError(
        "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.",
      );
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="card elev-md"
        style={{ padding: "var(--space-8)", background: "var(--color-surface)" }}
      >
        <div
          role="status"
          style={{
            display: "grid",
            gap: "var(--space-3)",
            padding: "var(--space-8) 0",
            justifyItems: "center",
            textAlign: "center",
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 28 }}>
            Başvurunuz alındı
          </span>
          <span className="text-muted" style={{ fontSize: 15 }}>
            Ön görüşme daveti iki iş günü içinde iletilir.
          </span>
        </div>
      </div>
    );
  }

  return (
    <form
      className="card elev-md"
      style={{ padding: "var(--space-8)", background: "var(--color-surface)" }}
      onSubmit={onSubmit}
      noValidate
    >
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <div className="split-pair">
          <div className="field">
            <label htmlFor={field("name")}>Adınız Soyadınız *</label>
            <input
              id={field("name")}
              className="input"
              type="text"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${field("name")}-err` : undefined}
            />
            {errors.name && (
              <span className="field-error" id={`${field("name")}-err`}>
                {errors.name}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor={field("phone")}>Telefon Numaranız *</label>
            <input
              id={field("phone")}
              className="input"
              type="tel"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+90 5xx xxx xx xx"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? `${field("phone")}-err` : undefined}
            />
            {errors.phone && (
              <span className="field-error" id={`${field("phone")}-err`}>
                {errors.phone}
              </span>
            )}
          </div>
        </div>

        <div className="split-pair">
          <div className="field">
            <label htmlFor={field("email")}>E-posta Adresiniz *</label>
            <input
              id={field("email")}
              className="input"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? `${field("email")}-err` : undefined}
            />
            {errors.email && (
              <span className="field-error" id={`${field("email")}-err`}>
                {errors.email}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor={field("org")}>Kurum / Şirket *</label>
            <input
              id={field("org")}
              className="input"
              type="text"
              name="org"
              autoComplete="organization"
              value={values.org}
              onChange={(e) => set("org", e.target.value)}
              aria-invalid={errors.org ? true : undefined}
              aria-describedby={errors.org ? `${field("org")}-err` : undefined}
            />
            {errors.org && (
              <span className="field-error" id={`${field("org")}-err`}>
                {errors.org}
              </span>
            )}
          </div>
        </div>

        <fieldset
          className="field"
          style={{ border: 0, padding: 0, margin: 0 }}
          id={field("area")}
          tabIndex={-1}
        >
          <legend
            style={{
              fontSize: 12,
              marginBottom: 5,
              padding: 0,
              color: "color-mix(in srgb, var(--color-text) 70%, transparent)",
            }}
          >
            Kaynak Alanı Seçiniz *
          </legend>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-3)",
              marginTop: "var(--space-2)",
            }}
          >
            {RESOURCE_AREAS.map((area) => (
              <label className="radio" key={area}>
                <input
                  type="radio"
                  name="area"
                  value={area}
                  checked={values.area === area}
                  onChange={() => set("area", area)}
                />
                <span className="dot" />
                {area}
              </label>
            ))}
          </div>
          {errors.area && <span className="field-error">{errors.area}</span>}
        </fieldset>

        <div className="field">
          <label htmlFor={field("detail")}>
            Değerlendirme yapılmasını istediğiniz kaynak ile ilgili ayrıntılı bilgi veriniz *
          </label>
          <textarea
            id={field("detail")}
            className="input"
            name="detail"
            rows={4}
            value={values.detail}
            onChange={(e) => set("detail", e.target.value)}
            aria-invalid={errors.detail ? true : undefined}
            aria-describedby={errors.detail ? `${field("detail")}-err` : undefined}
          />
          {errors.detail && (
            <span className="field-error" id={`${field("detail")}-err`}>
              {errors.detail}
            </span>
          )}
        </div>

        {/* Bot tuzağı — gerçek kullanıcı görmez. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
          <label htmlFor={field("website")}>Web sitesi</label>
          <input
            id={field("website")}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>

        <label
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "flex-start",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          <input
            id={field("consent")}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            style={{
              marginTop: 3,
              width: 18,
              height: 18,
              flex: "none",
              accentColor: "var(--color-accent)",
            }}
            aria-invalid={errors.consent ? true : undefined}
          />
          <span>
            KVKK kapsamındaki{" "}
            <Link href={ROUTES.kvkk} target="_blank">
              Aydınlatma Metnini
            </Link>{" "}
            okudum, onaylıyorum. *
          </span>
        </label>
        {errors.consent && <span className="field-error">{errors.consent}</span>}

        <label
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "flex-start",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          <input
            id={field("marketingConsent")}
            type="checkbox"
            checked={values.marketingConsent}
            onChange={(e) => set("marketingConsent", e.target.checked)}
            style={{
              marginTop: 3,
              width: 18,
              height: 18,
              flex: "none",
              accentColor: "var(--color-accent)",
            }}
          />
          <span>
            Verimx7&rsquo;nin sektör raporları ve etkinlik duyurularını e-posta ile almak
            istiyorum. <span className="text-muted">(İsteğe bağlı)</span>
          </span>
        </label>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn btn-primary"
            type="submit"
            disabled={status === "sending"}
            style={{ fontSize: 16, padding: "14px 30px" }}
          >
            {status === "sending" ? "Gönderiliyor…" : "Gönder"}
          </button>
          <span
            role="alert"
            aria-live="assertive"
            style={{ fontSize: 13, color: "var(--color-accent-700)" }}
          >
            {formError}
          </span>
        </div>
      </div>
    </form>
  );
}
