# AI Project Workflow

This is the tool-independent operating workflow for ChatGPT Work, Codex, Claude Code, VS Code agents, or any assistant that can inspect this repository. The Markdown files are the source of truth; tool-specific automation is optional.

## Non-negotiable principles

- Discover before changing: read the project context and inspect the relevant source.
- Keep the human in control: separate planning, approval, implementation, and release decisions.
- Match rigor to risk: use the lightest profile that is safe, and escalate when new risk appears.
- Work in small, reviewable pieces and prefer the smallest correct change.
- Use evidence before completion: checks and observed behavior outrank confidence or assumption.
- Keep one source of truth: update these repository files instead of duplicating persistent rules in chat.

## 0. Choose a workflow profile

State the selected profile and the reason before editing.

### Lite

Use for one-file copy, documentation, styling, configuration, or another narrow low-risk change.

- Inspect the target and nearby conventions.
- Give a focused plan; the full PM approval gate may be skipped only when the user explicitly asks for immediate implementation.
- Run targeted validation or a clear manual/content check.

### Standard

Use for normal features, bug fixes, external API handling, JavaScript behavior, responsive UI, refactors, and multi-file changes. This is the default when Lite is not clearly sufficient.

- Use PM MODE and the approval gate.
- Use a check-first approach where meaningful: reproduce the problem or add a failing regression check, then make it pass.
- Run relevant lint/test/build checks plus manual UI checks when applicable.
- Review the diff for scope, accessibility, accuracy, and regressions.

### Production

Use for authentication, payments, secrets, personally identifiable information, migrations, destructive operations, deployment, or another change with difficult recovery.

- Apply every Standard requirement.
- Add security/privacy checks, backup or rollback steps, and explicit release approval.
- Verify CI and, when deployment is approved, perform an appropriate post-deploy check.

A task can move to a stricter profile at any time. Do not downgrade risky work to bypass a gate.

## 1. PM MODE — understand and plan

Use:

```text
PM MODE: <task>
```

The AI should:

1. Read `AGENTS.md`, `AI_CONTEXT.md`, and this workflow.
2. Inspect only the files and history relevant to the task.
3. Restate the objective, user-visible outcome, and definition of done.
4. Describe current behavior using repository evidence.
5. Name affected files/modules, risks, assumptions, and out-of-scope work.
6. Produce ordered, reviewable implementation steps.
7. Diagram only when it materially improves understanding. Use Mermaid where rendered or a concise text flow in a terminal.
8. Give a confidence percentage per step with a short reason. Below 90%, ask the exact question or identify the exact evidence needed.
9. Define the verification gate for the chosen profile, including commands and manual checks.
10. STOP before editing application files.

### Approval gate

Implementation begins only after explicit approval, for example:

```text
APPROVED: Implement the approved plan.
```

If code evidence materially contradicts the approved plan, stop and explain the contradiction before changing scope.

## 2. IMPLEMENT MODE — make the approved change

After approval:

1. Re-check the exact files to be modified and confirm the selected profile still fits.
2. Implement in small, reviewable pieces.
3. Use check-first validation where meaningful, then make the minimum change needed.
4. Preserve existing architecture, conventions, accessibility, responsive behavior, and factual portfolio claims.
5. Keep cleanup limited to the changed area; avoid unrelated rewrites.
6. Review each piece before proceeding.
7. If the same issue survives three focused attempts, stop, summarize the evidence, and re-plan.
8. Do not commit, push, or deploy unless the user explicitly asks.

When finished, report the files changed, behavior changed, differences from the approved plan, and validation evidence.

## 3. VERIFY MODE — prove the result

Use:

```text
VERIFY MODE: Review the latest change against the approved task.
```

Check and report:

- requested behavior and definition of done
- important success, empty, error, and boundary paths
- changed-file diff and absence of unrelated scope
- desktop/mobile, keyboard/focus, reduced-motion, alt-text, ID, link, and asset behavior when relevant
- exact commands or manual checks run, their result, and any check that could not be completed
- Production-only security/privacy, rollback, CI, release, and post-deploy evidence when applicable

Common repository checks include:

```text
python qa/test_portfolio.py
python qa/test_activity_calendar.py
python qa/test_live_activity_name_animation.py
python qa/test_hybrid_build_activity.py
```

A failing check is evidence to investigate, not permission to weaken the check. Decide deliberately whether the implementation is wrong or an existing test reflects older approved behavior.

## Using this without a coding CLI

### ChatGPT Work (no Codex or Claude Code required)

These files still work as manual project instructions. Give ChatGPT Work repository access or attach the relevant files, then use:

```text
Use mbricia/mbriciaportfolio.
Read AGENTS.md, AI_CONTEXT.md, and AI_WORKFLOW.md first.
PM MODE: <task>
```

After reviewing the plan, use `APPROVED:` to authorize implementation and `VERIFY MODE:` for the final evidence review. ChatGPT Work may not automatically discover every repository instruction, so explicitly naming the three files is the reliable path.

### Codex

Open the repository root. Codex automatically treats root `AGENTS.md` as project guidance; `AI_CONTEXT.md` and this file are then loaded because `AGENTS.md` requires them.

### Claude Code, VS Code, or another agent

Give the agent the same three files as project instructions/context. Tool-specific commands may improve convenience, but the PM / APPROVED / VERIFY contract remains the same.

## Core flow

```text
TASK → PROFILE → CONTEXT → PLAN → APPROVAL → IMPLEMENT → VERIFY → OPTIONAL RELEASE
```
