# Frontend code standards

Estándares de código para `frontend/`. **Arquitectura: Screaming Architecture** (las carpetas gritan el dominio del producto, no la tecnología).

Complementa: `frontend/AGENTS.md` (Next + Astryx), `docs/design_guideline.md` (look), root `AGENTS.md`.

---

## 1. Principios

1. **Scream the domain** — al abrir `src/`, se debe entender *qué hace* el producto (`chat`, `projects`, `billing`), no solo ver `components/` / `hooks/` / `utils/`.
2. **App Router delgado** — `src/app/` solo rutas, layouts y wiring. Cero lógica de negocio en page files.
3. **Features dueñas de su UI** — pantallas, hooks y adaptadores de una capability viven juntos.
4. **Types y lógica desacoplados** — types en `model/` (archivos aparte); funciones reutilizables en `lib/` / `model/` / `api/`, no embebidas en JSX.
5. **Shared es el último recurso** — solo lo genuinamente transversal; si solo lo usa un feature, no va a `shared/`.
6. **Astryx first** — UI vía DS; ver design guideline y CLI Astryx.
7. **Server por defecto** — Client Components solo cuando hay estado, efectos o APIs del browser.

---

## 2. Estructura objetivo (Screaming Architecture)

```text
frontend/src/
  app/                      # Next.js App Router (thin)
    (marketing)/            # route groups por superficie si aplica
    (app)/
    api/                    # Route Handlers solo si hacen falta
    layout.tsx
    providers.tsx
    globals.css

  features/                 # ← aquí “grita” el producto
    chat/
      ui/                   # componentes de pantalla (solo presentación)
      hooks/                # hooks del feature
      api/                  # fetch/adapters hacia backend (solo este feature)
      model/                # tipos + datos de dominio del feature (archivos separados)
        types.ts            # o types/<name>.ts — types/interfaces/unions
        mappers.ts          # DTO ↔ model (si aplica)
        constants.ts        # copy/opciones estáticas del feature (si aplica)
      lib/                  # funciones puras/reutilizables del feature (si aplica)
      index.ts              # API pública del feature (re-exports controlados)
    projects/
      ui/
      hooks/
      api/
      model/
      lib/
      index.ts
    …                       # una carpeta por capability

  shared/                   # transversal (mínimo)
    ui/                     # wrappers Astryx reutilizados por ≥2 features
    lib/                    # funciones/helpers genuínamente transversales
    config/
    hooks/                  # hooks genuínamente globales

  entities/                 # opcional: tipos de dominio estables compartidos
    user/
      types.ts
    project/
      types.ts
```

### Qué va dónde

| Qué | Dónde |
|-----|--------|
| Ruta `/projects/[id]` | `app/.../page.tsx` importa desde `features/projects` |
| Lista de proyectos + empty state | `features/projects/ui/` |
| `useProjectsQuery` | `features/projects/hooks/` |
| `GET /projects` client/server helper | `features/projects/api/` |
| Types/`Project`/DTOs | `features/projects/model/types.ts` (o `entities/project/types.ts` si ≥2 features) |
| Mappers DTO → model | `features/projects/model/mappers.ts` |
| Helpers puros del feature (`formatProjectTitle`, …) | `features/projects/lib/` |
| Helpers transversales (`parseQueryParam`, http base) | `shared/lib/` |
| `Button` Astryx sin lógica | import directo `@astryxdesign/core/...` (no wrap inútil) |

### Anti-estructura (evitar)

```text
src/
  components/     # cajón técnico
  hooks/
  services/
  utils/
  types/          # cajón global de types — usar model/ o entities/
```

Eso es *technical layering*. Migrar hacia `features/<capability>/…` a medida que crezca el código.

---

## 3. Types en archivos aparte

Los **types viven fuera de la UI**. No declarar `type` / `interface` de dominio (ni props compartidas no triviales) dentro de `.tsx` de pantalla salvo props locales de un solo componente (p. ej. `type Props = { … }` privado al archivo).

| Caso | Dónde |
|------|--------|
| Types del feature (mensajes, sesión, opciones, eventos de timeline, …) | `features/<x>/model/types.ts` o `features/<x>/model/types/<name>.ts` |
| Constantes tipadas / mocks estáticos | `features/<x>/model/` (p. ej. `constants.ts`, `mock-session.ts`) — importan types desde `types.ts` |
| Types de dominio usados por ≥2 features | `entities/<name>/types.ts` |
| Types solo del wire/API | junto al adapter en `features/<x>/api/` **o** en `model/types.ts` si el feature los reexpone |

Reglas:

1. Un archivo de types **no** mezcla JSX ni hooks.
2. Nombrar archivos por dominio (`types.ts`, `types/session.ts`), no `interfaces.ts` genérico en la raíz de `src/`.
3. Re-exportar desde `features/<x>/index.ts` solo lo que otros módulos deban consumir.
4. La UI importa types desde `../model/...` (o `@/features/<x>` vía public API); no redefine shapes inline.

---

## 4. Funciones desacopladas y reutilizables

Extraer lógica reusable a **funciones puras** (o módulos sin JSX) en lugar de dejarla embebida en componentes.

| Caso | Dónde |
|------|--------|
| Helper solo de un feature (`projectTitleFromPrompt`, `newChatId`, formatters) | `features/<x>/lib/<name>.ts` |
| Mapper / normalizer de datos | `features/<x>/model/mappers.ts` |
| Adapter HTTP | `features/<x>/api/<name>.ts` |
| Usado por ≥2 features | `shared/lib/<name>.ts` (o `entities/` si es dominio) |

Reglas:

1. Si una función no necesita React (sin hooks, sin JSX), **no** vive en `ui/`.
2. Preferir firma explícita y tipada (`(prompt: string) => string`) importable desde tests y otros módulos.
3. No crear `shared/lib` “por si acaso”: subir solo cuando un segundo feature lo necesite (o quede claro de antemano).
4. Handlers de UI (`onClick` locales, estado) pueden quedar en el componente; la **regla de negocio / transformación** que puedan reutilizar otros, afuera.
5. Evitar god-files: un módulo `lib/` o `model/` enfocado, no un `utils.ts` cajón.

---

## 5. Reglas de dependencia

```text
app/  →  features/*  →  entities/*  →  shared/*
                 ↘_______________↗
```

- `features/A` **no** importa internals de `features/B` (solo `features/B` public API vía `index.ts` si es inevitable; preferir subir a `entities/` o `shared/`).
- `shared/` **nunca** importa `features/`.
- `app/` no contiene fetch ni reglas de negocio.
- `ui/` puede importar `model/`, `lib/`, `hooks/`, `api/`; **no** al revés (lib/model no importan componentes de `ui/`).

---

## 6. Next.js & React

- TypeScript `strict`; paths `@/*` → `src/*`.
- Preferir Server Components; `"use client"` en el borde más bajo posible.
- Data fetching en Server Components / Route Handlers cuando baste; client fetch solo para interactividad.
- No filtrar secrets al client; env públicos solo `NEXT_PUBLIC_*`.
- Links con el `Link` de Next vía `LinkProvider` (ya en `providers.tsx`).
- Consultar docs locales de Next (`node_modules/next/dist/docs/`) ante APIs nuevas.

---

## 7. UI (Astryx)

- Descubrir con `npx astryx build|component|docs` desde `frontend/`.
- Sin `<div>` de layout; tokens semánticos; frame-first (ver design guideline).
- Un feature no inventa su propio design system.

---

## 8. API hacia el backend

- Cada feature habla con el backend desde `features/<x>/api/` (funciones tipadas).
- Contratos alineados al backend (OpenAPI / rutas reales); no inventar shapes.
- Mapear DTO → model del feature en `model/mappers.ts`; types del wire/model en `model/types.ts`; la UI no conoce JSON crudo del wire si se puede evitar.
- Errores: tipar y superficiear de forma consistente (toast/banner del DS cuando exista patrón).

---

## 9. Código limpio (prácticas)

- Nombres que digan el dominio (`ProjectCanvas`, no `DataView2`).
- Funciones pequeñas; early return; evitar abstracciones prematuras.
- No `any`; preferir types de `model/` / `entities/` (archivos aparte).
- Colocar tests junto al feature (`features/chat/lib/formatTitle.test.ts`, `ui/….test.tsx`).
- E2E de flujos/rutas en `frontend/e2e/<feature>.spec.ts` (Playwright).
- Comandos (desde `frontend/`):
  - `npm test` — Vitest (unit/component)
  - `npm run test:watch` — Vitest watch
  - `npm run test:e2e` — Playwright
  - `npm run test:e2e:ui` — Playwright UI mode
- Preferir tests de `lib/` / `model/` para lógica pura; Playwright para rutas y flujos. RTL (`*.test.tsx`) cuando la UI del feature tenga lógica propia (no para re-testear el Design System).
- ESLint (`npm run lint`) limpio en el cambio.
- Commits/PRs solo si el usuario lo pide (ver root `AGENTS.md`).

---

## 10. Checklist antes de merge (front)

- [ ] ¿La ruta en `app/` solo compone features?
- [ ] ¿El código nuevo vive bajo `features/<capability>/` (o `shared/` / `entities/` justificado)?
- [ ] ¿Los types de dominio están en `model/types*` (o `entities/`), no embebidos en UI?
- [ ] ¿Las funciones reutilizables están en `lib/` / `model/` / `api/`, desacopladas de JSX?
- [ ] ¿Cumple Astryx + design guideline?
- [ ] ¿Tipos de API sin inventar contratos?
- [ ] ¿Server vs Client justificado?
- [ ] ¿Hay Vitest y/o Playwright para el comportamiento nuevo/cambiado (`npm test`, `npm run test:e2e` si aplica)?
