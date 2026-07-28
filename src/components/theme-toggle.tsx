"use client";

import { setTheme, type Theme } from "@/lib/theme";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * UI del toggle papel/noche sobre el mecanismo del Bloque 4 (`src/lib/theme.ts`).
 *
 * Sin ícono: una palabra en la misma voz que el resto de la nav. Ambas etiquetas
 * se renderizan siempre y el CSS muestra la que corresponde (ver globals.css) —
 * así el servidor no tiene que adivinar el `prefers-color-scheme` del visitante
 * y no hay parpadeo ni desajuste de hidratación.
 */
export function ThemeToggle({
  labels,
  className,
}: {
  labels: Dictionary["nav"]["tema"];
  className?: string;
}) {
  function alternar() {
    const root = document.documentElement;
    const explicito = root.getAttribute("data-theme");
    const actual: Theme =
      explicito === "papel" || explicito === "noche"
        ? explicito
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "noche"
          : "papel";

    setTheme(actual === "papel" ? "noche" : "papel");
  }

  return (
    <button type="button" onClick={alternar} className={className}>
      <span data-theme-target="noche" className="quiet-underline">
        <span className="sr-only">{labels.accion} </span>
        {labels.noche}
      </span>
      <span data-theme-target="papel" className="quiet-underline">
        <span className="sr-only">{labels.accion} </span>
        {labels.papel}
      </span>
    </button>
  );
}
