import Link from "next/link";
import { Cuerpo } from "./cuerpo";
import { Transicion } from "@/components/transicion";
import { resolverCampo, type Proyecto } from "@/lib/content/types";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Un proyecto por dentro (docs/recorrido.md · Rutas).
 *
 * Una mini-experiencia que representa a **otra** identidad. Todo lo que hay acá
 * está al servicio de eso: la apertura dice quién es y qué se hizo sin inflar
 * nada, el cuerpo lo interpreta según la secuencia que el proyecto eligió, y el
 * cierre devuelve al recorrido en vez de empujar al siguiente caso.
 *
 * El método se demuestra, no se nombra: en ningún lugar de esta página el
 * estudio explica cómo trabaja. Se ve.
 *
 * **El caso nace del plano del que salió.** La apertura transcurre sobre el
 * bosque —el mismo Dark Spruce del momento del trabajo— y después baja al cielo
 * por una onda, con la misma gramática que la portada.
 *
 * Se consideró la alternativa: que la página del cliente tuviera un tratamiento
 * propio para marcar que se entró a otra experiencia. Se descartó por una
 * decisión que ya estaba tomada — un proyecto no tiene tema, paleta ni tipografía
 * propios; si necesitara eso para sentirse distinto sería lucimiento, y la
 * variación honesta cabe en el orden de los bloques. Lo que quedaba entonces era
 * elegir de qué plano nace, y la respuesta la da el gesto: **se hace click sobre
 * una lámina apoyada en el bosque y se llega a un nombre apoyado en el bosque.**
 * La continuidad es literal, y no cuesta ningún color nuevo.
 *
 * **Sólo la apertura.** El cuerpo de un caso son textos largos y material ajeno
 * —capturas, fotos, video— y un campo verde oscuro debajo de todo eso durante
 * tres mil píxeles convierte al caso en otro sitio en vez de en otra parte de
 * este. Del bosque se baja al cielo, que es el fondo neutro del lugar y donde el
 * material se ve por lo que es. El pie ya cierra ahí, así que la página termina
 * sin ninguna junta.
 */
export function ProyectoAdentro({
  proyecto,
  dict,
  locale,
  trabajoHref,
  conversacionHref,
}: {
  proyecto: Proyecto;
  dict: Dictionary;
  locale: Locale;
  trabajoHref: string;
  conversacionHref: string;
}) {
  // Metadatos honestos: solo lo que existe. Un campo vacío no se rellena ni se
  // rotula "—"; simplemente no está, y eso también dice la verdad.
  const ficha = [
    proyecto.año?.toString(),
    ...(proyecto.rol ?? []).map((rol) => resolverCampo(rol, locale)),
  ].filter(Boolean);

  const clima = [
    proyecto.clima?.ritmo === "pausado" ? "pausado" : "",
    proyecto.clima?.acentoPolar ? "polar" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article data-clima={clima}>
      {/* La apertura: una pantalla de bosque, el nombre y la ficha. El retiro
          desde arriba es el mismo que tenía sobre el cielo — lo que cambió es el
          plano, no la composición. */}
      <section
        data-zona
        data-superficie="bosque"
        className="superficie min-h-svh px-md pt-[14svh] pb-3xl sm:px-xl sm:pt-[18svh]"
      >
        <div className="mx-auto w-full max-w-[92rem]">
          <header data-reveal className="md:ml-[8%]">
            {/* Un borrador dice que lo es, incluso a quien llega con la dirección
                exacta. Enseñar algo sin publicar y callarlo sería fingir estado. */}
            {proyecto.estado === "borrador" ? (
              <p className="mb-lg font-mono text-meta text-muted">
                {dict.project.borrador}
              </p>
            ) : null}

            <h1 className="max-w-[16ch] font-serif text-display text-ink">
              {proyecto.persona}
            </h1>

            {proyecto.descriptor ? (
              <p className="mt-md max-w-[44ch] font-serif text-title-3 italic text-muted">
                {resolverCampo(proyecto.descriptor, locale)}
              </p>
            ) : null}

            {ficha.length > 0 ? (
              <p className="mt-2xl font-mono text-meta text-muted">
                {ficha.join(" · ")}
              </p>
            ) : null}

            {proyecto.colaboradores?.length ? (
              <p className="mt-2xs font-mono text-meta text-muted">
                {dict.project.con} {proyecto.colaboradores.join(" · ")}
              </p>
            ) : null}
          </header>
        </div>
      </section>

      {/* Y el caso sale al cielo: el material se ve sobre el fondo neutro del
          lugar, y el pie —que también cierra en el cielo— continúa sin junta. */}
      <Transicion desde="bosque" hacia="cielo" sesgo="derecha" />

      <div className="px-md sm:px-xl">
        <div className="mx-auto w-full max-w-[92rem]">
          {proyecto.cuerpo.length > 0 ? (
            <div className="mt-3xl">
              <Cuerpo bloques={proyecto.cuerpo} locale={locale} />
            </div>
          ) : null}

          {/*
            El sitio real, como gesto y no como dirección.
            Antes se mostraba el nombre del dominio, apoyado en que el dominio ya
            dice adónde lleva. Con una URL real de despliegue eso dejó de ser
            cierto: una cadena generada de sesenta caracteres es ruido y no informa
            nada. Ahora es una acción escrita en el único registro que el sistema
            reserva para las acciones (grotesque en versalitas, el mismo del botón
            de enviar), con el acuse de siempre y una flecha que dice que se sale
            del sitio. Sigue sin ser un botón relleno ni un "visitá la web ahora":
            la sobriedad estaba en el tono, nunca en esconder el destino.
          */}
          {proyecto.enlaceVivo ? (
            <div data-reveal className="mt-rest md:ml-[16%]">
              <a
                href={proyecto.enlaceVivo}
                target="_blank"
                rel="noopener noreferrer"
                data-orienta
                className="-m-2xs inline-flex items-baseline gap-2xs p-2xs font-sans text-label uppercase text-ink"
              >
                <span className="quiet-underline">{dict.project.sitio}</span>
                <span aria-hidden="true">&#8599;</span>
                <span className="sr-only">{dict.project.sitioNuevaPestana}</span>
              </a>
            </div>
          ) : null}

          {/* El regreso también es atención: nadie queda en el fondo de la página.
              Dos salidas del mismo peso —seguir mirando o empezar a hablar—, sin
              "siguiente proyecto" empujando hacia adelante. */}
          {/* `items-start`: cada salida ocupa lo que dicen sus palabras. Un enlace
              en bloque tendría un área de click invisible de media pantalla, y un
              gesto que no se ve no se puede prever. */}
          <footer
            data-reveal
            className="mt-rest-lg flex flex-col items-start gap-md pb-rest md:ml-[8%]"
          >
            <Link href={trabajoHref} className="font-serif text-title-3 text-ink">
              <span className="quiet-underline">{dict.project.volver}</span>
            </Link>
            <Link href={conversacionHref} className="font-serif text-title-3 text-muted">
              <span className="quiet-underline">{dict.project.conversacion}</span>
            </Link>
          </footer>
        </div>
      </div>
    </article>
  );
}
