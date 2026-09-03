"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hesaplama uç noktasına geciktirmeli (debounce) istek atan kanca.
 *
 * Katsayı tablosu sunucuda kaldığı için kaydırıcı her hareket ettiğinde
 * sonucu sunucudan isteriz. Üç tedbirle bu ucuz kalır:
 *   - 160 ms geciktirme: sürükleme sırasında tek istek gider,
 *   - AbortController: eskiyen istek iptal edilir, sıra karışmaz,
 *   - "son uygulanan girdi" karşılaştırması: sunucunun bastığı varsayılan
 *     sonuç için gereksiz istek atılmaz.
 *
 * Hata durumunda son geçerli sonuç ekranda kalır ve `failed` true olur;
 * sayı hiçbir zaman boşalmaz ama kullanıcı bayat veriyi görmediğini bilir.
 */
export function useCalc<TResult>(
  mode: "quick" | "full",
  input: unknown,
  initial: TResult,
): { data: TResult; pending: boolean; failed: boolean } {
  const [data, setData] = useState<TResult>(initial);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const serialized = JSON.stringify(input);

  /** Ekranda gösterilen sonucun hangi girdiye ait olduğu. */
  const appliedRef = useRef(serialized);
  /** Sunucunun ilk bastığı sonuç — girdiler varsayılana dönerse buna dönülür. */
  const initialRef = useRef<{ key: string; value: TResult }>({
    key: serialized,
    value: initial,
  });
  const abortRef = useRef<AbortController | null>(null);
  /** Yarış koşulu freni: yalnızca en son gönderilen isteğin yanıtı yazılır. */
  const requestIdRef = useRef(0);

  useEffect(() => {
    // Gösterilen sonuç zaten bu girdiye ait: yapacak iş yok.
    if (serialized === appliedRef.current) {
      setPending(false);
      return;
    }

    // Girdiler tam olarak varsayılana döndü: sunucunun bastığı sonuca dön,
    // istek atmadan. Bu dal olmadan ekranda eski rakam kalıyordu.
    if (serialized === initialRef.current.key) {
      abortRef.current?.abort();
      requestIdRef.current += 1;
      appliedRef.current = serialized;
      setData(initialRef.current.value);
      setPending(false);
      setFailed(false);
      return;
    }

    setPending(true);
    const timeout = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      requestIdRef.current += 1;
      const requestId = requestIdRef.current;

      fetch("/api/atil-kapasite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input: JSON.parse(serialized) }),
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          return res.json();
        })
        .then((json: TResult) => {
          // Daha yeni bir istek gönderilmişse bu yanıt bayattır.
          if (requestId !== requestIdRef.current) return;
          appliedRef.current = serialized;
          setData(json);
          setFailed(false);
          setPending(false);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          if (requestId !== requestIdRef.current) return;
          setFailed(true);
          setPending(false);
        });
    }, 160);

    return () => clearTimeout(timeout);
  }, [mode, serialized]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { data, pending, failed };
}
