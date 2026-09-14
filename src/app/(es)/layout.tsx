import type { ReactNode } from "react";
import { RootShell } from "@/components/root-shell";
import { metadataDe } from "@/lib/metadata";

/**
 * Los metadatos del sitio, y la base que heredan las páginas que no los
 * redefinen. ~~Antes el objeto entero vivía acá, y otra copia en el layout de
 * inglés.~~ Ahora hay un solo constructor (`lib/metadata.ts`): las páginas de
 * proyecto lo usan con su propio título y su propia dirección, y la tarjeta, el
 * locale y la base salen iguales para todas.
 */
export const metadata = metadataDe({ locale: "es", rutas: { es: "/", en: "/en" } });

export default function EsLayout({ children }: { children: ReactNode }) {
  return <RootShell locale="es">{children}</RootShell>;
}
