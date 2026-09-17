## ADDED Requirements

### Requirement: Builder transport sends memory thread and resource

The builder chat hook on `/chats/[chatId]` SHALL include the route `chatId` as the Mastra memory `thread` (and the documented default `resource` unless overridden) on every `POST /api/agent/chat` request made by `DefaultChatTransport` / `useChat`.

#### Scenario: Submit includes thread id

- **WHEN** the user submits a non-empty follow-up from the builder composer for a session with `chatId`
- **THEN** the JSON body sent to `/api/agent/chat` MUST include that `chatId` as `thread` (or nested `memory.thread`) and MUST include a non-empty resource (explicit body field or server default)

### Requirement: Builder hydrates history on load when available

When `/chats/[chatId]` loads, the builder chat hook SHALL attempt to load prior messages from the agent history `GET` for that thread and, when messages are returned, seed the live chat UI so a reload shows persisted turns without requiring the user to re-prompt.

#### Scenario: Reload shows recalled messages

- **WHEN** the builder loads a `chatId` that has previously stored Memory messages and the history endpoint returns them
- **THEN** the chat panel MUST render those messages as the initial live transcript before or instead of an empty client-only state

#### Scenario: Empty history stays empty

- **WHEN** the history endpoint returns no messages for the `chatId`
- **THEN** the panel MUST behave as a fresh chat (including existing `initialPrompt` auto-send rules when applicable)
