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

/**
 * Momento 1 · El umbral — la línea que dice qué hace el estudio.
 *
 * Termina en la itálica. El ", no un rubro" que cerraba antes explicaba el
 * contraste en vez de dejarlo entender, y le sacaba el peso a la afirmación:
 * una frase que se defiende suena menos segura que una que se apoya sola.
 */
const lineaUmbral: Segmento[] = [
  { texto: "North Studio diseña y desarrolla sitios que representan " },
  { texto: "una identidad", enfasis: true },
  { texto: "." },
];

/**
 * El estudio — cinco tiempos.
 *
 * La tesis, el puente, qué se hace, qué se construye y el remate. El salto de la
 * tesis a "sitios web pensados desde cero" era abrupto: una frase sobre personas
 * seguida de una sobre entregables, sin nada que las una. El puente y el remate
 * existen para eso, y de paso le devuelven densidad a la mitad de atrás del
 * recorrido, que había quedado más vacía que calma.
 *
 * Sobre cómo están escritos: la idea de que la identidad no es una capa visual
 * sino coherencia se dice **desde el lado de la persona** —cómo escribís, qué
 * mostrás, cuánto espacio dejás— y no desde el lado del oficio. Nombrar logo y
 * paleta para decir que no alcanzan sería el estudio hablando de diseño, y de
 * paso un golpe a cómo trabajan otros.
 */
const pasajeEstudio: Segmento[] = [
  { texto: "Lo que vuelve memorable a alguien es " },
  { texto: "cómo vive", enfasis: true },
  { texto: " lo que hace." },
];

/** El puente: qué es una identidad, dicho sin nombrar una sola pieza de diseño. */
const puenteEstudio: Segmento[] = [
  {
    texto:
      "Eso se nota en cómo escribís, en qué elegís mostrar, en cuánto espacio dejás. Un sitio se construye igual: la identidad no está en una pieza, está en que ",
  },
  { texto: "todo diga lo mismo", enfasis: true },
  { texto: "." },
];

const cierreEstudio: Segmento[] = [
  { texto: "Sitios web pensados desde cero para representar " },
  { texto: "una identidad", enfasis: true },
  { texto: "." },
];

/** El remate: la filosofía, sin volver a enumerar el proceso. */
const remateEstudio: Segmento[] = [
  { texto: "Cada decisión busca lo mismo: que la experiencia se sienta tan " },
  { texto: "propia", enfasis: true },
  { texto: " como la persona que representa." },
];

/**
 * Momento 5 · La conversación — la invitación.
 *
 * Una sola frase. "Un mensaje corto alcanza para empezar" tranquilizaba a
 * alguien que no había dicho estar intranquilo: es la nota justificativa que se
 * agrega cuando no se confía en que la invitación se sostenga sola. Se sostiene.
 */
const invitacionConversacion: Segmento[] = [
  { texto: "Si tenés un proyecto en mente, " },
  { texto: "escribinos", enfasis: true },
  { texto: "." },
];

export const es = {
  notFound: "Esta página no existe.",
  notFoundVolver: "Volver al inicio",
  meta: {
    title: "North Studio",
    description:
      "North Studio diseña y desarrolla sitios que representan una identidad. Sitios web, landing pages, portfolios y experiencias digitales.",
  },
  nav: {
    /** Nombre accesible de la firma; también el destino "volver al inicio". */
    inicio: "North Studio — volver al inicio",
    secundaria: "Navegación",
    /** Los destinos. El orden vive en el código (`src/lib/i18n/secciones.ts`):
        acá solo el nombre, para que traducir no desincronice un ancla. */
    secciones: {
      trabajo: "Trabajo",
      estudio: "Estudio",
      contacto: "Contacto",
    },
    menu: { abrir: "Menú", cerrar: "Cerrar" },
    idioma: { corto: "EN", nombre: "English" },
    tema: { accion: "Cambiar a", papel: "Papel", noche: "Noche" },
  },
  umbral: {
    linea: lineaUmbral,
  },
  /**
   * Los momentos ya no llevan etiqueta visible. La nav los nombra; imprimir
   * "El estudio" arriba del estudio es un sitio explicándose su propio índice.
   * El nombre sigue existiendo para quien navega con lector de pantalla, que sí
   * necesita saber en qué región está.
   */
  trabajo: {
    nombre: "Trabajo",
    vacio: "El primer proyecto está por publicarse.",
  },
  estudio: {
    nombre: "El estudio",
    pasaje: pasajeEstudio,
    puente: puenteEstudio,
    cierre: cierreEstudio,
    remate: remateEstudio,
    /**
     * El colofón. Responde "¿qué hacen?" en dos segundos para quien lo necesita
     * y es invisible para quien no. Sin etiqueta: una lista rotulada sería un
     * menú de servicios.
     *
     * Nombra **lo que se construye**, no las etapas para construirlo. La versión
     * anterior (estrategia, dirección de arte, diseño, desarrollo) describía el
     * trabajo desde adentro del oficio; esta responde la pregunta que alguien
     * trae de verdad, que es qué puede pedir.
     */
    oficios: "Sitios web · Landing pages · Portfolios · Experiencias digitales",
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
    enviar: "Enviar",
    /** Estado de carga: dice qué está pasando, sin apurar a nadie. */
    enviando: "Enviando",
    /**
     * Dos palabras y dos palabras. "Lo leemos con atención" era el estudio
     * contando lo atento que es — la atención se demuestra respondiendo.
     */
    confirmacion: "Llegó. Te escribimos.",
    /**
     * Los errores orientan sin culpar ni alarmar, y son cortos: alguien que se
     * equivocó en una letra no necesita una explicación, necesita saber qué
     * falta. Las claves son los códigos que devuelve el servidor.
     */
    errores: {
      "nombre-vacio": "Falta tu nombre.",
      "nombre-largo": "Ese nombre es demasiado largo.",
      "email-vacio": "Falta tu email.",
      "email-invalido": "Esa dirección parece incompleta.",
      "email-largo": "Esa dirección es demasiado larga.",
      "mensaje-vacio": "Contanos algo.",
      "mensaje-largo": "Es demasiado largo. ¿Lo acortás?",
      limite: "Ya llegaron tus mensajes. Dejá pasar unos minutos.",
      envio: "Algo falló de nuestro lado. Probá de nuevo en un rato.",
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
    /** Era "Empezar una conversación": el estudio nombrando su propia filosofía. */
    conversacion: "Escribir",
  },
  /** El correo que recibe quien escribe. Voz del sitio, no plantilla de sistema. */
  acuse: {
    asunto: "Tu mensaje llegó a North Studio",
    saludo: "Hola",
    cuerpo: "Tu mensaje llegó. Te respondemos pronto, y lo escribe una persona.",
    despedida: "North Studio",
    copia: "Esto es lo que escribiste:",
  },
};
