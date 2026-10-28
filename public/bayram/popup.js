/*
 * 29 Ekim Cumhuriyet Bayramı karşılama penceresi.
 * Her ziyaretçiye yalnız bir kez gösterilir (localStorage işareti).
 * Satır içi betik/stil kullanmaz; CSP 'self' ile uyumludur.
 */
(function () {
  "use strict";

  var ANAHTAR = "bayram-29-ekim-2026-goruldu";
  var KOK = "/bayram/";

  // Otomasyon tarayıcıları (Playwright e2e testleri) pencereye takılmasın.
  if (navigator.webdriver) return;

  try {
    if (window.localStorage.getItem(ANAHTAR)) return;
  } catch (e) {
    // Depolama kapalıysa (gizli mod vb.) her açılışta gösterip rahatsız etmeyelim.
    return;
  }

  function isaretle() {
    try {
      window.localStorage.setItem(ANAHTAR, String(Date.now()));
    } catch (e) {}
  }

  function baslat() {
    // Stil ve görsel ikisi de yüklenmeden pencere açılmaz; biri gelmezse hiç açılmaz.
    var kalan = 2;
    function hazir() {
      if (--kalan === 0) goster(img);
    }

    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = KOK + "popup.css";
    css.onload = hazir;
    document.head.appendChild(css);

    var img = new Image();
    img.alt = "29 Ekim Cumhuriyet Bayramımız Kutlu Olsun!";
    img.className = "bayram29-gorsel";
    img.decoding = "async";
    img.onload = hazir;
    img.src = KOK + "29-ekim.webp";
  }

  function goster(img) {
    var onceki = document.activeElement;
    var tasma = document.documentElement.style.overflow;

    var perde = document.createElement("div");
    perde.className = "bayram29-perde";
    perde.setAttribute("role", "dialog");
    perde.setAttribute("aria-modal", "true");
    perde.setAttribute("aria-label", "29 Ekim Cumhuriyet Bayramı");

    var kutu = document.createElement("div");
    kutu.className = "bayram29-kutu";

    var kapat = document.createElement("button");
    kapat.type = "button";
    kapat.className = "bayram29-kapat";
    kapat.setAttribute("aria-label", "Kapat");
    kapat.textContent = "×";

    kutu.appendChild(img);
    kutu.appendChild(kapat);
    perde.appendChild(kutu);

    function kapa() {
      document.removeEventListener("keydown", tus);
      perde.classList.remove("bayram29-acik");
      document.documentElement.style.overflow = tasma;
      setTimeout(function () {
        if (perde.parentNode) perde.parentNode.removeChild(perde);
      }, 250);
      if (onceki && onceki.focus) onceki.focus();
    }

    function tus(e) {
      if (e.key === "Escape") kapa();
    }

    kapat.addEventListener("click", kapa);
    perde.addEventListener("click", function (e) {
      if (e.target === perde) kapa();
    });
    document.addEventListener("keydown", tus);

    document.body.appendChild(perde);
    document.documentElement.style.overflow = "hidden";
    isaretle();

    // Bir kare bekle ki geçiş animasyonu çalışsın.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        perde.classList.add("bayram29-acik");
        kapat.focus({ preventScroll: true });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", baslat);
  } else {
    baslat();
  }
})();
