"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { FIELD_RULES, checkEmail, checkText } from "@/lib/form-constants";
import { ROUTES, SECTIONS } from "@/lib/site";

type Status = "idle" | "sending" | "sent";

/** Panelin kendiliğinden açık geldiği en dar ekran genişliği. */
const OPEN_MIN_WIDTH = 1240;

/**
 * Sağ kenara yapışık kısa başvuru paneli.
 *
 * Geniş ekranda açık gelir; dar ekranda içeriği örtmemek için kapalı başlar
 * ve yalnızca sekmesi görünür. Sunucu her zaman kapalı hâli basar: açık
 * gelmesi gereken ekranlarda panel ilk karede kayarak açılır, böylece
 * hidrasyon uyuşmazlığı olmaz.
 *
 * Ana sayfada tam ekran açılış videosu varken panel videonun üstüne
 * açılmaz; video ekrandan çıkınca bir kez açılır (kullanıcı o ana kadar
 * sekmeye dokunmadıysa).
 *
 * Kapalıyken gövde `inert`: sekme sırasından ve erişilebilirlik ağacından
 * çıkar; ekran dışındaki girdilere odak kaçmaz.
 *
 * Kısa form yalnızca ad, kurum ve e-posta ister; KVKK aydınlatma onayı yine
 * de zorunludur — kişisel veri toplanan her noktada.
 */
export default function SideForm() {
  const [open, setOpen] = useState(false);
  const touched = useRef(false);
  const [values, setValues] = useState({ name: "", org: "", email: "", consent: false, website: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const bodyId = `${uid}-body`;

  useEffect(() => {
    if (window.innerWidth < OPEN_MIN_WIDTH) return;
    const opener = document.getElementById(SECTIONS.acilis);
    if (!opener) {
      setOpen(true);
      return;
    }
    // "Keşfedin" çapası videonun alt şeridini ekranda bırakır; çoğu
    // çıktıysa yeterli sayılır.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || entry.intersectionRatio >= 0.25) return;
        observer.disconnect();
        if (!touched.current) setOpen(true);
      },
      { threshold: [0, 0.25] },
    );
    observer.observe(opener);
    return () => observer.disconnect();
  }, []);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (error) setError("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem =
      checkText(values.name, FIELD_RULES.name) ??
      checkText(values.org, FIELD_RULES.org) ??
      checkEmail(values.email) ??
      (values.consent ? undefined : "Aydınlatma metni onayı gereklidir.");
    if (problem) {
      setError(problem);
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/basvuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: "kisa",
          name: values.name.trim(),
          org: values.org.trim(),
          email: values.email.trim().toLowerCase(),
          consent: true,
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
      setError(
        payload.fields ? Object.values(payload.fields)[0]! : payload.error ?? "Gönderilemedi. Lütfen tekrar deneyin.",
      );
      setStatus("idle");
    } catch {
      setError("Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.");
      setStatus("idle");
    }
  }

  return (
    <aside className="side-form" data-open={open} aria-label="Hızlı başvuru paneli">
      <button
        className="side-tab"
        type="button"
        onClick={() => {
          touched.current = true;
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        {open ? "Kapat" : "Başvuru formu"}
      </button>

      <div id={bodyId} className="side-body card elev-lg" inert={open ? undefined : true}>
        <div style={{ display: "grid", gap: 4 }}>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 20,
              lineHeight: 1.2,
              color: "var(--color-accent-800)",
            }}
          >
            Değerlendirme başvurusu
          </span>
          <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>
            Beş günlük teşhis için ön görüşme.
          </span>
        </div>

        {status === "sent" ? (
          <div
            role="status"
            style={{
              display: "grid",
              gap: "var(--space-2)",
              padding: "var(--space-4)",
              background: "var(--color-accent-2-100)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 17,
                color: "var(--color-accent-2-800)",
              }}
            >
              Başvurunuz alındı
            </span>
            <span style={{ fontSize: 13, color: "var(--color-neutral-800)" }}>
              İki iş günü içinde ön görüşme için dönüş yapılacak.
            </span>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: "var(--space-2)" }}>
            <label className="sr-only" htmlFor={`${uid}-name`}>
              Ad soyad
            </label>
            <input
              id={`${uid}-name`}
              className="input"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Ad soyad"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
            />
            <label className="sr-only" htmlFor={`${uid}-org`}>
              Kurum
            </label>
            <input
              id={`${uid}-org`}
              className="input"
              type="text"
              name="org"
              autoComplete="organization"
              placeholder="Kurum"
              value={values.org}
              onChange={(e) => set("org", e.target.value)}
            />
            <label className="sr-only" htmlFor={`${uid}-email`}>
              Kurumsal e-posta
            </label>
            <input
              id={`${uid}-email`}
              className="input"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Kurumsal e-posta"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
            />

            {/* Bot tuzağı — gerçek kullanıcı görmez. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
              <label htmlFor={`${uid}-website`}>Web sitesi</label>
              <input
                id={`${uid}-website`}
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
                gap: "var(--space-2)",
                alignItems: "flex-start",
                fontSize: 12,
                lineHeight: 1.45,
                color: "var(--color-neutral-800)",
              }}
            >
              <input
                type="checkbox"
                checked={values.consent}
                onChange={(e) => set("consent", e.target.checked)}
                style={{
                  marginTop: 2,
                  width: 16,
                  height: 16,
                  flex: "none",
                  accentColor: "var(--color-accent)",
                }}
              />
              <span>
                KVKK{" "}
                <Link href={ROUTES.kvkk} target="_blank">
                  Aydınlatma Metnini
                </Link>{" "}
                okudum, onaylıyorum.
              </span>
            </label>

            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={status === "sending"}
              style={{ width: "100%" }}
            >
              {status === "sending" ? "Gönderiliyor…" : "Başvuruyu gönder"}
            </button>
            <span
              role="alert"
              aria-live="assertive"
              style={{ fontSize: 12, color: "var(--color-accent-800)", minHeight: "1em" }}
            >
              {error}
            </span>
          </form>
        )}
      </div>
    </aside>
  );
}
