import type { BloquePausa } from "@/lib/content/types";

/**
 * Bloque `pausa` — silencio deliberado.
 *
 * El único bloque que no muestra nada, y el que más decide. Existe como dato
 * porque el vacío es contenido (principio 3): acá el silencio se escribió, no
 * quedó. Usa los tokens de descanso —los mismos que separan los momentos del
 * recorrido principal—, así que una pausa dentro de un proyecto pesa lo mismo
 * que el aire entre el umbral y la obra.
 *
 * `aria-hidden` porque para quien escucha la página esto no es nada: el
 * silencio es una decisión visual, y anunciarlo sería ruido.
 */
export function Pausa({ bloque }: { bloque: BloquePausa }) {
  return (
    <div
      aria-hidden="true"
      className={bloque.tamaño === "rest-lg" ? "h-rest-lg" : "h-rest"}
    />
  );
}
