## ADDED Requirements

### Requirement: Postgres-backed Memory on chat-agent

The `chat-agent` SHALL be configured with Mastra `Memory` using PostgreSQL storage (`@mastra/pg` PostgresStore or equivalent package export) driven by `DATABASE_URL`, with working memory enabled via a project-oriented English template and a moderate `lastMessages` window (default 20 unless design documents a different tuned value). Semantic recall and Observational Memory MUST NOT be enabled in this change.

#### Scenario: Agent has Memory configured

- **WHEN** the Mastra composition root loads `chat-agent`
- **THEN** the agent MUST expose Memory configuration that uses Postgres storage and MUST include working memory enabled plus a finite `lastMessages` count

#### Scenario: Deferred memory features stay off

- **WHEN** an engineer inspects the chat Memory options shipped in this change
- **THEN** semantic recall / vector store wiring and Observational Memory MUST be absent or explicitly disabled

#### Scenario: DATABASE_URL is documented

- **WHEN** an engineer opens `frontend/.env.example`
- **THEN** it MUST list `DATABASE_URL` without a real secret value (alongside existing provider key placeholders)

### Requirement: Chat stream supplies stable memory thread and resource

`POST /api/agent/chat` SHALL pass Mastra memory identifiers into `handleChatStream` as `params.memory` with `thread` and `resource`. The `thread` MUST come from the request (body `thread` or nested `memory.thread`). The `resource` MUST be a stable non-empty string (request override allowed; otherwise the documented default placeholder such as `anon`).

#### Scenario: Successful stream with memory ids

- **WHEN** a client `POST`s usable `messages` plus a non-empty `thread`
- **THEN** the handler MUST invoke `handleChatStream` with `params.memory.thread` equal to that thread and a non-empty `params.memory.resource`, and MUST return a `200` UI Message Stream when generation succeeds

#### Scenario: Missing thread rejected

- **WHEN** a client `POST`s usable `messages` without a resolvable non-empty thread
- **THEN** the response status MUST be `400` and the body MUST include an `error` string

#### Scenario: Storage or connection failure does not leak secrets

- **WHEN** Memory storage fails (for example missing `DATABASE_URL` or Postgres unreachable)
- **THEN** the client-visible error MUST NOT include connection strings, passwords, or API keys

### Requirement: Chat history hydrate via GET

The system SHALL expose a `GET` on `/api/agent/chat` that recalls messages for a thread/resource and returns AI SDK UI messages as JSON for builder hydration. Empty history MUST return success with an empty list.

#### Scenario: Hydrate existing thread

- **WHEN** a client `GET`s `/api/agent/chat` with a non-empty `thread` query (and optional `resource`, defaulting to the documented placeholder)
- **THEN** the response status MUST be `200` and the body MUST include the recalled messages in AI SDK UI message form (empty array when none exist)

#### Scenario: Hydrate rejects missing thread

- **WHEN** a client `GET`s `/api/agent/chat` without a non-empty `thread`
- **THEN** the response status MUST be `400` and the body MUST include an `error` string

## MODIFIED Requirements

### Requirement: Smoke chat HTTP endpoint

The system SHALL expose `POST /api/agent/chat` as a Next.js App Router Route Handler that accepts a JSON body compatible with AI SDK chat transport (including a `messages` array of UI messages), invokes the Mastra `chat-agent` via `@mastra/ai-sdk` `handleChatStream`, and returns a `200` **UI Message Stream** response created with `createUIMessageStreamResponse` from the `ai` package. This contract is Next-only (not FastAPI). The previous AST-4 plain-text (`text/plain` token) contract is superseded. The same path SHALL also support `GET` for history hydrate as specified in **Chat history hydrate via GET**.

#### Scenario: Successful UI message stream

- **WHEN** a client `POST`s a body with at least one valid user message in `messages` and provider keys are configured
- **THEN** the response status MUST be `200` and the body MUST be an AI SDK UI Message Stream (not a `text/plain` concatenation of tokens and not a single JSON `{ text }` envelope)

#### Scenario: Invalid body

- **WHEN** a client `POST`s without a usable `messages` payload (missing, empty, or no user text to send)
- **THEN** the response status MUST be `400` and the body MUST include an `error` string

#### Scenario: Provider failure

- **WHEN** generation fails after exhausting the configured model fallback chain (or required keys are missing)
- **THEN** the response status MUST be `500` with a generic `error` string that MUST NOT include API keys or raw provider secret material (or the stream MUST fail closed without leaking secrets)

#### Scenario: Method not allowed

- **WHEN** a client uses a method other than `POST` or `GET` on `/api/agent/chat`
- **THEN** the response status MUST be `405`
