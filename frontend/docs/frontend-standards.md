# Frontend code standards

Estándares de código para `frontend/`. **Arquitectura: Screaming Architecture** (las carpetas gritan el dominio del producto, no la tecnología).

Complementa: `frontend/AGENTS.md` (Next + Astryx), `docs/design_guideline.md` (look), root `AGENTS.md`.

---

## 1. Principios

1. **Scream the domain** — al abrir `src/`, se debe entender *qué hace* el producto (`chat`, `projects`, `billing`), no solo ver `components/` / `hooks/` / `utils/`.
2. **App Router delgado** — `src/app/` solo rutas, layouts y wiring. Cero lógica de negocio en page files.
3. **Features dueñas de su UI** — pantallas, hooks y adaptadores de una capability viven juntos.
4. **Shared es el último recurso** — solo lo genuinamente transversal; si solo lo usa un feature, no va a `shared/`.
5. **Astryx first** — UI vía DS; ver design guideline y CLI Astryx.
6. **Server por defecto** — Client Components solo cuando hay estado, efectos o APIs del browser.

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
      ui/                   # componentes de pantalla del feature
      hooks/                # hooks del feature
      api/                  # fetch/adapters hacia backend (solo este feature)
      model/                # types, mappers, schemas del feature
      index.ts              # API pública del feature (re-exports controlados)
    projects/
      ui/
      hooks/
      api/
      model/
      index.ts
    …                       # una carpeta por capability

  shared/                   # transversal (mínimo)
    ui/                     # wrappers Astryx reutilizados por ≥2 features
    lib/                    # http client, env, formatters genéricos
    config/
    hooks/                  # hooks genuínamente globales

  entities/                 # opcional: tipos de dominio estables compartidos
    user/
    project/
```

### Qué va dónde

| Qué | Dónde |
|-----|--------|
| Ruta `/projects/[id]` | `app/.../page.tsx` importa desde `features/projects` |
| Lista de proyectos + empty state | `features/projects/ui/` |
| `useProjectsQuery` | `features/projects/hooks/` |
| `GET /projects` client/server helper | `features/projects/api/` |
| `Project`, DTOs, mappers | `features/projects/model/` o `entities/project/` |
| `Button` Astryx sin lógica | import directo `@astryxdesign/core/...` (no wrap inútil) |
| `HttpClient` / base URL | `shared/lib/` |

### Anti-estructura (evitar)

```text
src/
  components/     # cajón técnico
  hooks/
  services/
  utils/
  types/
```

Eso es *technical layering*. Migrar hacia `features/<capability>/…` a medida que crezca el código. El scaffold actual (`app/page.tsx` plano) es temporal: al agregar la segunda capability, introducir `features/`.

---

## 3. Reglas de dependencia

```text
app/  →  features/*  →  entities/*  →  shared/*
                 ↘_______________↗
```

- `features/A` **no** importa internals de `features/B` (solo `features/B` public API vía `index.ts` si es inevitable; preferir subir a `entities/` o `shared/`).
- `shared/` **nunca** importa `features/`.
- `app/` no contiene fetch ni reglas de negocio.

---

## 4. Next.js & React

- TypeScript `strict`; paths `@/*` → `src/*`.
- Preferir Server Components; `"use client"` en el borde más bajo posible.
- Data fetching en Server Components / Route Handlers cuando baste; client fetch solo para interactividad.
- No filtrar secrets al client; env públicos solo `NEXT_PUBLIC_*`.
- Links con el `Link` de Next vía `LinkProvider` (ya en `providers.tsx`).
- Consultar docs locales de Next (`node_modules/next/dist/docs/`) ante APIs nuevas.

---

## 5. UI (Astryx)

- Descubrir con `npx astryx build|component|docs` desde `frontend/`.
- Sin `<div>` de layout; tokens semánticos; frame-first (ver design guideline).
- Un feature no inventa su propio design system.

---

## 6. API hacia el backend

- Cada feature habla con el backend desde `features/<x>/api/` (funciones tipadas).
- Contratos alineados al backend (OpenAPI / rutas reales); no inventar shapes.
- Mapear DTO → model del feature en `model/`; la UI no conoce JSON crudo del wire si se puede evitar.
- Errores: tipar y superficiear de forma consistente (toast/banner del DS cuando exista patrón).

---

## 7. Código limpio (prácticas)

- Nombres que digan el dominio (`ProjectCanvas`, no `DataView2`).
- Funciones pequeñas; early return; evitar abstracciones prematuras.
- No `any`; preferir tipos del `model/` / `entities/`.
- Colocar tests junto al feature (`features/chat/ui/ChatStream.test.tsx`) cuando exista harness (Vitest/Playwright).
- ESLint (`npm run lint`) limpio en el cambio.
- Commits/PRs solo si el usuario lo pide (ver root `AGENTS.md`).

---

## 8. Checklist antes de merge (front)

- [ ] ¿La ruta en `app/` solo compone features?
- [ ] ¿El código nuevo vive bajo `features/<capability>/` (o `shared/` justificado)?
- [ ] ¿Cumple Astryx + design guideline?
- [ ] ¿Tipos de API sin inventar contratos?
- [ ] ¿Server vs Client justificado?
