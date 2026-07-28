import { getDictionary } from "@/lib/i18n/get-dictionary";
import { listarProyectosPublicados } from "@/lib/content/proyectos";
import { SiteShell } from "@/components/site-shell";
import { Umbral } from "@/components/momentos/umbral";
import { Estudio } from "@/components/momentos/estudio";
import { Encargo } from "@/components/momentos/encargo";
import { Trabajo } from "@/components/momentos/trabajo";
import { Conversacion } from "@/components/momentos/conversacion";

/**
 * El lugar (experience-architecture.md §1): un solo plano vertical continuo,
 * no una página con secciones. Los momentos no se separan con divisores: los
 * separa el silencio entre ellos, que es parte del recorrido.
 *
 * El silencio ahora lo carga cada momento como `padding-bottom` propio y de
 * tamaño distinto según la transición: 8rem donde el recorrido sigue, 12rem
 * antes del trabajo y antes de la conversación, que son los dos momentos a los
 * que hay que *llegar*. Antes todas las transiciones medían lo mismo, y un ritmo
 * constante no es ritmo. Además hace que el borde superior de cada sección sea
 * el comienzo real de su contenido, que es lo que vuelve preciso al índice.
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
      <Estudio dict={dict} />
      <Encargo dict={dict} />
      <Trabajo
        dict={dict}
        locale="es"
        proyectos={proyectos}
        projectHref={(slug) => `/proyectos/${slug}`}
      />
      <Conversacion dict={dict} locale="es" />
    </SiteShell>
  );
}
