import type { Metadata } from "next";
import { getDictionary } from "./i18n/get-dictionary";
import type { Locale } from "./i18n/locales";
import { urlDelSitio } from "./sitio";

/**
 * Los metadatos de una página, escritos una sola vez.
 *
 * Existe por cómo fusiona Next: `openGraph` y `alternates` **se reemplazan, no
 * se combinan**. Si una página define `openGraph: { title }`, pierde la imagen,
 * el locale y el nombre del sitio que declaró el layout; y si no lo define,
 * hereda el del layout entero — título, `og:url` y `canonical` incluidos.
 * ~~Así estaban las páginas de proyecto:~~ al compartirlas la tarjeta decía
 * "North Studio", apuntaba a la portada, y su `canonical` le decía a un buscador
 * que el caso era un duplicado de la home.
 *
 * Con un solo constructor, cada página declara lo que es suyo —título,
 * descripción y su dirección en cada idioma— y todo lo demás sale igual para
 * todas: base absoluta, tarjeta, locale, `hreflang`. Una página no puede
 * olvidarse de la imagen porque no la escribe.
 */

/** El locale de Open Graph por idioma. */
const OG_LOCALE: Record<Locale, string> = { es: "es_AR", en: "en_US" };

export function metadataDe({
  locale,
  titulo,
  descripcion,
  rutas,
}: {
  locale: Locale;
  /** Sin el sufijo del sitio; si falta, la página es el sitio mismo. */
  titulo?: string;
  /** Si falta, la del sitio. */
  descripcion?: string;
  /** La misma página en cada idioma. Es lo que hace posibles `canonical` y `hreflang`. */
  rutas: Record<Locale, string>;
}): Metadata {
  const dict = getDictionary(locale);
  const title = titulo ? `${titulo} — ${dict.meta.title}` : dict.meta.title;
  const description = descripcion ?? dict.meta.description;
  const ruta = rutas[locale];
  const otro: Locale = locale === "es" ? "en" : "es";

  return {
    // Sin una base absoluta, Next emite rutas relativas que ningún cliente
    // externo puede resolver y la tarjeta queda vacía (`sitio.ts`).
    metadataBase: new URL(urlDelSitio),
    title,
    description,
    // Dos árboles de idioma completos que se declaran entre sí: sin esto un
    // buscador los ve como dos sitios, y quien llega en inglés no tiene forma de
    // que le ofrezcan su versión.
    alternates: {
      canonical: ruta,
      languages: rutas,
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[otro]],
      url: ruta,
      siteName: dict.meta.title,
      title,
      description,
      // La tarjeta de previsualización: la firma sobre la noche (`public/og.png`,
      // generada por `scripts/og.mjs`). Ancho y alto van declarados porque
      // WhatsApp los lee para decidir si muestra la vista grande.
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: dict.meta.imagenAlt,
        },
      ],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}
