"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registrarLenis, irASeccion } from "@/lib/scroll";

/**
 * El scroll del recorrido.
 *
 * Lenis entra al proyecto con una condición: **no puede quitarle el control al
 * visitante** (principio 4 del journal — el ritmo lo marca quien recorre). Por
 * eso no hay scroll-jacking, ni secciones que se peguen, ni ruedas capturadas:
 * lo único que hace es interpolar el mismo desplazamiento que el visitante pidió,
 * con una inercia corta. Si suelta la rueda, se detiene; si arrastra, manda él.
 *
 * Se apaga por completo cuando el visitante pide menos movimiento —y no se
 * "atenúa": se desmonta, y el scroll vuelve a ser el nativo del sistema. Dos
 * experiencias distintas de scroll era la objeción con la que este proyecto lo
 * había descartado; se resuelve haciendo que la ausencia de Lenis sea un estado
 * de primera clase (ver `src/lib/scroll.ts`: la navegación funciona igual sin él).
 *
 * Táctil queda en manos del sistema (`syncTouch` apagado): el scroll de un dedo
 * en un teléfono ya tiene una física que el usuario conoce, y reemplazarla es
 * exactamente "hacer visible la tecnología".
 */
export function ScrollSuave() {
  useEffect(() => {
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (quieto.matches) return;

    const lenis = new Lenis({
      // Corto a propósito. Una inercia larga se siente como flotar, y flotar es
      // la sensación de que la página decide por vos.
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: false,
    });

    registrarLenis(lenis);

    let raf = requestAnimationFrame(function loop(tiempo: number) {
      lenis.raf(tiempo);
      raf = requestAnimationFrame(loop);
    });

    // Llegar con un ancla en la URL (desde un proyecto, o con un link
    // compartido) tiene que aterrizar en el mismo lugar que un click en la nav.
    // El navegador ya salta usando `scroll-margin-top`; esto solo corrige el
    // caso en que el salto ocurrió antes de que Lenis tomara el control.
    const hash = window.location.hash.slice(1);
    if (hash) requestAnimationFrame(() => irASeccion(hash));

    return () => {
      cancelAnimationFrame(raf);
      registrarLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
