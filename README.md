# North Studio — web oficial

Sitio del estudio: un recorrido continuo bilingüe (ES fuente de verdad, EN paralelo) con una ruta dedicada por proyecto publicado y un contacto que envía correo.

Next.js 16 · React 19 · TypeScript 6 · Tailwind CSS 4 · pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Antes de cerrar cualquier cambio: `pnpm typecheck`, `pnpm build`, `pnpm lint`.

El contacto necesita `.env.local` — copiar de `.env.example`. Sin esas variables el formulario funciona en desarrollo (escribe en el log) y avisa que no salió en producción.

---

## Dónde está cada cosa

| Necesitás… | Está en |
|---|---|
| Cómo se trabaja en este proyecto | `north-studio-principles.md` |
| Qué se decidió, qué falta, qué no romper | `project-journal.md` |
| Cómo funciona una parte del sistema | `docs/` |
| El criterio y la metodología del estudio | El Playbook, fuera del repositorio |

**Cada dato tiene una sola fuente.** Criterio general → Playbook. Interpretación y reglas de este proyecto → Principles. Estado y decisiones → journal. Cómo funciona → `docs/`. Implementación → código.

### `docs/`

| Archivo | Qué explica |
|---|---|
| `sistema-visual.md` | Registros tipográficos, tokens, color, espacio, motion, el cielo, accesibilidad |
| `recorrido.md` | Los cuatro momentos, la navegación, el menú móvil, las rutas |
| `contenido.md` | Esquema de proyecto, los seis bloques, i18n, cómo sumar un proyecto |
| `contacto.md` | El formulario, el envío, los correos, anti-spam, configuración |
| `marca.md` | Qué pieza de la firma va en cada lugar, y la foto de perfil |

`docs/` no se lee al empezar un chat: se consulta cuando la tarea lo necesita.

---

## Para retomar el trabajo

En un chat nuevo, en este orden y nada más por defecto:

1. `north-studio-principles.md`
2. `project-journal.md`
3. el archivo del bloque activo, si existe
4. los archivos que la tarea necesite

El Playbook no se relee salvo decisión metodológica. La excepción vigente: cualquier bloque que toque dirección de arte, sistema visual o el recorrido completo relee sus capítulos III y VII.

---

## Estructura

```
src/app/          rutas — (es) y (en) como route groups, cada uno con su root layout
src/components/   momentos/ · proyecto/ · brand/ · shell y nav
src/lib/          content/ · i18n/ · contacto/ · fonts, theme, motion, scroll, sitio
brand/            SVG canónicos de la firma + brand/perfil/ (redes)
scripts/          utilidades de estudio, fuera del bundle
docs/             conocimiento operativo
```
