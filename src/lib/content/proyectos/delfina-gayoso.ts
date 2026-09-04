import type { Media, Proyecto } from "../types";

/**
 * Primer proyecto publicado del estudio. Todo lo que hay acá viene de material
 * real o del propio sitio terminado: nada inventado. Lo que no existe todavía
 * —una devolución de Delfina— no está: el bloque `cita` se agregará cuando haya
 * una frase suya de verdad, y no antes (principio 9).
 */

/**
 * La apertura del sitio real. Única imagen disponible hoy, así que hace dos
 * trabajos: anuncia el proyecto en el trabajo y abre el caso por dentro. Que se
 * repita entre la lista y la página no es descuido — es continuidad: se hace
 * click en una imagen y se llega a la misma imagen, más grande.
 */
const apertura: Media = {
  src: "/images/delfina-gayoso-web.png",
  tipo: "imagen",
  ancho: 1897,
  alto: 907,
  alt: {
    es: "La apertura del sitio de Delfina Gayoso: sobre un fondo verde salvia, «Hola, soy Delfi» en serif, un texto breve donde se presenta, y una fotografía suya recortada en arco estirando el queso de una croqueta.",
    en: "The opening of Delfina Gayoso's site: over a sage green background, «Hola, soy Delfi» set in serif, a short text introducing herself, and a photograph of her cropped into an arch, pulling the cheese from a croquette.",
  },
  foco: "50% 40%",
};

export const delfinaGayoso: Proyecto = {
  slug: "delfina-gayoso",
  estado: "publicado",
  orden: 1,
  destacado: true,
  persona: "Delfina Gayoso",
  /**
   * "…que hace sentir que cualquiera puede cocinar" se leía como *cocinar es
   * fácil*, y ahí lo que se minimiza es su trabajo. El foco se corrió del logro
   * al vínculo: no es que cocinar sea sencillo, es que con ella la cocina se
   * vuelve un lugar agradable.
   */
  descriptor: {
    es: "Una forma de enseñar que transforma la cocina en un lugar al que siempre dan ganas de volver.",
    en: "A way of teaching that turns the kitchen into a place you always want to come back to.",
  },
  /**
   * Quién es, en la apertura y debajo del nombre.
   *
   * Empieza sin "Delfina" a propósito: el nombre está justo arriba en display, y
   * repetirlo es leerle al visitante lo que acaba de ver. En inglés el sujeto no
   * se puede elidir, así que ahí sí aparece — la elisión es una decisión de esta
   * lengua, no una regla del contenido.
   *
   * ~~"Sin apuro y sin tecnicismos, aunque detrás haya oficio."~~ ~~"Sin apuro y
   * sin tecnicismos, que es la parte difícil."~~ Las dos hablaban de lo mismo —el
   * oficio, la dificultad, el conocimiento detrás— y las dos, por más ajustadas
   * que estuvieran, describían a Delfina desde afuera y en abstracto. **El
   * problema no era la redacción: era el tema.**
   *
   * **"Sin apuro y con humor"** cambia la temperatura de la frase entera, y lo
   * hace con un giro mínimo: las versiones anteriores eran *sin* y *sin* —dos
   * restas, la descripción de lo que ella evita—; ésta gira en la "y" de resta a
   * suma y pasa a decir lo que trae. Es la diferencia entre definir a alguien por
   * lo que no hace y por cómo es.
   *
   * *Se evaluó ir más lejos* —nombrar algo concreto, una risa, una escena— y se
   * descartó por las dos razones de siempre: no hay material real para
   * sostenerlo (principio 9) y un tercer tiempo sobrecargaría una frase que
   * funciona en dos. Acá la contención no es prudencia: es el registro.
   */
  presentacion: {
    es: `Comparte una manera de cocinar que se siente simple y cotidiana.

Su forma de *enseñar* hace que cocinar parezca mucho más cercano. Sin apuro y con humor.`,
    en: `She shares a way of cooking that feels simple and everyday.

The way she *teaches* makes cooking feel much closer. No rush, and plenty of laughs.`,
  },
  año: 2026,
  rol: [
    { es: "Estrategia y Discovery", en: "Strategy and Discovery" },
    { es: "Arquitectura de experiencia y UX", en: "Experience architecture and UX" },
    { es: "Dirección creativa y de arte", en: "Creative and art direction" },
    {
      es: "Arquitectura técnica e implementación",
      en: "Technical architecture and implementation",
    },
  ],
  enlaceVivo:
    "https://delfina-gayoso-git-delfina-preview-01-nahuels-projects-0004f11b.vercel.app/",
  portada: apertura,
  // Pausado: el caso tiene que sentirse como una historia que se recorre, no
  // como una ficha técnica que se consulta.
  clima: { ritmo: "pausado" },
  /**
   * REGLA DE LOS CASOS (vigente para todos los proyectos):
   * **el protagonista es siempre la persona, nunca el estudio.**
   *
   * Un caso no cuenta "había un problema, llegó North Studio, ahora está
   * resuelto". Eso convierte al cliente en el antes y al estudio en el después,
   * y North Studio no salva proyectos: representa mejor a alguien. El estudio
   * aparece únicamente a través de las decisiones que se ven, y no hace falta
   * que las nombre.
   *
   * De acá salieron tres eliminaciones concretas en este cuerpo: el párrafo que
   * explicaba cómo está organizado el sitio (le interesa al que lo hizo, no al
   * que lo lee), el que decía que el material "vivía repartido en plataformas
   * que no eran suyas" (planteaba a Delfina como un problema), y el cierre
   * "sus redes siguen funcionando como antes, la diferencia es que ahora…"
   * (era el gracias-a-nosotros de siempre, con otro traje).
   */
  cuerpo: [
    // El cuerpo empieza en la imagen: la presentación subió a la apertura y los
    // créditos la anteceden acá, escritos por la página.
    { tipo: "media", media: apertura },
    { tipo: "pausa" },
    {
      tipo: "dato",
      etiqueta: { es: "En un mismo lugar", en: "All in one place" },
      valor: {
        es: "Contenido, marcas, clases, ebooks y formas de trabajar juntos",
        en: "Content, brands, classes, ebooks, and ways of working together",
      },
    },
    // El párrafo de dirección de arte se eliminó ("un verde salvia, una serif de
    // trazo fino, fotografía sin estilizar"): enumeraba decisiones sin decir qué
    // consiguen, y "fotografía sin estilizar" describe una ausencia. El caso
    // cierra en el dato, que es lo último que aporta algo.
  ],
};
