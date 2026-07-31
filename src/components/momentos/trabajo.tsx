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
 * - **sin etiqueta de sección arriba.** Un rótulo "Trabajo" antes de una imagen
 *   a sangre le baja el volumen a lo único que tenía que subirlo;
 * - **la portada rompe el marco.** Un proyecto destacado se muestra a todo el
 *   ancho de la ventana, no dentro del paspartú. Es la única vez en todo el
 *   sitio que algo desborda el margen — y como es la única, significa;
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
        className="px-md pb-rest-lg sm:px-xl"
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
    <section id={ANCLA_TRABAJO} aria-label={dict.trabajo.nombre} className="pb-rest-lg">
      <ul>
        {proyectos.map((proyecto, indice) => {
          // La lista anuncia; no ficha. El año alcanza para situar el trabajo:
          // la lista de roles completa vive adentro del proyecto.
          const meta = proyecto.año?.toString();
          const aSangre = Boolean(proyecto.destacado && proyecto.portada);

          return (
            <li key={proyecto.slug} className={espacioAntes(proyecto, indice)}>
              <Link href={projectHref(proyecto.slug)} className="group block">
                {proyecto.portada ? (
                  // La portada en su proporción natural, sin recorte: recortar
                  // la captura de un trabajo ajeno le come la composición que la
                  // captura venía a mostrar.
                  <figure
                    data-reveal
                    className={
                      aSangre
                        ? "overflow-hidden"
                        : "mx-auto w-full max-w-[92rem] overflow-hidden px-md sm:px-xl md:ml-[22%] md:max-w-[34rem]"
                    }
                  >
                    <Image
                      src={proyecto.portada.src}
                      alt={resolverCampo(proyecto.portada.alt, locale)}
                      width={proyecto.portada.ancho}
                      height={proyecto.portada.alto}
                      sizes={aSangre ? "100vw" : "(min-width: 768px) 34rem, 100vw"}
                      className="h-auto w-full"
                      priority={indice === 0}
                    />
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
