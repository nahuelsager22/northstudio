"use client";

import { useEffect } from "react";
import { REVEAL_ROOT_MARGIN } from "@/lib/motion";

/**
 * Recepción (art-direction.md §4.1): al aparecer por primera vez, un contenido
 * se asienta. Un único observer para toda la página; cada elemento se revela
 * una sola vez y deja de observarse. No renderiza nada ni envuelve el markup,
 * así que los momentos siguen siendo componentes de servidor: basta con marcar
 * un elemento con `data-reveal`.
 */
export function RevealObserver() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
    );
    if (nodes.length === 0) return;

    const revelarTodo = () => {
      for (const node of nodes) node.setAttribute("data-revealed", "");
    };

    // Honrar la configuración del visitante es la forma más literal de prestar
    // atención (art-direction.md §4.3): sin movimiento, el contenido ya está.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      revelarTodo();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: REVEAL_ROOT_MARGIN, threshold: 0.01 }
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return null;
}
