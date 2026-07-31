"use client";

import { setTheme, type Theme } from "@/lib/theme";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * UI del toggle papel/noche sobre el mecanismo del Bloque 4 (`src/lib/theme.ts`).
 *
 * Pasó de palabra a símbolo. "Papel" nombraba el destino con precisión pero no
 * era evidente para alguien que entra por primera vez: hay que conocer los
 * nombres de los temas de este sitio para entender qué hace ese botón. Sol y
 * luna se entienden sin aprender nada, y pelear una convención que funciona
 * sería lucimiento.
 *
 * Lo propio va en la ejecución, no en el símbolo: los dos están dibujados con la
 * hairline del sistema (1.25 px, sin relleno) en vez de ser iconos macizos de
 * librería, y **el sol tiene el ritmo del destello de la firma** — cuatro rayos
 * largos en los ejes y cuatro cortos en las diagonales. Nadie tiene que notarlo;
 * es lo que hace que el gesto pertenezca a este sitio y no a cualquiera.
 *
 * Ambas figuras se renderizan siempre y el CSS muestra la que corresponde (ver
 * globals.css) — así el servidor no tiene que adivinar el `prefers-color-scheme`
 * del visitante y no hay parpadeo ni desajuste de hidratación.
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
      {/* Estás en papel: el destino es la noche. */}
      <span data-theme-target="noche">
        <Luna />
        <span className="sr-only">
          {labels.accion} {labels.noche}
        </span>
      </span>

      {/* Estás en la noche: el destino es el papel. */}
      <span data-theme-target="papel">
        <Sol />
        <span className="sr-only">
          {labels.accion} {labels.papel}
        </span>
      </span>
    </button>
  );
}

/** Cuatro rayos largos en los ejes, cuatro cortos en las diagonales: el ritmo del destello. */
function Sol() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-[18px]"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
      <path d="M5.9 5.9l1.5 1.5M16.6 16.6l1.5 1.5M18.1 5.9l-1.5 1.5M7.4 16.6l-1.5 1.5" />
    </svg>
  );
}

function Luna() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[18px]"
    >
      <path d="M19 14.5A8 8 0 0 1 9.5 5a7 7 0 1 0 9.5 9.5Z" />
    </svg>
  );
}
