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
 * Momento 3 · El estudio — la forma de mirar.
 *
 * Llega **después** del trabajo, a propósito: una frase sobre uno mismo se
 * sostiene cuando confirma algo que el visitante ya vio, y suena a promesa
 * cuando lo antecede.
 *
 * Tres líneas y un colofón. Lo que antes era una sección entera explicando el
 * proceso —observar, interpretar, construir, refinar— se eliminó: el proceso ya
 * está a la vista en el caso, que *es* discovery, dirección de arte y desarrollo.
 * Un estudio que enumera sus etapas está describiendo lo que su trabajo debería
 * poder mostrar solo.
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

/**
 * Lo único de todo aquello que no se puede mostrar: qué queda cuando el proyecto
 * termina. Sobrevive como una frase, no como el cierre de una sección.
 */
const entregaEstudio: Segmento[] = [
  { texto: "Al final queda un sitio " },
  { texto: "propio", enfasis: true },
  { texto: ", que podés actualizar y hacer crecer sin que pierda coherencia." },
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
      "North Studio diseña y desarrolla sitios que representan una identidad. Discovery, arquitectura de experiencia, dirección de arte, diseño y desarrollo.",
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
    cierre: cierreEstudio,
    entrega: entregaEstudio,
    /**
     * El colofón. Responde "¿qué hacen?" en tres segundos para quien lo
     * necesita, y es invisible para quien no. Registro de notación, sin
     * etiqueta: una lista rotulada sería un menú de servicios.
     */
    oficios: "Discovery · Experiencia · Dirección de arte · Diseño · Desarrollo",
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
