import type { Dictionary } from "./get-dictionary";

/**
 * El índice del lugar.
 *
 * El recorrido sigue siendo un scroll continuo: esto no lo parte en páginas,
 * le da un índice —como el de un impreso— para que quien llega con una
 * intención concreta no tenga que recorrerlo entero a ciegas. El orden es el del
 * recorrido, y por eso vive acá y no en la nav: el `id` es también el ancla de
 * la sección, y una lista traducible podría desincronizarse de ella.
 *
 * La numeración es notación editorial, no jerarquía: dice "esto fue ordenado con
 * cuidado", que es exactamente lo que el registro mono significa en el sistema.
 */
export const SECCIONES = [
  { id: "estudio", numero: "01" },
  { id: "encargo", numero: "02" },
  { id: "trabajo", numero: "03" },
  { id: "conversacion", numero: "04" },
] as const;

export type SeccionId = (typeof SECCIONES)[number]["id"];

/** El ancla de la sección del trabajo, para volver desde un proyecto. */
export const ANCLA_TRABAJO = "trabajo";
export const ANCLA_CONVERSACION = "conversacion";

export function nombreDeSeccion(dict: Dictionary, id: SeccionId): string {
  return dict.nav.secciones[id];
}
