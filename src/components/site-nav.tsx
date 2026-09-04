"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Destello } from "@/components/brand/destello";
import { ThemeToggle } from "@/components/theme-toggle";
import { irArriba, irASeccion, pausarScroll } from "@/lib/scroll";
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
  /** Qué superficie está pasando por debajo del encabezado. */
  const [superficie, setSuperficie] = useState<string | null>(null);
  const [activa, setActiva] = useState<SeccionId | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  /** Para saber si el logo tiene que navegar o simplemente volver arriba. */
  const ruta = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);
  const velo = useRef<HTMLDivElement>(null);

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

  /**
   * De qué color es el lugar donde está apoyado el encabezado.
   *
   * ~~Antes se buscaba la superficie *pintada* más cercana y se usaba su `--bg`.~~
   * Sobre una transición no hay ninguna —son doce rem de degradado—, así que la
   * nav se quedaba con el color del plano anterior y aparecía como una capa
   * aparte apoyada encima del recorrido. Ese era el problema, y no se arreglaba
   * con más superficies.
   *
   * Ahora cada tramo vertical declara sus cuatro paradas de color (`--z0..--z3`
   * en globals.css) y acá se evalúa **en qué punto del tramo cae la altura del
   * encabezado**. Lo que se entrega son las dos paradas que rodean ese punto y
   * cuánto hay entre ellas; la mezcla la hace `color-mix` en CSS. No hay
   * aritmética de color en JavaScript: la nav sólo mide dónde está.
   *
   * Las paradas son las mismas con las que se dibuja el degradado, así que el
   * color que calcula la nav y el que se ve en pantalla son una sola definición.
   */
  useEffect(() => {
    /** Dónde se mira: la altura a la que el velo todavía es casi opaco. */
    const BANDA = 22;
    /** Las posiciones de las cuatro paradas dentro de una zona. */
    const PARADAS = [0, 0.55, 0.78, 1];
    /** Índice seguro: las cuatro posiciones son constantes, el índice no. */
    const parada = (k: number) => PARADAS[k] ?? 0;

    let pendiente = 0;
    let zonas: HTMLElement[] = [];

    const recolectar = () => {
      zonas = Array.from(document.querySelectorAll<HTMLElement>("[data-zona]"));
    };

    const revisar = () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(() => {
        pendiente = 0;
        const nodo = velo.current;
        if (!nodo) return;

        let zona: HTMLElement | null = null;
        let avance = 0;
        for (const candidata of zonas) {
          const caja = candidata.getBoundingClientRect();
          if (caja.top <= BANDA && caja.bottom > BANDA && caja.height > 0) {
            zona = candidata;
            avance = Math.min(Math.max((BANDA - caja.top) / caja.height, 0), 1);
          }
        }

        // Fuera del recorrido —la página de un caso— no hay zonas: el velo cae
        // al fondo del tema, que es exactamente lo que hay detrás.
        if (!zona) {
          nodo.style.removeProperty("--nav-a");
          nodo.style.removeProperty("--nav-b");
          nodo.style.removeProperty("--nav-t");
          nodo.style.removeProperty("opacity");
          setSuperficie(null);
          return;
        }

        let i = 0;
        while (i < PARADAS.length - 2 && avance > parada(i + 1)) i += 1;
        const tramo = parada(i + 1) - parada(i);

        const estilo = getComputedStyle(zona);
        nodo.style.setProperty("--nav-a", estilo.getPropertyValue(`--z${i}`).trim());
        nodo.style.setProperty(
          "--nav-b",
          estilo.getPropertyValue(`--z${i + 1}`).trim()
        );
        nodo.style.setProperty("--nav-t", String((avance - parada(i)) / tramo));

        // Y sobre una transición el velo no se pinta.
        //
        // Un velo es el color que hay detrás, y sobre una onda no hay *un*
        // color: la curva deja mitad de un plano y mitad del otro a lo ancho de
        // la ventana. Pintar ahí el promedio de los dos —que parece la respuesta
        // prudente— es pintar un color que no está en la pantalla, y se ve: una
        // banda apoyada encima del recorrido, que es exactamente lo que el velo
        // existe para no ser. Y el velo mide 7,5 rem, así que la curva le pasa
        // por dentro mucho después de haberle pasado por la altura: cualquier
        // mezcla queda mal en la mitad de abajo aunque esté bien arriba.
        //
        // Donde no hay un color que heredar, lo honesto es no pintar. Se puede
        // porque una transición **es** el silencio entre dos momentos: no hay
        // contenido pasando por debajo, que es lo único que el velo vela. Al
        // entrar al plano siguiente vuelve entero y no se nota — ahí su color y
        // el del plano son el mismo.
        nodo.style.opacity = zona.dataset.paso ? "0" : "1";

        // La tinta no se mezcla: salta una vez, y salta donde el fondo está
        // justo a mitad de camino — no a mitad del tramo. Desde que se fueron
        // los degradados, una transición es color de origen hasta la onda: a
        // mitad del bloque el fondo todavía es el de arriba, y una tinta que se
        // diera vuelta ahí quedaría treinta por ciento del tramo ilegible sobre
        // su propio plano. Un valor intermedio entre dos tintas opuestas no se
        // lee sobre ninguno de los dos fondos: el fondo puede ser continuo, el
        // contraste no puede.
        const cambio = (parada(2) + parada(3)) / 2;
        setSuperficie(
          (avance < cambio ? zona.dataset.tintaA : zona.dataset.tintaB) ??
            zona.dataset.superficie ??
            null
        );
      });
    };

    const alRedimensionar = () => {
      recolectar();
      revisar();
    };

    recolectar();
    revisar();
    window.addEventListener("scroll", revisar, { passive: true });
    window.addEventListener("resize", alRedimensionar);
    return () => {
      window.removeEventListener("scroll", revisar);
      window.removeEventListener("resize", alRedimensionar);
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

  /**
   * El logo, cuando ya estamos en el lugar.
   *
   * ~~Antes era un `<Link>` a la raíz y nada más:~~ estando en la portada, eso
   * pedía la misma ruta de nuevo — la página se remontaba y el scroll saltaba al
   * tope de golpe, que es exactamente la sensación de una recarga. Volver arriba
   * es un destino del encabezado como los otros tres y usa el mismo camino
   * (`irArriba`, la misma instancia de Lenis).
   *
   * Desde otra ruta —un caso— el enlace sigue siendo un enlace de verdad: ahí sí
   * hay que ir a otro lado, y el `<Link>` es lo correcto. Por eso la decisión se
   * toma con la ruta y no con una prop.
   */
  function volverAlInicio(evento: React.MouseEvent<HTMLAnchorElement>) {
    if (ruta !== homeHref) return;

    evento.preventDefault();
    setMenuAbierto(false);
    // Igual que en `irA`: un Lenis detenido ignora un `scrollTo`.
    pausarScroll(false);
    irArriba();
    // Y se limpia el ancla: quedarse con `#estudio` en la barra estando arriba
    // sería mentir sobre dónde está el visitante.
    history.replaceState(null, "", homeHref);
  }

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
        data-superficie={superficie ?? undefined}
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
          del recorrido. Lo que tiene es el **color exacto que hay detrás en esa
          altura** disolviéndose hacia abajo, calculado cuadro a cuadro por el
          efecto de arriba. Así el encabezado pertenece al mismo plano que está
          cruzando, también en el medio de una transición, y lo que pasa por
          debajo se intuye sin leerse.
          Nada de blur ni de glass: es el color del lugar, nada más.
        */}
        <div
          ref={velo}
          aria-hidden="true"
          className="velo-nav pointer-events-none absolute inset-x-0 top-0 -z-10 h-[7.5rem]"
        />

        <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-md px-md py-sm sm:px-xl">
          <Link
            href={homeHref}
            aria-label={dict.nav.inicio}
            onClick={volverAlInicio}
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
