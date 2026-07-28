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
    es: "Una cocinera que enseña como si estuvieras en su cocina.",
    en: "A cook who teaches as if you were standing in her kitchen.",
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
  cuerpo: [
    {
      tipo: "texto",
      contenido: {
        es: `Delfina cocina, enseña y publica desde hace años. Todo eso vivía repartido entre plataformas que no eran suyas; el encargo fue reunirlo en un lugar propio.

Lo que la distingue es su forma de *enseñar*: cercana, paciente, con la idea de que cualquiera puede cocinar si alguien lo acompaña. El sitio se organizó alrededor de esa idea.`,
        en: `Delfina has been cooking, teaching and publishing for years. All of it lived scattered across platforms that weren't hers; the commission was to bring it together somewhere of her own.

What sets her apart is the way she *teaches*: close by, patient, working from the idea that anyone can cook if someone walks them through it. The site was organised around that idea.`,
      },
    },
    { tipo: "pausa", tamaño: "rest-lg" },
    { tipo: "media", media: apertura },
    { tipo: "pausa" },
    {
      tipo: "texto",
      contenido: {
        es: `La navegación sigue lo que alguien viene a hacer —conocerla, aprender con ella o trabajar con ella— en lugar de seguir los tipos de contenido. Cada camino tiene su propia extensión y su propio ritmo.`,
        en: `Navigation follows what someone comes to do — get to know her, learn with her, or work with her — rather than following content types. Each path has its own length and its own pace.`,
      },
    },
    {
      tipo: "dato",
      etiqueta: { es: "El sitio reúne", en: "The site brings together" },
      valor: {
        es: "Quién es, qué enseña, su trabajo con marcas y el contacto",
        en: "Who she is, what she teaches, her work with brands, and contact",
      },
    },
    {
      tipo: "texto",
      contenido: {
        es: `La dirección de arte parte de la cocina de todos los días: un verde salvia, una serif de trazo fino, fotografía sin estilizar. Es el mismo tono con el que ella enseña, dicho en color, tipografía y ritmo.

Sus redes siguen funcionando como antes. La diferencia es que ahora llevan a un lugar que le pertenece.`,
        en: `The art direction comes from an everyday kitchen: a sage green, a fine-stroked serif, unstyled photography. It's the same tone she teaches in, said in colour, type and pace.

Her social accounts work the same as before. The difference is that now they lead somewhere that belongs to her.`,
      },
    },
  ],
};
