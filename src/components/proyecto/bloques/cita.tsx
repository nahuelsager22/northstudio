import { resolverCampo, type BloqueCita } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Bloque `cita` — la voz de la persona representada, nunca la del estudio.
 *
 * Sin comillas decorativas ni comilla gigante de fondo: agregarlas sería
 * ponerle énfasis a la voz de otro. Lo que la separa del relato es que entra
 * más adentro que cualquier otro bloque —alguien más está hablando, y se le
 * hace lugar— y que abajo aparece quién habla.
 *
 * La medida es corta a propósito: una cita larga deja de ser una voz y pasa a
 * ser un texto.
 */
export function Cita({
  bloque,
  locale,
}: {
  bloque: BloqueCita;
  locale: Locale;
}) {
  return (
    <blockquote className="max-w-[30ch] md:ml-[28%] md:max-w-[34ch]">
      <p className="font-serif text-title-2 text-ink">
        {resolverCampo(bloque.texto, locale)}
      </p>
      {bloque.atribucion ? (
        <footer className="mt-md font-mono text-meta text-muted">
          {bloque.atribucion}
        </footer>
      ) : null}
    </blockquote>
  );
}
