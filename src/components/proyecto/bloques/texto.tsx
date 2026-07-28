import { Fragment } from "react";
import { resolverCampo, type BloqueTexto } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Bloque `texto` — el relato honesto del proyecto.
 *
 * Serif a medida de lectura (60–68ch, art-direction.md §1.5) y entrada desde el
 * margen: es una columna editorial, no un ancho de pantalla. Los párrafos se
 * separan en el dato con una línea en blanco, como se escribe en cualquier
 * lado; la interfaz no obliga a estructurar la prosa en un array.
 *
 * El énfasis se escribe `*así*` y sale en itálica. Es la misma regla que ya
 * gobernaba el copy del recorrido (el tipo `Segmento`, donde el énfasis vive en
 * el dato y no en el markup), traída a la prosa: escribir un caso no debería
 * obligar a partir un párrafo en fragmentos para poder acentuar una palabra.
 * Itálica y nada más — el sistema no tiene negrita (art-direction.md §1.3).
 */
export function Texto({
  bloque,
  locale,
}: {
  bloque: BloqueTexto;
  locale: Locale;
}) {
  const parrafos = resolverCampo(bloque.contenido, locale)
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean);

  return (
    <div className="max-w-[64ch] font-serif text-body text-ink md:ml-[16%]">
      {parrafos.map((parrafo, i) => (
        <p key={i} className={i > 0 ? "mt-md" : undefined}>
          {conEnfasis(parrafo)}
        </p>
      ))}
    </div>
  );
}

/** Los tramos impares del split caen entre asteriscos: esos van en itálica. */
function conEnfasis(parrafo: string) {
  return parrafo.split(/\*([^*]+)\*/g).map((tramo, i) =>
    i % 2 === 1 ? <em key={i}>{tramo}</em> : <Fragment key={i}>{tramo}</Fragment>
  );
}
