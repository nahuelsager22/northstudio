import { Fragment } from "react";
import { Lockup, AstroDeLaFirma } from "@/components/brand/lockup";
import { FirmaViva } from "@/components/firma-viva";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * El umbral — apertura, calma.
 *
 * El momento contemplativo del recorrido: pantalla completa, una firma, una
 * línea, y el cielo detrás si es de noche. Nada que leer, nada que decidir.
 *
 * La firma no está centrada ni arriba: se apoya por debajo del centro óptico,
 * desplazada del margen. Entrar es bajar la vista. La transición al momento
 * siguiente es el vacío que sigue — ni flecha ni "scroll para descubrir".
 *
 * Y ahora respira: el cordón y el astro siguen al puntero a ritmos distintos
 * (`FirmaViva`). No se ve moverse; se percibe que la firma está un poco detrás
 * de la pantalla y no impresa sobre ella.
 */
export function Umbral({ dict }: { dict: Dictionary }) {
  return (
    // Sin `.superficie`: el cielo no se pinta, se deja ver — el canvas de
    // estrellas está fijo detrás. `data-zona` es lo que le dice a la nav de qué
    // color es el lugar donde está apoyada (globals.css).
    <section
      data-zona
      data-superficie="cielo"
      className="flex min-h-svh flex-col justify-center px-md pt-[16svh] pb-rest sm:px-xl"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <div className="md:ml-[8%]">
          {/* La recepción se marca por unidad y no por bloque: la firma y la
              línea se asientan cada una a su momento. */}
          <div data-reveal className="w-fit">
            {/* La firma crece con el formato: en pantallas grandes, un tamaño
                pensado para el portátil queda perdido en el margen. */}
            <FirmaViva
              cordon={
                <Lockup
                  sinAstro
                  className="h-24 w-auto text-ink sm:h-32 lg:h-40 2xl:h-52"
                />
              }
              destello={
                <AstroDeLaFirma className="h-24 w-auto text-ink sm:h-32 lg:h-40 2xl:h-52" />
              }
            />
          </div>

          <p
            data-reveal
            className="mt-xl max-w-[40ch] font-serif text-title-3 text-ink sm:mt-2xl md:max-w-[46ch] md:text-title-2"
          >
            {dict.umbral.linea.map((segmento, i) =>
              segmento.enfasis ? (
                <em key={i}>{segmento.texto}</em>
              ) : (
                <Fragment key={i}>{segmento.texto}</Fragment>
              )
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
