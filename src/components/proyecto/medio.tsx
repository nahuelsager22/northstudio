import Image from "next/image";
import { resolverCampo, type Media } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/locales";

/**
 * El elemento media, compartido por los bloques `media` y `par`.
 *
 * Por defecto la imagen se muestra **en su proporción natural**: no se la
 * fuerza a un formato del sistema. Un recorte que nadie pidió es una opinión
 * sobre el trabajo ajeno; mostrar el archivo como es, atención.
 *
 * `recorte` existe para el único caso donde el recorte tiene un motivo: cuando
 * dos medios tienen que compartir altura para poder compararse (el bloque
 * `par`). Ahí entra `foco`, que decide qué sobrevive.
 *
 * El video nunca arranca solo (art-direction.md §4.2): llega con sus controles
 * y espera. El ritmo lo marca quien recorre.
 */
export function Medio({
  media,
  locale,
  sizes,
  recorte,
  className = "",
}: {
  media: Media;
  locale: Locale;
  sizes: string;
  /** Clase de aspect-ratio; con ella el medio se recorta y `foco` decide el encuadre. */
  recorte?: string;
  className?: string;
}) {
  const alt = resolverCampo(media.alt, locale);
  const proporcion = `${media.ancho} / ${media.alto}`;

  const pieza =
    media.tipo === "video" ? (
      <video
        src={media.src}
        controls
        preload="metadata"
        aria-label={alt}
        className={recorte ? "size-full object-cover" : "h-auto w-full"}
        style={
          recorte
            ? { objectPosition: media.foco }
            : { aspectRatio: proporcion }
        }
      />
    ) : recorte ? (
      <Image
        src={media.src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: media.foco }}
      />
    ) : (
      <Image
        src={media.src}
        alt={alt}
        width={media.ancho}
        height={media.alto}
        sizes={sizes}
        className="h-auto w-full"
      />
    );

  return (
    <figure className={className}>
      <div className={recorte ? `relative overflow-hidden ${recorte}` : undefined}>
        {pieza}
      </div>
      {media.credito ? (
        <figcaption className="mt-xs font-mono text-meta text-muted">
          {media.credito}
        </figcaption>
      ) : null}
    </figure>
  );
}
