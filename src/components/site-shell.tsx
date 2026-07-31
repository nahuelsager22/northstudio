import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { RevealObserver } from "@/components/reveal-observer";
import { ScrollSuave } from "@/components/scroll-suave";
import { Cielo } from "@/components/cielo";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Lo que permanece mientras el visitante recorre: la nav, el vocabulario de
 * recepción y el scroll del lugar. Todo lo demás cambia. Vive acá y no en el
 * layout porque cada ruta conoce sus propios destinos (su par en el otro idioma,
 * si tiene secciones que indexar) — el shell los recibe, no los adivina.
 */
export function SiteShell({
  dict,
  homeHref,
  altLocale,
  altLocaleHref,
  conIndice = false,
  children,
}: {
  dict: Dictionary;
  homeHref: string;
  altLocale: Locale;
  altLocaleHref: string;
  /** Solo el recorrido tiene secciones que indexar; un proyecto es otro lugar. */
  conIndice?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <SiteNav
        dict={dict}
        homeHref={homeHref}
        altLocale={altLocale}
        altLocaleHref={altLocaleHref}
        conIndice={conIndice}
      />
      {/* El cielo vive detrás de todo el lugar, no de un momento: cambiar de
          tema en cualquier punto del recorrido tiene que revelarlo igual. */}
      <Cielo />
      <main className="relative">{children}</main>
      <RevealObserver />
      <ScrollSuave />
    </>
  );
}
