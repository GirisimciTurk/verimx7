"use client";

import { useEffect, useRef } from "react";

/**
 * 30 saniyelik hikâye videosu (kaynağı: video/hikaye.html).
 *
 * İki kodlama var: geniş ekranda 16:9, dar ekranda 9:16. Hangisinin
 * görüneceğine CSS karar verir (.story-video-yatay / -dikey); gizli olan
 * hiç indirilmez, çünkü ikisi de preload="none" ve oynatmayı yalnızca bu
 * bileşen, görünür olanı başlatarak yapar.
 *
 * Video sessiz ve döngüde; ekrana girince oynar, çıkınca durur. Kullanıcı
 * kendisi durdurduysa geri kaydırınca yeniden başlatılmaz. "Hareketi azalt"
 * tercihi açıksa kendiliğinden hiç oynamaz; kapak ve oynatıcı denetimleri kalır.
 */

const VIDEOS = [
  {
    className: "story-video-yatay",
    src: "/video/verimx7-hikaye.mp4",
    poster: "/video/verimx7-hikaye-kapak.jpg",
    width: 1280,
    height: 720,
  },
  {
    className: "story-video-dikey",
    src: "/video/verimx7-hikaye-dikey.mp4",
    poster: "/video/verimx7-hikaye-dikey-kapak.jpg",
    width: 720,
    height: 1280,
  },
] as const;

const DESCRIPTION =
  "Atıl kaynaklar, iflasın eşiğindeki şirketler ve mutsuz patronlarla başlayan hikâye: " +
  "Verimx7 mühendisleri sahaya iniyor, birim liderleriyle planlar çıkıyor, plan hayata " +
  "geçiyor ve kasa doluyor. Video sessizdir; tüm anlatım ekrandaki yazılardadır.";

export default function StoryVideo() {
  const root = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);
  const ours = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const videos = [...el.querySelectorAll("video")];
    const visible = () => videos.find((v) => v.offsetParent !== null);

    // Kullanıcının kendi durdurmasını bizimkinden ayır.
    const onPause = () => {
      if (!ours.current) userPaused.current = true;
    };
    const onPlay = () => {
      userPaused.current = false;
    };
    for (const v of videos) {
      v.addEventListener("pause", onPause);
      v.addEventListener("play", onPlay);
    }

    const pauseAll = () => {
      ours.current = true;
      for (const v of videos) if (!v.paused) v.pause();
      ours.current = false;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          const v = visible();
          if (v && v.paused && !userPaused.current) {
            pauseAll();
            // Tarayıcı otomatik oynatmayı reddederse denetimler zaten görünür.
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
      for (const v of videos) {
        v.removeEventListener("pause", onPause);
        v.removeEventListener("play", onPlay);
      }
    };
  }, []);

  return (
    <figure ref={root} className="story-video">
      {VIDEOS.map((v) => (
        <video
          key={v.src}
          className={v.className}
          poster={v.poster}
          width={v.width}
          height={v.height}
          muted
          loop
          playsInline
          controls
          preload="none"
          aria-label={DESCRIPTION}
        >
          <source src={v.src} type="video/mp4" />
        </video>
      ))}
      <figcaption className="sr-only">{DESCRIPTION}</figcaption>
    </figure>
  );
}
