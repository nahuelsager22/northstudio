"use client";

import { Fragment, useActionState, useEffect, useRef, useState } from "react";
import { enviarConversacion } from "@/lib/contacto/accion";
import {
  CAMPOS,
  ESTADO_INICIAL,
  type Campo as ClaveDeCampo,
  type CodigoError,
} from "@/lib/contacto/tipos";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

/**
 * Momento 5 · el formulario — rediseñado por completo (Bloque 5c · refinamiento).
 *
 * Siguen siendo tres campos y sigue siendo "escuchar, no captar": no se agregó
 * teléfono, ni empresa, ni presupuesto, ni tipo de proyecto, ni opt-in. Lo que
 * cambió es todo lo demás, porque la versión anterior —tres líneas iguales
 * apiladas con la misma separación y un botón de texto abajo a la izquierda— era
 * el formulario minimalista de cualquier estudio, justo en el momento del sitio
 * que más tiene que sentirse propio.
 *
 * Las decisiones del rediseño:
 *
 * 1. **Los tres campos dejan de pesar lo mismo.** Nombre y email son datos: van
 *    juntos, en una línea, con anchos desiguales (2fr/3fr — la dirección tiene
 *    más caracteres que un nombre). El proyecto es la voz: ocupa el ancho entero
 *    y es lo único que se ve grande. El formulario ya no es una lista: tiene
 *    jerarquía, como todo lo demás en el sitio.
 * 2. **El campo del proyecto es una hoja.** Se apoya en `surface` —el token que
 *    llevaba todo el proyecto definido y sin usar— con margen interno real. Deja
 *    de ser una línea con un hueco de siete filas encima y pasa a ser un lugar
 *    donde escribir. Crece con el texto en vez de empezar enorme y vacío.
 * 3. **La etiqueta responde al foco.** Cuando el campo se enfoca, su etiqueta
 *    pasa de `muted` a tinta plena. Es el acuse del sistema aplicado a un
 *    formulario: "te vi, estás acá". Sin color de alarma, sin animación nueva.
 * 4. **El registro de las etiquetas cambia a notación (mono).** Antes compartían
 *    registro con el botón de enviar y con las etiquetas de sección: tres
 *    funciones distintas leyéndose igual. Ahora mono = notación, grotesque =
 *    acción, serif = voz, sin excepciones.
 *
 * Sin JavaScript funciona igual: la acción es una server action y el formulario
 * la postea como un formulario de siempre.
 */

/**
 * La voz del estudio. La confirmación usa este mismo registro: ocupa el lugar de
 * la invitación, porque la conversación ya empezó.
 */
const VOZ = "max-w-[32ch] font-serif text-title-2 text-ink md:text-title-1";

/** Notación, no interrogatorio. El registro mono es el de lo catalogado con cuidado. */
const ETIQUETA =
  "block font-mono text-meta uppercase text-muted group-focus-within:text-ink";

/**
 * Lo que la persona escribe va en serif. Es la única vez que la voz del sistema
 * no es la del estudio: quien escribe está hablando.
 *
 * A `text-title-3` y no a `text-body`: a 18 px la Newsreader dentro de un input
 * se leía como el serif por defecto de un navegador —clásico y genérico, que fue
 * la observación—. A 22 px se lee como lo que es, la misma voz con la que habla
 * el resto del sitio.
 *
 * Ya no declara su propia transición. Antes tenía `transition-[border-color]`
 * para mantener afuera el `outline-color` del anillo de foco (un foco que aparece
 * en 400 ms llega tarde para quien navega con teclado); ahora ese cuidado vive en
 * `globals.css`, en la regla de `:focus-visible`, y vale para todo el sitio. El
 * campo hereda la transición común, así que su tinta también acompaña el cambio
 * de tema en vez de saltar.
 */
const CONTROL =
  "mt-2xs w-full appearance-none rounded-none bg-transparent font-serif text-title-3 text-ink";

const LINEA = "border-b border-hairline py-2xs focus:border-ink";

const AVISO = "mt-2xs font-sans text-ui text-ink";

export function ConversacionFormulario({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [estado, accion, pendiente] = useActionState(
    enviarConversacion,
    ESTADO_INICIAL
  );
  const c = dict.conversacion;
  const enviado = estado.estado === "enviado";

  // Un error sin foco es un error que solo ven los que miran. Llevar el cursor
  // al primer campo con problema hace que el lector de pantalla lo anuncie con
  // su etiqueta y su aviso, y que el teclado siga desde donde hay que corregir.
  useEffect(() => {
    if (estado.estado !== "error" || !estado.errores) return;
    const primero = CAMPOS.find((campo) => estado.errores?.[campo]);
    if (primero) document.getElementById(`conversacion-${primero}`)?.focus();
  }, [estado]);

  return (
    <>
      {/* La región vive siempre en el DOM, aunque esté vacía: si apareciera
          recién con el texto, algunos lectores de pantalla no la anunciarían. */}
      <p role="status" aria-live="polite" className={VOZ}>
        {enviado ? c.confirmacion : null}
      </p>

      {enviado ? null : (
        <>
          <p className={VOZ}>
            {c.invitacion.map((segmento, i) =>
              segmento.enfasis ? (
                <em key={i}>{segmento.texto}</em>
              ) : (
                <Fragment key={i}>{segmento.texto}</Fragment>
              )
            )}
          </p>

          {/* `noValidate` apaga los mensajes del navegador: todo lo que alguien
              lea acá está escrito en la voz del sitio, y la validación de verdad
              vive en el servidor. */}
          <form action={accion} noValidate className="mt-2xl max-w-[46rem]">
            <input type="hidden" name="locale" value={locale} />

            {/* Honeypot: nadie lo ve, nadie llega con el teclado, nadie lo
                escucha. Solo un robot lo completa. Anti-spam sin pedirle nada a
                quien vino a hablar — prohibido el CAPTCHA. */}
            <div className="sr-only" aria-hidden="true">
              <input
                type="text"
                name="sitio"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            {/* Los dos datos, en una línea y con anchos desiguales. La asimetría
                no es estética: una dirección de correo necesita más lugar que un
                nombre, y darles la mitad a cada uno sería la grilla por reflejo. */}
            <div className="sm:grid sm:grid-cols-[2fr_3fr] sm:gap-xl">
              <CampoLinea
                campo="nombre"
                etiqueta={c.campos.nombre}
                error={mensajeDeCampo(c, estado.errores?.nombre)}
                defaultValue={estado.valores?.nombre}
                autoComplete="name"
              />
              <CampoLinea
                campo="email"
                etiqueta={c.campos.email}
                error={mensajeDeCampo(c, estado.errores?.email)}
                defaultValue={estado.valores?.email}
                type="email"
                autoComplete="email"
                className="mt-2xl sm:mt-0"
              />
            </div>

            <CampoProyecto
              etiqueta={c.campos.mensaje}
              ayuda={c.ayudaMensaje}
              error={mensajeDeCampo(c, estado.errores?.mensaje)}
              defaultValue={estado.valores?.mensaje}
            />

            {estado.general ? (
              <p role="alert" className={`${AVISO} mt-xl`}>
                {c.errores[estado.general]}
              </p>
            ) : null}

            {/* El envío se apoya en el borde derecho de la hoja. No es un CTA:
                es la única dirección del momento —hacia adelante— dicha por la
                composición y no por el tamaño ni por un color. */}
            <div className="mt-xl flex justify-end">
              <button
                type="submit"
                disabled={pendiente}
                aria-busy={pendiente}
                className="-mr-2xs px-2xs py-sm font-sans text-label uppercase text-ink disabled:text-muted"
              >
                <span className="quiet-underline">
                  {pendiente ? c.enviando : c.enviar}
                </span>
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
}

/**
 * Traduce el código que devolvió el servidor contra el diccionario del locale.
 * El servidor nunca manda una frase: si mandara texto, la voz del contacto
 * viviría en la lógica de envío y traducirla obligaría a tocarla.
 */
function mensajeDeCampo(
  c: Dictionary["conversacion"],
  codigo?: CodigoError
): string | null {
  return codigo ? c.errores[codigo] : null;
}

/** Un dato: una línea sobre la que apoyar el texto, como en un papel. */
function CampoLinea({
  campo,
  etiqueta,
  error,
  defaultValue,
  type = "text",
  autoComplete,
  className = "",
}: {
  campo: ClaveDeCampo;
  etiqueta: string;
  error: string | null;
  defaultValue?: string;
  type?: "text" | "email";
  autoComplete?: string;
  className?: string;
}) {
  const id = `conversacion-${campo}`;
  const idError = `${id}-aviso`;

  return (
    // `group` para que la etiqueta pueda responder al foco del campo.
    <div className={`group ${className}`}>
      <label htmlFor={id} className={ETIQUETA}>
        {etiqueta}
      </label>
      <input
        id={id}
        name={campo}
        type={type}
        defaultValue={defaultValue ?? ""}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idError : undefined}
        className={`${CONTROL} ${LINEA}`}
      />
      {error ? (
        <p id={idError} className={AVISO}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * El corazón del formulario: una hoja donde escribir, no un campo más.
 *
 * Crece con lo que se escribe. Empieza en cuatro líneas de alto —una invitación,
 * no un vacío de siete filas dominando el cierre del recorrido— y se estira sin
 * tope: el largo lo sigue decidiendo quien escribe, que era la intención
 * original. Si no hay JavaScript queda en su alto inicial y el navegador da su
 * propio scroll interno: nadie pierde la posibilidad de escribir largo.
 */
function CampoProyecto({
  etiqueta,
  ayuda,
  error,
  defaultValue,
}: {
  etiqueta: string;
  ayuda: string;
  error: string | null;
  defaultValue?: string;
}) {
  const id = "conversacion-mensaje";
  const idError = `${id}-aviso`;
  const idAyuda = `${id}-ayuda`;
  const area = useRef<HTMLTextAreaElement>(null);
  const [alto, setAlto] = useState<number | null>(null);

  function ajustar() {
    const nodo = area.current;
    if (!nodo) return;
    nodo.style.height = "auto";
    setAlto(nodo.scrollHeight);
  }

  // Lo que volvió del servidor tras un error puede ser más largo que el alto
  // inicial: se mide una vez al montar para que el texto no llegue recortado.
  useEffect(() => {
    const nodo = area.current;
    if (!nodo) return;
    nodo.style.height = "auto";
    setAlto(nodo.scrollHeight);
  }, []);

  return (
    <div className="group mt-2xl">
      <label htmlFor={id} className={ETIQUETA}>
        {etiqueta}
      </label>

      {/* La ayuda orienta qué contar. Sin ella, el campo más importante del
          sitio llega vacío de intención y quien escribe tiene que adivinar. */}
      <p id={idAyuda} className="mt-2xs font-serif text-body italic text-muted">
        {ayuda}
      </p>

      <textarea
        ref={area}
        id={id}
        name="mensaje"
        rows={4}
        defaultValue={defaultValue ?? ""}
        onInput={ajustar}
        // El `overflow` se oculta solo cuando el alto lo administra JS. Sin JS,
        // `alto` es null y el navegador da su propio scroll interno: escribir
        // largo sigue siendo posible aunque la hoja no crezca.
        style={alto ? { height: `${alto}px`, overflowY: "hidden" } : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${idAyuda} ${idError}` : idAyuda}
        className={`${CONTROL} resize-none overflow-auto border border-hairline bg-surface p-md focus:border-ink`}
      />

      {error ? (
        <p id={idError} className={AVISO}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
