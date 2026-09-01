import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Correo, MensajeParaEnviar } from "./tipos";

/**
 * Los dos correos de la conversación, compuestos acá y no en el proveedor.
 *
 * 1. **El aviso al estudio.** Llega como lo que es: alguien que quiere hablar.
 *    El asunto dice quién escribe; el cuerpo empieza con *sus palabras* y la
 *    ficha va debajo, no arriba — quien lee tiene que encontrarse primero con la
 *    persona y después con los metadatos. `responderA` es su dirección, así que
 *    responder el correo es responderle a ella.
 * 2. **El acuse a quien escribió.** Breve, cálido, y sobre todo honesto: dice
 *    que el mensaje llegó y que la respuesta la va a escribir una persona. No
 *    promete plazos (sería una regla de servicio, no una conversación), no
 *    arranca una secuencia y no vende nada.
 *
 * Los dos llevan versión en texto plano y versión HTML. El HTML usa la paleta y
 * los registros del sitio traducidos a lo que un cliente de correo entiende:
 * estilos en línea, sin webfonts (Georgia sostiene la voz serif en todos lados),
 * sin imágenes —un correo que depende de descargar un logo se ve roto la mitad de
 * las veces— y con su propio modo oscuro. La atención al detalle también vale
 * fuera del sitio.
 */

/** Fallbacks hex de la paleta OKLCH (docs/sistema-visual.md · Color). Un cliente de correo no entiende oklch(). */
const PAPEL = {
  bg: "#FAF9F6",
  surface: "#F4F2EE",
  ink: "#201D19",
  muted: "#6E6A63",
  hairline: "#E4E1DB",
};

const NOCHE = {
  bg: "#17181C",
  surface: "#1E2025",
  ink: "#E9E5DE",
  muted: "#A0A2A8",
  hairline: "#3A3D44",
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

export function correoParaElEstudio(
  mensaje: MensajeParaEnviar,
  destino: string
): Correo {
  const idioma = mensaje.locale === "en" ? "inglés" : "español";
  const asunto = `${mensaje.nombre} escribió desde North Studio`;

  const ficha: [string, string][] = [
    ["Nombre", mensaje.nombre],
    ["Email", mensaje.email],
    ["Idioma", idioma],
  ];

  return {
    para: destino,
    asunto,
    responderA: mensaje.email,
    texto: [
      mensaje.mensaje,
      "",
      "—",
      ...ficha.map(([etiqueta, valor]) => `${etiqueta}: ${valor}`),
      "",
      "Respondé este correo y le llega directo.",
    ].join("\n"),
    html: envolver(
      "Conversación",
      `
        ${parrafos(mensaje.mensaje)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="margin-top:32px;border-top:1px solid ${PAPEL.hairline};border-collapse:collapse"
               class="ns-ficha">
          ${ficha
            .map(
              ([etiqueta, valor], i) => `
          <tr>
            <td style="padding:${i === 0 ? "20px" : "6px"} 0 0;font-family:${SANS};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${PAPEL.muted};width:96px;vertical-align:top" class="ns-muted">${escapar(etiqueta)}</td>
            <td style="padding:${i === 0 ? "20px" : "6px"} 0 0;font-family:${SERIF};font-size:16px;color:${PAPEL.ink};vertical-align:top" class="ns-ink">${escapar(valor)}</td>
          </tr>`
            )
            .join("")}
        </table>
        <p style="margin:28px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${PAPEL.muted}" class="ns-muted">
          Respondé este correo y le llega directo a ${escapar(mensaje.nombre)}.
        </p>
      `
    ),
  };
}

export function acuseParaQuienEscribe(mensaje: MensajeParaEnviar): Correo {
  const dict = getDictionary(mensaje.locale);
  const a = dict.acuse;

  return {
    para: mensaje.email,
    asunto: a.asunto,
    texto: [
      `${a.saludo} ${mensaje.nombre},`,
      "",
      a.cuerpo,
      "",
      a.copia,
      "",
      mensaje.mensaje,
      "",
      "—",
      a.despedida,
    ].join("\n"),
    html: envolver(
      a.despedida,
      `
        <p style="margin:0;font-family:${SERIF};font-size:20px;line-height:1.5;color:${PAPEL.ink}" class="ns-ink">
          ${escapar(a.saludo)} ${escapar(mensaje.nombre)},
        </p>
        <p style="margin:20px 0 0;font-family:${SERIF};font-size:17px;line-height:1.65;color:${PAPEL.ink}" class="ns-ink">
          ${escapar(a.cuerpo)}
        </p>
        <p style="margin:36px 0 12px;font-family:${SANS};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${PAPEL.muted}" class="ns-muted">
          ${escapar(a.copia)}
        </p>
        <div style="border-left:1px solid ${PAPEL.hairline};padding-left:20px" class="ns-cita">
          ${parrafos(mensaje.mensaje, PAPEL.muted, "ns-muted")}
        </div>
        <p style="margin:36px 0 0;font-family:${SERIF};font-size:16px;color:${PAPEL.muted}" class="ns-muted">
          ${escapar(a.despedida)}
        </p>
      `
    ),
  };
}

/**
 * El marco del correo. Un solo bloque de papel centrado con margen generoso:
 * el mismo paspartú del sitio, en el único layout que un cliente de correo
 * respeta de verdad. El modo oscuro se resuelve con clases sobrescritas dentro
 * de la media query, porque los estilos en línea no se pueden condicionar.
 */
function envolver(etiqueta: string, contenido: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  @media (prefers-color-scheme: dark) {
    .ns-bg { background-color: ${NOCHE.bg} !important; }
    .ns-hoja { background-color: ${NOCHE.surface} !important; border-color: ${NOCHE.hairline} !important; }
    .ns-ink { color: ${NOCHE.ink} !important; }
    .ns-muted { color: ${NOCHE.muted} !important; }
    .ns-ficha { border-color: ${NOCHE.hairline} !important; }
    .ns-cita { border-color: ${NOCHE.hairline} !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${PAPEL.bg}" class="ns-bg">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:${PAPEL.bg}" class="ns-bg">
    <tr>
      <td align="center" style="padding:48px 20px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border-collapse:collapse;background-color:${PAPEL.surface};border:1px solid ${PAPEL.hairline}" class="ns-hoja">
          <tr>
            <td style="padding:40px">
              <p style="margin:0 0 32px;font-family:${SANS};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${PAPEL.muted}" class="ns-muted">
                North Studio &middot; ${escapar(etiqueta)}
              </p>
              ${contenido}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** La prosa de alguien, párrafo por párrafo. En serif: lo que se escribió es voz. */
function parrafos(
  texto: string,
  color: string = PAPEL.ink,
  clase: string = "ns-ink"
): string {
  return texto
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean)
    .map(
      (parrafo, i) =>
        `<p style="margin:${i === 0 ? "0" : "16px 0 0"};font-family:${SERIF};font-size:17px;line-height:1.65;color:${color}" class="${clase}">${escapar(parrafo).replace(/\n/g, "<br>")}</p>`
    )
    .join("");
}

/**
 * Todo lo que escribió una persona entra al HTML escapado. No es paranoia: el
 * cuerpo del correo es texto de un desconocido, y un correo que se rompe (o
 * peor) por un `<` que alguien escribió sin querer es una falta de cuidado.
 */
function escapar(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
