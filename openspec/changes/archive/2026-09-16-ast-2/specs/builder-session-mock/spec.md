## ADDED Requirements

### Requirement: Builder session route shows mock shell

The system SHALL render a builder/tool session mock at `/chats/[chatId]` using Astryx `AppShell` and `TopNav`, with a left chat region and a center preview region — without calling any backend.

#### Scenario: Visitor opens a chat session URL

- **WHEN** a user navigates to `/chats/demo` (or any `[chatId]`)
- **THEN** the page shows a top bar with Astryx brand signal, a project title, a Preview control, and visual Log In / Sign Up actions
- **AND** a left chat panel is visible
- **AND** a center preview area is visible with empty-state copy indicating generation will appear there
- **AND** no network request is made to generate or preview content

### Requirement: Left chat shows static transcript with tool activity

The left panel SHALL show a static conversation mock using Astryx Chat components, including tool-call / thinking activity via `ChatToolCalls` (not a non-existent ChatReasoning component), and a follow-up composer that does not submit remotely.

#### Scenario: Transcript content

- **WHEN** the builder session mock is displayed
- **THEN** the chat panel includes a user message (e.g. Landing page of lawyer)
- **AND** an assistant message bubble or equivalent ghost bubble content
- **AND** one or more `ChatToolCalls` rows with mock statuses including at least one non-complete state representing Thinking / in-progress work

#### Scenario: Follow-up composer is local-only

- **WHEN** the user types in the follow-up `ChatComposer` and submits
- **THEN** the app does not call any HTTP endpoint
- **AND** the app does not navigate away from the builder session route

### Requirement: Preview canvas is empty with fake browser chrome

The center region SHALL present a non-functional preview chrome and an empty placeholder — not a live iframe or generated page.

#### Scenario: Empty preview

- **WHEN** the builder session mock is displayed
- **THEN** the preview region shows browser-like controls (including a path indicator such as `/`) built with Astryx primitives (e.g. `Toolbar`, `Button`, `Icon`)
- **AND** empty-state text is shown (e.g. Your Astryx generation will show here.)
- **AND** no generated HTML document is loaded for preview

#### Scenario: Icon-only preview controls are labeled

- **WHEN** icon-only controls appear in the preview chrome (e.g. refresh, device)
- **THEN** each control has an accessible name suitable for assistive tech

### Requirement: Builder code lives under features/builder

The session implementation SHALL follow Screaming Architecture: UI and static model data under `frontend/src/features/builder/`, with `frontend/src/app/chats/[chatId]/page.tsx` only wiring the feature.

#### Scenario: Thin app route

- **WHEN** the change is implemented
- **THEN** `app/chats/[chatId]/page.tsx` imports from `features/builder` and contains no transcript business logic
- **AND** there is no scaffold path `src/app/ai-chat`
- **AND** there is no `features/builder/api/` module for this mock
- **AND** the mock does not require a backend service to render
