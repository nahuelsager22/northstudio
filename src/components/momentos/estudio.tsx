import { Fragment } from "react";
import type { Segmento } from "@/lib/i18n/segments";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * Momento 2 · El estudio — la forma de mirar (antes `forma-de-mirar.tsx`).
 *
 * Sigue siendo una respiración y no un manifiesto: dos pasajes cortos, no una
 * lista de valores ni "nuestro proceso en cuatro pasos". Lo que cambió es la voz
 * —ahora es la del estudio, no un "yo"— y que la sección tiene ancla propia,
 * porque el recorrido ahora se puede navegar.
 *
 * Cambia de registro respecto del umbral sin cambiar de lugar: la columna entra
 * mucho más adentro (24% contra 8%) y la medida es corta a propósito. El segundo
 * pasaje entra todavía un poco más y en `muted`: es la misma voz bajando el tono,
 * no una idea nueva compitiendo con la primera.
 */
export function Estudio({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="estudio"
      aria-labelledby="estudio-etiqueta"
      className="px-md pb-rest-lg sm:px-xl"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <p
          id="estudio-etiqueta"
          data-reveal
          className="font-mono text-meta uppercase text-muted md:ml-[24%]"
        >
          {dict.estudio.etiqueta}
        </p>

        <p
          data-reveal
          className="mt-lg max-w-[30ch] font-serif text-title-2 text-ink md:ml-[24%] md:max-w-[34ch] md:text-title-1"
        >
          <Pasaje segmentos={dict.estudio.pasaje} />
        </p>

        <p
          data-reveal
          className="mt-xl max-w-[38ch] font-serif text-body text-muted md:ml-[30%] md:max-w-[44ch]"
        >
          <Pasaje segmentos={dict.estudio.cierre} />
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
