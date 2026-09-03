import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { ROUTES, SECTIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteNav />

      <main id="icerik" className="lp-sec" style={{ minHeight: "48vh" }}>
        <span className="tag tag-outline">404</span>
        <h1 style={{ fontSize: "clamp(30px, 4vw, 44px)", margin: "var(--space-4) 0" }}>
          Aradığınız sayfa burada değil
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--color-neutral-800)",
            maxWidth: "34em",
            marginBottom: "var(--space-6)",
          }}
        >
          Bağlantı taşınmış veya yanlış yazılmış olabilir. Aşağıdaki sayfalardan devam
          edebilirsiniz.
        </p>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href={ROUTES.home}>
            Ana sayfa
          </Link>
          <Link className="btn btn-secondary" href={ROUTES.test}>
            Atıl Kapasite Testi
          </Link>
          <Link className="btn btn-secondary" href={`${ROUTES.home}#${SECTIONS.basvuru}`}>
            Değerlendirme başvurusu
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
