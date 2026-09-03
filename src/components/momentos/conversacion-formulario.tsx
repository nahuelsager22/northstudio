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
 * El tamaño (20 px) y sobre todo **el interlineado** son la corrección. Antes
 * usaba `text-title-3`, que es un token de *título*: interlineado 1.15 y tracking
 * negativo. Sirve para una línea corta y aprieta cualquier cosa de dos líneas
 * para arriba — que es justo lo que alguien escribe en el campo del proyecto. Con
 * 1.6 de interlineado y tracking neutro el texto tipeado se lee con la misma
 * comodidad que el cuerpo del sitio: es prosa, no un encabezado.
 *
 * Sin caja, sin fondo y sin sombra: una sola línea abajo, y el texto apoyado
 * encima. El indicador de foco es esa misma línea (ver `globals.css`).
 */
const CONTROL =
  "mt-2xs w-full appearance-none rounded-none bg-transparent font-serif text-[1.25rem] leading-[1.6] tracking-normal text-ink";

const LINEA = "border-b border-hairline py-2xs";

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
          {/* `autoComplete="off"` va también en el formulario y no solo en cada
              campo: es la forma correcta de desactivarlo, y algunos navegadores
              solo respetan el atributo del campo si el formulario lo declara
              primero. No afecta el envío en absoluto — `autocomplete` gobierna
              lo que el navegador ofrece completar, nunca lo que se manda. */}
          <form
            action={accion}
            noValidate
            autoComplete="off"
            className="mt-2xl max-w-[46rem]"
          >
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
              />
              <CampoLinea
                campo="email"
                etiqueta={c.campos.email}
                error={mensajeDeCampo(c, estado.errores?.email)}
                defaultValue={estado.valores?.email}
                // `type="email"` se conserva: no tiene nada que ver con el
                // autocompletado. Es lo que le da a un teléfono el teclado con
                // arroba, y quitarlo sí sería fricción real.
                type="email"
                className="mt-xl sm:mt-0"
              />
            </div>

            <CampoProyecto
              etiqueta={c.campos.mensaje}
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
  className = "",
}: {
  campo: ClaveDeCampo;
  etiqueta: string;
  error: string | null;
  defaultValue?: string;
  type?: "text" | "email";
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
        // Nada del navegador se mete acá. Sin autocompletado —decisión tomada
        // con el costo sobre la mesa: son dos campos cortos, y el desplegable
        // del sistema aparecía encima de una composición que se cuidó al
        // milímetro—, sin corrector y sin mayúscula automática. Un apellido
        // subrayado en rojo es el navegador diciéndole a alguien que su nombre
        // está mal escrito.
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-campo
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
 * El corazón del formulario. Ya no es una hoja con caja y fondo: es el mismo
 * renglón que los otros dos campos, y el texto se apoya encima.
 *
 * La caja anterior (`surface` + borde) dibujaba el marco que todo el resto del
 * sitio se cuidó de no poner, y al enfocar el anillo rectangular lo remarcaba.
 * Sin caja, lo único que hay es una línea — y el foco es esa línea volviéndose
 * tinta.
 *
 * Crece con lo que se escribe: empieza en tres líneas y se estira sin tope, así
 * que el largo lo decide quien escribe. Si no hay JavaScript queda en su alto
 * inicial y el navegador da su propio scroll interno.
 */
function CampoProyecto({
  etiqueta,
  error,
  defaultValue,
}: {
  etiqueta: string;
  error: string | null;
  defaultValue?: string;
}) {
  const id = "conversacion-mensaje";
  const idError = `${id}-aviso`;
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
    <div className="group mt-xl sm:mt-2xl">
      <label htmlFor={id} className={ETIQUETA}>
        {etiqueta}
      </label>

      <textarea
        ref={area}
        id={id}
        name="mensaje"
        rows={3}
        defaultValue={defaultValue ?? ""}
        onInput={ajustar}
        data-campo
        // Nada del navegador se mete acá: sin autocompletado, sin autocorrección,
        // sin mayúscula automática y sin subrayado rojo. Alguien que está
        // contando qué quiere hacer no necesita que el sistema le discuta cómo
        // se escribe el nombre de su proyecto — y las líneas rojas son lo más
        // ruidoso que puede aparecer en una pantalla que se compuso en silencio.
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        // El `overflow` se oculta solo cuando el alto lo administra JS. Sin JS,
        // `alto` es null y el navegador da su propio scroll interno: escribir
        // largo sigue siendo posible aunque el campo no crezca.
        style={alto ? { height: `${alto}px`, overflowY: "hidden" } : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idError : undefined}
        className={`${CONTROL} ${LINEA} resize-none overflow-auto`}
      />

      {error ? (
        <p id={idError} className={AVISO}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
