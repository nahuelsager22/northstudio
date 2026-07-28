import type { ProveedorDeCorreo } from "./tipos";
import { proveedorResend } from "./proveedores/resend";
import { proveedorConsola } from "./proveedores/consola";

/**
 * El único lugar del sitio que sabe qué servicio manda el correo.
 *
 * Todo lo demás (la acción, la vista, el correo mismo) trabaja contra
 * `ProveedorDeCorreo`. Cambiar Resend por otro servicio —o por un SMTP propio—
 * es escribir otro archivo en `proveedores/` y devolverlo desde acá.
 *
 * Variables de entorno (ver `.env.example`; nunca en el repositorio):
 *   CONTACTO_DESTINO    — dirección donde llega el mensaje
 *   CONTACTO_REMITENTE  — remitente verificado en el proveedor
 *   RESEND_API_KEY      — credencial del proveedor
 */
export function resolverProveedor(): ProveedorDeCorreo | null {
  const destino = process.env.CONTACTO_DESTINO?.trim();
  const remitente = process.env.CONTACTO_REMITENTE?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (destino && remitente && apiKey) {
    return proveedorResend({ apiKey, destino, remitente });
  }

  // Falta configuración: en desarrollo se degrada sin romper el recorrido; en
  // producción no se finge que el mensaje llegó (ver `proveedores/consola.ts`).
  if (process.env.NODE_ENV !== "production") return proveedorConsola();

  return null;
}
