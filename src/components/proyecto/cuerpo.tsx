import { Texto } from "./bloques/texto";
import { Media } from "./bloques/media";
import { Par } from "./bloques/par";
import { Cita } from "./bloques/cita";
import { Dato } from "./bloques/dato";
import { Pausa } from "./bloques/pausa";
import type { BloqueProyecto } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";

/**
 * El cuerpo de un proyecto (docs/contenido.md).
 *
 * La interfaz sabe interpretar cada tipo de bloque; el orden, la cantidad y la
 * combinación los define el dato. Acá no hay ninguna decisión sobre *qué*
 * proyecto se está mostrando: solo sobre cómo respira una secuencia.
 *
 * El aire entre bloques es `--aire`, que fija el clima (ver globals.css). La
 * excepción es la pausa: un bloque de silencio *reemplaza* el ritmo por defecto
 * en vez de sumarse a él, así que ni la pausa ni lo que viene después llevan el
 * margen normal. Si no fuera así, escribir una pausa daría un salto doble y el
 * dato dejaría de controlar de verdad el ritmo.
 */
export function Cuerpo({
  bloques,
  locale,
}: {
  bloques: BloqueProyecto[];
  locale: Locale;
}) {
  let medios = 0;

  return (
    <div>
      {bloques.map((bloque, i) => {
        const anterior = bloques[i - 1];
        const junto =
          i === 0 || bloque.tipo === "pausa" || anterior?.tipo === "pausa";

        return (
          <div
            key={i}
            // Una pausa no se recibe: no hay nada que asentarse.
            data-reveal={bloque.tipo === "pausa" ? undefined : ""}
            className={junto ? undefined : "mt-[var(--aire)]"}
          >
            {renderizar(bloque, locale, bloque.tipo === "media" ? medios++ : 0)}
          </div>
        );
      })}
    </div>
  );
}

function renderizar(bloque: BloqueProyecto, locale: Locale, indiceMedia: number) {
  switch (bloque.tipo) {
    case "texto":
      return <Texto bloque={bloque} locale={locale} />;
    case "media":
      return <Media bloque={bloque} locale={locale} indice={indiceMedia} />;
    case "par":
      return <Par bloque={bloque} locale={locale} />;
    case "cita":
      return <Cita bloque={bloque} locale={locale} />;
    case "dato":
      return <Dato bloque={bloque} locale={locale} />;
    case "pausa":
      return <Pausa bloque={bloque} />;
    default: {
      // Sumar un tipo de bloque al esquema sin enseñarle a la interfaz a leerlo
      // rompe acá, en compilación, y no en la página de alguien.
      const nunca: never = bloque;
      return nunca;
    }
  }
}
