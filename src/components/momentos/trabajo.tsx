import Image from "next/image";
import Link from "next/link";
import { resolverCampo, type Proyecto } from "@/lib/content/types";
import { ANCLA_TRABAJO } from "@/lib/i18n/secciones";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * El trabajo — el momento de impacto del recorrido.
 *
 * Subió al segundo lugar, inmediatamente después del umbral. Antes llegaba
 * cuarto, detrás de unas doscientas cincuenta palabras sobre cómo trabajamos: el
 * visitante tenía que leerse el discurso para llegar a la evidencia. Ahora lo
 * primero que aparece después de la firma es un trabajo, y todo lo que se diga
 * después se lee como confirmación.
 *
 * Es también el punto de mayor intensidad. Por eso:
 * - **abre con un título de sección, y el proyecto vive adentro.** ~~Antes no
 *   había rótulo: la nav ya nombraba el momento.~~ El costo de esa economía era
 *   que el trabajo publicado flotaba — una portada y un nombre, sin nada que
 *   dijera que esa persona es alguien para quien el estudio trabajó. El título
 *   es una frase ("Con quién trabajamos") y no una etiqueta, y **es más chico
 *   que el nombre de la persona**: la sección presenta, la persona protagoniza;
 * - **la portada va dentro de un marco.** ~~Antes rompía el paspartú y se
 *   mostraba a todo el ancho de la ventana.~~ Ahora es una pieza apoyada en la
 *   composición: un paspartú de `surface` con hairline alrededor de la imagen,
 *   como una lámina montada. A sangre, la captura de un sitio ajeno no leía
 *   como obra sino como fondo — y el marco es además lo que la vuelve un objeto
 *   dentro de la página en vez de una interrupción de la página;
 * - **el nombre entra sobre el margen editorial**, en display, después de la
 *   imagen: el trabajo se ve antes de saber de quién es.
 *
 * El ritmo variable sigue saliendo del dato (`destacado`, `clima.ritmo`, el
 * orden), no del capricho. Sumar un trabajo publicado expande el momento solo.
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
  // placeholders, sin casos inventados (principio 9). No llenar es también
  // ritmo — y acá es la decisión que demuestra criterio.
  if (proyectos.length === 0) {
    return (
      <section
        id={ANCLA_TRABAJO}
        aria-label={dict.trabajo.nombre}
        data-zona
        data-superficie="cielo"
        className="px-md pb-2xl sm:px-xl"
      >
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
    // El último momento bajo el cielo abierto. El silencio que lo separa del
    // estudio ya no es su `padding-bottom`: es la transición que viene después
    // (`components/transicion.tsx`), donde el amanecer apaga las estrellas.
    <section
      id={ANCLA_TRABAJO}
      aria-label={dict.trabajo.nombre}
      data-zona
      data-superficie="cielo"
      className="pb-2xl"
    >
      <div className="mx-auto w-full max-w-[92rem] px-md sm:px-xl">
        <h2
          data-reveal
          className="font-serif text-title-2 text-muted md:ml-[6%] md:text-title-1"
        >
          {dict.trabajo.clientes}
        </h2>
      </div>

      <ul className="mt-2xl">
        {proyectos.map((proyecto, indice) => {
          // La lista anuncia; no ficha. El año alcanza para situar el trabajo:
          // la lista de roles completa vive adentro del proyecto.
          const meta = proyecto.año?.toString();

          return (
            <li key={proyecto.slug} className={espacioAntes(proyecto, indice)}>
              <Link href={projectHref(proyecto.slug)} className="group block">
                {proyecto.portada ? (
                  // La portada en su proporción natural, sin recorte: recortar
                  // la captura de un trabajo ajeno le come la composición que la
                  // captura venía a mostrar. El paspartú es lo que la monta en
                  // la página — el destacado abre más, el resto entra.
                  <figure
                    data-reveal
                    className="mx-auto w-full max-w-[92rem] px-md sm:px-xl"
                  >
                    <div
                      className={
                        proyecto.destacado
                          ? "border bg-surface p-sm sm:p-md md:ml-[6%] md:mr-[8%]"
                          : "border bg-surface p-2xs sm:p-sm md:ml-[22%] md:max-w-[34rem]"
                      }
                    >
                      <Image
                        src={proyecto.portada.src}
                        alt={resolverCampo(proyecto.portada.alt, locale)}
                        width={proyecto.portada.ancho}
                        height={proyecto.portada.alto}
                        sizes={
                          proyecto.destacado
                            ? "(min-width: 768px) 78vw, 100vw"
                            : "(min-width: 768px) 34rem, 100vw"
                        }
                        className="h-auto w-full"
                        priority={indice === 0}
                      />
                    </div>
                  </figure>
                ) : null}

                <div className="mx-auto w-full max-w-[92rem] px-md sm:px-xl">
                  <div
                    data-reveal
                    className={`mt-lg ${SANGRIAS[indice % SANGRIAS.length]}`}
                  >
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
                        de secundario a presente. Un zoom sobre la portada sería
                        el gesto de portfolio más visto que existe. */}
                    {meta ? (
                      <p className="mt-md font-mono text-meta text-muted group-hover:text-ink">
                        {meta}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
