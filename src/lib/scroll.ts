import type Lenis from "lenis";

/**
 * El único punto del sitio que sabe que existe Lenis.
 *
 * La nav no importa la librería ni la recibe por contexto: pide "llevame a esta
 * sección" y esto resuelve cómo. Si Lenis no está —porque el visitante pidió
 * menos movimiento, porque falló la carga, porque un día se retira— la misma
 * llamada cae al scroll nativo y la navegación sigue funcionando igual. La
 * tecnología acompaña; que se pueda apagar sin romper nada es la prueba.
 */

let instancia: Lenis | null = null;

export function registrarLenis(lenis: Lenis | null): void {
  instancia = lenis;
}

export function obtenerLenis(): Lenis | null {
  return instancia;
}

/**
 * Detiene o reanuda el recorrido. Se usa cuando el menú móvil ocupa la pantalla:
 * dejar el fondo scrolleando detrás de un panel es perderle el lugar al
 * visitante, justo lo contrario de la orientación que el motion debe dar.
 *
 * El bloqueo es doble a propósito: `stop()` desactiva la rueda y el táctil que
 * administra Lenis, y `overflow: hidden` cubre lo que Lenis no intercepta
 * (arrastrar la barra de scroll, las teclas de página). Las dos mitades viven
 * juntas acá porque son una sola decisión — si se separaran, cerrar el panel por
 * un camino podría soltar una y no la otra.
 */
export function pausarScroll(pausado: boolean): void {
  document.documentElement.style.overflow = pausado ? "hidden" : "";
  if (!instancia) return;
  if (pausado) instancia.stop();
  else instancia.start();
}

/**
 * Aterriza al comienzo de una sección.
 *
 * Cuánto se retira el destino del borde superior lo dice **una sola cosa**: el
 * `scroll-margin-top` de la sección (`--spacing-anchor` en globals.css). Los dos
 * caminos lo respetan — el salto nativo del navegador y el desplazamiento de
 * Lenis— así que un ancla aterriza en el mismo lugar con JS y sin JS.
 *
 * Verificado en el navegador, y vale la pena registrarlo porque no es obvio:
 * pasarle además un `offset` a Lenis lo aplicaba *encima* del scroll-margin y la
 * sección quedaba al doble de distancia. El valor vive en el CSS y nada más lo
 * repite; duplicarlo era el error.
 */
export function irASeccion(id: string): boolean {
  const destino = document.getElementById(id);
  if (!destino) return false;

  const lenis = obtenerLenis();
  if (!lenis) {
    destino.scrollIntoView({ behavior: "auto", block: "start" });
    return true;
  }

  lenis.scrollTo(destino);
  return true;
}
