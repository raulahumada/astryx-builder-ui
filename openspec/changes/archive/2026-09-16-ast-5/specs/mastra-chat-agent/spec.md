## MODIFIED Requirements

### Requirement: Smoke chat HTTP endpoint

The system SHALL expose `POST /api/agent/chat` as a Next.js App Router Route Handler that accepts a JSON body compatible with AI SDK chat transport (including a `messages` array of UI messages), invokes the Mastra `chat-agent` via `@mastra/ai-sdk` `handleChatStream`, and returns a `200` **UI Message Stream** response created with `createUIMessageStreamResponse` from the `ai` package. This contract is Next-only (not FastAPI). The previous AST-4 plain-text (`text/plain` token) contract is superseded.

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

- **WHEN** a client uses a method other than `POST` on `/api/agent/chat`
- **THEN** the response status MUST be `405`

## ADDED Requirements

### Requirement: AI SDK bridge packages

The frontend SHALL depend on `@mastra/ai-sdk`, `@ai-sdk/react`, and `ai`, and the chat Route Handler SHALL pass a `version` option to `handleChatStream` that matches the installed AI SDK major.

#### Scenario: Packages present

- **WHEN** an engineer inspects `frontend/package.json`
- **THEN** `@mastra/ai-sdk`, `@ai-sdk/react`, and `ai` MUST be listed as dependencies

#### Scenario: Version flag set

- **WHEN** `handleChatStream` is invoked from `POST /api/agent/chat`
- **THEN** a `version` argument MUST be supplied that matches the installed `ai` package major (verified at implementation time)
