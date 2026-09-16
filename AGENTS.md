# Astryx (v0)

Monorepo de un UI builder: frontend Next.js + Astryx Design System, backend FastAPI.

## Estructura

```
frontend/     Next.js 16 (App Router) + React 19 + Astryx 0.6.2
backend/      FastAPI (CORS → http://localhost:3000)
openspec/     Spec-Driven Development (cambios, specs, archive)
.cursor/      Skills y comandos OpenSpec (/opsx:*)
```

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js `16.3.5`, React `19.2.8`, TypeScript |
| UI | `@astryxdesign/core` + `@astryxdesign/theme-neutral` (`^0.6.2`) |
| CLI UI | `@astryxdesign/cli` — siempre `npx astryx <cmd>` desde `frontend/` |
| Backend | FastAPI `0.141.1` (`fastapi[standard]`), uvicorn |
| Specs | OpenSpec (`openspec/`, schema `spec-driven`) |

## Cómo correr

**Frontend** (desde `frontend/`):

```bash
npm run dev          # http://localhost:3000
npm run build
npm run lint
```

**Backend** (desde `backend/`):

```bash
# activar .venv si aplica
uvicorn app.main:app --reload --port 8000
```

- Health: `GET /health` → `{ "status": "ok" }`
- Root: `GET /` → mensaje de estado

## Diseño visual

Guía de producto (estilo v0 adaptado a Astryx): [`docs/design_guideline.md`](docs/design_guideline.md).  
Obligatoria en stories Front/UI y antes de inventar layout o look. No confundir con el `design.md` técnico de OpenSpec.

## Estándares de código

| Lado | Arquitectura | Doc |
|------|--------------|-----|
| Frontend | Screaming Architecture | [`frontend/docs/frontend-standards.md`](frontend/docs/frontend-standards.md) |
| Backend | Clean Architecture | [`backend/docs/backend-standards.md`](backend/docs/backend-standards.md) |

`/enrich-us` debe citar paths concretos según estos docs (`features/<capability>/…`, capas CA).

## Frontend — reglas obligatorias

Antes de tocar UI, lee `frontend/AGENTS.md`, `frontend/docs/frontend-standards.md` y `docs/design_guideline.md`. Resumen:

1. **Descubrir, no adivinar**: `npx astryx build "<idea>"` → `template` → `component <Name>`.
2. **Frame primero**: `npx astryx docs layout` antes de páginas/pantallas.
3. **Sin `<div>` de layout**: layout/spacing vía componentes Astryx; page frame incluido.
4. **Estilos**: props del componente primero; si no, `style`/`className` con tokens `var(--color-*|--spacing-*|--radius-*)`. Sin hex/px crudos. Sin Tailwind/utility classes de Astryx.
5. **Tema**: brand/accent en el theme (`npx astryx theme …`), no override de `--color-*` en `:root`.
6. **Datos densos**: Table/List/Item, no Cards como filas de lista.
7. **CSS base** (ya en `frontend/src/app/globals.css`):
   - `@astryxdesign/core/reset.css`
   - `@astryxdesign/core/astryx.css`
   - `@astryxdesign/theme-neutral/theme.css`
8. **Providers**: `Theme` + `LinkProvider` en `frontend/src/app/providers.tsx`.
9. **Next.js**: esta versión puede diferir del entrenamiento — consultar docs en `frontend/node_modules/next/dist/docs/` antes de APIs nuevas.

CLI útil (desde `frontend/`):

```bash
npx astryx build "<idea>"
npx astryx component <Name>
npx astryx component --list
npx astryx template --list
npx astryx search "<query>"
npx astryx docs <topic>    # layout, tokens, theme, styling, …
npx astryx upgrade --apply # tras bump de Astryx
```

## Backend — convenciones

- Estándares: [`backend/docs/backend-standards.md`](backend/docs/backend-standards.md) (Clean Architecture).
- App: `backend/app/` — composition root en `main.py`; crecer por capas, no god-file.
- CORS permitido solo para `http://localhost:3000` por ahora.
- Dependencias: `backend/requirements.txt`.
- No commitear `.venv/`, `.env`, ni secretos.

## OpenSpec / flujo de cambios

Usar skills/comandos en `.cursor/`:

| Comando / skill | Uso |
|-----------------|-----|
| `/enrich-us` | Enriquecer user story / ticket Linear (`AST-*`) con detalle técnico listo para implementar |
| `/opsx:explore` | Explorar idea antes de comprometerse |
| `/opsx:propose` | Crear change + proposal/design/tasks |
| `/opsx:apply` | Implementar tasks del change |
| `/opsx:sync` | Sync delta specs → main specs |
| `/opsx:archive` | Archivar change completado |

Linear: workspace [Systhema](https://linear.app/systhema), keys `AST-*` (ej. [AST-1](https://linear.app/systhema/issue/AST-1/a)). Skill: `.cursor/skills/enrich-us/SKILL.md`.

Artefactos viven en `openspec/changes/` y specs en `openspec/specs/`. El nombre de carpeta del change es el id Linear en minúsculas (`AST-1` → `openspec/changes/ast-1/`). Context del proyecto: `openspec/config.yaml` (inyecta design guideline + estándares front/back en `/opsx:propose` y artifacts).

## Principios para el agente

- Cambios mínimos y enfocados al pedido; no refactors ni docs no pedidos.
- UI: seguir Astryx CLI, `frontend/AGENTS.md` y `frontend/docs/frontend-standards.md`; no inventar componentes ni CSS.
- Backend: Clean Architecture (`backend/docs/backend-standards.md`); endpoints delgados; CORS alineado con el front de dev.
- No inventar APIs, rutas ni dependencias que no existan en el repo.
- Commits / PRs solo si el usuario lo pide explícitamente.
