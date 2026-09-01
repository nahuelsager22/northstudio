import { Medio } from "../medio";
import type { BloqueMedia } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Bloque `media` — una imagen o un video a plena atención.
 *
 * "Plena atención" no es "pantalla completa": el margen sigue enmarcando
 * (docs/sistema-visual.md · Espacio). Lo que cambia es que nada la acompaña — el medio
 * ocupa su propio momento.
 *
 * Las sangrías alternan entre medios consecutivos porque varias imágenes con
 * el mismo borde izquierdo dejan de leerse como composición y empiezan a
 * leerse como columna. La alternancia sale del propio orden del dato, no de un
 * capricho: es la misma decisión que la lista de obra del Momento 3.
 *
 * Los dos márgenes suman lo mismo (16%): el medio conserva su peso y lo único
 * que se mueve es dónde se apoya. Y son porcentajes, no un ancho fijo: un tope
 * en píxeles se veía justo en un portátil y quedaba chico en una pantalla
 * grande — la misma lección que la firma del umbral (Bloque 5a).
 */
const SANGRIAS = ["md:ml-[6%] md:mr-[10%]", "md:ml-[14%] md:mr-[2%]"];

export function Media({
  bloque,
  locale,
  indice,
}: {
  bloque: BloqueMedia;
  locale: Locale;
  /** Ordinal entre los medios del cuerpo, no entre todos los bloques. */
  indice: number;
}) {
  return (
    <Medio
      media={bloque.media}
      locale={locale}
      sizes="(min-width: 1600px) 1240px, (min-width: 768px) 78vw, 100vw"
      className={SANGRIAS[indice % SANGRIAS.length]}
    />
  );
}
