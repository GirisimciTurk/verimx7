"use client";

import { useEffect, useRef, useState } from "react";

const PHRASES = [
  "Atıl Kaynakları Stratejik Güce Dönüştürüyoruz",
  "Gizli Kapasiteyi Ölçülebilir Verime Çeviriyoruz",
  "Kayıp Zamanı Hesaplanabilir Kazanca Çeviriyoruz",
] as const;

/**
 * Daktilo başlığı.
 *
 * Görünmez kopyalar en uzun cümlenin yerini baştan ayırır; harfler yazılırken
 * başlık yüksekliği değişmez (CLS = 0). Sunucu ilk cümlenin tamamını basar,
 * böylece JavaScript kapalıyken de okunabilir bir başlık kalır.
 *
 * "Hareketi azalt" tercihi açıksa animasyon hiç başlamaz.
 */
export default function HeroTyping() {
  const [text, setText] = useState<string>(PHRASES[0]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let length = PHRASES[0].length;
    let erasing = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const full = PHRASES[index]!;

      if (!erasing) {
        if (length < full.length) {
          length += 1;
          setText(full.slice(0, length));
          timer.current = setTimeout(tick, 78);
        } else {
          erasing = true;
          timer.current = setTimeout(tick, 3600);
        }
      } else if (length > 0) {
        length -= 1;
        setText(full.slice(0, length));
        timer.current = setTimeout(tick, 38);
      } else {
        erasing = false;
        index = (index + 1) % PHRASES.length;
        timer.current = setTimeout(tick, 600);
      }
    };

    timer.current = setTimeout(tick, 3600);

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Son kelime imleçle birlikte satır sonunda bölünmesin.
  const splitAt = text.lastIndexOf(" ") + 1;

  return (
    <h1
      style={{
        fontSize: "clamp(32px, 4.4vw, 52px)",
        lineHeight: 1.08,
        margin: "var(--space-4) 0 var(--space-3)",
        maxWidth: "18em",
        display: "grid",
        alignItems: "start",
      }}
    >
      {PHRASES.map((phrase) => (
        <span key={phrase} aria-hidden="true" style={{ gridArea: "1 / 1", visibility: "hidden" }}>
          {phrase}
        </span>
      ))}
      <span style={{ gridArea: "1 / 1" }}>
        {text.slice(0, splitAt)}
        <span style={{ whiteSpace: "nowrap" }}>
          {text.slice(splitAt)}
          <span className="caret" aria-hidden="true" />
        </span>
      </span>
    </h1>
  );
}
