## Purpose

Builder session live chat stream on `/chats/[chatId]`: AI SDK `useChat` against `POST /api/agent/chat`, rendering streamed assistant text in the existing Astryx chat chrome. Introduced by Linear AST-5. Tools/codegen preview remain out of scope.

## Requirements

### Requirement: Builder chat uses AI SDK useChat

The builder chat panel on `/chats/[chatId]` SHALL use AI SDK `useChat` with `DefaultChatTransport` targeting `/api/agent/chat` so that user submits stream assistant text into the existing Astryx chat UI (`ChatLayout`, `ChatMessageList`, `ChatMessage`, `ChatMessageBubble`, `ChatComposer`).

#### Scenario: Submit sends and streams assistant text

- **WHEN** the user types a non-empty follow-up in the composer and submits
- **THEN** the client MUST call `sendMessage` (or equivalent) against `/api/agent/chat` and MUST render assistant `text` parts as they stream into `ChatMessageBubble` components

#### Scenario: Composer disabled while streaming

- **WHEN** chat `status` is not ready (e.g. submitted or streaming)
- **THEN** the composer send path MUST be disabled or no-op until status returns to ready

#### Scenario: Live messages replace static mock transcript

- **WHEN** live `useChat` messages are present
- **THEN** the panel MUST NOT treat `MOCK_TIMELINE` / static mock assistant activity as the source of truth for the conversation transcript

### Requirement: Initial landing prompt seeds the chat

When the builder is opened with a non-empty `initialPrompt` (from landing query), the panel SHALL present that prompt as the first user message and SHALL auto-send it once so a streamed assistant reply begins without requiring a second submit.

#### Scenario: Auto-send initial prompt once

- **WHEN** `/chats/[chatId]` loads with a non-empty initial prompt
- **THEN** the UI MUST show that text as a user message and MUST trigger exactly one send to `/api/agent/chat` for it (no duplicate sends on remount guards)

### Requirement: Unchanged chrome stays mock/visual-only

Model selector, dictate/mic control, and preview empty state SHALL keep their current visual behavior without binding to real providers, speech APIs, or generated preview content in this change.

#### Scenario: Model and mic remain non-functional

- **WHEN** the user opens the model dropdown or clicks the mic control
- **THEN** the UI MAY update local selection/label state but MUST NOT change the Mastra model chain or start speech recognition

#### Scenario: Preview stays empty placeholder

- **WHEN** a streamed assistant reply completes
- **THEN** the center preview MUST still show the existing empty-state copy (no generated preview HTML)
