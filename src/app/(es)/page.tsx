import { getDictionary } from "@/lib/i18n/get-dictionary";
import { listarProyectosPublicados } from "@/lib/content/proyectos";
import { SiteShell } from "@/components/site-shell";
import { Umbral } from "@/components/momentos/umbral";
import { Trabajo } from "@/components/momentos/trabajo";
import { Estudio } from "@/components/momentos/estudio";
import { Conversacion } from "@/components/momentos/conversacion";
import { Transicion } from "@/components/transicion";

/**
 * El lugar: un solo plano vertical continuo, no una página con secciones.
 *
 * **El orden cambió, y es el cambio más importante del recorrido.** Antes era
 * umbral → estudio → encargo → trabajo → conversación: doscientas cincuenta
 * palabras sobre cómo trabajamos antes de que apareciera una sola imagen. Ahora
 * lo primero después del umbral es el trabajo. Las frases del estudio llegan
 * después y confirman algo que el visitante ya vio, en vez de prometerlo.
 *
 * Mapa de intensidad, que ahora se puede escribir porque hay contraste:
 *   umbral       contemplativo — pantalla completa, silencio, el cielo de noche
 *   trabajo      impacto       — la portada a sangre, el nombre en display
 *   estudio      respiración   — corto, entrado, en voz baja
 *   conversación cierre
 *
 * El silencio entre momentos lo carga cada uno como `padding-bottom` propio y de
 * tamaño distinto según la transición, para que el borde superior de cada
 * sección sea el comienzo real de su contenido — que es lo que vuelve preciso al
 * índice de la nav.
 */
export default function EsHomePage() {
  const dict = getDictionary("es");
  const proyectos = listarProyectosPublicados();

  return (
    <SiteShell
      dict={dict}
      homeHref="/"
      altLocale="en"
      altLocaleHref="/en"
      conIndice
    >
      <Umbral dict={dict} />
      <Trabajo
        dict={dict}
        locale="es"
        proyectos={proyectos}
        projectHref={(slug) => `/proyectos/${slug}`}
      />
      {/* Los pasos entre planos se declaran acá, en el orden del recorrido, y
          no dentro de cada momento: una transición pertenece a los dos lados y a
          ninguno. Cada una **es** el silencio entre dos momentos — por eso las
          secciones que rodean vuelven a terminar en su contenido. */}
      <Transicion desde="cielo" hacia="arena" onda="amanecer" />
      <Estudio dict={dict} />
      <Transicion desde="arena" hacia="tierra" onda="atardecer" />
      <Conversacion dict={dict} locale="es" />
      <Transicion desde="tierra" hacia="cielo" onda="amanecer" />
    </SiteShell>
  );
}
