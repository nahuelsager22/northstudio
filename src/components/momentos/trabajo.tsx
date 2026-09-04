import Image from "next/image";
import Link from "next/link";
import { resolverCampo, type Proyecto } from "@/lib/content/types";
import { ANCLA_TRABAJO } from "@/lib/i18n/secciones";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * El trabajo — el momento de impacto del recorrido, y ahora también su primer
 * plano de color.
 *
 * Subió al segundo lugar, inmediatamente después del umbral. Antes llegaba
 * cuarto, detrás de unas doscientas cincuenta palabras sobre cómo trabajamos: el
 * visitante tenía que leerse el discurso para llegar a la evidencia. Ahora lo
 * primero que aparece después de la firma es un trabajo, y todo lo que se diga
 * después se lee como confirmación.
 *
 * **Transcurre sobre el bosque** (`globals.css`), el Dark Spruce de la paleta.
 * ~~Antes compartía el cielo con el umbral.~~ Era el único momento del recorrido
 * sin plano propio, y se pagaba dos veces: el paso del cielo al liquen era el
 * salto de luz más grande de la página, y el momento de mayor intensidad no
 * tenía ningún lugar donde ocurrir. Ahora el recorrido baja parejo y el trabajo
 * pasa a ser lo primero que tiene color.
 *
 * Es también el punto de mayor intensidad. Por eso:
 * - **abre con un título de sección, y el proyecto vive adentro.** ~~Antes no
 *   había rótulo: la nav ya nombraba el momento.~~ El costo de esa economía era
 *   que el trabajo publicado flotaba — una portada y un nombre, sin nada que
 *   dijera que esa persona es alguien para quien el estudio trabajó. El título
 *   es una frase ("Con quién trabajamos") y no una etiqueta, y **es más chico
 *   que el nombre de la persona**: la sección presenta, la persona protagoniza;
 * - **el nombre entra sobre el eje de la lámina**, en display, después de la
 *   imagen: el trabajo se ve antes de saber de quién es.
 *
 * El ritmo variable sigue saliendo del dato (`destacado`, `clima.ritmo`, el
 * orden), no del capricho. Sumar un trabajo publicado expande el momento solo.
 */

/**
 * Cómo se presenta un trabajo: **como una lámina, no como una captura en una
 * caja.**
 *
 * ~~Antes la portada iba dentro de un paspartú: un relleno de `surface` con
 * hairline alrededor y aire adentro.~~ Ese marco existía por un motivo real —a
 * sangre sobre el cielo, la captura de un sitio ajeno no leía como obra sino
 * como fondo— pero resolvía el problema con la única caja de todo el sitio, y una
 * caja en una página construida sobre márgenes es un objeto de otro sistema. El
 * plano de color hace ahora ese trabajo: sobre el bosque, una imagen con aire
 * alrededor ya es una lámina apoyada y no un fondo.
 *
 * Queda **una línea de contorno, sin relleno ni aire**. No es lo que quedó del
 * marco: es la garantía de que una lámina tenga borde propio pase lo que pase
 * adentro. Esta portada trae su propio campo claro y se recorta sola contra el
 * bosque; la próxima puede venir oscura, y sin la línea se disolvería en el
 * plano. Un keyline, que es lo que lleva una lámina impresa.
 *
 * Tres decisiones más, y las tres son de composición:
 *
 * 1. **La imagen y el nombre comparten eje.** ~~Antes la imagen entraba desde un
 *    margen y el nombre desde otro.~~ Alineados, la imagen y su texto son una
 *    pieza; desalineados, son dos cosas que quedaron cerca.
 * 2. **La imagen no llega al margen derecho.** Un cuarto del plano queda vacío a
 *    su lado, y ese vacío es parte de la lámina: lo que dice que algo está
 *    puesto ahí a propósito es el espacio que se le dejó, no el marco.
 * 3. **Bordes rectos contra ondas.** El plano está limitado arriba y abajo por
 *    dos curvas; la lámina es lo único recto que hay adentro. Ese contraste es
 *    justamente por qué no lleva marco: un marco agrega un segundo rectángulo y
 *    le saca el trabajo al primero.
 */

/** Los ejes de la lista. Se alternan en un ciclo de tres para que no lea a patrón par/impar. */
const EJES = ["md:ml-[6%]", "md:ml-[22%]", "md:ml-[12%]"];

/** El destacado entra siempre desde el margen ancho: es el que abre el momento. */
function eje(proyecto: Proyecto, indice: number): string {
  if (proyecto.destacado) return "md:ml-[6%]";
  return EJES[indice % EJES.length] ?? "md:ml-[22%]";
}

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
  // ritmo — y acá es la decisión que demuestra criterio. El plano se queda: un
  // momento sin obra sigue siendo un momento del recorrido.
  if (proyectos.length === 0) {
    return (
      <section
        id={ANCLA_TRABAJO}
        aria-label={dict.trabajo.nombre}
        data-zona
        data-superficie="bosque"
        className="superficie plano px-md sm:px-xl"
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
    // El primer plano de color del recorrido. `.plano` le da una pantalla y
    // media, que es lo que hace falta para que el bosque se lea entero antes de
    // la onda siguiente — y para que el ancla "Trabajo" aterrice a ras.
    <section
      id={ANCLA_TRABAJO}
      aria-label={dict.trabajo.nombre}
      data-zona
      data-superficie="bosque"
      className="superficie plano"
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
          const margen = eje(proyecto, indice);

          return (
            <li key={proyecto.slug} className={espacioAntes(proyecto, indice)}>
              <Link href={projectHref(proyecto.slug)} className="group block">
                <div className="mx-auto w-full max-w-[92rem] px-md sm:px-xl">
                  {proyecto.portada ? (
                    // La portada en su proporción natural, sin recorte: recortar
                    // la captura de un trabajo ajeno le come la composición que
                    // la captura venía a mostrar.
                    <figure
                      data-reveal
                      className={`border ${margen} ${
                        proyecto.destacado
                          ? "md:mr-[26%]"
                          : "md:max-w-[30rem]"
                      }`}
                    >
                      <Image
                        src={proyecto.portada.src}
                        alt={resolverCampo(proyecto.portada.alt, locale)}
                        width={proyecto.portada.ancho}
                        height={proyecto.portada.alto}
                        sizes={
                          proyecto.destacado
                            ? "(min-width: 768px) 62vw, 100vw"
                            : "(min-width: 768px) 30rem, 100vw"
                        }
                        className="h-auto w-full"
                        priority={indice === 0}
                      />
                    </figure>
                  ) : null}

                  <div data-reveal className={`mt-xl ${margen}`}>
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
