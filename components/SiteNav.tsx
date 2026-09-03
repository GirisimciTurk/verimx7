"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { BRAND, NAV_ITEMS, ROUTES } from "@/lib/site";

/**
 * Papatya menüsü — markanın imzası olan radyal gezinme.
 *
 * Erişilebilirlik kararları:
 * - Tetikleyici düğme DOM'da bağlantılardan ÖNCE. Konumlandırma zaten
 *   position:absolute ile yapıldığı için görsel düzen değişmez, ama sekme
 *   sırası doğru olur: düğme → menü öğeleri → sayfa. Düğme sonda olduğunda
 *   menü açıkken ileri Tab arka plana kaçıyordu.
 *   (.daisy-item:nth-of-type(n) seçicileri etkilenmez: :nth-of-type aynı
 *   ETİKET türündeki kardeşleri sayar, düğme <button>, öğeler <a>.)
 * - Menü kapalıyken öğeler `inert`: hem sekme sırasından hem erişilebilirlik
 *   ağacından çıkar. tabIndex=-1 inert desteklemeyen tarayıcılar için yedek.
 *   aria-hidden KULLANILMAZ — odaklanabilir öğeye aria-hidden vermek ihlaldir.
 * - Menü açılınca odak ilk öğeye taşınır, Tab menü içinde döner, Escape
 *   kapatır ve odağı düğmeye geri verir.
 * - Perde (scrim) yalnızca fare için; ekran okuyucudan gizlenir.
 */
export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  // Rota değişince menü kapansın (bağlantıya tıklandığında).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const nav = navRef.current;
    const items = () =>
      Array.from(nav?.querySelectorAll<HTMLElement>("a.daisy-item") ?? []);

    // Açılışta odak ilk öğeye.
    items()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      // Odak döngüsü: düğme + menü öğeleri.
      const focusables = [buttonRef.current, ...items()].filter(Boolean) as HTMLElement[];
      if (focusables.length === 0) return;

      const current = document.activeElement as HTMLElement | null;
      const index = current ? focusables.indexOf(current) : -1;

      // Odak menünün dışındaysa içine çek.
      if (index === -1) {
        event.preventDefault();
        focusables[event.shiftKey ? focusables.length - 1 : 0]!.focus();
        return;
      }

      const next = event.shiftKey ? index - 1 : index + 1;
      if (next < 0 || next >= focusables.length) {
        event.preventDefault();
        focusables[event.shiftKey ? focusables.length - 1 : 0]!.focus();
      }
    };

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="daisy-scrim" data-open={open} onClick={close} aria-hidden="true" />

      <header className="nav site-nav">
        <span style={{ width: 1 }} />

        <Link
          className="nav-brand"
          href={ROUTES.home}
          style={{ marginLeft: "auto", marginRight: 0 }}
        >
          {BRAND}
        </Link>

        <nav id={menuId} ref={navRef} className="daisy" data-open={open} aria-label="Ana menü">
          <button
            ref={buttonRef}
            className="daisy-btn"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          >
            <Image src="/logo-mark.png" alt="" width={92} height={92} priority sizes="92px" />
          </button>

          {NAV_ITEMS.map((item) => {
            const isHere = item.matchPath ? pathname === item.matchPath : false;
            return (
              <Link
                key={item.href}
                className={`daisy-item${item.cta ? " is-cta" : ""}${isHere ? " is-here" : ""}`}
                href={item.href}
                onClick={close}
                inert={open ? undefined : true}
                tabIndex={open ? 0 : -1}
                aria-current={isHere ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
