import type { Correo, ProveedorDeCorreo } from "../tipos";

/**
 * Degradación en desarrollo: sin variables de entorno no hay a dónde enviar,
 * pero el recorrido no se rompe ni le muestra al visitante un error técnico que
 * no es suyo. El correo se escribe en el log del servidor y el formulario
 * confirma igual.
 *
 * Solo en desarrollo, a propósito. En producción, dar por enviado un mensaje
 * que nadie va a leer sería fingir atención — el peor error posible en el
 * momento del sitio que existe para escuchar. Ahí, si falta configuración, el
 * formulario lo dice (`resolverProveedor` devuelve `null`).
 */
export function proveedorConsola(): ProveedorDeCorreo {
  return {
    nombre: "consola",
    remitente: "consola@local",
    destino: "consola@local",
    async enviar(correo: Correo) {
      console.info(
        `\n[contacto · desarrollo] Sin proveedor configurado; el correo no salió.\n` +
          `Para: ${correo.para}\nAsunto: ${correo.asunto}\n\n${correo.texto}\n`
      );
    },
  };
}
