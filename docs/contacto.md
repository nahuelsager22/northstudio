# El contacto

Cómo funciona el envío del formulario, de la vista al proveedor de correo. Vista en `src/components/momentos/conversacion-formulario.tsx`, lógica completa en `src/lib/contacto/`.

Es la parte del proyecto que activa riesgo (`north-studio-principles.md` §5): usa la credencial de un tercero y **enviar un correo es irreversible**.

---

## 1. El formulario

Exactamente tres campos: nombre, email y proyecto. **En el contacto el criterio se demuestra sobre todo en lo que no se pide** — no hay teléfono, ni empresa, ni presupuesto, ni tipo de proyecto, ni "cómo nos conociste", ni opt-in.

- Los dos datos comparten línea con anchos desiguales (2fr/3fr): una dirección de correo necesita más lugar que un nombre, y darles la mitad a cada uno sería la grilla por reflejo.
- **Lo que la persona escribe va en serif**, a 20 px con interlineado 1.6. Es la única vez que la voz del sistema no es la del estudio. No usa un token de título: ésos tienen interlineado 1.15 y aprietan cualquier cosa de dos líneas para arriba.
- Sin caja y sin fondo: una línea abajo, y el texto apoyado encima. El foco es esa misma línea volviéndose tinta (`docs/sistema-visual.md` §9).
- El campo del proyecto **crece con lo que se escribe**. Sin JS queda en su alto inicial y el navegador da su propio scroll: nadie pierde la posibilidad de escribir largo.
- **Nada del navegador se mete adentro**: sin autocompletado, sin autocorrección, sin mayúscula automática y sin corrector. `autocomplete="off"` va en el formulario **y** en cada campo — algunos navegadores sólo respetan el del campo si el formulario lo declara. `type="email"` se conserva: no tiene relación con el autocompletado y es lo que da el teclado con arroba.

**Costo asumido:** con `autocomplete` desactivado estos campos dejan de cumplir el criterio WCAG 1.3.5. Fue una decisión explícita del estudio, con el dato sobre la mesa.

---

## 2. El envío

Server action (`accion.ts`), no endpoint de API: el formulario funciona igual sin JavaScript, coherente con cómo degrada el resto del sitio.

```
honeypot → validación → límite → aviso al estudio → acuse a quien escribió
```

**Nada se almacena.** Sin CRM, sin base de datos, sin lista, sin autorespuesta de marketing. El mensaje se valida, se envía y desaparece de la memoria del servidor.

**El proveedor es sólo transporte.** El único tipo que el sitio conoce es `ProveedorDeCorreo`: recibe un `Correo` ya compuesto y lo entrega. Las decisiones editoriales —qué dice cada correo, cómo se ve— viven en `correo.ts`. Por eso se pueden mandar dos correos distintos sin que el proveedor sepa que existen, y mañana entra un tercero sin tocar Resend.

**Los dos envíos no valen lo mismo:**

- **El aviso al estudio es el que cuenta.** Si falla, el mensaje no llegó a nadie y el formulario lo dice.
- **El acuse a quien escribió es una cortesía, y es best-effort.** Su fracaso se registra en el log y no se le cuenta a nadie: el mensaje *sí* llegó, y decir "no salió" porque falló el acuse sería mentir en la dirección más costosa.

---

## 3. Los correos

Los dos llevan versión en texto plano **y** versión HTML. El HTML usa la paleta y los registros del sitio traducidos a lo que un cliente de correo entiende: estilos en línea, sin webfonts (Georgia sostiene la voz serif), **sin imágenes** —un correo que depende de descargar un logo se ve roto la mitad de las veces— y con su propio modo oscuro por clases sobrescritas dentro de una media query.

- **Aviso al estudio.** El asunto dice quién escribe; el cuerpo empieza con *sus palabras* y la ficha va debajo. Quien lee tiene que encontrarse primero con la persona y después con los metadatos. `reply_to` es su dirección: responder el correo es responderle a ella.
- **Acuse a quien escribió.** Breve y honesto: dice que llegó y que la respuesta la escribe una persona. No promete plazos, no arranca una secuencia y no vende nada. Su copy vive en los diccionarios (clave `acuse`) porque sí lo lee alguien de afuera; el texto del aviso al estudio no, y por eso vive en `correo.ts`.

**Todo lo que escribió una persona entra al HTML escapado.** No es paranoia: el cuerpo es texto de un desconocido y un correo que se rompe por un `<` que alguien escribió sin querer es una falta de cuidado.

---

## 4. Anti-spam — tres capas, ningún CAPTCHA

Hacerle rendir un examen a quien viene a hablar es lo contrario de escuchar. La defensa es invisible:

1. **Honeypot** (`sitio`): un campo que nadie ve, nadie enfoca (`tabIndex={-1}`) y nadie escucha (`aria-hidden`). Si viene completo no se envía nada y **se responde exactamente lo mismo que a todos** — a un robot no se le explica que lo detectamos.
2. **Validación en el servidor**, la única que cuenta. El formulario lleva `noValidate` para apagar los mensajes del navegador: todo lo que alguien lea está escrito en la voz del sitio.
3. **Rate limiting en memoria**: 3 envíos por IP cada 10 minutos, y **el turno se consume recién cuando el mensaje ya es válido y está por salir** — equivocarse en una letra del email no gasta el cupo de nadie.

**Alcance real del límite:** vive en memoria de una instancia. Si el despliegue escala a varias, el límite se relaja solo. Es una defensa proporcional, no una barrera dura.

---

## 5. Estados y errores

- **Confirmación**: reemplaza a la invitación en su mismo lugar y registro. Sin redirección a página de gracias.
- **Errores de campo**: el servidor nunca manda una frase, sólo un **código**; la vista lo traduce contra el diccionario del locale, así la voz del contacto no vive en la lógica de envío.
- **Sin color de alarma.** La paleta no tiene rojo y no se inventó uno. Un error se distingue por registro tipográfico, no por semáforo.
- **El foco va al primer campo con problema**, para que el lector de pantalla lo anuncie con su etiqueta y su aviso.
- La región `role="status"` **vive siempre en el DOM**: si apareciera recién con el texto, algunos lectores no la anunciarían.

**Progressive enhancement, verificado y no supuesto.** React emite `action=""`, `method=POST` y los campos `$ACTION_*`, así que sin JavaScript el navegador hace un POST normal. **Lo escrito vuelve con el error**: sin eso, equivocarse en una letra borraría todo lo que alguien acababa de contar. Consecuencia asumida sin JS: tras el POST el navegador vuelve al tope, porque la respuesta no puede llevar el hash.

---

## 6. Configuración

Tres variables, documentadas en `.env.example`. `.env.local` está en `.gitignore` y ninguna credencial vive en el repositorio.

| Variable | Qué es |
|---|---|
| `CONTACTO_DESTINO` | Dónde llega el mensaje |
| `CONTACTO_REMITENTE` | Remitente verificado en el proveedor |
| `RESEND_API_KEY` | Credencial del proveedor |

**La degradación sin configuración es distinta según el entorno, y es a propósito.** En desarrollo se usa un proveedor de consola: el formulario funciona igual y el mensaje se escribe en el log. En **producción** `resolverProveedor()` devuelve `null` y el formulario dice —sin tecnicismos— que el mensaje no salió.

**Dar por enviado un mensaje que nadie va a leer sería fingir atención**, el peor error posible en el momento del sitio que existe para escuchar. El mismo silencio que en un entorno es cortesía, en el otro es mentira.

**Estado actual del remitente:** con el remitente de desarrollo de Resend (`onboarding@resend.dev`) el aviso al estudio llega y **el acuse se rechaza**, porque ese remitente sólo puede escribirle a la dirección de la cuenta. No es un error: es el comportamiento best-effort funcionando. Al verificar un dominio propio empieza a llegar sin tocar código.
