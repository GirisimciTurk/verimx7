"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

import { ROUTES, formatPercent, formatTL, groupTR } from "@/lib/site";
import {
  CHOICES,
  DEFAULT_VALUES,
  LIMITS,
  SECTORS,
  SYSTEM_OPTIONS,
  type SectorKey,
  type SystemKey,
  type TestResult,
  type TestValues,
} from "@/lib/test-config";
import { useCalc } from "@/lib/use-calc";

type Props = { initial: TestResult };

type ReportStatus = "idle" | "sending" | "sent";

/** Kaydırıcılı soru. */
function RangeQuestion({
  no,
  kicker,
  title,
  hint,
  value,
  valueLabel,
  min,
  max,
  step,
  onChange,
}: {
  no: string;
  kicker: string;
  title: string;
  hint?: string;
  value: number;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="q">
      <span className="q-no">
        Soru {no} — {kicker}
      </span>
      <label className="q-t" htmlFor={id}>
        {title}
      </label>
      {hint && (
        <span className="q-h" id={hintId}>
          {hint}
        </span>
      )}
      <span className="q-v" aria-hidden="true">
        {valueLabel}
      </span>
      <input
        id={id}
        className="rng"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={valueLabel}
        aria-describedby={hint ? hintId : undefined}
      />
    </div>
  );
}

/** Dört seçenekli soru. */
function ChoiceQuestion({
  no,
  kicker,
  title,
  hint,
  options,
  value,
  name,
  onChange,
}: {
  no: string;
  kicker: string;
  title: string;
  hint?: string;
  options: readonly string[];
  value: number;
  name: string;
  onChange: (index: number) => void;
}) {
  const id = useId();
  const legendId = `${id}-legend`;
  const titleId = `${id}-title`;
  const hintId = `${id}-hint`;
  return (
    <fieldset
      className="q"
      style={{ minInlineSize: 0 }}
      // legend tek başına yalnızca "Soru 03 — Kontrol alanı" diyordu; asıl
      // soru metni erişilebilir adın parçası olmadan ekran okuyucuda kayboluyordu.
      aria-labelledby={`${legendId} ${titleId}`}
      aria-describedby={hint ? hintId : undefined}
    >
      <legend className="q-no" style={{ padding: 0 }} id={legendId}>
        Soru {no} — {kicker}
      </legend>
      <span className="q-t" id={titleId}>
        {title}
      </span>
      {hint && (
        <span className="q-h" id={hintId}>
          {hint}
        </span>
      )}
      <div className="seg">
        {options.map((option, index) => (
          <label className="seg-opt" key={option}>
            <input
              type="radio"
              name={name}
              value={index}
              checked={value === index}
              onChange={() => onChange(index)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function CapacityTest({ initial }: Props) {
  const [values, setValues] = useState<TestValues>(DEFAULT_VALUES);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [reportStatus, setReportStatus] = useState<ReportStatus>("idle");
  const [reportError, setReportError] = useState("");
  const uid = useId();

  const { data: result, pending, failed } = useCalc<TestResult>("full", values, initial);

  function set<K extends keyof TestValues>(key: K, value: TestValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleSystem(key: SystemKey, checked: boolean) {
    setValues((v) => ({ ...v, systems: { ...v.systems, [key]: checked } }));
  }

  async function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReportError("");

    if (!email.includes("@") || email.indexOf("@") < 1) {
      setReportError("Geçerli bir e-posta adresi girin.");
      return;
    }
    if (!consent) {
      setReportError("Aydınlatma metni onayı gereklidir.");
      return;
    }

    setReportStatus("sending");
    try {
      const response = await fetch("/api/rapor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, input: values, consent: true, website }),
      });

      if (response.ok) {
        setReportStatus("sent");
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setReportError(payload.error ?? "Talep gönderilemedi. Lütfen tekrar deneyin.");
      setReportStatus("idle");
    } catch {
      setReportError("Bağlantı kurulamadı. Lütfen tekrar deneyin.");
      setReportStatus("idle");
    }
  }

  return (
    <div className="test-grid">
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <RangeQuestion
          no="01"
          kicker="Ölçek"
          title="Kurumunuzda kaç çalışan var?"
          value={values.emp}
          valueLabel={`${groupTR(values.emp)} kişi`}
          min={LIMITS.emp.min}
          max={LIMITS.emp.max}
          step={LIMITS.emp.step}
          onChange={(v) => set("emp", v)}
        />

        <RangeQuestion
          no="02"
          kicker="Maliyet tabanı"
          title="Kişi başı aylık toplam personel maliyeti nedir?"
          hint="Brüt maaş, yan haklar ve işveren yükleri dahil ortalama."
          value={values.cost}
          valueLabel={formatTL(values.cost)}
          min={LIMITS.cost.min}
          max={LIMITS.cost.max}
          step={LIMITS.cost.step}
          onChange={(v) => set("cost", v)}
        />

        <ChoiceQuestion
          no="03"
          kicker="Kontrol alanı"
          title="Bir yöneticiye ortalama kaç kişi doğrudan rapor ediyor?"
          hint="Metrik: doğrudan rapor eden kişi sayısı ÷ yönetici sayısı. Hem çok dar hem çok geniş kontrol alanı maliyetlidir; model ikisini de kayıp sayar."
          options={CHOICES.span}
          value={values.span}
          name={`${uid}-span`}
          onChange={(i) => set("span", i)}
        />

        <RangeQuestion
          no="04"
          kicker="Onay katmanı"
          title="Sıradan bir talep tamamlanana kadar kaç onay adımından geçiyor?"
          value={values.layers}
          valueLabel={`${values.layers} onay katmanı`}
          min={LIMITS.layers.min}
          max={LIMITS.layers.max}
          step={LIMITS.layers.step}
          onChange={(v) => set("layers", v)}
        />

        <RangeQuestion
          no="05"
          kicker="Toplantı yükü"
          title="Kişi başı haftalık toplantı saati ne kadar?"
          value={values.meet}
          valueLabel={`${values.meet} saat / hafta`}
          min={LIMITS.meet.min}
          max={LIMITS.meet.max}
          step={LIMITS.meet.step}
          onChange={(v) => set("meet", v)}
        />

        <ChoiceQuestion
          no="06"
          kicker="Toplantı verimi"
          title="Toplantıların ne kadarı karar üretmeden bitiyor?"
          options={CHOICES.dec}
          value={values.dec}
          name={`${uid}-dec`}
          onChange={(i) => set("dec", i)}
        />

        <RangeQuestion
          no="07"
          kicker="Yapısal fazla mesai"
          title="Aylık ortalama fazla mesai, normal mesainin yüzde kaçı?"
          value={values.overtime}
          valueLabel={`%${values.overtime}`}
          min={LIMITS.overtime.min}
          max={LIMITS.overtime.max}
          step={LIMITS.overtime.step}
          onChange={(v) => set("overtime", v)}
        />

        <RangeQuestion
          no="08"
          kicker="Devir"
          title="Yıllık gönüllü devir oranınız nedir?"
          hint="Metrik: gönüllü ayrılan ÷ ortalama kadro."
          value={values.turnover}
          valueLabel={`%${values.turnover}`}
          min={LIMITS.turnover.min}
          max={LIMITS.turnover.max}
          step={LIMITS.turnover.step}
          onChange={(v) => set("turnover", v)}
        />

        <ChoiceQuestion
          no="09"
          kicker="Boş kadro"
          title="Açık bir pozisyon ortalama ne kadar süre boş kalıyor?"
          options={CHOICES.vac}
          value={values.vac}
          name={`${uid}-vac`}
          onChange={(i) => set("vac", i)}
        />

        <RangeQuestion
          no="10"
          kicker="Yeniden yapılan iş"
          title="İşlerin yüzde kaçı hata veya eksik nedeniyle geri dönüyor?"
          value={values.rework}
          valueLabel={`%${values.rework}`}
          min={LIMITS.rework.min}
          max={LIMITS.rework.max}
          step={LIMITS.rework.step}
          onChange={(v) => set("rework", v)}
        />

        <ChoiceQuestion
          no="11"
          kicker="Verime ulaşma süresi"
          title="Yeni işe giren biri hedef performansa ne kadar sürede ulaşıyor?"
          options={CHOICES.ramp}
          value={values.ramp}
          name={`${uid}-ramp`}
          onChange={(i) => set("ramp", i)}
        />

        <fieldset
          className="q"
          style={{ minInlineSize: 0 }}
          aria-labelledby={`${uid}-s12-legend ${uid}-s12-title`}
          aria-describedby={`${uid}-s12-hint`}
        >
          <legend className="q-no" style={{ padding: 0 }} id={`${uid}-s12-legend`}>
            Soru 12 — Ölçülebilirlik
          </legend>
          <span className="q-t" id={`${uid}-s12-title`}>
            Bu veriler hangi sistemlerde tutuluyor?
          </span>
          <span className="q-h" id={`${uid}-s12-hint`}>
            Ölçüm kalite kapısı: kaynağı bir sistem olan metrikler prim hesabına girer,
            beyana dayalı olanlar girmez.
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-4)",
              marginTop: "var(--space-1)",
            }}
          >
            {SYSTEM_OPTIONS.map((option) => (
              <label className="radio" key={option.key}>
                <input
                  type="checkbox"
                  checked={values.systems[option.key]}
                  onChange={(event) => toggleSystem(option.key, event.target.checked)}
                />
                <span className="dot" style={{ borderRadius: 5 }} />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* ── Ayrıntılı rapor ────────────────────────────────────────── */}
        <div className="q" style={{ background: "var(--color-neutral-100)" }}>
          <span className="q-no">Ayrıntılı rapor</span>
          <span className="q-t">
            On iki soruluk tahminin arkasındaki hesabı e-posta ile alın
          </span>

          {reportStatus === "sent" ? (
            <span role="status" style={{ fontSize: 15, color: "var(--color-accent-2-800)" }}>
              Rapor talebiniz alındı. Hesap dökümü ve veri talep listesi e-postanıza
              iletilecek.
            </span>
          ) : (
            <form onSubmit={submitReport} noValidate style={{ display: "grid", gap: "var(--space-3)" }}>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <label htmlFor={`${uid}-mail`} className="text-muted" style={{ position: "absolute", left: -9999 }}>
                  Kurumsal e-posta adresiniz
                </label>
                <input
                  id={`${uid}-mail`}
                  className="input"
                  style={{ maxWidth: 320 }}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="kurumsal e-posta adresiniz"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button className="btn btn-primary" type="submit" disabled={reportStatus === "sending"}>
                  {reportStatus === "sending" ? "Gönderiliyor…" : "Raporu gönder"}
                </button>
              </div>

              {/* Bot tuzağı */}
              <div aria-hidden="true" style={{ position: "absolute", left: -9999 }}>
                <label htmlFor={`${uid}-hp`}>Web sitesi</label>
                <input
                  id={`${uid}-hp`}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
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
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  style={{
                    marginTop: 3,
                    width: 18,
                    height: 18,
                    flex: "none",
                    accentColor: "var(--color-accent)",
                  }}
                />
                <span>
                  Raporun e-posta ile iletilmesi için{" "}
                  <Link href={ROUTES.kvkk} target="_blank">
                    KVKK Aydınlatma Metnini
                  </Link>{" "}
                  okudum, onaylıyorum.
                </span>
              </label>

              <span role="alert" style={{ fontSize: 13, color: "var(--color-accent-700)" }}>
                {reportError}
              </span>
            </form>
          )}
        </div>
      </div>

      {/* ── Sonuç paneli ─────────────────────────────────────────────── */}
      <aside className="test-aside" aria-label="Hesaplanan sonuç">
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor={`${uid}-sector`}>Kurum tipi</label>
          <select
            id={`${uid}-sector`}
            className="input"
            value={values.sector}
            onChange={(event) => set("sector", event.target.value as SectorKey)}
          >
            {SECTORS.map((sector) => (
              <option key={sector.key} value={sector.key}>
                {sector.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="card elev-md result-card"
          aria-live="polite"
          style={{ opacity: pending ? 0.75 : 1, transition: "opacity 0.2s ease" }}
        >
          <span className="card-kicker" style={{ color: "var(--color-accent-300)" }}>
            Tahmini yıllık atıl kapasite
          </span>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 3vw, 44px)",
              lineHeight: 1.05,
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatTL(result.total)}
          </span>
          <span style={{ fontSize: 14, color: "var(--color-accent-200)" }}>
            Yıllık personel maliyetinin {formatPercent(result.ratio * 100)}&rsquo;i ·{" "}
            {result.sectorLabel.toLocaleLowerCase("tr-TR")} varsayımı
          </span>

          <div
            style={{
              display: "grid",
              gap: "var(--space-2)",
              marginTop: "var(--space-3)",
              fontSize: 15,
            }}
          >
            <div className="result-row">
              <span style={{ color: "var(--color-accent-200)" }}>Zaman kaybı</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatTL(result.time)}</span>
            </div>
            <div className="result-row">
              <span style={{ color: "var(--color-accent-200)" }}>Eşleşme kaybı</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatTL(result.match)}</span>
            </div>
            <div className="result-row">
              <span style={{ color: "var(--color-accent-200)" }}>Kadro kaybı</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatTL(result.staff)}</span>
            </div>
          </div>

          {failed && (
            <p
              role="status"
              style={{
                margin: "var(--space-3) 0 0",
                fontSize: 13,
                color: "var(--color-accent-200)",
                lineHeight: 1.5,
              }}
            >
              Hesap güncellenemedi; gösterilen değer son başarılı hesaba aittir.
              Bağlantınızı kontrol edip bir girdiyi yeniden oynatın.
            </p>
          )}

          {result.capped && (
            <p
              style={{
                margin: "var(--space-3) 0 0",
                fontSize: 12,
                color: "var(--color-accent-300)",
                lineHeight: 1.5,
              }}
            >
              Girdileriniz modelin üst bandına dayandı. Bu aralıkta tahmin,
              savunulabilir bir tavana sıkıştırılır; gerçek büyüklük ancak sistem
              verinizle yapılan teşhiste ortaya çıkar.
            </p>
          )}

          <p
            style={{
              margin: "var(--space-3) 0 0",
              fontSize: 12,
              color: "var(--color-accent-300)",
            }}
          >
            Formül sürümü {result.formulaVersion}
          </p>
        </div>

        <div className="card" style={{ background: "var(--color-surface)", gap: "var(--space-3)" }}>
          <span className="card-kicker">Ölçülebilirlik</span>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 24, lineHeight: 1 }}>
            {result.measurableLabel}
          </span>
          <div
            role="meter"
            aria-valuenow={result.measurableCount}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="Sistem kaynaklı metrik kapsamı"
            style={{
              height: 8,
              borderRadius: 999,
              background: "var(--color-neutral-300)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 999,
                background: "var(--color-accent-2)",
                width: `${(result.measurableCount / 4) * 100}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span className="card-body" style={{ opacity: 1 }}>
            {result.measurableNote}
          </span>
        </div>

        <div className="card" style={{ background: "var(--color-accent-2-100)", gap: "var(--space-2)" }}>
          <span className="card-kicker" style={{ color: "var(--color-accent-2-800)" }}>
            Benchmark havuzu
          </span>
          <span className="card-body" style={{ opacity: 1 }}>
            Bir sektör–ölçek bandı hücresinde en az 5 farklı müşteri birikmeden o hücrenin
            değeri hiçbir raporda yayımlanmaz. Bu nedenle karşılaştırma sonucu, havuz
            dolduğunda erişime açılır.
          </span>
        </div>

        <div className="card" style={{ background: "transparent", padding: 0, gap: "var(--space-3)" }}>
          <span className="card-body" style={{ opacity: 1 }}>
            Teşhis aşamasında Atıl Kapasite Raporu, kurum sistemlerinden gelen veriyle 5
            günde hazırlanır ve tespit edilen her kalemin TL karşılığını içerir.
          </span>
          <Link className="btn btn-secondary" href={`${ROUTES.home}#basvuru`}>
            Değerlendirme başvurusu
          </Link>
        </div>
      </aside>

      {/* Dar ekranda sonuç paneli yukarıda kalır; toplam burada görünür olur.
          Yukarıdaki panel zaten aria-live ile duyurduğu için bu kopya gizlenir. */}
      <div className="mobile-total" aria-hidden="true">
        <span className="mobile-total-k">Tahmini atıl kapasite</span>
        <span className="mobile-total-v">{formatTL(result.total)}</span>
      </div>
    </div>
  );
}
