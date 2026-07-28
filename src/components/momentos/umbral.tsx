import { Fragment } from "react";
import { Lockup } from "@/components/brand/lockup";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * Momento 1 · El umbral — apertura, calma (experience-architecture.md §1).
 *
 * Contención, pero no mutismo. Antes acá había una etiqueta de cinco palabras en
 * registro de interfaz; ahora hay **una línea de voz** que dice qué hace el
 * estudio y para quién. Es el cambio vigente: la web sigue demostrando, y además
 * deja claro qué es esto sin volverse una promesa de landing.
 *
 * Esa línea resuelve además el hueco que quedaba abierto —"hay alguien detrás"—
 * sin inventar un nombre propio: el sujeto es el estudio.
 *
 * La firma no está centrada ni arriba: se apoya por debajo del centro óptico,
 * desplazada del margen. Entrar es bajar la vista. La transición al momento
 * siguiente es el vacío que sigue: ni flecha ni "scroll para descubrir".
 */
export function Umbral({ dict }: { dict: Dictionary }) {
  return (
    <section className="flex min-h-svh flex-col justify-center px-md pt-[16svh] pb-rest sm:px-xl">
      <div className="mx-auto w-full max-w-[92rem]">
        <div className="md:ml-[8%]">
          {/* La recepción se marca por unidad y no por bloque: la firma y la
              línea se asientan cada una a su momento. Marcarlo todo junto hacía
              que el único movimiento del sitio pasara casi sin percibirse. */}
          {/* La firma crece con el formato: en pantallas grandes, un tamaño
              pensado para el portátil quedaría perdido en el margen. */}
          <div data-reveal>
            <Lockup className="h-24 w-auto text-ink sm:h-32 lg:h-40 2xl:h-52" />
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
