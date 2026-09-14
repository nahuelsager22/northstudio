import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { urlDelSitio } from "@/lib/sitio";

const dict = getDictionary("en");

export const metadata: Metadata = {
  metadataBase: new URL(urlDelSitio),
  title: dict.meta.title,
  description: dict.meta.description,
  alternates: {
    canonical: "/en",
    languages: { es: "/", en: "/en" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_AR"],
    url: "/en",
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

export default function EnSegmentLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
