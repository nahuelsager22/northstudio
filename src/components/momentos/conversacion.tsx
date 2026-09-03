import { ConversacionFormulario } from "./conversacion-formulario";
import { ANCLA_CONTACTO } from "@/lib/i18n/secciones";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Momento 5 · La conversación — el cierre del recorrido (docs/recorrido.md).
 *
 * El cierre del recorrido y el pico emocional del arco. No capta: recibe. Un
 * formulario de captación existe para *calificar* a quien escribe; este existe
 * para *escuchar*. La diferencia se nota en lo que no está — no hay urgencia, ni
 * "agendá una llamada", ni contador de plazas, ni lenguaje de conversión.
 *
 * Vuelve al margen del umbral (8%): el recorrido cierra donde abrió, ahora con
 * alguien más adentro. Después del formulario hay un pie con dos datos y nada
 * más (`components/pie.tsx`): sigue sin haber "seguinos" ni menú de enlaces,
 * pero un estudio que no dice dónde encontrarlo le hace trabajo a quien quiere
 * seguir la conversación por otro lado.
 */
export function Conversacion({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    // El ancla se llama como el destino que la nav ofrece (`contacto`), no como
    // el momento (`la conversación`): la palabra que alguien clickea y la que
    // termina en su barra de direcciones tienen que ser la misma.
    <section
      id={ANCLA_CONTACTO}
      data-zona
      data-superficie="tierra"
      className="superficie escena px-md sm:px-xl"
    >
      {/* La recepción se marca acá, en lo que no se desmonta: si estuviera
          sobre el formulario, la confirmación aparecería después de que el
          observer terminó su trabajo y quedaría escondida esperándolo. */}
      <div data-reveal className="mx-auto w-full max-w-[46rem]">
        <ConversacionFormulario dict={dict} locale={locale} />
      </div>
    </section>
  );
}
