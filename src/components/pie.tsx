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
 * 2. **Ocupa una pantalla.** `.escena` (globals.css): `100svh`, contenido
 *    centrado y el alto de la nav descontado, para que no se vea nada de lo
 *    anterior ni el cierre quede comprimido contra el borde.
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

/** El dato, en la voz del sitio. Serif y no mono: no es un metadato, es una puerta. */
const DATO = "font-serif text-title-3 text-ink";

export function Pie({ dict }: { dict: Dictionary }) {
  return (
    <footer
      aria-label={dict.pie.nombre}
      data-zona
      data-superficie="cielo"
      className="escena px-md sm:px-xl"
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
