"use client";

import { useEffect, useRef } from "react";

/**
 * La firma respira.
 *
 * El cordón y el destello se mueven a ritmos distintos —tres píxeles y medio de
 * diferencia— siguiendo el puntero. Es profundidad, no animación: nadie lo va a
 * ver moverse, y esa es la condición para que exista. Lo que sí se percibe es
 * que la firma no está impresa sobre la pantalla sino un poco detrás.
 *
 * Es el mismo gesto que el cielo (`cielo.tsx`) y por eso comparte su regla: el
 * parallax responde al **puntero**, nunca al scroll. Nada acá le toca el ritmo a
 * quien recorre. Con `prefers-reduced-motion` no se mueve nada, y en táctil —sin
 * puntero que seguir— tampoco: la firma se queda quieta y no pierde nada.
 *
 * Envuelve en vez de reemplazar: el `Lockup` sigue siendo el SVG de la marca y
 * este archivo no sabe qué hay adentro.
 */
export function FirmaViva({
  cordon,
  destello,
}: {
  /** La firma completa; se mueve poco. */
  cordon: React.ReactNode;
  /** El astro, en su lugar sobre la firma; se mueve un poco más. */
  destello?: React.ReactNode;
}) {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (quieto.matches) return;

    let raf = 0;
    const objetivo = { x: 0, y: 0 };
    const actual = { x: 0, y: 0 };

    const acercar = () => {
      actual.x += (objetivo.x - actual.x) * 0.055;
      actual.y += (objetivo.y - actual.y) * 0.055;
      nodo.style.setProperty("--px", actual.x.toFixed(3));
      nodo.style.setProperty("--py", actual.y.toFixed(3));
      raf = requestAnimationFrame(acercar);
    };

    const alPuntero = (evento: PointerEvent) => {
      objetivo.x = (evento.clientX / window.innerWidth - 0.5) * 2;
      objetivo.y = (evento.clientY / window.innerHeight - 0.5) * 2;
    };

    raf = requestAnimationFrame(acercar);
    window.addEventListener("pointermove", alPuntero, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", alPuntero);
    };
  }, []);

  return (
    <div ref={caja} className="relative [--px:0] [--py:0]">
      <div
        style={{
          transform: "translate3d(calc(var(--px) * 1.5px), calc(var(--py) * 1.5px), 0)",
        }}
      >
        {cordon}
      </div>
      {destello ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            transform: "translate3d(calc(var(--px) * 5px), calc(var(--py) * 5px), 0)",
          }}
        >
          {destello}
        </div>
      ) : null}
    </div>
  );
}
