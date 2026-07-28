import type { Locale } from "@/lib/i18n/locales";

/**
 * Momento 5 · La conversación — el contrato entre el formulario y el envío.
 *
 * Vive separado de la vista y del proveedor: la vista solo conoce *códigos* de
 * estado, nunca frases. Las frases viven en los diccionarios, así que reescribir
 * la voz del contacto no obliga a tocar ni la validación ni el envío.
 */

/** Los tres campos. No hay un cuarto: cada campo ausente es una decisión (experience-architecture.md §7). */
export const CAMPOS = ["nombre", "email", "mensaje"] as const;

export type Campo = (typeof CAMPOS)[number];

/** Lo que alguien escribió. Nada más se guarda, y no se guarda más allá del envío. */
export type Mensaje = {
  nombre: string;
  email: string;
  mensaje: string;
};

/** Códigos por campo: la vista los traduce contra el diccionario del locale. */
export type CodigoError =
  | "nombre-vacio"
  | "nombre-largo"
  | "email-vacio"
  | "email-invalido"
  | "email-largo"
  | "mensaje-vacio"
  | "mensaje-largo";

/** Códigos que no pertenecen a un campo sino al intento entero. */
export type CodigoGeneral = "limite" | "envio";

export type EstadoConversacion = {
  estado: "inicial" | "enviado" | "error";
  errores?: Partial<Record<Campo, CodigoError>>;
  general?: CodigoGeneral;
  /**
   * Lo escrito vuelve con el error. Sin JavaScript la página se rehace entera:
   * si el formulario volviera vacío, alguien perdería lo que acababa de contar
   * por haberse equivocado en una letra del email.
   */
  valores?: Mensaje;
};

export const ESTADO_INICIAL: EstadoConversacion = { estado: "inicial" };

/** Lo que se compone a partir del formulario: el mensaje y el idioma en que fue escrito. */
export type MensajeParaEnviar = Mensaje & { locale: Locale };

/**
 * Un correo ya compuesto y listo para salir.
 *
 * Este tipo es el cambio de arquitectura del refinamiento. Antes el proveedor
 * recibía el *mensaje del formulario* y decidía él cómo se convertía en correo;
 * eso ataba una decisión editorial (qué dice el correo, cómo se ve) a la
 * implementación de un servicio. Ahora el proveedor es solo transporte: recibe un
 * correo terminado y lo entrega. Por eso se pueden mandar dos correos distintos
 * —el aviso al estudio y el acuse a quien escribió— sin que el proveedor sepa que
 * existen, y por eso mañana se puede agregar un tercero sin tocar Resend.
 */
export type Correo = {
  para: string;
  asunto: string;
  /** Siempre presente: un correo que solo existe en HTML es un correo que alguien no puede leer. */
  texto: string;
  html?: string;
  /** Responder el correo es responderle a la persona, sin copiar ninguna dirección. */
  responderA?: string;
};

/**
 * La interfaz que hace intercambiable al proveedor. El sitio no depende de
 * ningún servicio de correo concreto: depende de esto. Cambiar de proveedor es
 * escribir otro objeto con esta forma y devolverlo desde `resolverProveedor()`.
 */
export type ProveedorDeCorreo = {
  readonly nombre: string;
  /** Dirección verificada desde la que sale el correo. */
  readonly remitente: string;
  /** A dónde llegan los mensajes del formulario. */
  readonly destino: string;
  /** Resuelve si el correo salió; lanza si no. El error nunca llega a la vista. */
  enviar(correo: Correo): Promise<void>;
};
