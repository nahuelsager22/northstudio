import { Destello } from "@/components/brand/destello";
import { redes } from "@/lib/sitio";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * El pie — el cierre, y una escena completa.
 *
 * Van dos versiones descartadas y las dos por el mismo motivo, que conviene
 * dejar escrito: **el pie no es el final del sitio, es el último momento del
 * recorrido.** Primero fue una tabla de etiqueta y valor en mono —parecía la
 * salida de una terminal—; después una firma con dos enlaces apoyada en la
 * arcilla, que decía lo correcto pero seguía siendo una franja pegada al fondo
 * de la página anterior.
 *
 * Ahora son tres decisiones:
 *
 * 1. **Vuelve al cielo.** El recorrido abre bajo las estrellas y cierra bajo las
 *    mismas: entre medio se pisan la piedra y la tierra. No se pinta —el canvas está
 *    fijo detrás y esta escena lo deja ver—, así que el cierre tiene la
 *    profundidad del comienzo y la constelación puede aparecer también acá. Es
 *    lo que le da sensación de cierre a un recorrido: volver, no terminar.
 * 2. **Ocupa una pantalla, y la mide con la ventana grande.** `.escena`
 *    (globals.css) centra el contenido y descuenta el alto de la nav;
 *    `.escena-cierre` cambia `svh` por `lvh` porque ésta es la última escena del
 *    documento. Con `svh` el final del scroll dejaba asomando arriba la cola de
 *    la tierra —la barra del teléfono se retrae al llegar abajo y lo que se ve
 *    pasa a medir más que la escena—, así que el cierre no llegaba a sangre.
 * 3. **Se compone al centro.** Todo el sitio está construido sobre márgenes
 *    asimétricos; el cierre es el único momento centrado, y esa es la razón por
 *    la que se lee como cierre. Un eje que aparece una sola vez y al final es
 *    una resolución.
 *
 * La jerarquía es la de un colofón: dos rótulos chicos en versalitas, la firma
 * grande en el medio, mucho aire entre las tres. El Instagram y el correo siguen
 * estando —alguien los va a querer copiar— pero cada uno debajo de la palabra
 * que lo nombra, no sueltos: el dato es el valor de un rótulo, no una línea de
 * contacto.
 *
 * Sigue sin haber "seguinos", menú de enlaces ni copyright. Lo que no está es la
 * mitad de la decisión.
 */

/** Versalitas: el rótulo nombra, no habla. Es el registro de acción, en voz baja. */
const ROTULO = "font-sans text-label uppercase text-muted";

/**
 * El dato, en la voz del sitio. Serif y no mono: no es un metadato, es una
 * puerta.
 *
 * ~~Antes en `text-title-3`, después en `text-body` y siempre en `text-ink`.~~
 * Bajar el tamaño no alcanzó, y el motivo es que el problema no era el tamaño:
 * **eran el único otro texto en tinta plena de la escena**, así que tonalmente
 * eran pares de la firma por más chicos que fueran. Dos cosas del mismo color se
 * leen como del mismo rango.
 *
 * Tres decisiones, ninguna de tamaño:
 *
 * 1. **Contraste.** Pasan a la voz baja. La firma se queda sola en tinta plena y
 *    la jerarquía se resuelve sin achicar nada más.
 * 2. **Se encienden al tocarlos.** En reposo son información; con la intención
 *    encima son la puerta que siempre fueron. Un enlace que cambia de rango
 *    cuando lo vas a usar está diseñado; uno que es chico y ya, no.
 * 3. **Tracking.** Una pizca de aire entre letras — el rótulo que tienen arriba
 *    lleva 0.12em, y esto los emparenta con él: el par rótulo/dato se lee como
 *    una unidad compuesta y no como dos líneas que quedaron cerca.
 */
const DATO = [
  "font-serif text-body tracking-[0.015em] text-muted",
  "transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-calm)]",
  "hover:text-ink focus-visible:text-ink",
].join(" ");

export function Pie({ dict }: { dict: Dictionary }) {
  return (
    <footer
      aria-label={dict.pie.nombre}
      data-zona
      data-superficie="cielo"
      className="escena escena-cierre px-md sm:px-xl"
    >
      <div className="mx-auto w-full max-w-[42rem] text-center">
        <div data-reveal>
          <p className={ROTULO}>{dict.pie.instagram}</p>
          <a
            href={redes.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className={`${DATO} quiet-underline mt-2xs inline-block`}
          >
            @{redes.instagram}
          </a>
        </div>

        {/* La firma en el medio y sola: es lo único que tiene que quedar. */}
        <div data-reveal className="mt-4xl">
          <Destello className="mx-auto size-7 text-ink" />
          <p className="mt-lg font-serif text-display text-ink">North Studio</p>
        </div>

        <div data-reveal className="mt-4xl">
          <p className={ROTULO}>{dict.pie.email}</p>
          <a
            href={`mailto:${redes.email}`}
            className={`${DATO} quiet-underline mt-2xs inline-block break-words`}
          >
            {redes.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
