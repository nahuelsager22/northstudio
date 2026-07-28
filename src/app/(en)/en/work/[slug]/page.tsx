import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { obtenerProyecto, listarSlugsPublicados } from "@/lib/content/proyectos";
import { SiteShell } from "@/components/site-shell";
import { ProyectoAdentro } from "@/components/proyecto/proyecto-adentro";
import { resolverCampo } from "@/lib/content/types";
import { ANCLA_TRABAJO, ANCLA_CONVERSACION } from "@/lib/i18n/secciones";

/** El mismo proyecto en inglés: cambian las palabras, no el recorrido. */
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

  const dict = getDictionary("en");

  return {
    title: `${proyecto.persona} — ${dict.meta.title}`,
    description: proyecto.descriptor
      ? resolverCampo(proyecto.descriptor, "en")
      : undefined,
    robots: proyecto.estado === "borrador" ? { index: false, follow: false } : undefined,
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = obtenerProyecto(slug);
  if (!proyecto) notFound();

  const dict = getDictionary("en");

  return (
    <SiteShell
      dict={dict}
      homeHref="/en"
      altLocale="es"
      altLocaleHref={`/proyectos/${slug}`}
    >
      <ProyectoAdentro
        proyecto={proyecto}
        dict={dict}
        locale="en"
        trabajoHref={`/en#${ANCLA_TRABAJO}`}
        conversacionHref={`/en#${ANCLA_CONVERSACION}`}
      />
    </SiteShell>
  );
}
