# Backend code standards

Estándares de código para `backend/`. **Arquitectura: Clean Architecture** (regla de dependencia hacia el dominio).

Complementa: root `AGENTS.md`, contratos HTTP (FastAPI OpenAPI y/o `backend/docs/api/` cuando existan).

---

## 1. Principios

1. **Dependency rule** — el dominio no conoce FastAPI, DB ni HTTP. Las dependencias apuntan **hacia adentro**.
2. **Use cases explícitos** — cada acción de negocio es un caso de uso (application), no lógica en el router.
3. **Puertos y adaptadores** — el dominio/application definen interfaces (ports); infrastructure las implementa.
4. **Composition root** — `main.py` (y wiring) ensamblan dependencias; no hay singletons escondidos en el dominio.
5. **Contratos claros** — request/response tipados (Pydantic); OpenAPI es parte del producto.
6. **Fallar barato** — validación en el borde; errores de dominio mapeados a HTTP de forma centralizada.

---

## 2. Estructura objetivo (Clean Architecture)

```text
backend/
  app/
    main.py                 # composition root: FastAPI app, middleware, router include
    dependencies.py         # DI de FastAPI (Depends) — wiring

    domain/                 # capa más interna
      models/               # entities / value objects (sin Pydantic de API si se puede)
      errors.py             # errores de dominio
      ports/                # Protocol / ABC: repositorios, gateways

    application/            # casos de uso
      <capability>/
        create_x.py         # un use case por archivo (o módulo cohesivo)
        dto.py              # input/output internos del use case (opcional)
      …

    presentation/           # borde HTTP
      api/
        router.py           # APIRouter aggregate
        <capability>/
          routes.py         # endpoints delgados
          schemas.py        # Pydantic request/response (HTTP DTOs)
      http_errors.py        # map domain errors → status codes

    infrastructure/         # detalles
      db/                   # sesión, repos SQLAlchemy/etc.
      external/             # clientes HTTP, storage, colas
      config.py             # settings (pydantic-settings)
```

Hoy el repo es mínimo (`app/main.py` con health). Al agregar el **primer** endpoint de negocio, introducir estas capas; no crecer el `main.py` como god-file.

### Flujo de una request

```text
HTTP → presentation (schema + route)
     → application (use case)
     → domain (rules) + ports
     ← infrastructure (adapters)
     ← presentation (HTTP response)
```

---

## 3. Reglas de dependencia

| Capa | Puede importar |
|------|----------------|
| `domain` | solo stdlib / tipos puros (sin FastAPI, sin SQLAlchemy) |
| `application` | `domain` |
| `presentation` | `application`, `domain` (errores), schemas propios |
| `infrastructure` | `domain` (ports + models), libs externas |
| `main` / `dependencies` | todas (wiring) |

**Prohibido:** routers con SQL; entities con `BaseModel` de response HTTP; use cases que importen `fastapi`.

---

## 4. FastAPI & HTTP

- Routers por capability: `presentation/api/<capability>/routes.py`.
- Endpoints **delgados**: parse → llamar use case → mapear resultado/error.
- Status codes explícitos; 2xx/4xx/5xx coherentes; no devolver stack traces al client.
- CORS: orígenes explícitos (hoy `http://localhost:3000`); no `*` con credentials en prod.
- Versionado: cuando haya breaking changes, prefijo `/api/v1` (acordar en OpenSpec).
- Documentar en OpenAPI (docstrings + `response_model` + `responses`).
- Si existe `backend/docs/api/api-<module>.md`, mantenerlo alineado al código (source of truth del contrato para el front).

### Convenciones de rutas

| Recurso | Ejemplo |
|---------|---------|
| Health | `GET /health` |
| Colección | `GET/POST /api/v1/projects` |
| Ítem | `GET/PATCH/DELETE /api/v1/projects/{id}` |

---

## 5. Domain & application

- Entities con invariantes; métodos de dominio > setters anémicos.
- Use cases: un verbo de negocio (`CreateProject`, `GeneratePreview`).
- Inputs/outputs del use case tipados; no pasar `Request` de FastAPI al application.
- Ports (`Protocol`) para persistencia y servicios externos; fake in-memory en tests.

---

## 6. Infrastructure

- Settings vía env (`pydantic-settings` cuando se agregue); nunca secrets en código.
- Repos implementan ports; transacciones en el borde del use case / unit of work.
- I/O async cuando el stack lo justifique; no bloquear el event loop.
- Logs estructurados (request id cuando exista); sin PII de más.

---

## 7. Código limpio (prácticas)

- Type hints en firmas públicas; Ruff/mypy cuando se configure el toolchain.
- Nombres de dominio (`ProjectRepository`, no `Manager2`).
- Sin lógica de negocio en `if` del router.
- Tests:
  - domain/application: unitarios rápidos (sin HTTP)
  - presentation: TestClient de FastAPI
  - infrastructure: tests de integración opcionales
- Dependencias en `requirements.txt` (o lock futuro); pins conscientes.
- No commitear `.venv/`, `.env`, secretos.

---

## 8. Checklist antes de merge (back)

- [ ] ¿El router solo adapta HTTP ↔ use case?
- [ ] ¿El dominio/application libres de FastAPI/DB?
- [ ] ¿Errores de dominio mapeados de forma central?
- [ ] ¿OpenAPI / `api-*.md` actualizados si cambió el contrato?
- [ ] ¿CORS y auth pensados para el entorno (dev vs prod)?
- [ ] ¿Tests del use case o del endpoint para el camino feliz + 1 error?

---

## 9. Migración desde el scaffold actual

Estado actual: `app/main.py` con `/` y `/health` (aceptable como bootstrap).

Próximos pasos al primer feature:

1. Crear `domain/`, `application/`, `presentation/`, `infrastructure/`.
2. Mover health a `presentation/api/health/routes.py` (opcional pero consistente).
3. Primer use case real bajo `application/<capability>/`.
4. Registrar router en `main.py`.
5. Documentar contrato en OpenAPI (+ `docs/api/` si el equipo lo usa).
