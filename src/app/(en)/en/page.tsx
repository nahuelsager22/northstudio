import { getDictionary } from "@/lib/i18n/get-dictionary";
import { listarProyectosPublicados } from "@/lib/content/proyectos";
import { SiteShell } from "@/components/site-shell";
import { Umbral } from "@/components/momentos/umbral";
import { Trabajo } from "@/components/momentos/trabajo";
import { Estudio } from "@/components/momentos/estudio";
import { Conversacion } from "@/components/momentos/conversacion";
import { Transicion } from "@/components/transicion";

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
      {/* Los pasos entre planos se declaran acá, en el orden del recorrido, y
          no dentro de cada momento: una transición pertenece a los dos lados y a
          ninguno. Cada una **es** el silencio entre dos momentos — por eso las
          secciones que rodean vuelven a terminar en su contenido. */}
      <Transicion desde="cielo" hacia="arena" onda="amanecer" />
      <Estudio dict={dict} />
      <Transicion desde="arena" hacia="tierra" onda="atardecer" />
      <Conversacion dict={dict} locale="en" />
      <Transicion desde="tierra" hacia="cielo" onda="amanecer" />
    </SiteShell>
  );
}
