import Link from "next/link";
import { newsreader, monaSans } from "@/lib/fonts";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import "./globals.css";

/**
 * Red de seguridad para rutas fuera del sitemap (§3): ninguno de los dos
 * árboles de locale ((es)/(en)) las reclama, así que este es el único
 * root layout que puede envolverlas. ES por default — es la fuente de verdad.
 *
 * Desde el Bloque 5b también recibe los slugs de proyecto que no existen. Por
 * eso hay una salida: dejar a alguien en una página sin puerta es la única
 * forma segura de perderlo, y el regreso también es atención.
 */
export default function GlobalNotFound() {
  const dict = getDictionary("es");

  return (
    <html lang="es" className={`${newsreader.variable} ${monaSans.variable}`}>
      <body className="flex min-h-screen items-center justify-center bg-bg px-md antialiased">
        <div className="max-w-[60ch]">
          <p className="font-serif text-body text-ink">{dict.notFound}</p>
          <Link
            href="/"
            className="mt-lg inline-block font-sans text-label uppercase text-muted"
          >
            <span className="quiet-underline">{dict.notFoundVolver}</span>
          </Link>
        </div>
      </body>
    </html>
  );
}
