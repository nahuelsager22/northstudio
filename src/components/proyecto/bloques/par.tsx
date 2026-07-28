import { Medio } from "../medio";
import type { BloquePar } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Bloque `par` — dos medios en relación (antes/después, dos vistas).
 *
 * Es el único lugar del sitio donde dos elementos comparten formato exacto, y
 * está justificado: comparar exige igualdad de condiciones. Si uno fuera más
 * alto o más ancho, la comparación diría algo que el trabajo no dijo. La regla
 * anti-grilla no se rompe por costumbre — se rompe porque acá la simetría *es*
 * el contenido, y la asimetría vuelve enseguida en dónde se apoya el par
 * dentro de la página.
 *
 * En teléfono el par se apila conservando el mismo recorte: apilados siguen
 * siendo dos vistas de lo mismo, y ahí el foco hace su trabajo.
 */
export function Par({
  bloque,
  locale,
}: {
  bloque: BloquePar;
  locale: Locale;
}) {
  return (
    <div className="grid max-w-[52rem] grid-cols-1 gap-lg sm:grid-cols-2 sm:gap-md md:ml-[14%]">
      {bloque.medios.map((media, i) => (
        <Medio
          key={i}
          media={media}
          locale={locale}
          sizes="(min-width: 640px) 36vw, 100vw"
          recorte="aspect-[4/5]"
        />
      ))}
    </div>
  );
}
