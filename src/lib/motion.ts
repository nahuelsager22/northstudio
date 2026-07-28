/**
 * Fundación de motion — sin librerías (ver project-journal.md, Bloque 5a).
 *
 * Un solo vocabulario en todo el sitio, definido en `globals.css`:
 *   1. recepción   — fundido + ascenso de pocos píxeles, lento, una sola vez;
 *   2. continuidad — el fondo/tinta y la nav cambian de estado sin saltar;
 *   3. acuse       — un subrayado que se dibuja despacio al hover/foco.
 *
 * Este archivo aporta solo lo que el CSS no puede: marcar que hay JS antes del
 * primer paint. El estado oculto del revelado se aplica únicamente bajo
 * `html[data-js]`, así que sin JavaScript el recorrido se ve entero — nunca
 * hay contenido escondido esperando un observer que no va a llegar.
 */
export const motionInitScript = `document.documentElement.setAttribute("data-js","");`;

/** Margen inferior: el elemento entra recién cuando ya está dentro de la vista. */
export const REVEAL_ROOT_MARGIN = "0px 0px -12% 0px";
