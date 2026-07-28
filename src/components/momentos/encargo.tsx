import { Pasaje } from "./estudio";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * Momento 3 · El encargo — qué hace el estudio, cómo trabaja y qué recibís.
 *
 * Momento nuevo, y el cambio más grande de este bloque. Hasta acá la web
 * transmitía muy bien una experiencia y explicaba muy poco: quien llegara sin
 * conocer al estudio no podía responder "¿qué hacen y qué me llevo?". Este
 * momento lo responde.
 *
 * Lo que NO es: una lista de servicios en cards, un "proceso en 4 pasos con
 * íconos", una tabla de precios ni un argumento de venta. Lo que sí: la
 * secuencia real del método del estudio —observar, interpretar, construir,
 * refinar— dicha en una línea cada una, y una ficha en registro de notación que
 * filtra sin vender. Información verificable, no promesa: eso nunca estuvo
 * prohibido por "demuestra, no describe" — lo prohibido era el texto declarativo
 * vacío.
 *
 * Las sangrías de las etapas avanzan hacia adentro sin ser una progresión
 * aritmética (6 · 14 · 18 · 28): la secuencia se lee como un descenso con ritmo
 * irregular, el mismo criterio con que el cordón de la firma tiene cumbres de
 * alturas distintas. Una escalera perfecta sería una grilla vertical.
 */
const SANGRIAS_ETAPA = ["md:ml-[6%]", "md:ml-[14%]", "md:ml-[18%]", "md:ml-[28%]"];

export function Encargo({ dict }: { dict: Dictionary }) {
  const e = dict.encargo;

  return (
    <section
      id="encargo"
      aria-labelledby="encargo-etiqueta"
      className="px-md pb-rest sm:px-xl"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <p
          id="encargo-etiqueta"
          data-reveal
          className="font-mono text-meta uppercase text-muted md:ml-[8%]"
        >
          {e.etiqueta}
        </p>

        <p
          data-reveal
          className="mt-lg max-w-[30ch] font-serif text-title-2 text-ink md:ml-[8%] md:max-w-[34ch] md:text-title-1"
        >
          <Pasaje segmentos={e.entrada} />
        </p>

        {/* La secuencia del trabajo. Lista ordenada de verdad: el orden es el
            contenido, y un lector de pantalla tiene que oírlo como tal. */}
        <ol className="mt-rest">
          {e.etapas.map((etapa, i) => (
            <li
              key={etapa.titulo}
              data-reveal
              className={`mt-2xl first:mt-0 ${SANGRIAS_ETAPA[i % SANGRIAS_ETAPA.length]}`}
            >
              <div className="flex items-baseline gap-md">
                {/* El número es notación, no jerarquía: dice que esto tiene un
                    orden. `aria-hidden` porque la lista ya numera. */}
                <span aria-hidden="true" className="font-mono text-meta text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-title-3 text-ink">{etapa.titulo}</h3>
              </div>
              <p className="mt-sm max-w-[54ch] pl-[2.5rem] font-serif text-body text-muted">
                {etapa.linea}
              </p>
            </li>
          ))}
        </ol>

        <p
          data-reveal
          className="mt-rest max-w-[46ch] font-serif text-title-3 text-ink md:ml-[8%] md:max-w-[52ch]"
        >
          <Pasaje segmentos={e.entrega} />
        </p>

        {/* La ficha del encargo. Hairline arriba como notación editorial —el
            mismo uso que en el bloque `dato` de un proyecto—, no como divisor.
            Angosta a propósito: una ficha ancha se convierte en tabla de precios. */}
        <dl
          data-reveal
          className="mt-2xl max-w-[46rem] border-t border-hairline pt-lg md:ml-[8%]"
        >
          {e.ficha.map((linea) => (
            <div
              key={linea.etiqueta}
              className="mt-md first:mt-0 md:grid md:grid-cols-[11rem_1fr] md:gap-md"
            >
              <dt className="font-mono text-meta uppercase text-muted">
                {linea.etiqueta}
              </dt>
              <dd className="mt-2xs font-serif text-body text-ink md:mt-0">
                {linea.valor}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
