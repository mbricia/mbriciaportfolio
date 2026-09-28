# AI Project Workflow

This is a tool-independent workflow for ChatGPT, Codex, VS Code coding agents, or another AI assistant that can inspect this repository.

It adapts the repository-planning idea from the original setup workflow into a simple process that does not depend on Claude Code.

## 1. PM MODE — plan before editing

Use:

```text
PM MODE: <task>
```

Example:

```text
PM MODE: Fix the GitHub contribution activity so older active months remain visible while preserving the current UI.
```

The AI should:

1. Read `AGENTS.md` and `AI_CONTEXT.md`.
2. Inspect only the files relevant to the task.
3. State the current behavior based on the code.
4. Identify the affected files/modules.
5. Produce ordered implementation steps.
6. Show the affected flow as:
   - Mermaid, when useful
   - plain-text ASCII flow that is readable in a terminal/chat
7. Give a confidence percentage per implementation step with a short reason.
8. For any step below 90%, name the exact ambiguity rather than using a generic warning.
9. Give a validation plan with relevant QA commands/manual checks.
10. STOP. Do not edit application files yet.

### Approval gate

Implementation begins only after an explicit approval such as:

```text
APPROVED: Implement the approved plan.
```

If new code evidence materially contradicts the approved plan, stop and explain the contradiction before expanding scope.

## 2. IMPLEMENT MODE — make the approved change

After approval:

1. Re-check the exact files to be modified.
2. Implement only the approved scope.
3. Preserve existing architecture and conventions.
4. Avoid unrelated cleanup.
5. Keep accessibility, responsive behavior, and accurate portfolio claims intact.
6. Do not commit/push/deploy unless explicitly requested.

When finished, report:

- files changed
- what changed
- any implementation detail that differed from the plan and why
- validation performed

## 3. VERIFY MODE — review before considering it done

Use:

```text
VERIFY MODE: Review the latest change against the approved task.
```

The AI should check:

### Functional

- requested behavior works
- important edge/empty/error paths remain sensible
- no unrelated behavior was changed

### UI / accessibility

When relevant:

- desktop layout
- mobile layout
- keyboard/focus behavior
- reduced motion
- alt text
- unique IDs
- local links/assets

### Regression tests

Choose tests based on the affected behavior. Common commands include:

```text
python qa/test_portfolio.py
python qa/test_activity_calendar.py
python qa/test_live_activity_name_animation.py
python qa/test_hybrid_build_activity.py
```

A failing test is evidence to investigate, not permission to weaken the test. Determine whether the implementation is wrong or the test reflects an older approved behavior.

## 4. Small edits

For a truly tiny, low-risk edit (for example, correcting one visible typo), PM MODE can be skipped if the user explicitly asks to edit it immediately.

For anything involving logic, multiple files, architecture, external APIs, animation behavior, responsive layout, or project claims, use PM MODE first.

## Using this with different tools

### Codex

Open/work from the repository root. `AGENTS.md` provides persistent repository instructions. Describe the task using `PM MODE:` when you want the planning gate.

### ChatGPT with repository access

Tell ChatGPT:

```text
Use mbricia/mbriciaportfolio. Read AGENTS.md and AI_CONTEXT.md first.
PM MODE: <task>
```

### VS Code / another coding agent

Open the repository folder and give the agent `AGENTS.md`, `AI_CONTEXT.md`, and this file as project instructions/context. Use the same PM / APPROVED / VERIFY labels in chat.

## Core principle

The AI should understand the current project before changing it:

```text
TASK
  ↓
READ PROJECT CONTEXT
  ↓
INSPECT RELEVANT CODE
  ↓
PLAN + FLOW + RISKS
  ↓
APPROVAL
  ↓
IMPLEMENT
  ↓
VERIFY
```
