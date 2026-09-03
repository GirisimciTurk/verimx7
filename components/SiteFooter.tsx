import Link from "next/link";

import {
  BRAND,
  CONTACT,
  FOUNDED_YEAR,
  GROUP_LINKS,
  LEGAL_ENTITY,
  PARENT_LEGAL,
  ROUTES,
  SECTIONS,
  TAGLINE,
} from "@/lib/site";

const serviceLinks = [
  { label: "Ne yapıyoruz", href: `${ROUTES.home}#${SECTIONS.alanlar}` },
  { label: `${BRAND} modeli`, href: `${ROUTES.home}#${SECTIONS.model}` },
  { label: "Ölçüm mimarisi", href: `${ROUTES.home}#${SECTIONS.olcum}` },
  { label: "Teslimat mimarisi", href: `${ROUTES.home}#${SECTIONS.teslimat}` },
  { label: "Atıl Kapasite Testi", href: ROUTES.test },
  { label: "Verimetri panosu", href: ROUTES.dashboard },
];

const supportLinks = [
  { label: "Değerlendirme başvurusu", href: `${ROUTES.home}#${SECTIONS.basvuru}` },
  { label: "KVKK aydınlatma metni", href: ROUTES.kvkk },
  { label: "Gizlilik ve veri güvenliği", href: ROUTES.privacy },
  { label: "Çerez politikası", href: ROUTES.cookies },
  { label: "Ölçüm kalite kapıları", href: `${ROUTES.home}#${SECTIONS.olcum}` },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 20,
              color: "var(--color-accent-100)",
            }}
          >
            {BRAND}
          </div>
          <p
            style={{
              margin: "var(--space-2) 0 0",
              fontSize: 14,
              color: "var(--color-accent-300)",
            }}
          >
            {TAGLINE}
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            style={{ display: "inline-block", marginTop: "var(--space-3)", fontSize: 14 }}
          >
            {CONTACT.email}
          </a>
          <a
            href={CONTACT.whatsappHref}
            rel="noopener"
            style={{ display: "inline-block", marginTop: "var(--space-2)", fontSize: 14 }}
          >
            WhatsApp · {CONTACT.whatsappNumber}
          </a>
        </div>

        <nav aria-label="Hizmetler">
          <h6>Hizmetler</h6>
          <div style={{ display: "grid", gap: "var(--space-2)", fontSize: 14 }}>
            {serviceLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav aria-label="Destek ve bilgi">
          <h6>Destek ve bilgi</h6>
          <div style={{ display: "grid", gap: "var(--space-2)", fontSize: 14 }}>
            {supportLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
            <a href="https://girisimciturk.com/iletisim/" rel="noopener">
              İletişim
            </a>
          </div>
        </nav>

        <div>
          <h6>Grup</h6>
          <div style={{ display: "grid", gap: "var(--space-2)", fontSize: 14 }}>
            {GROUP_LINKS.map((link) => (
              <a key={link.href} href={link.href} rel="noopener">
                {link.label}
              </a>
            ))}
          </div>

          <h6 style={{ marginTop: "var(--space-6)" }}>Ofisler</h6>
          <address
            style={{ fontSize: 13, margin: 0, lineHeight: 1.6, fontStyle: "normal" }}
          >
            {CONTACT.offices.map((office) => (
              <span key={office.city} style={{ display: "block" }}>
                {office.city} ·{" "}
                <a href={office.href}>{office.phone}</a>
              </span>
            ))}
          </address>
        </div>
      </div>

      {/*
        Yasal künye. Yer tutucular bilerek görünür bırakıldı: eksik bir künyeyi
        gizlemek, eksik olmasından daha kötüdür. lib/site.ts → LEGAL_ENTITY.
      */}
      <div className="footer-legal">
        <h2 className="kicker" style={{ color: "var(--color-accent-300)" }}>
          Künye
        </h2>
        <dl className="footer-legal-list">
          <div>
            <dt>Ticaret unvanı</dt>
            <dd>{LEGAL_ENTITY.tradeName}</dd>
          </div>
          <div>
            <dt>Adres</dt>
            <dd>{LEGAL_ENTITY.address}</dd>
          </div>
          <div>
            <dt>MERSİS</dt>
            <dd>{LEGAL_ENTITY.mersis}</dd>
          </div>
          <div>
            <dt>Vergi dairesi / no</dt>
            <dd>{LEGAL_ENTITY.taxOffice}</dd>
          </div>
          <div>
            <dt>Ticaret sicil no</dt>
            <dd>{LEGAL_ENTITY.tradeRegistry}</dd>
          </div>
          <div>
            <dt>KEP</dt>
            <dd>{LEGAL_ENTITY.kep}</dd>
          </div>
          <div>
            <dt>KVKK başvuru</dt>
            <dd>{LEGAL_ENTITY.kvkkEmail}</dd>
          </div>
        </dl>
      </div>

      <div className="footer-bottom">
        {/* Sabit yıl: statik prerender'da new Date() derleme anında donuyor
            ve yıl değiştiğinde site yeniden derlenene kadar yanlış kalıyor. */}
        <span>
          © {FOUNDED_YEAR} {BRAND}. Tüm hakları saklıdır.
        </span>
        <span>
          Bu site bir{" "}
          <strong style={{ color: "var(--color-accent-200)" }}>{PARENT_LEGAL}</strong>{" "}
          iştirakidir.
        </span>
      </div>
    </footer>
  );
}
