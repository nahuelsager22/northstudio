import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootShell } from "@/components/root-shell";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { urlDelSitio } from "@/lib/sitio";

const dict = getDictionary("es");

export const metadata: Metadata = {
  metadataBase: new URL(urlDelSitio),
  title: dict.meta.title,
  description: dict.meta.description,
  // Dos árboles de idioma completos que no se declaraban entre sí: un buscador
  // los veía como dos sitios distintos, y quien llega en inglés no tenía forma
  // de que le ofrecieran su versión. El idioma no cambia el recorrido; tampoco
  // debería cambiar la identidad de la página.
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en" },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: dict.meta.title,
    title: dict.meta.title,
    description: dict.meta.description,
    // La tarjeta de previsualización: la firma sobre la noche (`public/og.png`,
    // generada por `scripts/og.mjs`). Sin ella, WhatsApp e Instagram muestran el
    // enlace pelado — y la tarjeta es la primera impresión de un link compartido.
    // Ancho y alto van declarados porque WhatsApp los lee para decidir si
    // muestra la vista grande.
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

export default function EsLayout({ children }: { children: ReactNode }) {
  return <RootShell locale="es">{children}</RootShell>;
}
