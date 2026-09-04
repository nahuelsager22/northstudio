/**
 * El paso de un plano al siguiente — parte del diseño de la página, no un
 * cambio de `background-color` entre dos componentes.
 *
 * Existe como pieza propia porque eso es lo que era el problema: antes cada
 * momento resolvía su borde por su cuenta (uno con un degradado en su padding,
 * otro con un filo) y el recorrido terminaba siendo una pila de secciones
 * puestas una debajo de otra. La transición es un bloque en el flujo, y **es el
 * silencio entre dos momentos**: no se le suma a ningún padding, lo reemplaza.
 * Por eso cada sección puede volver a empezar en su contenido y un ancla sigue
 * aterrizando en lo que se vino a leer.
 *
 * **Una sola capa: la onda.** ~~Antes eran dos —una atmósfera en degradado y la
 * curva encima.~~ El degradado existía para presentar dos colores que no se
 * conocían; ahora se conocen (los colores y el porqué: `globals.css`), así que
 * el fundido sobraba y era, además, lo único artificial del sistema. El
 * recorrido es color plano, onda, color plano.
 *
 * Un horizonte no es horizontal: una recta a todo el ancho de la ventana es lo
 * que hace que un cambio de fondo se lea como el final de un bloque. Las dos
 * curvas se alternan — la misma tres veces sería un separador, que es otra
 * manera de decir lo mismo.
 */

/**
 * Las curvas, sin cerrar. `viewBox` de 1440×140 con `preserveAspectRatio="none"`:
 * la onda se estira al ancho de la ventana, así que la proporción la decide el
 * formato y no un número fijo. Se guardan abiertas porque el mismo trazo se
 * cierra hacia abajo o hacia arriba según el modo, y el borde que se ve —que es
 * la curva— resulta idéntico en los dos casos.
 */
const CURVAS = {
  /** Cresta corrida a la izquierda, caída larga hacia la derecha. */
  amanecer:
    "M0,84 C210,34 402,30 618,62 C806,90 986,116 1178,100 C1290,90 1368,66 1440,40",
  /** La inversa: entra baja, sube al centro-derecha y vuelve a caer. */
  atardecer:
    "M0,44 C168,74 356,104 566,96 C774,88 962,50 1166,44 C1272,41 1362,52 1440,72",
} as const;

/**
 * Los dos modos, y la diferencia es de qué lado del paso está el cielo.
 *
 * El cielo **no se pinta**: el canvas de estrellas está fijo detrás y lo que lo
 * muestra es que no haya nada encima. Así que cuando el cielo es el destino no
 * se puede rellenar la onda con su color —eso es pintar un fondo que no había
 * que pintar, y era exactamente el corte recto de negro que aparecía debajo de
 * la onda del pie—: se rellena lo contrario. Mismo trazo, se cierra para arriba,
 * y debajo de la curva no queda nada.
 */
const CIERRE = {
  sube: "L1440,140 L0,140 Z",
  revela: "L1440,0 L0,0 Z",
} as const;

type Plano = "cielo" | "bosque" | "liquen" | "tierra";

export function Transicion({
  /** El plano que queda arriba. */
  desde,
  /** El plano que llega. */
  hacia,
  onda = "amanecer",
}: {
  desde: Plano;
  hacia: Plano;
  onda?: keyof typeof CURVAS;
}) {
  const modo = hacia === "cielo" ? "revela" : "sube";

  return (
    <div
      aria-hidden="true"
      data-zona
      data-paso={`${desde}-${hacia}`}
      data-onda={modo}
      data-tinta-a={desde}
      data-tinta-b={hacia}
      className="transicion"
    >
      {/* En modo `revela` el bloque no se pinta —debajo de la curva tiene que
          verse el cielo—, así que el plano de origen necesita un cuerpo propio
          que baje hasta apoyarse en la onda. En modo `sube` no hace falta: ese
          cuerpo es el fondo del bloque. */}
      {modo === "revela" ? <div className="transicion-masa" /> : null}

      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        focusable="false"
        className="transicion-onda"
      >
        <path d={`${CURVAS[onda]} ${CIERRE[modo]}`} />
      </svg>
    </div>
  );
}
