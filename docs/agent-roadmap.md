# Roadmap: agente de generación (Astryx)

Pasos recomendados para continuar el producto tipo v0: el agente genera componentes (código TSX/Astryx).  
Decisión de stack: **runtime del agente en Node (Mastra o AI SDK)**; FastAPI queda para dominio de negocio más adelante, no para el loop de codegen.

## Principios

1. El artefacto es código UI (TSX + Astryx). El runtime del agente vive donde se puede validar ese código (`npx astryx`, `tsc`, lint).
2. No meter LangChain/LangGraph en FastAPI como primer paso.
3. Contrato de eventos y UX primero; framework después.
4. Un spike vertical feliz antes de persistencia, auth o multi-agent.

---

## Paso 0 — Cerrar el mock del builder (actual)

**Objetivo:** UI estable que defina qué se muestra en sesión.

**Hecho cuando:**
- Ruta `/chats/[chatId]` con chat, activity/tool rows (“Thinking”), preview vacío.
- Contrato visual claro: mensajes, tool calls, estados pending/running/complete.

**Notas:**
- No API real todavía.
- Este mock es el destino del stream futuro.

---

## Paso 1 — Spec del contrato del agent (sin framework)

**Objetivo:** documentar el contrato en OpenSpec (change tipo `generate-session` o similar) antes de elegir vendor.

**Incluir:**
- Input: `chatId`, prompt, (futuro) contexto de project files.
- Stream de eventos: `message` | `tool` | `file` | `preview` | `error`.
- Tools mínimas: `astryx.search`, `astryx.docs`, `write_file`, `typecheck`.
- Loop: generate → validate → repair (máx. 1–2 vueltas).
- Non-goals: auth, billing, RAG, multi-agent, DB seria.

**Hecho cuando:** proposal + design + tasks revisables; sin código de agent todavía (o solo stubs).

---

## Paso 2 — Spike vertical (1–2 días)

**Objetivo:** un prompt → un componente Astryx que compile → se ve en preview.

**Stack del spike:**
- Next.js (route handler / API) + **Mastra** (preferido) o Vercel AI SDK (más liviano).
- FastAPI **no participa**.

**Flujo:**
1. Usuario envía prompt desde el builder.
2. Agent llama tools (búsqueda/docs Astryx, write file).
3. Typecheck/lint; si falla, repair una vez.
4. Stream de mensajes + tool rows al chat.
5. Preview deja de ser placeholder y muestra el artefacto.

**Criterio de éxito:**
- Al menos un `.tsx` generado que compile.
- Preview no vacío.
- Tool activity visible en el chat (aunque sea rough).

**No hacer en el spike:**
- Persistencia real, auth, multi-file sofisticado, sandbox fuerte, Python agent.

---

## Paso 3 — Cablear stream real al builder

**Objetivo:** reemplazar mock estático de activity/mensajes por eventos del agent.

**Parcial (AST-5):** composer → `useChat` → `POST /api/agent/chat` (AI SDK UI Message Stream) muestra texto del assistant. Tools reales y preview siguen pendientes.

**Hecho cuando:**
- Composer dispara generate.
- Activity feed refleja tools reales.
- Preview se actualiza al cerrar un `file` / `preview` event.

---

## Paso 4 — Endurecer generación

**Objetivo:** de “demo” a “usable en iteraciones”.

- Multi-archivo y patches.
- Repair loop estable + límites de tokens/costo.
- Preview sandbox (iframe / isolation).
- Historial de sesión en memoria o storage simple.

---

## Paso 5 — Dominio de producto (opcional FastAPI)

**Objetivo:** cuentas, proyectos, billing, persistencia seria.

**Dónde:**
- FastAPI + Clean Architecture (`backend/docs/backend-standards.md`), **o**
- Persistencia desde Next si el equipo prefiere un solo runtime.

**Regla:** el loop LLM/codegen **no** se mueve a Python. FastAPI (si existe) expone proyectos/sesiones; el agent runtime sigue en Node.

---

## Orden de tickets (resumen)

| Orden | Qué | Dónde |
|------|-----|--------|
| 0 | Terminar mock builder | `features/builder` |
| 1 | Spec contrato generate-session | OpenSpec |
| 2 | Spike: generate 1 component | Next + Mastra (o AI SDK) |
| 3 | Stream real → chat + preview | front + agent runtime |
| 4 | Multi-file, repair, sandbox | agent runtime |
| 5 | Persistencia / auth / billing | FastAPI o Next |

---

## Decisiones explícitas

| Tema | Decisión |
|------|----------|
| Agent runtime | Node (Mastra preferido; AI SDK aceptable al inicio) |
| LangChain en Python | No para codegen Astryx |
| FastAPI hoy | Scaffold; no dueño del agent |
| Validación | En el mismo mundo que el artefacto (`astryx` + TypeScript) |

---

## Anti-patrones (evitar)

- Meter LangChain en `backend/` “porque ya hay FastAPI”.
- Diseñar CA completa del agent en Python antes del spike.
- RAG / vector DB / multi-agent antes de que un archivo compile.
- Generar UI sin pasar por catálogo/docs Astryx y typecheck.

---

## Siguiente acción inmediata

1. Cerrar Paso 0 (mock).
2. Abrir change OpenSpec del Paso 1 (`/opsx:propose` o equivalente).
3. Ejecutar spike del Paso 2 en una rama corta con criterio de éxito binario: **compila y se ve**.

Nota: [AST-4](https://linear.app/systhema/issue/AST-4/agente-con-mastra) aterriza el scaffold Mastra + prompts Nunjucks + fallback OpenAI→Anthropic **sin** codegen (`frontend/src/mastra/`, `POST /api/agent/chat`).
