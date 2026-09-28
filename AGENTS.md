# AI Coding Instructions — mbriciaportfolio

Read `AI_CONTEXT.md` and `AI_WORKFLOW.md` before making a non-trivial change.

## Working rules

- This repository is a static HTML/CSS/JavaScript portfolio. Do not introduce a framework, package manager, bundler, or build system unless the user explicitly approves that architectural change.
- Inspect the relevant existing files before proposing or implementing a change. Do not guess file ownership or behavior.
- For non-trivial feature, design, refactor, integration, or bug-fix requests, use the plan-first workflow in `AI_WORKFLOW.md` and stop at the approval gate before editing application files.
- Preserve the current visual language unless the task explicitly changes it: dark interface, teal accent, glass/surface treatment, responsive layout, and restrained motion.
- Preserve accessibility behavior: semantic structure, image alt text, unique IDs, keyboard/focus behavior, skip link, dialog behavior, and `prefers-reduced-motion` support.
- Keep portfolio claims accurate. Do not inflate experience, project ownership, release status, credentials, or skill levels. Existing labels such as "Private prototype" and "Team capstone" are intentional.
- Never hard-code secrets, API keys, access tokens, or private credentials.
- Do not commit, push, deploy, or broaden the requested scope unless the user explicitly asks.

## Important architecture

- `index.html`: page structure and portfolio content.
- `css/style.css`: all styling, responsive rules, animation, and design tokens.
- `js/script.js`: interactions, project case-study dialog, CV download, GitHub activity loading/rendering, particle background, reveal animations, and navigation state.
- `js/activity-history.js`: sanitized date/count-only historical contribution data used to supplement private activity without exposing private repository identities.
- `js/activity-calendar.js`: isolated GitHub-style activity calendar calculation shared by the browser and Node-based QA.
- `qa/`: Python regression checks; several invoke Node for JavaScript behavior.
- `assets/`: profile, project, certificate, technology, metadata, and CV assets.

## Validation

Run the tests relevant to the files or behavior changed. For broad portfolio changes, run the applicable scripts under `qa/`, especially:

- `python qa/test_portfolio.py`
- `python qa/test_activity_calendar.py`
- `python qa/test_live_activity_name_animation.py`
- `python qa/test_hybrid_build_activity.py`

Do not weaken or delete a regression test merely to make it pass. Some tests can lag behind an intentionally changed implementation; when a test and current approved behavior conflict, identify the mismatch and update the stale side deliberately.

After UI changes, also check desktop and mobile behavior manually when a browser is available.
