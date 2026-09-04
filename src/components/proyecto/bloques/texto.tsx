import { Fragment } from "react";
import { resolverCampo, type BloqueTexto } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Bloque `texto` — el relato honesto del proyecto.
 *
 * Serif a medida de lectura (60–68ch, docs/sistema-visual.md) y entrada desde el
 * margen: es una columna editorial, no un ancho de pantalla. Los párrafos se
 * separan en el dato con una línea en blanco, como se escribe en cualquier
 * lado; la interfaz no obliga a estructurar la prosa en un array.
 *
 * El énfasis se escribe `*así*` y sale en itálica. Es la misma regla que ya
 * gobernaba el copy del recorrido (el tipo `Segmento`, donde el énfasis vive en
 * el dato y no en el markup), traída a la prosa: escribir un caso no debería
 * obligar a partir un párrafo en fragmentos para poder acentuar una palabra.
 * Itálica y nada más — el sistema no tiene negrita (docs/sistema-visual.md).
 */
export function Texto({
  bloque,
  locale,
}: {
  bloque: BloqueTexto;
  locale: Locale;
}) {
  return (
    <Prosa
      texto={resolverCampo(bloque.contenido, locale)}
      className="max-w-[64ch] font-serif text-body text-ink md:ml-[16%]"
    />
  );
}

/**
 * La misma gramática de prosa, disponible fuera del cuerpo.
 *
 * Existe porque la presentación de un proyecto dejó de vivir en el cuerpo y pasó
 * a la apertura (`proyecto-adentro.tsx`): es el mismo texto escrito de la misma
 * manera —párrafos separados por una línea en blanco, énfasis entre asteriscos—
 * puesto en otro lugar de la página. Duplicar el intérprete habría sido tener dos
 * reglas de escritura para la misma prosa.
 */
export function Prosa({
  texto,
  className,
}: {
  texto: string;
  className?: string;
}) {
  const parrafos = texto
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean);

  return (
    <div className={className}>
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
