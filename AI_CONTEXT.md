# AI Project Context — Mark Jhollan Bricia Portfolio

_Last reviewed against the repository on September 28, 2026._

## Purpose

This repository is Mark Jhollan Bricia's personal developer, AI automation, and IT portfolio. It presents selected software projects, automation systems, web products, credentials, experience, and contact information.

The portfolio should communicate practical technical ability without exaggerating project status or ownership.

## Stack and runtime

This is a static website:

- HTML
- CSS
- Vanilla JavaScript
- No framework
- No package.json
- No required build step

The site can be opened from `index.html` or served with a simple local static server.

External/public runtime dependencies currently include:

- Google Fonts
- Public GitHub REST API calls for live repository activity

Do not add a new framework, build tool, or runtime dependency unless the user explicitly approves it.

## Repository map

### `index.html`

Owns the page structure and visible portfolio content, including:

- sticky primary navigation
- hero / profile section
- technology carousel
- development activity / automation milestones
- selected projects
- about / experience / credentials
- contact
- project detail dialog

Important content/status distinctions are deliberate. Examples include the Kopi Brews app being a private prototype and Eleventh28 being a team capstone.

### `css/style.css`

Owns visual presentation and responsive behavior.

Current design system begins with CSS custom properties including:

- background: `#0b0d10`
- surface layers: `#11151a`, `#151a20`
- primary text: `#f3f5f7`
- muted text: `#a6afb9`
- accent: `#7ce0ca`
- max content width: `1120px`

Visual language:

- dark professional interface
- teal accent
- subtle glassmorphism
- restrained glow/gradient treatments
- responsive grid/card layouts
- motion used as polish rather than as the main content

Accessibility and reduced-motion behavior should be preserved.

### `js/script.js`

Owns most browser behavior:

- CV download with PDF fallback
- project case-study dialog content and controls
- live GitHub activity fetching/rendering
- particle background
- reveal animations
- active navigation state

The GitHub activity implementation currently discovers the user's public owner repositories dynamically through:

`https://api.github.com/users/mbricia/repos?per_page=100&type=owner&sort=updated&direction=desc`

It filters out forks and archived repositories, then requests the authenticated author's commits for the rolling 12-month range. Repository requests use `Promise.allSettled` so one unavailable repository does not discard all activity.

### `js/activity-calendar.js`

Owns activity-calendar calculations separately from DOM rendering.

Important behavior:

- 53 weeks
- 7 days per week
- 371 rendered cells
- rolling 365-day activity range
- UTC date handling
- commit count → activity level mapping
- month label positions
- CommonJS export for Node QA plus browser global `window.ActivityCalendar`

Keep date/grid logic here rather than duplicating it inside `script.js`.

### `qa/`

Contains lightweight regression checks written in Python. Some tests inspect HTML/CSS/JS strings; `test_activity_calendar.py` runs Node to test calendar behavior.

Tests protect things such as:

- information architecture
- project/status wording
- valid local assets and external HTTPS links
- unique HTML IDs
- image alt attributes
- GitHub activity behavior
- animation/UI expectations
- CV behavior
- credentials and project-dialog content

## GitHub activity note

The current implementation dynamically fetches public owner repositories with `fetchActivityRepositories()`.

At least two existing QA files still contain expectations for an older fixed-array implementation named `GITHUB_ACTIVITY_REPOS`. If those checks fail, do not automatically revert the current dynamic repository discovery. First determine whether the approved behavior or the test is stale, then update the stale side intentionally.

## Editing conventions

When changing content:

- keep claims factual and supportable
- preserve explicit project statuses
- keep copy concise and recruiter-readable
- keep visible tech/project information consistent between cards, dialogs, README, and assets when the task requires it

When changing UI:

- reuse existing CSS variables and components before inventing new patterns
- preserve mobile layout
- preserve keyboard/focus behavior
- preserve reduced-motion behavior
- avoid unnecessary visual clutter

When changing GitHub activity:

- keep calendar math in `js/activity-calendar.js`
- keep API/DOM behavior in `js/script.js`
- account for GitHub API failures and partial repository failures
- validate historical dates, current dates, and future/out-of-range cells

## Safety boundaries

- No secrets or private tokens in the repository.
- Do not rewrite unrelated sections during a focused task.
- Do not replace working static architecture with a framework solely for convenience.
- Do not change public claims or project status without explicit user intent.
