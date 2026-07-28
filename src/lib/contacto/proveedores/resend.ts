import type { Correo, ProveedorDeCorreo } from "../tipos";

const ENDPOINT = "https://api.resend.com/emails";

/**
 * Implementación por defecto: Resend.
 *
 * Sin SDK. Enviar un correo con Resend es un POST con un JSON; `fetch` ya está
 * en el runtime, así que el paquete `resend` no haría nada que el propio
 * lenguaje no haga (mismo criterio con el que se descartaron `next-themes`, una
 * librería de i18n y Motion: una dependencia tiene que resolver un problema
 * real, no ahorrar diez líneas).
 *
 * Este archivo no sabe qué dice ningún correo ni cuántos correos manda el sitio:
 * recibe uno compuesto y lo entrega. Es la única cosa que hace, y es la razón por
 * la que cambiar de proveedor no toca nada más.
 */
export function proveedorResend(config: {
  apiKey: string;
  destino: string;
  remitente: string;
}): ProveedorDeCorreo {
  return {
    nombre: "resend",
    remitente: config.remitente,
    destino: config.destino,
    async enviar(correo: Correo) {
      const respuesta = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: config.remitente,
          to: [correo.para],
          subject: correo.asunto,
          text: correo.texto,
          ...(correo.html ? { html: correo.html } : {}),
          ...(correo.responderA ? { reply_to: correo.responderA } : {}),
        }),
      });

      if (!respuesta.ok) {
        const detalle = await respuesta.text().catch(() => "");
        throw new Error(`Resend respondió ${respuesta.status}: ${detalle}`);
      }
    },
  };
}
