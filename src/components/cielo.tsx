"use client";

import { useEffect, useRef } from "react";

/**
 * El cielo.
 *
 * La única excepción a la quietud por defecto del sistema, y existe con una
 * restricción que es la que la vuelve criterio en vez de decoración: **solo en
 * modo Noche. En Papel no hay nada.** El modo oscuro de este sitio se llama
 * Noche y significa algo —la noche del norte, el fondo sobre el que la estrella
 * polar orienta—; un campo de estrellas ahí no es un efecto agregado, es la
 * consecuencia del nombre. Y el papel no tiene cielo.
 *
 * De ahí sale el momento que el recorrido no tenía: quien cambia de tema
 * **descubre** un cielo. Nadie se lo anunció, no hay nada que lo señale, y es la
 * clase de detalle que solo aparece si alguien se tomó el trabajo.
 *
 * Las reglas que lo mantienen del lado de la atmósfera y no del efecto:
 *
 * - **Densidad baja.** Alrededor de 50 puntos en una pantalla de portátil. Un
 *   cielo lleno es un salvapantallas.
 * - **Deriva sub-pixel.** Tres capas a velocidades distintas, tan lentas que no
 *   se ven moverse: se nota que algo cambió si volvés, no mientras mirás.
 * - **La fugaz es rara.** Una cada 60–120 segundos, nunca en los primeros
 *   quince. Que sea rara es exactamente lo que la hace valer.
 * - **No interactúa con el scroll.** El parallax responde al puntero, no a la
 *   rueda: nada acá le toca el ritmo a quien recorre (principio 4).
 * - **Se apaga.** Con `prefers-reduced-motion` el campo queda estático —las
 *   estrellas están, pero quietas y sin fugaces—, y cuando la pestaña deja de
 *   verse el bucle se detiene entero.
 *
 * Sin librerías: un canvas y este archivo.
 */

type Capa = { escala: number; alfa: number; deriva: number; parallax: number };

type Estrella = {
  x: number;
  y: number;
  r: number;
  brillo: number;
  /** La capa misma, no su índice: nada tiene que volver a buscarla después. */
  capa: Capa;
  /** Desfase del titileo, para que ninguna respire a la vez que su vecina. */
  fase: number;
};

type Fugaz = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
  largo: number;
};

/** Tres profundidades: más lejos = más chico, más tenue, más lento. */
const CAPAS: Capa[] = [
  { escala: 0.55, alfa: 0.34, deriva: 0.0016, parallax: 1.6 },
  { escala: 0.8, alfa: 0.52, deriva: 0.0032, parallax: 3.0 },
  { escala: 1.15, alfa: 0.78, deriva: 0.0055, parallax: 4.6 },
];

/** Un punto cada ~26.000 px²: densidad de cielo, no de planetario. */
const AREA_POR_ESTRELLA = 26000;
const MAX_ESTRELLAS = 140;

export function Cielo() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const nodo = canvas.current;
    if (!nodo) return;
    const ctx = nodo.getContext("2d");
    if (!ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    let estrellas: Estrella[] = [];
    let fugaz: Fugaz | null = null;
    let proximaFugaz = 0;
    let ancho = 0;
    let alto = 0;
    let raf = 0;
    let corriendo = false;

    // El puntero mueve las capas a ritmos distintos: eso es profundidad. El
    // objetivo se persigue con suavizado para que nunca haya un salto.
    const puntero = { x: 0, y: 0, sx: 0, sy: 0 };

    function medir() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = window.innerWidth;
      alto = window.innerHeight;
      nodo!.width = Math.floor(ancho * dpr);
      nodo!.height = Math.floor(alto * dpr);
      nodo!.style.width = `${ancho}px`;
      nodo!.style.height = `${alto}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      sembrar();
    }

    function sembrar() {
      const cantidad = Math.min(
        MAX_ESTRELLAS,
        Math.round((ancho * alto) / AREA_POR_ESTRELLA)
      );
      estrellas = Array.from({ length: cantidad }, () => {
        const capa = CAPAS[Math.floor(Math.random() * CAPAS.length)] ?? CAPAS[0]!;
        return {
          x: Math.random(),
          y: Math.random(),
          r: (0.5 + Math.random() * 0.9) * capa.escala,
          brillo: 0.55 + Math.random() * 0.45,
          capa,
          fase: Math.random() * Math.PI * 2,
        };
      });
    }

    function programarFugaz(ahora: number) {
      // Nunca en los primeros quince segundos: una fugaz al entrar se leería
      // como bienvenida, y esto no viene a saludar a nadie.
      proximaFugaz = ahora + 15000 + Math.random() * 105000;
    }

    function lanzarFugaz() {
      const desdeArriba = Math.random() < 0.7;
      const velocidad = 0.42 + Math.random() * 0.3;
      const angulo = (Math.PI / 180) * (24 + Math.random() * 18);
      fugaz = {
        x: desdeArriba ? Math.random() * ancho : ancho + 40,
        y: desdeArriba ? -40 : Math.random() * alto * 0.4,
        vx: -Math.cos(angulo) * velocidad,
        vy: Math.sin(angulo) * velocidad,
        vida: 0,
        largo: 90 + Math.random() * 70,
      };
    }

    function pintar(t: number) {
      ctx!.clearRect(0, 0, ancho, alto);

      puntero.sx += (puntero.x - puntero.sx) * 0.045;
      puntero.sy += (puntero.y - puntero.sy) * 0.045;

      for (const e of estrellas) {
        const capa = e.capa;
        const deriva = quieto.matches ? 0 : t * capa.deriva;

        // La deriva envuelve: el cielo no tiene borde del que caerse.
        const x =
          ((((e.x * ancho + deriva) % ancho) + ancho) % ancho) +
          puntero.sx * capa.parallax;
        const y = e.y * alto + puntero.sy * capa.parallax;

        // Titileo mínimo y desfasado. Si se ve parpadear, sobra.
        const titileo = quieto.matches
          ? 1
          : 0.82 + Math.sin(t * 0.0008 + e.fase) * 0.18;

        ctx!.globalAlpha = capa.alfa * e.brillo * titileo;
        ctx!.beginPath();
        ctx!.arc(x, y, e.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!quieto.matches) {
        if (!fugaz && t > proximaFugaz) {
          lanzarFugaz();
          programarFugaz(t);
        }

        if (fugaz) {
          fugaz.vida += 1;
          fugaz.x += fugaz.vx * 16;
          fugaz.y += fugaz.vy * 16;

          // Entra y se apaga: nunca se corta de golpe.
          const desvanecido = Math.max(0, 1 - fugaz.vida / 70);
          const cola = ctx!.createLinearGradient(
            fugaz.x,
            fugaz.y,
            fugaz.x - fugaz.vx * fugaz.largo,
            fugaz.y - fugaz.vy * fugaz.largo
          );
          cola.addColorStop(0, `rgba(255,255,255,${0.5 * desvanecido})`);
          cola.addColorStop(1, "rgba(255,255,255,0)");

          ctx!.globalAlpha = 1;
          ctx!.strokeStyle = cola;
          ctx!.lineWidth = 1;
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(fugaz.x, fugaz.y);
          ctx!.lineTo(
            fugaz.x - fugaz.vx * fugaz.largo,
            fugaz.y - fugaz.vy * fugaz.largo
          );
          ctx!.stroke();

          if (
            desvanecido <= 0 ||
            fugaz.y > alto + 120 ||
            fugaz.x < -160 ||
            fugaz.x > ancho + 160
          ) {
            fugaz = null;
          }
        }
      }

      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(pintar);
    }

    function arrancar() {
      if (corriendo) return;
      corriendo = true;
      // La tinta la decide el tema, no este archivo: se lee del propio canvas.
      ctx!.fillStyle = getComputedStyle(nodo!).color;
      raf = requestAnimationFrame(pintar);
    }

    function frenar() {
      if (!corriendo) return;
      corriendo = false;
      cancelAnimationFrame(raf);
    }

    function alPuntero(evento: PointerEvent) {
      if (quieto.matches) return;
      puntero.x = (evento.clientX / ancho - 0.5) * 2;
      puntero.y = (evento.clientY / alto - 0.5) * 2;
    }

    function alCambiarVisibilidad() {
      if (document.hidden) frenar();
      else arrancar();
    }

    medir();
    programarFugaz(performance.now());
    arrancar();

    window.addEventListener("resize", medir);
    window.addEventListener("pointermove", alPuntero, { passive: true });
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    quieto.addEventListener("change", sembrar);

    return () => {
      frenar();
      window.removeEventListener("resize", medir);
      window.removeEventListener("pointermove", alPuntero);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      quieto.removeEventListener("change", sembrar);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      data-cielo
      aria-hidden="true"
      // `text-ink` no pinta nada: es de dónde el canvas lee su tinta, para que
      // las estrellas sean del mismo color que el texto del lugar.
      className="pointer-events-none fixed inset-0 -z-10 text-ink transition-opacity duration-[var(--duration-slow)] ease-[var(--ease-out-calm)]"
    />
  );
}
