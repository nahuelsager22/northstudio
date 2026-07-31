import { getDictionary } from "@/lib/i18n/get-dictionary";
import { listarProyectosPublicados } from "@/lib/content/proyectos";
import { SiteShell } from "@/components/site-shell";
import { Umbral } from "@/components/momentos/umbral";
import { Trabajo } from "@/components/momentos/trabajo";
import { Estudio } from "@/components/momentos/estudio";
import { Conversacion } from "@/components/momentos/conversacion";

/** El mismo lugar, en inglés: el idioma cambia las palabras, nunca el recorrido. */
export default function EnHomePage() {
  const dict = getDictionary("en");
  const proyectos = listarProyectosPublicados();

  return (
    <SiteShell
      dict={dict}
      homeHref="/en"
      altLocale="es"
      altLocaleHref="/"
      conIndice
    >
      <Umbral dict={dict} />
      <Trabajo
        dict={dict}
        locale="en"
        proyectos={proyectos}
        projectHref={(slug) => `/en/work/${slug}`}
      />
      <Estudio dict={dict} />
      <Conversacion dict={dict} locale="en" />
    </SiteShell>
  );
}
