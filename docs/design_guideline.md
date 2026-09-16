# Design guideline — Astryx (v0)

Guía visual y de producto para este monorepo. **No** es el `design.md` de OpenSpec (ese es diseño técnico por change).

**Dirección:** estética tipo [v0](https://v0.dev) (producto limpio, chrome mínimo, jerarquía clara) ejecutada con **Astryx** + theme **`neutral`**.

**Estado:** brand decisions confirmadas abajo. Lo demás es guía operativa.

---

## 1. Brand decisions

| Decisión | Valor | Notas |
|----------|-------|-------|
| Nombre de producto en UI | **Astryx** | Lockup final TBD si cambia el naming |
| Theme package | `@astryxdesign/theme-neutral` | Fijo |
| Modo por defecto | **`system`** (seguir OS) | Confirmado |
| Accent | **Azul Neutral** (`--color-accent`) | Confirmado — no CTA “Vercel black” |
| Tipo de pantallas | **C — espectro completo** (como [v0](https://v0.dev)) | Landing → app → tools → componentes sueltos |

Implementar siempre con Neutral + tokens; no hardcodear marca ni override de `--color-*` en `:root`.

### 1.1 Alcance (como v0)

Este producto **no** es solo un builder ni solo marketing. Igual que v0 (“build anything”: landings, dashboards, ecommerce, AI apps, full-stack, componentes), diseñamos **cualquier superficie** bajo el mismo sistema visual.

El look es uno (Neutral + reglas de esta guía). Lo que cambia es el **frame** según el job de la pantalla:

| Superficie | Job | Frame Astryx típico |
|------------|-----|---------------------|
| **Marketing / landing** | Convertir / explicar | Columna de contenido; hero full-bleed; poco chrome |
| **Documento / settings** | Leer / configurar | `Layout` + `contentWidth` capped |
| **App / dashboard** | Operar datos | `AppShell` + nav; tablas/listas fill |
| **Builder / tool** | Crear + preview | Multi-pane (`Layout` + panels); canvas fill |
| **Chat / agent** | Conversar + actuar | `ChatLayout` + `ChatComposer` |
| **Componente / bloque suelto** | Reutilizar en isolation | Sin shell de app; props + ejemplos; mismo theme |
| **Ecommerce / gallery** | Browse + select | Grid de media/cards **solo** donde el item es un producto/widget, no filas de datos |
| **Auth / empty / error** | Un mensaje + CTA | Layout mínimo capped; cero decoración |

**Regla de oro:** antes de diseñar, nombrar la superficie de la tabla. Luego `npx astryx build "<idea>"` para el kit/template más cercano. No mezclar frame de landing dentro de un tool ni chrome de AppShell en un hero de marketing.

---

## 2. North star (estilo v0 → Astryx)

| Principio v0 | Cómo se traduce aquí |
|--------------|----------------------|
| Una composición clara, no “dashboard de widgets” | Frame primero (`AppShell` / `Layout`); una job por región |
| Chrome mínimo | Nav fina; contenido manda; sin decoración inútil |
| Tipografía con jerarquía, no tamaño al azar | `Heading` + `Text` (body sin props; secondary para support) |
| Superficies quietas | `wash` / `surface`; elevation solo cuando hay stacking real |
| Un accent, no arcoíris | Accent del theme; status con `StatusDot` / `Token`, no Badge decorativo |
| Densidad productiva en tools | Listas/tablas edge-to-edge; cards solo para widgets sueltos |
| Preview / canvas / hero como ancla | Una ancla dominante por viewport; paneles con width budget |

### Anti-looks (evitar)

- Gradientes purple→indigo / glow / “AI purple”
- Cream + serif + terracotta genérico
- Broadsheet / newspaper denso
- Pills, stat strips y badge clusters en el hero
- Cards envolviendo cada fila o sección
- Hex / px sueltos en UI (salvo width estructurales de layout)

---

## 3. Stack visual (source of truth)

| Capa | Fuente |
|------|--------|
| Componentes | `@astryxdesign/core` — descubrir con `npx astryx …` |
| Theme | `@astryxdesign/theme-neutral` (+ CSS en `globals.css`) |
| Providers | `frontend/src/app/providers.tsx` (`Theme`, `LinkProvider`) |
| Tokens | `npx astryx docs tokens` |
| Layout | `npx astryx docs layout` |
| Principios DS | `npx astryx docs principles` |
| Agent rules | `AGENTS.md`, `frontend/AGENTS.md` |

**Regla:** componentes y props primero; si hace falta estilo custom → tokens `var(--color-*|--spacing-*|--radius-*)`. Sin Tailwind utility inventado ni CSS de layout ad-hoc.

---

## 4. Layout & composition

### Frame-first

1. **Nombrar la superficie** (§1.1) y recién ahí elegir shell:
   - Marketing → columna / hero; sin AppShell de producto
   - App / dashboard / builder → `AppShell` + nav; multi-pane con `Layout` + `LayoutPanel` si hace falta
   - Documento / settings → `Layout` + `contentWidth` capped (640 / 960)
   - Chat / agent → `ChatLayout` + `ChatComposer`
   - Componente suelto → sin shell; solo Theme
2. Presupuestar anchos de regiones (px estructurales OK): SideNav ~240–280, panel ~340–420, icon rail ~64–72.
3. Fill vs capped: tablas/canvas/preview **fill**; prose/forms/marketing copy **capped** o full-bleed hero según superficie.
4. Empezar con `npx astryx build "<idea>"` y `npx astryx template <name>`.

### Densidad

| Contexto | Contenedor |
|----------|------------|
| Datos densos (issues, files, props) | `Table` / `List`+`Item`, filas con divider, sin Card |
| Widget suelto / settings group | `Card` OK |
| Status | `StatusDot` o `Token` |
| Conteos | `Badge` solo para counts |

### Espaciado

- Una línea de contenido por región; gaps del scale de spacing.
- No inventar `padding: 24` / `gap: 16` en raw elements — usar componentes o tokens.

---

## 5. Tipografía & color

### Tipo

- Body: `<Text>` sin props.
- Lead: `<Heading level={…}>` acorde a profundidad de página.
- Support / meta: `color` secondary (o Token), no “más chico” por defecto.
- No traer Inter/Geist/Arial a mano si el theme ya define familias; si se customiza tipografía, va en el **theme**, no en la página.

### Color

- Texto: primary / secondary solamente en UI normal.
- Fondos: `body` vs `surface` / `card` según elevación semántica.
- Accent: solo CTAs primarios, links enfatizados, focus — no teñir secciones enteras.
- Modo claro/oscuro: vía `<Theme mode="system|light|dark">`; el código no elige hex por modo.

---

## 6. Patrones por superficie (espectro v0)

Mismo theme y tipografía en todas. Cambiá **frame y densidad**, no la marca.

### Marketing / landing

- Brand como señal hero-level (no solo texto de nav).
- Primer viewport: brand + un headline + una frase + un grupo de CTA + un plano visual dominante (full-bleed).
- Sin stats, schedules, chips flotantes ni overlays sobre el hero.
- Secciones siguientes: **una job** cada una (un headline + una frase).
- Cards: evitar en hero; OK solo si son el control de interacción.

### Documento / settings

- `Layout` con `contentWidth` capped (640 prose / 960 mixed).
- Forms controlados; FieldStatus del DS.
- Grupos de settings pueden ir en Card; listas densas no.

### App / dashboard

- `AppShell` + SideNav y/o TopNav según profundidad de nav (`astryx docs layout`).
- Datos densos = `Table` / `List`+`Item`, edge-to-edge.
- KPI/widgets sueltos = Card OK; no cardificar cada fila.

### Builder / tool

```text
┌─ AppShell ─────────────────────────────────────────┐
│ TopNav (contexto, acciones globales)               │
├──────────┬────────────────────────────┬────────────┤
│ SideNav  │  Canvas / preview (fill)   │ Detail     │
│ o rail   │  o editor                  │ panel      │
├──────────┴────────────────────────────┴────────────┤
│ Composer / toolbar (si aplica)                     │
└────────────────────────────────────────────────────┘
```

- Una ancla visual dominante (preview/canvas).
- Un primary CTA claro; resto secondary/ghost.

### Chat / agent

- `ChatLayout` + `ChatComposer` (y slots del DS).
- Stream fill; composer docked; density según ancho (el DS ya adapta).
- Tokens/chips de contexto vía componentes Chat — no pills inventadas.

### Componente o bloque suelto

- Sin AppShell de producto a menos que el story sea “en contexto de app”.
- Documentar props con `npx astryx component <Name>`; ejemplos con el mismo Theme provider.
- Swizzle solo si el DS no alcanza (`astryx swizzle`).

### Ecommerce / gallery / media

- Grid de ítems donde cada ítem es seleccionable (Card/media OK).
- Filtros en rail/panel budgeted, no como cards sueltas en el contenido.
- Dense catalogs can mix TopNav + grid (ver templates Astryx).

### Auth / empty / error

- Mensaje corto + un CTA.
- Sin ilustraciones decorativas salvo assets del DS (`astryx docs illustrations` / icons).

### Formularios (todas las superficies)

- Inputs controlados (`value` + `onChange`).
- Errores con tokens de error; no color inventado.

### Navegación (todas las superficies)

- Links vía `LinkProvider` / Astryx — no `<a>` crudos.
- Next `Link` ya está en `providers.tsx`.

---

## 7. Motion

- Poco y con propósito: entrada de panel, feedback de submit, scroll en chat.
- Preferir motion del DS / tokens si existen (`astryx docs motion`).
- Respetar `prefers-reduced-motion`.
- Evitar parallax, glow pulses y confetti.

---

## 8. Responsive

- El shell (AppShell) maneja mobile nav — no reinventar hamburguesas.
- Paneles: colapsar o apilar según docs de layout; no esconder acciones primarias solo en hover.
- Touch: targets del DS; no achicar botones por debajo del mínimo del componente.

---

## 9. Do / Don't (checklist rápido)

**Do**

- `npx astryx build|template|component|docs` antes de inventar UI
- Frame → estructura → spacing → breakpoints
- Tokens semánticos
- Self-check: cero `<div>` de layout, cero hex/px de estilo, cero Card-en-lista

**Don't**

- Copiar markup de shadcn/v0 HTML a pelo — mapear a Astryx
- Override `--color-*` en `:root`
- Mezclar themes en la misma vista sin un `<Theme>` anidado consciente
- Documentar “diseño” solo en un ticket sin actualizar esta guía cuando cambie el look del producto

---

## 10. Cómo evoluciona esta guía

1. Cambios de look **globales** → PR que actualiza este archivo + theme si aplica.
2. Cambios de una feature → OpenSpec `design.md` del change (técnico) + cumplir esta guía.
3. Stories Front/UI (`/enrich-us`) deben citar secciones de este doc + componentes Astryx concretos.

### Comandos útiles

```bash
cd frontend
npx astryx build "<idea>"
npx astryx docs layout
npx astryx docs tokens
npx astryx docs principles
npx astryx docs motion
npx astryx theme list
```
