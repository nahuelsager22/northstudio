"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Destello } from "@/components/brand/destello";
import { ThemeToggle } from "@/components/theme-toggle";
import { irASeccion, pausarScroll } from "@/lib/scroll";
import { SECCIONES, type SeccionId } from "@/lib/i18n/secciones";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Nav persistente — el encabezado corriente de una publicación.
 *
 * Tres cosas cambiaron y las tres apuntan al mismo lado:
 *
 * 1. **Se quedó.** Antes se retiraba al bajar y volvía al subir. Era un problema
 *    práctico —para navegar había que volver arriba— y también de carácter: un
 *    elemento que se va y vuelve pide ser mirado dos veces. Ahora está siempre,
 *    en `muted` y sin banda; recupera la tinta al llegar al tope. La seguridad
 *    es quedarse quieto, no desaparecer.
 * 2. **Dejó de numerar.** `01 · 02 · 03` prometía un método ordenado y convertía
 *    el índice en un catálogo de metodología. La sección activa se marca con un
 *    punto polar: la estrella sigue orientando, sin catálogo.
 * 3. **Dejó de ser interfaz.** El registro pasó de mono en versalitas —que es el
 *    registro de una terminal— a la serif en caja baja. El mono vuelve a quedar
 *    solo para metadatos reales.
 *
 * La marca es el destello solo (`Destello`): la firma completa quedó reservada
 * para el umbral, donde tiene protagonismo.
 */

/** Los destinos: serif, caja baja, sin tracking. Un encabezado, no una barra. */
const DESTINO =
  "font-serif text-[0.9375rem] leading-none no-underline transition-colors";

/** Idioma y tema: el mismo registro, más chicos y siempre en segundo plano. */
const PREFERENCIA =
  "-my-xs py-xs font-serif text-[0.875rem] leading-none no-underline";

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
  const [alTope, setAlTope] = useState(true);
  const [activa, setActiva] = useState<SeccionId | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let pendiente = 0;
    const alScrollear = () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(() => {
        pendiente = 0;
        setAlTope(window.scrollY < 80);
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
    // El recorrido se suelta antes de pedirle que vaya a ningún lado: un Lenis
    // detenido ignora un `scrollTo`, y esperar al efecto dejaba el click sin
    // destino. El efecto sigue siendo la fuente de verdad del estado.
    pausarScroll(false);
    if (irASeccion(id)) history.replaceState(null, "", `#${id}`);
  }

  return (
    <>
      <header
        data-abierto={menuAbierto ? "" : undefined}
        className={[
          "fixed inset-x-0 top-0 z-20 isolate transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-calm)]",
          // Al tope el encabezado tiene la tinta del lugar; una vez que hay
          // contenido debajo se retira a segundo plano sin irse. Sin banda y sin
          // regla: lo que lo separa del contenido es su propio silencio.
          alTope || menuAbierto ? "text-ink" : "text-muted",
          menuAbierto ? "bg-bg" : "",
        ].join(" ")}
      >
        {/*
          El velo.
          La nav no tiene fondo propio ni banda: sería una placa apoyada encima
          del recorrido. Lo que tiene es el **mismo fondo del lugar disolviéndose**
          —opaco arriba, nada abajo—, así que hereda la atmósfera sobre la que se
          apoya en vez de taparla. Lo que pasa por debajo se intuye y no se lee,
          que era lo que faltaba: sin esto, el verde a sangre del trabajo cruzaba
          entero por detrás de las palabras.
          Nada de blur ni de glass: es el color del sitio, nada más.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[7.5rem]"
          style={{
            background:
              "linear-gradient(to bottom, var(--bg) 0%, color-mix(in oklab, var(--bg) 82%, transparent) 34%, color-mix(in oklab, var(--bg) 38%, transparent) 66%, transparent 100%)",
          }}
        />

        <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-md px-md py-sm sm:px-xl">
          <Link
            href={homeHref}
            aria-label={dict.nav.inicio}
            className="-m-2xs p-2xs"
          >
            <Destello className="size-5" />
          </Link>

          {conIndice ? (
            <nav
              aria-label={dict.nav.secundaria}
              className="hidden lg:flex lg:items-center lg:gap-xl"
            >
              {SECCIONES.map(({ id }) => {
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
                    className={`${DESTINO} relative ${esActiva ? "text-ink" : "hover:text-ink"}`}
                  >
                    {/* El punto polar reemplaza al número. Marca dónde estás sin
                        prometer una estructura: es el uso de orientación que
                        docs/sistema-visual.md autoriza, y el único del recorrido. */}
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute top-1/2 -left-md size-[3px] -translate-y-1/2 rounded-full bg-polar transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-calm)]",
                        esActiva ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
                    <span className="quiet-underline">{dict.nav.secciones[id]}</span>
                  </a>
                );
              })}
            </nav>
          ) : null}

          <div className="flex items-center gap-lg">
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
              <ThemeToggle
                labels={dict.nav.tema}
                className="-m-2xs flex p-2xs hover:text-ink"
              />
            </div>

            {conIndice ? (
              <button
                ref={disparador}
                type="button"
                onClick={() => setMenuAbierto((abierto) => !abierto)}
                aria-expanded={menuAbierto}
                aria-controls="menu-movil"
                aria-label={menuAbierto ? dict.nav.menu.cerrar : dict.nav.menu.abrir}
                className="-m-2xs p-2xs lg:hidden"
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

      {/* El panel móvil: el mismo lugar, ocupado por su índice. Fondo sólido,
          composición asimétrica, los destinos en la voz del sitio. */}
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
              {SECCIONES.map(({ id }) => (
                <li key={id} className="mt-lg first:mt-0">
                  <a
                    href={`#${id}`}
                    onClick={(evento) => {
                      evento.preventDefault();
                      irA(id);
                    }}
                    aria-current={activa === id ? "true" : undefined}
                    className="relative inline-block no-underline"
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute top-1/2 -left-md size-[4px] -translate-y-1/2 rounded-full bg-polar transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-calm)]",
                        activa === id ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
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

          <div className="mt-rest ml-[6%] flex items-center gap-lg text-muted">
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
            <ThemeToggle labels={dict.nav.tema} className="-m-2xs flex p-2xs" />
          </div>
        </div>
      ) : null}
    </>
  );
}
