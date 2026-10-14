"use client";

import { useEffect, useRef, useState } from "react";

import { SECTIONS } from "@/lib/site";

/**
 * Tam ekran açılış: 30 saniyelik hikâye videosu (kaynağı: video/hikaye.html).
 *
 * Bölüm ekranın tamamını kaplar ve menünün arkasına uzanır; video ise
 * menünün altında kalan alana "contain" ile sığdırılır. Videonun kendi
 * yazıları (başlıklar, gösterge) olduğu için kırpılmaması gerekir; boşluk
 * kalırsa videonun kenar rengiyle aynı lacivert zemin görünür.
 *
 * İki kodlama var: yatay ekranda 16:9, dikey ekranda 9:16. Hangisinin
 * görüneceğine CSS karar verir; gizli olan hiç indirilmez, çünkü ikisi de
 * preload="none" ve oynatmayı yalnızca bu bileşen, görünür olanı başlatarak
 * yapar.
 *
 * Video sessiz ve döngüde; ekrandayken oynar, çıkınca durur. Kendiliğinden
 * oynayan içerik 5 saniyeden uzun olduğu için durdurma düğmesi zorunlu
 * (WCAG 2.2.2). Kullanıcı durdurduysa geri kaydırınca yeniden başlamaz;
 * "hareketi azalt" tercihi açıksa kendiliğinden hiç başlamaz.
 */

const VIDEOS = [
  {
    className: "opener-yatay",
    src: "/video/verimx7-hikaye.mp4",
    poster: "/video/verimx7-hikaye-kapak.jpg",
  },
  {
    className: "opener-dikey",
    src: "/video/verimx7-hikaye-dikey.mp4",
    poster: "/video/verimx7-hikaye-dikey-kapak.jpg",
  },
] as const;

const DESCRIPTION =
  "Atıl kaynaklar, iflasın eşiğindeki şirketler ve mutsuz patronlarla başlayan hikâye: " +
  "Verimx7 mühendisleri sahaya iniyor, birim liderleriyle planlar çıkıyor, plan hayata " +
  "geçiyor ve kasa doluyor. Video sessizdir; tüm anlatım ekrandaki yazılardadır.";

export default function StoryVideo({ next }: { next: string }) {
  const root = useRef<HTMLElement>(null);
  const userPaused = useRef(false);
  const ours = useRef(false);
  const [playing, setPlaying] = useState(false);

  const videos = () => [...(root.current?.querySelectorAll("video") ?? [])];
  const visible = () => videos().find((v) => v.offsetParent !== null);

  const pauseAll = () => {
    ours.current = true;
    for (const v of videos()) if (!v.paused) v.pause();
    ours.current = false;
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) userPaused.current = true;

    const list = videos();
    // Kullanıcının kendi durdurmasını bizimkinden ayır.
    const onPause = () => {
      if (!ours.current) userPaused.current = true;
      setPlaying(list.some((v) => !v.paused));
    };
    const onPlay = () => setPlaying(true);
    for (const v of list) {
      v.addEventListener("pause", onPause);
      v.addEventListener("play", onPlay);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          const v = visible();
          if (v && v.paused && !userPaused.current) {
            pauseAll();
            // Tarayıcı otomatik oynatmayı reddederse kapak ve oynat düğmesi kalır.
            v.play().catch(() => {});
          }
        } else {
          pauseAll();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      for (const v of list) {
        v.removeEventListener("pause", onPause);
        v.removeEventListener("play", onPlay);
      }
    };
    // Yardımcılar yalnızca ref okur; bir kez bağlanması yeterli.
  }, []);

  function toggle() {
    const v = visible();
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }

  return (
    <section ref={root} id={SECTIONS.acilis} className="opener" aria-label="Verimx7 hikâyesi">
      <div className="opener-frame">
        {VIDEOS.map((v) => (
          <video
            key={v.src}
            className={v.className}
            poster={v.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={DESCRIPTION}
          >
            <source src={v.src} type="video/mp4" />
          </video>
        ))}
      </div>
      <p className="sr-only">{DESCRIPTION}</p>

      <button type="button" className="opener-toggle" onClick={toggle} aria-label={playing ? "Videoyu durdur" : "Videoyu oynat"}>
        {playing ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
            <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" fill="currentColor" />
          </svg>
        )}
      </button>

      <a className="opener-next" href={`#${next}`}>
        Keşfedin
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
