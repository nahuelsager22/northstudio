import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { metadataDe } from "@/lib/metadata";
import { obtenerProyecto, listarSlugsPublicados } from "@/lib/content/proyectos";
import { ANCLA_TRABAJO, ANCLA_CONTACTO } from "@/lib/i18n/secciones";
import { SiteShell } from "@/components/site-shell";
import { ProyectoAdentro } from "@/components/proyecto/proyecto-adentro";

/** Solo la obra publicada se prerenderiza; un borrador se resuelve a demanda. */
export function generateStaticParams() {
  return listarSlugsPublicados().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = obtenerProyecto(slug);
  if (!proyecto) return {};

  return {
    // Título, descripción y dirección propios; la tarjeta, el locale y la base
    // salen del mismo lugar que para el resto del sitio. ~~Antes esta página no
    // definía `openGraph` y heredaba el del layout entero: al compartirla la
    // tarjeta decía "North Studio" y apuntaba a la portada.~~
    ...metadataDe({
      locale: "es",
      titulo: proyecto.persona,
      descripcion: proyecto.descriptor?.es,
      rutas: { es: `/proyectos/${slug}`, en: `/en/work/${slug}` },
    }),
    // Un borrador es visible para quien tiene la dirección, nunca para un
    // buscador: hasta que el trabajo esté publicado, no forma parte de la obra.
    robots: proyecto.estado === "borrador" ? { index: false, follow: false } : undefined,
  };
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = obtenerProyecto(slug);
  if (!proyecto) notFound();

  const dict = getDictionary("es");

  return (
    <SiteShell
      dict={dict}
      homeHref="/"
      altLocale="en"
      altLocaleHref={`/en/work/${slug}`}
    >
      <ProyectoAdentro
        proyecto={proyecto}
        dict={dict}
        locale="es"
        trabajoHref={`/#${ANCLA_TRABAJO}`}
        conversacionHref={`/#${ANCLA_CONTACTO}`}
      />
    </SiteShell>
  );
}
