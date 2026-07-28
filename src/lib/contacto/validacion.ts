import { type Campo, type CodigoError, type Mensaje } from "./tipos";

/**
 * Validación en el servidor — la única que cuenta. El navegador puede ayudar,
 * pero no se le cree: `noValidate` en el formulario apaga los mensajes nativos
 * justamente para que todo lo que alguien lea esté escrito en la voz del sitio.
 *
 * Los topes no son un embudo: son el largo a partir del cual un envío deja de
 * ser una persona escribiendo. El del mensaje es holgado a propósito — el
 * mensaje es el corazón, y nadie debería sentir que tiene que ser breve.
 */

const TOPE_NOMBRE = 120;
const TOPE_EMAIL = 254; // largo máximo real de una dirección (RFC 5321)
const TOPE_MENSAJE = 5000;

/**
 * Forma mínima y honesta de una dirección: algo, una arroba, un dominio con
 * punto. Verificar de verdad si existe es imposible sin escribirle; una regex
 * más estricta solo rechazaría direcciones válidas y raras.
 */
const FORMA_EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validar(mensaje: Mensaje): Partial<Record<Campo, CodigoError>> | null {
  const errores: Partial<Record<Campo, CodigoError>> = {};

  if (mensaje.nombre.length === 0) errores.nombre = "nombre-vacio";
  else if (mensaje.nombre.length > TOPE_NOMBRE) errores.nombre = "nombre-largo";

  if (mensaje.email.length === 0) errores.email = "email-vacio";
  else if (mensaje.email.length > TOPE_EMAIL) errores.email = "email-largo";
  else if (!FORMA_EMAIL.test(mensaje.email)) errores.email = "email-invalido";

  if (mensaje.mensaje.length === 0) errores.mensaje = "mensaje-vacio";
  else if (mensaje.mensaje.length > TOPE_MENSAJE) errores.mensaje = "mensaje-largo";

  return Object.keys(errores).length > 0 ? errores : null;
}
