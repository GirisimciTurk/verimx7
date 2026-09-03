"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
  /** Derece cinsinden azami eğim. */
  intensity?: number;
  priority?: boolean;
  sizes?: string;
};

/**
 * Fareyle eğilen dairesel görsel.
 *
 * Eğim doğrudan DOM'a yazılır (state yok): saniyede altmış kez React
 * render'ı tetiklemek gereksiz. Dokunmatik cihazlarda ve "hareketi azalt"
 * tercihinde efekt hiç bağlanmaz.
 */
export default function TiltImage({
  src,
  alt,
  intensity = 14,
  priority = false,
  // Gerçek düzen: ≤860px'te en fazla 420px genişlikte ortalanır,
  // 861–1080px arasında tek sütuna düşüp sayfa genişliğini kaplar,
  // üstünde ~500px'lik sağ kolona oturur.
  sizes = "(max-width: 860px) min(420px, 90vw), (max-width: 1080px) calc(100vw - 56px), 500px",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `perspective(900px) rotateX(${(-py * intensity).toFixed(
        2,
      )}deg) rotateY(${(px * intensity).toFixed(2)}deg) scale(1.03)`;
    };

    const onLeave = () => {
      element.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    };

    element.addEventListener("mousemove", onMove);
    element.addEventListener("mouseleave", onLeave);
    return () => {
      element.removeEventListener("mousemove", onMove);
      element.removeEventListener("mouseleave", onLeave);
    };
  }, [intensity]);

  return (
    <div className="hero-media">
      <div ref={ref} className="hero-media-inner washed">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
