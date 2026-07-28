import type { MetadataRoute } from "next";
import { listarSlugsPublicados } from "@/lib/content/proyectos";
import { urlDelSitio } from "@/lib/sitio";

/**
 * El sitemap se deriva del mismo loader que la interfaz: solo entra lo publicado.
 * Un borrador no se lista acá por la misma razón por la que no se lista en el
 * trabajo ni se prerenderiza — hasta que el proyecto esté publicado, no forma
 * parte del sitio.
 *
 * Cada URL declara su par en el otro idioma: el árbol es asimétrico por diseño
 * (`/proyectos/…` ↔ `/en/work/…`) y sin decirlo un buscador no puede saberlo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlDelSitio;
  const slugs = listarSlugsPublicados();

  const par = (es: string, en: string) => ({
    languages: { es: `${base}${es}`, en: `${base}${en}` },
  });

  return [
    {
      url: `${base}/`,
      priority: 1,
      changeFrequency: "monthly" as const,
      alternates: par("/", "/en"),
    },
    {
      url: `${base}/en`,
      priority: 1,
      changeFrequency: "monthly" as const,
      alternates: par("/", "/en"),
    },
    ...slugs.flatMap((slug) => [
      {
        url: `${base}/proyectos/${slug}`,
        priority: 0.8,
        changeFrequency: "yearly" as const,
        alternates: par(`/proyectos/${slug}`, `/en/work/${slug}`),
      },
      {
        url: `${base}/en/work/${slug}`,
        priority: 0.8,
        changeFrequency: "yearly" as const,
        alternates: par(`/proyectos/${slug}`, `/en/work/${slug}`),
      },
    ]),
  ];
}
