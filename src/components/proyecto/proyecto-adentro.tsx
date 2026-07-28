import Link from "next/link";
import { Cuerpo } from "./cuerpo";
import { resolverCampo, type Proyecto } from "@/lib/content/types";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Momento 4 · Un proyecto por dentro (experience-architecture.md §1).
 *
 * Una mini-experiencia que representa a **otra** identidad. Todo lo que hay acá
 * está al servicio de eso: la apertura dice quién es y qué se hizo sin inflar
 * nada, el cuerpo lo interpreta según la secuencia que el proyecto eligió, y el
 * cierre devuelve al recorrido en vez de empujar al siguiente caso.
 *
 * El método se demuestra, no se nombra: en ningún lugar de esta página el
 * estudio explica cómo trabaja. Se ve.
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
    <article data-clima={clima} className="px-md sm:px-xl">
      <div className="mx-auto w-full max-w-[92rem]">
        <header data-reveal className="pt-[14svh] sm:pt-[18svh] md:ml-[8%]">
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

        {proyecto.cuerpo.length > 0 ? (
          <div className="mt-rest">
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
    </article>
  );
}
