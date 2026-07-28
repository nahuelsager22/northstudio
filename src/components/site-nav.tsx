"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand/mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { irASeccion, pausarScroll } from "@/lib/scroll";
import { SECCIONES, type SeccionId } from "@/lib/i18n/secciones";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Nav persistente.
 *
 * Ya no es la nav mínima sin secciones de los bloques anteriores: el recorrido
 * ahora tiene un índice. La forma elegida no es una barra de links —eso sería el
 * header de cualquier sitio— sino el **índice de un impreso**: número y nombre en
 * registro de notación, y la sección donde estás marcada con el acento polar.
 *
 * Ese detalle es el que hace el trabajo del norte rector: el índice responde a
 * dónde está el visitante, no a lo que la nav quiere anunciar. La estrella marca
 * tu posición — que es, literalmente, para lo que sirve una estrella polar.
 *
 * Sigue acompañando sin apurar: baja el visitante y la nav se retira; sube y
 * vuelve. Se retira con un fundido y no con un deslizamiento, porque un elemento
 * que se desliza pide ser mirado.
 */

/** Preferencias: registro de acción (grotesque), separado del índice a propósito. */
const PREFERENCIA =
  "-my-xs py-xs font-sans text-label uppercase text-muted no-underline hover:text-ink";

export function SiteNav({
  dict,
  homeHref,
  altLocale,
  altLocaleHref,
  /** El índice solo existe donde existen las secciones (el recorrido, no un proyecto). */
  conIndice = false,
}: {
  dict: Dictionary;
  homeHref: string;
  altLocale: Locale;
  altLocaleHref: string;
  conIndice?: boolean;
}) {
  const [retraida, setRetraida] = useState(false);
  const [sobreContenido, setSobreContenido] = useState(false);
  const [activa, setActiva] = useState<SeccionId | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let anterior = window.scrollY;
    let pendiente = 0;

    const alScrollear = () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(() => {
        pendiente = 0;
        const y = window.scrollY;

        setSobreContenido(y > 80);

        if (!quieto) {
          if (y < 80) setRetraida(false);
          else if (y > anterior + 8) setRetraida(true);
          else if (y < anterior - 8) setRetraida(false);
        }

        anterior = y;
      });
    };

    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScrollear);
      if (pendiente) cancelAnimationFrame(pendiente);
    };
  }, []);

  // Qué sección está mirando el visitante. Se resuelve por la sección cuyo
  // comienzo quedó más arriba del umbral de lectura: es la lectura que
  // corresponde a un scroll continuo, donde varias secciones pueden estar
  // visibles a la vez y "la que está en pantalla" no significa nada.
  useEffect(() => {
    if (!conIndice) return;

    const nodos = SECCIONES.map(({ id }) => document.getElementById(id)).filter(
      (n): n is HTMLElement => n !== null
    );
    if (nodos.length === 0) return;

    let pendiente = 0;
    const revisar = () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(() => {
        pendiente = 0;
        const umbral = window.innerHeight * 0.35;
        let actual: SeccionId | null = null;
        for (const nodo of nodos) {
          if (nodo.getBoundingClientRect().top <= umbral) {
            actual = nodo.id as SeccionId;
          }
        }
        setActiva(actual);
      });
    };

    revisar();
    window.addEventListener("scroll", revisar, { passive: true });
    window.addEventListener("resize", revisar);
    return () => {
      window.removeEventListener("scroll", revisar);
      window.removeEventListener("resize", revisar);
      if (pendiente) cancelAnimationFrame(pendiente);
    };
  }, [conIndice]);

  // Con el panel abierto, el recorrido detrás se detiene: dejarlo scrollear
  // sería perderle el lugar al visitante. Y Escape cierra, porque un panel que
  // ocupa la pantalla tiene que poder soltarse sin buscar el botón.
  useEffect(() => {
    pausarScroll(menuAbierto);

    if (!menuAbierto) return;
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();

    const alTeclado = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setMenuAbierto(false);
        disparador.current?.focus();
      }
    };
    window.addEventListener("keydown", alTeclado);
    return () => window.removeEventListener("keydown", alTeclado);
  }, [menuAbierto]);

  useEffect(() => {
    return () => pausarScroll(false);
  }, []);

  function irA(id: SeccionId) {
    setMenuAbierto(false);
    // El recorrido se suelta **antes** de pedirle que vaya a ningún lado. Con el
    // panel abierto el scroll está detenido, y un Lenis detenido ignora un
    // `scrollTo`: si se esperaba a que el efecto lo reanudara, el click cerraba
    // el menú y no llevaba a ninguna parte. El efecto sigue siendo la fuente de
    // verdad del estado; esto solo se adelanta a él para este gesto.
    pausarScroll(false);

    // El hash se escribe igual: la sección queda enlazable y el botón "atrás"
    // del navegador sigue significando algo.
    if (irASeccion(id)) history.replaceState(null, "", `#${id}`);
  }

  return (
    <>
      <header
        data-abierto={menuAbierto ? "" : undefined}
        className={[
          "fixed inset-x-0 top-0 z-20 border-b transition-[opacity,background-color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out-calm)]",
          // Solo el foco de teclado la retiene: `focus-within` la dejaría fijada
          // después de cualquier click, y entonces estorbaría en vez de acompañar.
          "has-[:focus-visible]:pointer-events-auto has-[:focus-visible]:opacity-100",
          sobreContenido && !menuAbierto ? "border-hairline bg-bg" : "border-transparent",
          menuAbierto ? "bg-bg" : "",
          retraida && !menuAbierto ? "pointer-events-none opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-md px-md py-2xs sm:px-xl">
          <Link
            href={homeHref}
            aria-label={dict.nav.inicio}
            className="-m-2xs p-2xs text-ink"
          >
            {/* A 20 px el cordón entero se dispersa (art-direction.md §6.3): la
                marca necesita el tamaño que la hace legible, no el más discreto. */}
            <Mark className="h-7 w-auto sm:h-8" />
          </Link>

          {/* Escritorio: el índice del lugar. */}
          {conIndice ? (
            <nav
              aria-label={dict.nav.secundaria}
              className="hidden lg:flex lg:items-baseline lg:gap-lg"
            >
              {SECCIONES.map(({ id, numero }) => {
                const esActiva = activa === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(evento) => {
                      evento.preventDefault();
                      irA(id);
                    }}
                    aria-current={esActiva ? "true" : undefined}
                    className="group font-mono text-meta no-underline"
                  >
                    {/* El acento polar, una sola vez y como orientación: marca
                        dónde estás. Es el uso que art-direction.md §2.3 autoriza
                        —un punto que guía— y el único de todo el recorrido. */}
                    <span
                      aria-hidden="true"
                      className={esActiva ? "text-polar" : "text-muted"}
                    >
                      {numero}
                    </span>{" "}
                    <span
                      className={`quiet-underline ${esActiva ? "text-ink" : "text-muted group-hover:text-ink"}`}
                    >
                      {dict.nav.secciones[id]}
                    </span>
                  </a>
                );
              })}
            </nav>
          ) : null}

          <div className="flex items-center gap-md sm:gap-lg">
            {/* Idioma y tema quedan en el registro de acción y solo en escritorio:
                en móvil viven adentro del panel, para que la fila no compita con
                el gesto de apertura. */}
            <div className="hidden items-center gap-lg lg:flex">
              <Link
                href={altLocaleHref}
                hrefLang={altLocale}
                lang={altLocale}
                className={PREFERENCIA}
              >
                <span className="quiet-underline" aria-hidden="true">
                  {dict.nav.idioma.corto}
                </span>
                <span className="sr-only">{dict.nav.idioma.nombre}</span>
              </Link>
              <ThemeToggle labels={dict.nav.tema} className={PREFERENCIA} />
            </div>

            {conIndice ? (
              <button
                ref={disparador}
                type="button"
                onClick={() => setMenuAbierto((abierto) => !abierto)}
                aria-expanded={menuAbierto}
                aria-controls="menu-movil"
                aria-label={menuAbierto ? dict.nav.menu.cerrar : dict.nav.menu.abrir}
                className="-m-2xs p-2xs text-ink lg:hidden"
              >
                <span className="gesto-n block" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* El panel móvil. No es un overlay traslúcido ni un cajón que entra desde
          un borde: es el mismo lugar, ocupado por su índice. Fondo sólido (nada
          de glass), composición asimétrica y el índice en la voz del sitio. */}
      {conIndice ? (
        <div
          id="menu-movil"
          ref={panel}
          inert={!menuAbierto}
          aria-hidden={!menuAbierto}
          className={[
            "fixed inset-0 z-10 flex flex-col justify-center bg-bg px-md pt-[6rem] pb-xl transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-calm)] sm:px-xl lg:hidden",
            menuAbierto ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          <nav aria-label={dict.nav.secundaria} className="ml-[6%]">
            <ul>
              {SECCIONES.map(({ id, numero }) => (
                <li key={id} className="mt-lg first:mt-0">
                  <a
                    href={`#${id}`}
                    onClick={(evento) => {
                      evento.preventDefault();
                      irA(id);
                    }}
                    aria-current={activa === id ? "true" : undefined}
                    className="group flex items-baseline gap-md no-underline"
                  >
                    <span
                      aria-hidden="true"
                      className={`font-mono text-meta ${activa === id ? "text-polar" : "text-muted"}`}
                    >
                      {numero}
                    </span>
                    <span
                      className={`quiet-underline font-serif text-title-1 ${activa === id ? "text-ink" : "text-muted"}`}
                    >
                      {dict.nav.secciones[id]}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-rest ml-[6%] flex items-center gap-lg">
            <Link
              href={altLocaleHref}
              hrefLang={altLocale}
              lang={altLocale}
              className={PREFERENCIA}
            >
              <span className="quiet-underline" aria-hidden="true">
                {dict.nav.idioma.corto}
              </span>
              <span className="sr-only">{dict.nav.idioma.nombre}</span>
            </Link>
            <ThemeToggle labels={dict.nav.tema} className={PREFERENCIA} />
          </div>
        </div>
      ) : null}
    </>
  );
}
