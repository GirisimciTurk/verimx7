"use client";

import { useEffect } from "react";

/**
 * Adres çubuğunda çapa (#basvuru gibi) ile açılan sayfayı hedefe hizalar.
 *
 * Neden gerekli: html üzerinde scroll-behavior: smooth var ve tarayıcı ilk
 * yüklemedeki çapa atlamasını da animasyonlu yapıyor. Animasyon sürerken
 * görseller ve yazı tipleri yüklenip düzeni kaydırdığı için sayfa yanlış
 * yerde — çoğunlukla en üstte — kalıyordu. Bu, başka sayfalardan gelen
 * "Başvuru" bağlantısını işlevsiz bırakıyor.
 *
 * Çözüm: hedefi bir kare sonra ANLIK olarak hizala, düzen oturduktan sonra
 * bir kez daha doğrula. Sticky başlık boşluğu globals.css'teki
 * scroll-padding-top ile veriliyor.
 */
export default function HashAnchor() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length < 2) return;

    const id = decodeURIComponent(hash.slice(1));
    const align = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      align();
      // Görseller yüklendikçe düzen bir miktar daha kayabilir.
      timer = setTimeout(align, 300);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
