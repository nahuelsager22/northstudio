/**
 * El paso de un plano al siguiente — parte del diseño de la página, no un
 * cambio de `background-color` entre dos componentes.
 *
 * Existe como pieza propia porque eso es lo que era el problema: antes cada
 * momento resolvía su borde por su cuenta (uno con un degradado en su padding,
 * otro con un filo) y el recorrido terminaba siendo una pila de secciones
 * puestas una debajo de otra. La transición ahora es un bloque en el flujo, y
 * **es el silencio entre dos momentos**: no se le suma a ningún padding, lo
 * reemplaza. Por eso cada sección puede volver a empezar en su contenido y un
 * ancla sigue aterrizando en lo que se vino a leer.
 *
 * Dos capas, las dos de composición (los colores y el porqué: `globals.css`):
 *
 * 1. **La atmósfera.** Un degradado que no va directo del color A al B sino que
 *    pasa por un intermedio cálido. Dos colores se relacionan por lo que hay
 *    entre ellos: sin ese paso, la noche y la arena son dos decisiones que no se
 *    conocen.
 * 2. **La onda.** El plano que llega sube dentro del anterior por una curva
 *    asimétrica en vez de por una línea recta. Un horizonte no es horizontal —
 *    y una recta a todo el ancho de la ventana es lo que hace que un cambio de
 *    fondo se lea como el final de un bloque.
 *
 * Las dos curvas son distintas y se alternan: la misma onda tres veces sería un
 * separador, que es otra manera de decir "acá termina una sección".
 */

/**
 * Las curvas. `viewBox` de 1440×140 con `preserveAspectRatio="none"`: la onda se
 * estira al ancho de la ventana, así que la proporción de la curva la decide el
 * formato y no un número fijo. Todas se quedan por encima de y=120 y bajan a 140
 * para cerrarse: el borde inferior queda lleno de punta a punta, sin un solo
 * píxel del color anterior asomando en los valles.
 */
const ONDAS = {
  /** Cresta corrida a la izquierda, caída larga hacia la derecha. */
  amanecer:
    "M0,84 C210,34 402,30 618,62 C806,90 986,116 1178,100 C1290,90 1368,66 1440,40 L1440,140 L0,140 Z",
  /** La inversa: entra baja, sube al centro-derecha y vuelve a caer. */
  atardecer:
    "M0,44 C168,74 356,104 566,96 C774,88 962,50 1166,44 C1272,41 1362,52 1440,72 L1440,140 L0,140 Z",
} as const;

export function Transicion({
  /** El plano que llega. Nombra el degradado y el relleno de la onda. */
  hacia,
  /** Qué superficie manda en la tinta arriba y abajo — lo usa la nav. */
  desde,
  onda = "amanecer",
}: {
  hacia: "arena" | "tierra" | "cielo";
  desde: "cielo" | "arena" | "tierra";
  onda?: keyof typeof ONDAS;
}) {
  return (
    <div
      aria-hidden="true"
      data-zona
      data-transicion={hacia}
      data-tinta-a={desde}
      data-tinta-b={hacia}
      className="transicion"
    >
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        focusable="false"
        className="transicion-onda"
      >
        <path d={ONDAS[onda]} />
      </svg>
    </div>
  );
}
