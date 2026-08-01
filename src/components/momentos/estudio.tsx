import { Fragment } from "react";
import type { Segmento } from "@/lib/i18n/segments";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * El estudio — la forma de mirar.
 *
 * Ahora llega **después** del trabajo. Ese cambio de lugar es la mitad del
 * arreglo: las mismas frases que antes sonaban a promesa ahora confirman algo
 * que el visitante acaba de ver. La otra mitad es lo que se fue — la sección que
 * explicaba el proceso en cuatro etapas y la ficha que enumeraba con quién,
 * cuántos y qué incluye.
 *
 * Queda una respiración: dos pasajes, una frase sobre qué queda al final (lo
 * único que no se puede mostrar) y un colofón en registro de notación para quien
 * necesite saber qué hace el estudio. Sin etiqueta de sección: la nav ya lo
 * nombra, e imprimirlo acá sería un sitio leyéndose su propio índice.
 *
 * Es el momento de respiración del recorrido: entra hondo desde el margen (24%),
 * la voz baja en el segundo pasaje y el colofón casi no se ve.
 */
export function Estudio({ dict }: { dict: Dictionary }) {
  const e = dict.estudio;

  return (
    <section
      id="estudio"
      aria-label={e.nombre}
      className="px-md pb-rest-lg sm:px-xl"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <p
          data-reveal
          className="max-w-[30ch] font-serif text-title-2 text-ink md:ml-[24%] md:max-w-[34ch] md:text-title-1"
        >
          <Pasaje segmentos={e.pasaje} />
        </p>

        {/* El puente: de la persona al trabajo. Cuerpo en `muted` — es la voz
            bajando el tono para explicar una idea, no una afirmación nueva. */}
        <p
          data-reveal
          className="mt-xl max-w-[42ch] font-serif text-body text-muted md:ml-[30%] md:max-w-[52ch]"
        >
          <Pasaje segmentos={e.puente} />
        </p>

        {/* Qué se hace. Vuelve a subir a tinta y a escala de título: después del
            puente, es lo único que el visitante necesita retener. */}
        <p
          data-reveal
          className="mt-2xl max-w-[36ch] font-serif text-title-3 text-ink md:ml-[30%] md:max-w-[40ch]"
        >
          <Pasaje segmentos={e.cierre} />
        </p>

        {/* El colofón: qué se construye, sin rótulo. Una lista rotulada sería un
            menú de servicios; sin rótulo es la línea de créditos de un impreso. */}
        <p
          data-reveal
          className="mt-lg max-w-[64ch] font-mono text-meta text-muted md:ml-[30%]"
        >
          {e.oficios}
        </p>

        {/* El remate: la filosofía, después de la lista y no antes. Puesta
            arriba sonaría a promesa; acá cierra lo que ya se dijo. */}
        <p
          data-reveal
          className="mt-2xl max-w-[42ch] font-serif text-body text-muted md:ml-[30%] md:max-w-[50ch]"
        >
          <Pasaje segmentos={e.remate} />
        </p>
      </div>
    </section>
  );
}

/** El énfasis vive en el dato (art-direction.md §1.5): itálica, nunca negrita. */
export function Pasaje({ segmentos }: { segmentos: readonly Segmento[] }) {
  return (
    <>
      {segmentos.map((segmento, i) =>
        segmento.enfasis ? (
          <em key={i}>{segmento.texto}</em>
        ) : (
          <Fragment key={i}>{segmento.texto}</Fragment>
        )
      )}
    </>
  );
}
