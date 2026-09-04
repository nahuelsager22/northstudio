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
 *   trabajo      impacto       — el bosque, la lámina y el nombre en display
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
      <Transicion desde="cielo" hacia="bosque" sesgo="derecha" />
      <Trabajo
        dict={dict}
        locale="es"
        proyectos={proyectos}
        projectHref={(slug) => `/proyectos/${slug}`}
      />
      {/* Los pasos entre planos se declaran acá, en el orden del recorrido, y
          no dentro de cada momento: una transición pertenece a los dos lados y a
          ninguno. Cada una **es** el silencio entre dos momentos — por eso las
          secciones que rodean vuelven a terminar en su contenido.

          Y por eso el `sesgo` se escribe acá y no adentro de la transición: la
          dirección de un corte no es una propiedad del corte, es su lugar en la
          serie. Alternan —derecha, izquierda, derecha, izquierda— y lo que se ve
          no son las diagonales sino los planos que quedan entre ellas: cada uno
          se inclina hacia el lado contrario que el anterior. Cuatro paralelas
          serían un patrón, y un patrón se lee como plantilla; alternadas, el
          descenso tiene ritmo en vez de deriva. */}
      <Transicion desde="bosque" hacia="piedra" sesgo="izquierda" />
      <Estudio dict={dict} />
      <Transicion desde="piedra" hacia="tierra" sesgo="derecha" />
      <Conversacion dict={dict} locale="es" />
      <Transicion desde="tierra" hacia="cielo" sesgo="izquierda" />
    </SiteShell>
  );
}
