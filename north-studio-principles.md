# north-studio-principles.md

Interfaz operativa de Midfield para **la web oficial de North Studio**. Lo que un chat no puede inferir del proyecto, más las referencias que consulta a diario. La metodología general no se copia acá: vive en el Playbook y se aplica sin releerla.

---

## 0. Qué es este proyecto

La web oficial de North Studio: un estudio que diseña y desarrolla sitios que representan una identidad. Es un sitio de dos idiomas (ES fuente de verdad, EN paralelo) con un recorrido continuo y una ruta dedicada por proyecto publicado.

Lo que lo hace distinto es su tensión central: el estudio se define por *cómo decide*, no por cómo se ve, así que la web no puede describir ese criterio — tiene que ser un ejemplo de él. **Es el primer caso de North Studio.**

**Naturaleza:** propio del estudio.

**Excepción declarada — se opera con las reglas de proyecto con cliente.** El fundador ocupa el lugar del cliente: mira el sitio terminado, señala lo que no lo representa y decide. Sin esa regla cada iteración vuelve a discutir lo ya decidido, que es exactamente lo que pasó en las primeras. Rigen las tres del Playbook IX:

- Su indicación explícita vence a una decisión previa, incluso a una que él aprobó. Una decisión se conserva mientras siga representando al estudio; cuando deja de hacerlo se reformula **en el documento donde nació**, no se parcha en el último.
- El criterio se aporta **antes** de ejecutar: se dice lo que se ve, se explica el costo, se propone la alternativa. Si reafirma, se hace completo y se registra la advertencia.
- Su formulación es evidencia. Cómo nombra algo dice cómo lo entiende; reordenarlo exige más justificación que respetarlo.

---

## 1. Orden de lectura

Para trabajar en un chat nuevo, y nada más por defecto:

1. Este archivo
2. `project-journal.md`
3. el archivo del bloque activo, si existe
4. los archivos que la tarea necesite — `docs/` incluido

El Playbook no se relee salvo decisión metodológica explícita. **Una excepción vigente y frecuente acá:** cualquier bloque que toque dirección de arte, sistema visual o el recorrido completo relee los capítulos III y VII, que no sobreviven a un resumen.

---

## 2. Norte y filtro

> North-Studio existe para comprender profundamente a una persona y transformar esa comprensión en una experiencia digital coherente, donde cada decisión tenga una intención clara y la identidad ocupe el centro.

**Cómo se lee en este proyecto:** no hay una persona que descubrir, así que el lugar de la identidad lo ocupa **el criterio del estudio**, y la consecuencia concreta es que ninguna decisión puede justificarse describiendo ese criterio — tiene que demostrarlo. Si una idea sobre cómo trabaja el estudio sólo existe como frase, todavía no está diseñada.

**El filtro, cuando una decisión genera dudas:** ¿comprendemos o suponemos? · ¿responde a una intención clara? · ¿fortalece la coherencia? · ¿podríamos eliminarla sin perder nada? · ¿esto que incomoda se puede medir, o es una preferencia? · ¿resolvemos un problema real o agregamos complejidad? · ¿qué pasa si esto está mal y nadie se entera? · ¿lo seguiríamos decidiendo igual dentro de unos años?

**Un filtro más, propio de este proyecto:** *¿esto hace sentir observado al visitante, o sólo se luce?* Un detalle que pide ser notado desplaza el foco hacia el estudio; uno que atiende lo mantiene en la persona. Ante conflicto con cualquier recurso que sólo busque impacto, gana la atención.

---

## 3. Reglas de implementación propias de este proyecto

Sólo lo que vale para todo el proyecto y no es ya criterio del Playbook IV.

- **Los tres registros tipográficos tienen significado fijo y no se mezclan:** serif = voz, grotesque = acción, mono = notación. Dos cosas con el mismo registro se leen como la misma cosa. Tabla completa en `docs/sistema-visual.md`.
- **Un solo vocabulario de motion en todo el sitio.** Recepción, continuidad y acuse. Un estilo de movimiento nuevo no se agrega: se cambia por uno existente o no entra. La única excepción es el cielo, y está declarada en `docs/sistema-visual.md` con su límite.
- **Todo el copy vive en los diccionarios** (`src/lib/i18n/dictionaries/`), con su énfasis adentro del dato. Reescribir o traducir un pasaje nunca obliga a tocar una vista.
- **El contenido de proyectos son objetos TypeScript tipados, no un CMS.** Sumar un trabajo es sumar un archivo de datos; la interfaz no cambia.
- **En un caso de estudio el protagonista es siempre la persona, nunca el estudio.** North Studio aparece únicamente a través de las decisiones que se ven. Prohibido el relato "había un problema, llegó el estudio, ahora está resuelto".
- **El silencio entre momentos es `padding-bottom` del momento que termina**, nunca `padding-top` del que empieza, para que el borde superior de una sección sea el comienzo real de su contenido.
- **Nada se rellena.** No hay placeholders, proyectos ficticios ni secciones agregadas para completar. Cuando algo se contrae, se contrae entero — incluida su etiqueta.

---

## 4. Validación

| Tipo de cambio | Cómo se valida |
|---|---|
| Copy, contenido, datos | Controles automáticos + leer el texto renderizado en los dos idiomas |
| Interfaz, composición, motion | Controles automáticos + mirar en el navegador, en los cuatro formatos y los dos temas |
| Contacto (envío de correo) | Además: un envío real de punta a punta, comprobando llegada, `reply-to` y asunto |
| Contenido de un proyecto nuevo | Además: la ruta del proyecto y su entrada en el trabajo, en ES y EN |

**Controles automáticos que deben pasar antes de cerrar algo:** `pnpm typecheck`, `pnpm build`, `pnpm lint`.

No alcanzan solos: cubren lo que el sistema se dice a sí mismo. Lo que produce algo que una persona va a leer se ejecuta y se mira, **sobre el artefacto servido y no sobre el archivo editado**.

---

## 5. Riesgo

**Secciones del capítulo VI que este proyecto activa:** *Secretos* · *Qué cambia cuando el error es caro* · *Documentos que se contradicen*.

Por qué esas tres y no más: el sitio no tiene autenticación, no guarda datos de nadie y no mueve dinero. Pero usa la credencial de un tercero (Resend), **enviar un correo es irreversible**, y su configuración de envío hay que reproducirla a mano en producción.

*Alertas y guardas* no se activa: no hay procesos automáticos de los que alguien dependa.

**Qué es crítico acá:** que alguien escriba un mensaje, el sitio le confirme que llegó, y no haya llegado a nadie. Es el único punto donde el proyecto puede dejar a una persona esperando algo que ya entregó. De ahí sale la regla de degradación asimétrica del contacto (`docs/contacto.md`): en desarrollo se confirma igual, en producción se dice que no salió.

---

## 6. Estándar técnico

Foto del día, para no abrir el Apéndice A.

| Tecnología | Versión | Igual a la base |
|---|---|---|
| Next.js | 16.2.10 | sí |
| React | 19.2.8 | no — la base fija 19.2.7 |
| TypeScript | 6.0.3 | sí |
| Tailwind CSS | 4.3.3 | no — la base fija 4.3.2 |
| pnpm | 10.28.1 | la base no fija versión |
| Lenis | 1.3.25 | sí (librería aprobada) |

**Desvíos respecto de la base, con motivo:**

- **React y Tailwind avanzan un parche.** Es la versión que instaló el gestor al resolver el rango; no hubo una decisión de apartarse. Se registra acá y **no se sube al Apéndice A**: la deriva de parche de un proyecto no es evidencia de que cambió la base del estudio.
- **Motion, tailwind-merge y Sanity están aprobadas y no se usan.** Motion no entra porque todo el vocabulario de movimiento del sitio son transiciones CSS más un `IntersectionObserver`; tailwind-merge porque no hubo composición condicional de clases que simplificar; Sanity porque el contenido lo autoría el propio estudio y archivos tipados en el repositorio son más simples y no dependen de la red.
- **Resend se usa sin su SDK.** Enviar es un POST con un JSON y `fetch` ya está en el runtime.
- **`noUncheckedIndexedAccess` activado** en `tsconfig.json`, por encima del `strict` habitual.

El motivo de cada dependencia vive en el journal.

---

## 7. Interfaz

**Anti-genéricas específicas de este proyecto** — sólo lo propio; las generales están en el Playbook IX y no se copian:

- **Sin fotografía de stock ni de paisaje como clima.** La montaña y el norte viven como cualidad sentida y en la firma, nunca como imagen literal. La omisión del stock es, en sí, el movimiento de criterio.
- **Sin bold.** El énfasis es itálica. El bold pesado es el registro varsity que el proyecto abandonó.
- **Sin blanco ni negro puros**, sin gradientes de impacto, sin glassmorphism, sin sombras marcadas.
- **Sin etiquetas de sección visibles** en el recorrido. La nav ya nombra los destinos; imprimirlo arriba de cada momento es el sitio leyéndose su propio índice.
- **Sin construcciones "no es X, es Y"** en el copy. Es maquinaria de persuasión y suele esconder un golpe a cómo trabajan otros.
- **Sin lenguaje de proceso en la superficie.** El método no se enumera: se ve en el trabajo publicado.
- **Sin menú móvil estándar** y sin CTAs agresivos.

**Responsive — formatos y foco:** se revisa a 393 px (teléfono), 768 px (tablet), 1440 px (portátil) y 1920 px (escritorio grande), en los dos temas y los dos idiomas. En teléfono desaparecen las sangrías porcentuales —a ese ancho robarían medida sin dar ritmo— y el ritmo lo dan la variación vertical y el tamaño tipográfico. La calidad estructural —semántica, teclado, foco visible, etiquetas reales, alternativos, contraste— no se posterga aunque el sistema visual sí se reinterprete.

---

## 8. Registro

| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-08-26 | Creación | Migración a la versión nueva de Midfield. El proyecto no tenía Principles: se construyó desde la plantilla, con el proyecto ya avanzado. |
