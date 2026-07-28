import type { Segmento } from "../segments";

/**
 * Fuente de verdad de todo el texto de la interfaz y del recorrido.
 *
 * VOZ VIGENTE (validada — reemplaza la voz personal "yo" de los bloques 5a–5c):
 * voz del estudio, cercana, cálida y profesional. North Studio es el sujeto
 * cuando hace falta uno; al visitante se le habla en segunda persona. No se
 * enfatiza que el trato será personal —eso se demuestra respondiendo, no
 * anunciándolo— y no se usa un "nosotros" inflado para simular tamaño: solo
 * aparece donde evitarlo produciría una frase contorsionada, que sería peor.
 */

/** Momento 1 · El umbral — la línea que dice qué hace el estudio. */
const lineaUmbral: Segmento[] = [
  { texto: "North Studio diseña y desarrolla sitios que representan " },
  { texto: "una identidad", enfasis: true },
  { texto: ", no un rubro." },
];

/**
 * Momento 2 · El estudio — la forma de mirar. Se nombra; no se explica.
 *
 * Antes enumeraba acá lo que se observa (material, manera de comunicar, lo que
 * se repite y lo que se evita) y cerraba con "y no de un brief". Dos problemas:
 * repetía la misma lista que ya da la primera etapa del encargo, y el remate era
 * un pequeño golpe contra cómo trabajan otros. La lista quedó una sola vez, donde
 * corresponde, y el remate se retiró.
 */
const pasajeEstudio: Segmento[] = [
  { texto: "Antes de proponer nada, el estudio " },
  { texto: "observa", enfasis: true },
  { texto: ". Las decisiones de un proyecto salen de entender a quién representan." },
];

const cierreEstudio: Segmento[] = [
  {
    texto:
      "Dos personas con la misma profesión rara vez necesitan el mismo sitio. Lo que vuelve memorable a alguien casi nunca es ",
  },
  { texto: "qué hace", enfasis: true },
  { texto: ", sino cómo lo vive." },
];

/** Momento 3 · El encargo — qué hace el estudio, cómo trabaja y qué recibís. */
const entradaEncargo: Segmento[] = [
  { texto: "Un encargo acá no empieza con un diseño. Empieza con " },
  { texto: "una lectura", enfasis: true },
  { texto: " de quién sos." },
];

const entregaEncargo: Segmento[] = [
  { texto: "Lo que queda al final es un sitio " },
  { texto: "propio", enfasis: true },
  {
    texto:
      ": en producción, con contenido que podés actualizar sin romper nada y un sistema visual que sigue siendo tuyo cuando el proyecto termina.",
  },
];

/** Momento 5 · La conversación — la invitación. */
const invitacionConversacion: Segmento[] = [
  { texto: "Si tenés un proyecto en mente, " },
  { texto: "escribinos", enfasis: true },
  { texto: ". Un mensaje corto alcanza para empezar." },
];

export const es = {
  notFound: "Esta página no existe.",
  notFoundVolver: "Volver al inicio",
  meta: {
    title: "North Studio",
    description:
      "North Studio diseña y desarrolla sitios que representan una identidad, no un rubro. Discovery, arquitectura de experiencia, dirección de arte, diseño y desarrollo.",
  },
  nav: {
    /** Nombre accesible de la firma; también el destino "volver al inicio". */
    inicio: "North Studio — volver al inicio",
    secundaria: "Navegación",
    /** Índice del recorrido. El orden y la numeración viven en el código
        (`src/lib/i18n/secciones.ts`): acá solo el nombre de cada sección, para
        que traducir no pueda desincronizar un ancla. */
    secciones: {
      estudio: "Estudio",
      encargo: "Encargo",
      trabajo: "Trabajo",
      conversacion: "Conversación",
    },
    menu: { abrir: "Menú", cerrar: "Cerrar" },
    idioma: { corto: "EN", nombre: "English" },
    tema: { accion: "Cambiar a", papel: "Papel", noche: "Noche" },
  },
  umbral: {
    linea: lineaUmbral,
  },
  estudio: {
    etiqueta: "El estudio",
    pasaje: pasajeEstudio,
    cierre: cierreEstudio,
  },
  encargo: {
    etiqueta: "El encargo",
    entrada: entradaEncargo,
    /** El método del estudio como secuencia, no como "4 pasos con íconos". */
    etapas: [
      {
        titulo: "Observar",
        linea:
          "Se mira tu material real: cómo escribís, qué mostrás y qué elegís no mostrar. De ahí sale el encuadre del proyecto.",
      },
      {
        titulo: "Interpretar",
        linea:
          "El encuadre se vuelve un recorrido y una dirección de arte hechos para el proyecto, con su propio ritmo y su propio sistema visual.",
      },
      {
        titulo: "Construir",
        linea:
          "Diseño y desarrollo son la misma tarea. El sitio se construye para que pueda crecer con vos sin perder coherencia.",
      },
      {
        titulo: "Refinar",
        linea:
          "El proyecto se recorre entero antes de darlo por terminado. Ahí es donde encuentra su forma.",
      },
    ],
    entrega: entregaEncargo,
    /** La ficha del encargo, en registro de notación. Filtra sin vender. */
    ficha: [
      {
        etiqueta: "Con quién",
        valor: "Personas y proyectos con una identidad que vale la pena representar",
      },
      { etiqueta: "Cuántos a la vez", valor: "Uno" },
      {
        etiqueta: "Qué incluye",
        valor: "Discovery · Experiencia · Dirección de arte · Diseño · Desarrollo",
      },
    ],
  },
  trabajo: {
    titulo: "Trabajo",
    vacio: "El primer proyecto está por publicarse.",
  },
  conversacion: {
    invitacion: invitacionConversacion,
    /**
     * Etiquetas en registro de notación, no preguntas al visitante. Las
     * anteriores ("Cómo te llamás", "Dónde te escribo", "En qué estás
     * pensando") se sentían invasivas: una etiqueta no tiene que interrogar
     * para no ser burocrática.
     */
    campos: {
      nombre: "Nombre",
      email: "Email",
      mensaje: "Tu proyecto",
    },
    /** Orienta qué contar. Sin esto, el campo más importante llega vacío de intención. */
    ayudaMensaje: "Qué querés hacer, para quién, y en qué punto estás.",
    enviar: "Enviar",
    /** Estado de carga: dice qué está pasando, sin apurar a nadie. */
    enviando: "Enviando",
    /** Confirmación breve. Nada de "un asesor te contactará en 24-48hs". */
    confirmacion: "Tu mensaje llegó. Lo leemos con atención y te respondemos.",
    /**
     * Los errores orientan: dicen qué falta y cómo seguir, sin culpar ni
     * alarmar. Las claves son los códigos que devuelve el servidor.
     */
    errores: {
      "nombre-vacio": "Falta tu nombre.",
      "nombre-largo": "Ese nombre es más largo de lo que podemos recibir.",
      "email-vacio": "Sin una dirección no hay dónde responderte.",
      "email-invalido": "Esa dirección parece incompleta. ¿La revisás?",
      "email-largo": "Esa dirección es más larga de lo que podemos recibir.",
      "mensaje-vacio": "Contanos algo, aunque sea breve.",
      "mensaje-largo": "Es más largo de lo que podemos recibir. ¿Lo acortás un poco?",
      limite: "Tus mensajes ya llegaron. Dejá pasar unos minutos y seguimos.",
      envio: "Algo falló de nuestro lado y el mensaje no salió. Probá de nuevo en un rato.",
    },
  },
  project: {
    /** Se muestra en la propia página: un borrador no finge estar publicado. */
    borrador: "Borrador — todavía sin publicar",
    con: "Con",
    /** Acción, no dirección: la URL completa era ruido y no decía nada. */
    sitio: "Ver el sitio",
    sitioNuevaPestana: "(se abre en una pestaña nueva)",
    volver: "Volver al trabajo",
    conversacion: "Empezar una conversación",
  },
  /** El correo que recibe quien escribe. Voz del sitio, no plantilla de sistema. */
  acuse: {
    asunto: "Tu mensaje llegó a North Studio",
    saludo: "Hola",
    cuerpo:
      "Tu mensaje llegó bien. Lo vamos a leer con atención y vas a tener una respuesta escrita por una persona, no automática.",
    despedida: "North Studio",
    copia: "Esto es lo que escribiste:",
  },
};
