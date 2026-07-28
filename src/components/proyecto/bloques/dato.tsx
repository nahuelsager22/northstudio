import { resolverCampo, type BloqueDato } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Bloque `dato` — un metadato editorial que merece detenerse.
 *
 * No es la ficha técnica del proyecto (esa vive en la apertura): es el número
 * o el hecho que el proyecto quiso decir en voz alta. Por eso es el único
 * bloque con una regla encima: la hairline funciona como la línea que separa
 * un dato de una página impresa del cuerpo del texto — no como decoración,
 * como notación editorial.
 *
 * Angosto a propósito. Un dato ancho se convierte en tabla.
 */
export function Dato({
  bloque,
  locale,
}: {
  bloque: BloqueDato;
  locale: Locale;
}) {
  return (
    <div className="max-w-[26rem] border-t pt-md md:ml-[16%]">
      <p className="font-sans text-label uppercase text-muted">
        {resolverCampo(bloque.etiqueta, locale)}
      </p>
      <p className="mt-2xs font-serif text-title-3 text-ink">
        {resolverCampo(bloque.valor, locale)}
      </p>
    </div>
  );
}
