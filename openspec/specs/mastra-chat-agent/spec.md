## Purpose

Node/Mastra chat agent runtime in the Next.js app: versionable Nunjucks system prompts, OpenAI→Anthropic model fallback, and a streaming chat endpoint via AI SDK UI Message Stream (`handleChatStream`). Introduced by Linear AST-4; HTTP contract updated by AST-5. No UI codegen tools.

## Requirements

### Requirement: Versionable Nunjucks system prompts

The system SHALL render agent system instructions from versioned Nunjucks (`.njk`) template files under `frontend/src/mastra/prompts/`, with typed variables and failure when a required variable is undefined (`throwOnUndefined`).

#### Scenario: Render chat system prompt with vars

- **WHEN** `render` is called for the pinned chat system template (e.g. `chat/v1.system`) with required variables such as `productName`
- **THEN** the returned string MUST include the interpolated values and MUST NOT contain unresolved Nunjucks placeholders for those variables

#### Scenario: Missing variable fails

- **WHEN** `render` is called without a variable referenced by the template
- **THEN** the render step MUST throw (or otherwise fail) so the caller can return a client error instead of calling the LLM with a broken prompt

#### Scenario: Template lives in Git as a versioned file

- **WHEN** an engineer inspects `frontend/src/mastra/prompts/chat/`
- **THEN** there MUST be at least one `v1.system.njk` (or equivalently named) file that is the source of truth for the chat agent system prompt

### Requirement: Tool-less Mastra chat agent

The system SHALL register a Mastra agent (id `chat-agent`) with no tools, whose instructions come from the Nunjucks chat system template, and whose prompt copy forbids emitting UI component code / TSX / codegen.

#### Scenario: Agent is registered

- **WHEN** the Mastra composition root loads
- **THEN** `chat-agent` MUST be available via the Mastra instance (e.g. `mastra.getAgent('chat-agent')`)

#### Scenario: Agent has no tools

- **WHEN** the chat agent is configured
- **THEN** it MUST NOT register codegen or Astryx file/search tools in this change

### Requirement: OpenAI primary with Anthropic fallback

The chat agent SHALL use Mastra model fallbacks with OpenAI as the primary model and Anthropic as the first fallback, reading API keys from environment variables (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`).

#### Scenario: Default model chain configured

- **WHEN** the agent model configuration is loaded
- **THEN** the primary model MUST be an OpenAI model string (default `openai/gpt-4o-mini` unless overridden by env) and the next entry MUST be an Anthropic model string (default `anthropic/claude-haiku-4-5-20251001` unless overridden)

#### Scenario: Provider keys are documented

- **WHEN** an engineer opens `frontend/.env.example`
- **THEN** it MUST list `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` (without real secret values)

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

### Requirement: AI SDK bridge packages

The frontend SHALL depend on `@mastra/ai-sdk`, `@ai-sdk/react`, and `ai`, and the chat Route Handler SHALL pass a `version` option to `handleChatStream` that matches the installed AI SDK major.

#### Scenario: Packages present

- **WHEN** an engineer inspects `frontend/package.json`
- **THEN** `@mastra/ai-sdk`, `@ai-sdk/react`, and `ai` MUST be listed as dependencies

#### Scenario: Version flag set

- **WHEN** `handleChatStream` is invoked from `POST /api/agent/chat`
- **THEN** a `version` argument MUST be supplied that matches the installed `ai` package major (verified at implementation time)
