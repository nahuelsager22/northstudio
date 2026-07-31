import type { Dictionary } from "./get-dictionary";

/**
 * Los destinos del lugar.
 *
 * Tres, y sin numerar. La numeración anterior (`01 · 02 · 03 · 04`) prometía un
 * método ordenado y convertía la nav en un índice de metodología: un sitio que
 * numera sus partes está pidiendo que se lea su estructura. Una publicación no
 * numera su encabezado corriente; nombra sus destinos y se calla.
 *
 * El orden es el del recorrido, y por eso vive acá y no en la nav: el `id` es
 * también el ancla de la sección, y una lista traducible podría desincronizarse.
 */
export const SECCIONES = [
  { id: "trabajo" },
  { id: "estudio" },
  { id: "contacto" },
] as const;

export type SeccionId = (typeof SECCIONES)[number]["id"];

/** Anclas de regreso desde un proyecto. */
export const ANCLA_TRABAJO = "trabajo";
export const ANCLA_CONTACTO = "contacto";

export function nombreDeSeccion(dict: Dictionary, id: SeccionId): string {
  return dict.nav.secciones[id];
}
