import type { Proyecto } from "../types";
import { delfinaGayoso } from "./delfina-gayoso";

/** El trabajo real del estudio. Crece sumando un archivo, nunca rellenando. */
const proyectos: Proyecto[] = [delfinaGayoso];

/**
 * Los ensayos de composición se retiraron al publicarse el primer caso real
 * (era la condición registrada en el journal). El mecanismo que los mantenía
 * fuera de producción se conserva a propósito: `esEnsayo` sigue en el esquema y
 * un fixture futuro se excluye solo con este filtro, sin volver a pensarlo.
 *
 * `NODE_ENV` es una constante en el build, así que en producción esta lista no
 * puede contener un ensayo: no hay ruta, no hay slug, no hay forma de llegar.
 */
const visibles: Proyecto[] =
  process.env.NODE_ENV === "production"
    ? proyectos.filter((proyecto) => !proyecto.esEnsayo)
    : proyectos;

/** Solo `publicado`; nunca un borrador (docs/contenido.md · Visibilidad de un borrador). */
export function listarProyectosPublicados(): Proyecto[] {
  return visibles
    .filter((proyecto) => proyecto.estado === "publicado")
    .sort((a, b) => a.orden - b.orden);
}

/**
 * Devuelve un proyecto que existe en este entorno, publicado o borrador.
 *
 * Un borrador **resuelve por URL directa** —el estudio necesita mirar un caso
 * en su lugar real antes de publicarlo— pero no se lista en el trabajo, no se
 * prerenderiza y su página se declara `noindex` (ver la ruta). Nadie llega sin
 * la dirección exacta, y quien llega ve escrito que todavía es un borrador.
 */
export function obtenerProyecto(slug: string): Proyecto | undefined {
  return visibles.find((proyecto) => proyecto.slug === slug);
}

/** Lo único que se prerenderiza: el trabajo publicado. */
export function listarSlugsPublicados(): string[] {
  return listarProyectosPublicados().map((proyecto) => proyecto.slug);
}
