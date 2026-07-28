"use server";

import { headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/locales";
import { consumirTurno } from "./limite";
import { resolverProveedor } from "./proveedor";
import { validar } from "./validacion";
import { correoParaElEstudio, acuseParaQuienEscribe } from "./correo";
import type { EstadoConversacion, Mensaje, MensajeParaEnviar } from "./tipos";

/**
 * Momento 5 · el envío.
 *
 * Server action, no endpoint de API: el formulario funciona igual sin
 * JavaScript (React lo postea al servidor y la página se rehace con el mismo
 * estado), coherente con cómo degrada el resto del sitio.
 *
 * Nada se almacena. El mensaje se valida, se envía y desaparece de la memoria
 * del servidor: sin CRM, sin base de datos, sin lista.
 */

function texto(formData: FormData, campo: string): string {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

function resolverLocale(valor: string): Locale {
  return (locales as readonly string[]).includes(valor)
    ? (valor as Locale)
    : defaultLocale;
}

/** Clave del rate limiting. Se usa para contar, no se guarda ni se envía. */
async function origen(): Promise<string> {
  const cabeceras = await headers();
  const reenviado = cabeceras.get("x-forwarded-for")?.split(",")[0]?.trim();
  return reenviado || cabeceras.get("x-real-ip")?.trim() || "desconocido";
}

export async function enviarConversacion(
  _previo: EstadoConversacion,
  formData: FormData
): Promise<EstadoConversacion> {
  const valores: Mensaje = {
    nombre: texto(formData, "nombre"),
    email: texto(formData, "email"),
    mensaje: texto(formData, "mensaje"),
  };

  // Honeypot: un campo que ninguna persona ve ni puede enfocar. Si viene
  // completo, escribió un robot. No se le explica que lo detectamos —se le
  // responde exactamente lo mismo que a todos— y el mensaje no sale.
  if (texto(formData, "sitio") !== "") return { estado: "enviado" };

  const errores = validar(valores);
  if (errores) return { estado: "error", errores, valores };

  if (!consumirTurno(await origen())) {
    return { estado: "error", general: "limite", valores };
  }

  const proveedor = resolverProveedor();
  if (!proveedor) {
    console.error(
      "[contacto] Falta configuración de envío (CONTACTO_DESTINO, CONTACTO_REMITENTE, RESEND_API_KEY). El mensaje no salió."
    );
    return { estado: "error", general: "envio", valores };
  }

  const mensaje: MensajeParaEnviar = {
    ...valores,
    locale: resolverLocale(texto(formData, "locale")),
  };

  // El aviso al estudio es el envío que cuenta. Si este falla, el mensaje no
  // llegó a nadie y el formulario tiene que decirlo.
  try {
    await proveedor.enviar(correoParaElEstudio(mensaje, proveedor.destino));
  } catch (error) {
    // El detalle técnico queda del lado del servidor: quien escribe no tiene
    // por qué leer el error de un servicio que no eligió.
    console.error("[contacto] No se pudo enviar el mensaje:", error);
    return { estado: "error", general: "envio", valores };
  }

  // El acuse es una cortesía, no la operación. Se intenta después y su fracaso
  // no se le cuenta a nadie: el mensaje *sí* llegó, y decir "no salió" porque
  // falló el acuse sería mentir en la dirección más costosa. Hoy, además, falla
  // por diseño mientras el remitente sea el de desarrollo de Resend, que solo
  // puede escribirle a la cuenta del estudio.
  try {
    await proveedor.enviar(acuseParaQuienEscribe(mensaje));
  } catch (error) {
    console.warn(
      "[contacto] El mensaje llegó al estudio, pero el acuse a quien escribió no salió:",
      error
    );
  }

  return { estado: "enviado" };
}
