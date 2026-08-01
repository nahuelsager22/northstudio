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
  descriptor: {
    es: "Una forma de enseñar que hace sentir que cualquiera puede cocinar.",
    en: "A way of teaching that makes anyone feel they could cook.",
  },
  año: 2026,
  rol: [
    { es: "Estrategia y Discovery", en: "Strategy and Discovery" },
    { es: "Arquitectura de experiencia y UX", en: "Experience architecture and UX" },
    { es: "Dirección creativa y de arte", en: "Creative and art direction" },
    { es: "Identidad digital", en: "Digital identity" },
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
    {
      tipo: "texto",
      contenido: {
        es: `Delfina comparte una manera de cocinar que se siente simple y cotidiana.

Su forma de *enseñar* hace que cocinar parezca mucho más cercano. Sin apuro, sin tecnicismos, con la certeza de que cualquiera puede.`,
        en: `Delfina shares a way of cooking that feels simple and everyday.

The way she *teaches* makes cooking feel much closer. No rush, no jargon, and the certainty that anyone can.`,
      },
    },
    { tipo: "pausa", tamaño: "rest-lg" },
    { tipo: "media", media: apertura },
    { tipo: "pausa" },
    {
      tipo: "dato",
      etiqueta: { es: "En un mismo lugar", en: "All in one place" },
      valor: {
        es: "Recetas, marcas, contenido y formas de trabajar juntas",
        en: "Recipes, brands, content, and ways of working together",
      },
    },
    {
      tipo: "texto",
      contenido: {
        // Pendiente de revisión con el proyecto terminado: este párrafo se
        // reescribe cuando estén cerradas las decisiones reales de arte.
        es: `La dirección de arte viene de una cocina de todos los días: un verde salvia, una serif de trazo fino, fotografía sin estilizar. El mismo tono con el que ella enseña.`,
        en: `The art direction comes from an everyday kitchen: a sage green, a fine-stroked serif, unstyled photography. The same tone she teaches in.`,
      },
    },
  ],
};
