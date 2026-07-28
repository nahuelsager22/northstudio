import { ConversacionFormulario } from "./conversacion-formulario";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Momento 5 · La conversación — contacto, pertenencia (experience-architecture.md §1).
 *
 * El cierre del recorrido y el pico emocional del arco. No capta: recibe. Un
 * formulario de captación existe para *calificar* a quien escribe; este existe
 * para *escuchar*. La diferencia se nota en lo que no está — no hay urgencia, ni
 * "agendá una llamada", ni contador de plazas, ni lenguaje de conversión.
 *
 * Vuelve al margen del umbral (8%): el recorrido cierra donde abrió, ahora con
 * alguien más adentro. Y después del formulario no hay nada — sin footer de
 * enlaces, sin "seguinos". El último silencio cierra como se cierra un buen
 * libro, sin ruido.
 */
export function Conversacion({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section id="conversacion" className="px-md pb-rest sm:px-xl">
      <div className="mx-auto w-full max-w-[92rem]">
        {/* La recepción se marca acá, en lo que no se desmonta: si estuviera
            sobre el formulario, la confirmación aparecería después de que el
            observer terminó su trabajo y quedaría escondida esperándolo. */}
        <div data-reveal className="md:ml-[8%]">
          <ConversacionFormulario dict={dict} locale={locale} />
        </div>
      </div>
    </section>
  );
}
