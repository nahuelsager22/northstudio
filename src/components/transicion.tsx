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
 * ~~Antes el paso era una onda: una curva orgánica a todo el ancho.~~ Funcionaba
 * —no se cambió por un defecto—, pero era también la firma visual del primer
 * sitio de cliente publicado. Con sólo dos sitios en la calle, una firma
 * compartida se lee al revés de como es: parecía que el estudio había tomado el
 * lenguaje del cliente. **Un estudio tiene que poder dirigir un proyecto sin
 * quedarse con su imagen.**
 *
 * El corte diagonal resuelve eso por lo que *es*, no por ser distinto: una onda
 * es un motivo —dibuja algo, agua, colinas, un horizonte— y un motivo se hereda.
 * Una diagonal no dibuja nada: es una decisión de compaginación, del mismo orden
 * que un margen o una caja de texto. El estudio se queda con la gramática y cada
 * cliente se queda con sus imágenes.
 *
 * Un horizonte no es horizontal: una recta a todo el ancho de la ventana es lo
 * que hace que un cambio de fondo se lea como el final de un bloque. Por eso el
 * corte tiene sesgo, y por eso el sesgo **alterna**: cuatro diagonales paralelas
 * son un patrón, y un patrón vuelve a leerse como una plantilla. Alternadas, los
 * planos que quedan entre ellas se inclinan uno hacia cada lado y el descenso
 * tiene ritmo en vez de deriva.
 */

/**
 * Los dos cortes, sin cerrar. `viewBox` de 1440×140 con
 * `preserveAspectRatio="none"`: el corte se estira al ancho de la ventana, así
 * que la subida en píxeles la fija la altura de la caja (`--corte-alto`) y el
 * ángulo lo decide el formato — más leve cuanto más ancha la pantalla, que es lo
 * que hace falta para que en un teléfono se lea como un sesgo y no como una
 * recta. Se guardan abiertos porque el mismo trazo se cierra hacia abajo o hacia
 * arriba según qué lado haya que pintar, y el borde que se ve es idéntico.
 *
 * En SVG el eje vertical crece hacia abajo: el extremo que "sube" es el que
 * tiene y menor.
 */
const CORTES = {
  /** Arranca abajo a la izquierda y sube hacia la derecha. */
  derecha: "M0,140 L1440,0",
  /** La inversa: arranca abajo a la derecha y sube hacia la izquierda. */
  izquierda: "M0,0 L1440,140",
} as const;

/**
 * Qué lado del corte se pinta, y la diferencia es de qué lado del paso está el
 * cielo.
 *
 * El cielo **no se pinta**: el canvas de estrellas está fijo detrás y lo que lo
 * muestra es que no haya nada encima. Así que cuando el cielo es el destino no
 * se puede rellenar debajo del corte con su color —eso es pintar un fondo que no
 * había que pintar, y era exactamente el corte recto de negro que aparecía
 * debajo de la onda del pie—: se rellena lo contrario. Mismo trazo, se cierra
 * para arriba, y debajo de la diagonal no queda nada.
 */
const CIERRE = {
  destino: "L1440,140 L0,140 Z",
  origen: "L1440,0 L0,0 Z",
} as const;

type Plano = "cielo" | "bosque" | "piedra" | "tierra";

export function Transicion({
  /** El plano que queda arriba. */
  desde,
  /** El plano que llega. */
  hacia,
  /** Hacia dónde sube el corte. Alterna a lo largo del recorrido. */
  sesgo = "derecha",
}: {
  desde: Plano;
  hacia: Plano;
  sesgo?: keyof typeof CORTES;
}) {
  const relleno = hacia === "cielo" ? "origen" : "destino";

  return (
    <div
      aria-hidden="true"
      data-zona
      data-paso={`${desde}-${hacia}`}
      data-relleno={relleno}
      data-tinta-a={desde}
      data-tinta-b={hacia}
      className="transicion"
    >
      {/* Cuando se pinta el origen, el bloque queda transparente —debajo del
          corte tiene que verse el cielo—, así que el plano de arriba necesita un
          cuerpo propio que baje hasta apoyarse en la diagonal. Cuando se pinta
          el destino no hace falta: ese cuerpo es el fondo del bloque. */}
      {relleno === "origen" ? <div className="transicion-masa" /> : null}

      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        focusable="false"
        className="transicion-corte"
      >
        <path d={`${CORTES[sesgo]} ${CIERRE[relleno]}`} />
      </svg>
    </div>
  );
}
