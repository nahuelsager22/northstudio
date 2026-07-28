import Image from "next/image";
import Link from "next/link";
import { resolverCampo, type Proyecto } from "@/lib/content/types";
import { ANCLA_TRABAJO } from "@/lib/i18n/secciones";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Momento 4 · El trabajo (antes "La obra").
 *
 * El nombre cambió por criterio: "obra" es lenguaje de autor y hace leer el sitio
 * como el portfolio de una persona. "Trabajo" es lo que dice un estudio. Lo que
 * se muestra no es una colección de piezas: es una manera de trabajar aplicada a
 * identidades concretas.
 *
 * Lista editorial, no grilla de cards ni slider: cada entrada respira distinto
 * según el proyecto que anuncia. El ritmo variable no es decorativo ni aleatorio:
 * sale del dato (`destacado`, `clima.ritmo`, el orden). Sumar un trabajo
 * publicado expande este momento solo, sin tocar la interfaz.
 */

/** Sangrías que se alternan en un ciclo de tres para que la lista no lea a patrón par/impar. */
const SANGRIAS = ["md:ml-[6%]", "md:ml-[22%]", "md:ml-[12%]"];

function espacioAntes(proyecto: Proyecto, indice: number): string {
  if (indice === 0) return "";
  if (proyecto.destacado || proyecto.clima?.ritmo === "pausado") return "mt-rest";
  return "mt-3xl";
}

export function Trabajo({
  dict,
  locale,
  proyectos,
  projectHref,
}: {
  dict: Dictionary;
  locale: Locale;
  proyectos: Proyecto[];
  projectHref: (slug: string) => string;
}) {
  // Estado casi vacío: el momento se contrae con una línea honesta. Sin
  // etiqueta de sección, sin placeholders, sin casos inventados (principio 9).
  // No llenar es también ritmo — y acá es la decisión que demuestra criterio.
  if (proyectos.length === 0) {
    return (
      // El id vive en la sección y no en la etiqueta: el regreso desde un
      // proyecto —y el índice de la nav— necesitan un destino que exista también
      // cuando el momento se contrae. Un ancla que a veces no está no es un ancla.
      <section id={ANCLA_TRABAJO} className="px-md pb-rest-lg sm:px-xl">
        <div className="mx-auto w-full max-w-[92rem]">
          <p
            data-reveal
            className="max-w-[42ch] font-serif text-body text-muted md:ml-[8%]"
          >
            {dict.trabajo.vacio}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id={ANCLA_TRABAJO}
      aria-labelledby="trabajo-titulo"
      className="px-md pb-rest-lg sm:px-xl"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <p
          id="trabajo-titulo"
          data-reveal
          className="font-mono text-meta uppercase text-muted md:ml-[6%]"
        >
          {dict.trabajo.titulo}
        </p>

        <ul className="mt-2xl">
          {proyectos.map((proyecto, indice) => {
            // La lista anuncia; no ficha. El año alcanza para situar el trabajo:
            // la lista de roles completa vive adentro del proyecto, y acá haría
            // que cada entrada se leyera como un registro y no como una invitación.
            const meta = proyecto.año?.toString();

            return (
              <li
                key={proyecto.slug}
                data-reveal
                className={`${espacioAntes(proyecto, indice)} ${SANGRIAS[indice % SANGRIAS.length]}`}
              >
                <Link href={projectHref(proyecto.slug)} className="group block">
                  {/* La portada se muestra en su proporción natural, sin recorte.
                      Estaba en un `aspect-[16/10]` con `object-cover`, y con la
                      primera portada real —una captura de un sitio— se vio el
                      problema: recortar la captura de un trabajo ajeno le come la
                      composición que la captura venía a mostrar. Un recorte que
                      nadie pidió es una opinión sobre el trabajo de otro (misma
                      regla que ya gobernaba el bloque `media` de un proyecto).
                      Lo que varía por `destacado` es el tamaño, no el formato. */}
                  {proyecto.portada ? (
                    <figure
                      className={`mb-lg overflow-hidden ${
                        proyecto.destacado ? "" : "md:max-w-[34rem]"
                      }`}
                    >
                      <Image
                        src={proyecto.portada.src}
                        alt={resolverCampo(proyecto.portada.alt, locale)}
                        width={proyecto.portada.ancho}
                        height={proyecto.portada.alto}
                        sizes={
                          proyecto.destacado
                            ? "(min-width: 768px) 80vw, 100vw"
                            : "(min-width: 768px) 34rem, 100vw"
                        }
                        className="h-auto w-full"
                        priority={indice === 0}
                      />
                    </figure>
                  ) : null}

                  <h2
                    className={`quiet-underline inline font-serif text-ink ${
                      proyecto.destacado ? "text-display" : "text-title-1"
                    }`}
                  >
                    {proyecto.persona}
                  </h2>

                  {proyecto.descriptor ? (
                    <p className="mt-sm max-w-[48ch] font-serif text-body italic text-muted">
                      {resolverCampo(proyecto.descriptor, locale)}
                    </p>
                  ) : null}

                  {/* La entrada responde al hover sin moverse: el metadato pasa
                      de secundario a presente. Un zoom sobre la portada sería el
                      gesto de portfolio más visto que existe; esto es atención
                      ("te vi") sin desplazar un solo píxel. */}
                  {meta ? (
                    <p className="mt-md font-mono text-meta text-muted group-hover:text-ink">
                      {meta}
                    </p>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
