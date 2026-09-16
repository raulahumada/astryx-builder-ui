---
name: /opsx-propose
id: opsx-propose
category: Workflow
description: Propose a new change - create it and generate all artifacts in one step
---

Propose a new change - create the change and generate all artifacts in one step.

I'll create a change with artifacts:
- proposal.md (what & why)
- design.md (how)
- tasks.md (implementation steps)

When ready to implement, run /opsx:apply

---

**Project standards:** Before writing artifacts, apply `openspec/config.yaml` context/rules and read as needed: `AGENTS.md`, `docs/design_guideline.md`, `frontend/docs/frontend-standards.md` (Screaming Architecture), `backend/docs/backend-standards.md` (Clean Architecture), `frontend/AGENTS.md`. Design + tasks must name concrete `features/<capability>/…` and/or CA layers.

**Store selection:** If the user names a store (a store is a standalone OpenSpec repo registered on this machine) or the work lives in one, run `openspec store list --json` to discover registered store ids, then pass `--store <id>` on the commands that read or write specs and changes (`new change`, `status`, `instructions`, `list`, `show`, `validate`, `archive`, `doctor`, `context`). Other commands do not take the flag. Hints printed by commands already carry the flag; keep it on follow-ups. Without a store, commands act on the nearest local `openspec/` root.

**Change folder naming (required):** The OpenSpec change directory name is always the **Linear issue id in lowercase** (`AST-1` → `ast-1`, `AST-12` → `ast-12`). Do **not** invent descriptive kebab names (`landing-ui-mock`).

**Input**: Prefer a Linear id (`AST-1`, `ast-1`, or a Linear URL). A description alone is OK only if the Linear id is already clear from conversation (e.g. after `/enrich-us AST-1`); still create the folder as `ast-1`.

**Steps**

1. **Resolve the Linear id → change name**

   - If the user passed `AST-N`, `ast-n`, or a Linear URL → change name = lowercase id (`ast-1`).
   - If they only described work but the active ticket is clear in chat → use that ticket's lowercase id.
   - If no Linear id can be determined, ask:
     > "Which Linear issue is this for? (e.g. AST-1) — the OpenSpec folder will be named with that id in lowercase."

   **IMPORTANT**: Do NOT create a change without a Linear id. Do NOT derive fancy names from the title.

2. **Create the change directory**
   ```bash
   openspec new change "<name>"
   ```
   Example: `openspec new change "ast-1"`. This scaffolds under the planning home with `.openspec.yaml`.

3. **Get the artifact build order**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to get:
   - `applyRequires`: array of artifact IDs needed before implementation (e.g., `["tasks"]`)
   - `artifacts`: list of all artifacts with their status and dependencies
   - `planningHome`, `changeRoot`, `artifactPaths`, and `actionContext`: path and scope context. Use these instead of assuming repo-local paths.

4. **Create artifacts in sequence until apply-ready**

   Use the **TodoWrite tool** to track progress through the artifacts.

   Loop through artifacts in dependency order (artifacts with no pending dependencies first):

   a. **For each artifact that is `ready` (dependencies satisfied)**:
      - Get instructions:
        ```bash
        openspec instructions <artifact-id> --change "<name>" --json
        ```
      - The instructions JSON includes:
        - `context`: Project background (constraints for you - do NOT include in output)
        - `rules`: Artifact-specific rules (constraints for you - do NOT include in output)
        - `template`: The structure to use for your output file
        - `instruction`: Schema-specific guidance for this artifact type
        - `resolvedOutputPath`: Resolved path or pattern to write the artifact
        - `dependencies`: Completed artifacts to read for context
      - Read any completed dependency files for context
      - Create the artifact file using `template` as the structure and write it to `resolvedOutputPath`
      - Apply `context` and `rules` as constraints - but do NOT copy them into the file
      - Show brief progress: "Created <artifact-id>"

   b. **Continue until all `applyRequires` artifacts are complete**
      - After creating each artifact, re-run `openspec status --change "<name>" --json`
      - Check if every artifact ID in `applyRequires` has `status: "done"` in the artifacts array
      - Stop when all `applyRequires` artifacts are done

   c. **If an artifact requires user input** (unclear context):
      - Use **AskUserQuestion tool** to clarify
      - Then continue with creation

5. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

After completing all artifacts, summarize:
- Change name and location
- List of artifacts created with brief descriptions
- What's ready: "All artifacts created! Ready for implementation."
- Prompt: "Run `/opsx:apply` to start implementing."

**Artifact Creation Guidelines**

- Follow the `instruction` field from `openspec instructions` for each artifact type
- The schema defines what each artifact should contain - follow it
- Read dependency artifacts for context before creating new ones
- Use `template` as the structure for your output file - fill in its sections
- **IMPORTANT**: `context` and `rules` are constraints for YOU, not content for the file
  - Do NOT copy `<context>`, `<rules>`, `<project_context>` blocks into the artifact
  - These guide what you write, but should never appear in the output

**Guardrails**
- Create ALL artifacts needed for implementation (as defined by schema's `apply.requires`)
- Always read dependency artifacts before creating a new one
- Honor project standards (front Screaming Architecture, back Clean Architecture, design guideline) via config + docs above
- If context is critically unclear, ask the user - but prefer making reasonable decisions to keep momentum
- If a change with that name already exists, ask if user wants to continue it or create a new one
- Verify each artifact file exists after writing before proceeding to next
