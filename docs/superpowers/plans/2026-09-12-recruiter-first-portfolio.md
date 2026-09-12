# Recruiter-First Portfolio v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Refactor the existing portfolio into a recruiter-first proof hierarchy with a dedicated Kopi Brews application case study and stronger presentation of Eleventh28 and AVENLO products.

**Architecture:** Keep the existing static HTML/CSS/JavaScript routed workstation shell. Extend its route set with `kopi-app`, restructure Overview and Work for fast scanning, add project imagery under `assets/projects`, and preserve the existing Eleventh28 deep-dive route.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, local PNG/JPG assets, Python structural QA, Node syntax check.

**Spec:** `docs/superpowers/specs/2026-09-12-recruiter-first-portfolio-design.md`

## Global Constraints
- Static site only; no framework or build step.
- No fake metrics, unsupported seniority, or unsupported individual ownership claims.
- Kopi Brews must be labeled private prototype / not production released.
- Eleventh28 must be labeled team academic capstone.
- Preserve `#capstone` route compatibility.
- Preserve keyboard command palette, mobile drawer, reduced-motion support, and existing live-demo URLs.

---

### Task 1: Recruiter-first structural contract
**Files:**
- Create: `qa/test_portfolio.py`
- Modify later: `index.html`, `js/script.js`

**Interfaces:**
- Produces structural assertions used by all later tasks.

- [x] Write structural tests asserting: `kopi-app` route/view exists; Overview contains recruiter summary and primary Contact CTA; Work has `Software Systems` and `Shipped Web Products`; Kopi appears before Eleventh28 and AVENLO; existing Netlify links remain; `capstone` route remains.
- [x] Run the test and verify it fails because v2 lacks the new route/groups.
- [x] Implement the minimal HTML/JS route changes.
- [x] Run the test and verify it passes.

### Task 2: Kopi Brews evidence case study
**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Create: `assets/projects/kopi-*.png` or `.jpg` from existing documentation where usable.
- Extend: `qa/test_portfolio.py`

**Interfaces:**
- Consumes route `kopi-app`.
- Produces recruiter-readable app evidence and source-backed feature labels.

- [x] Add failing tests for required copy: React Native, Firebase/Firestore, Administrator, Cashier, Customer, inventory, waste/logs, and prototype status.
- [x] Verify failure.
- [x] Extract usable existing application screenshots from the Kopi Brews proposal into project assets.
- [x] Add the `kopi-app` case study with user-surface cards, data-flow diagram, source-evidence section, and screenshots.
- [x] Run tests and verify pass.

### Task 3: AVENLO shipped-product proof
**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Create: `assets/projects/avenlo-saas.png`, `assets/projects/avenlo-cafe.png`, and `assets/projects/avenlo-family.png` from existing Library assets.
- Extend: `qa/test_portfolio.py`

**Interfaces:**
- Produces three live product cards with preview art and correct URLs.

- [x] Add failing tests that each AVENLO product is labeled as shipped/static web product and contains its expected live-demo URL.
- [x] Verify failure.
- [x] Materialize existing preview images and integrate them into the shipped-products row.
- [x] Keep AVENLO SaaS, Café, and Portfolio descriptions concise and product-oriented.
- [x] Run tests and verify pass.

### Task 4: Recruiter scan and visual hierarchy
**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Extend: `qa/test_portfolio.py`

**Interfaces:**
- Consumes project sections from Tasks 2–3.
- Produces a first-screen summary optimized for quick scan.

- [x] Add failing tests for visible role, education, core technologies, availability, View Work CTA, and Contact CTA in Overview.
- [x] Verify failure.
- [x] Simplify Overview, reduce terminal density, add core-tech chips and compact proof strip.
- [x] Refine Work group spacing, project prominence, and mobile stacking.
- [x] Run tests and verify pass.

### Task 5: Final verification and packaging
**Files:**
- Modify: `README.md`, `PORTFOLIO-CONTENT-NOTES.txt`
- Create: `MARK-Portfolio-v3.0.0.zip` outside project folder.

**Interfaces:**
- Produces final downloadable package.

- [x] Run `python3 qa/test_portfolio.py` and require all assertions to pass.
- [x] Run `node --check js/script.js`.
- [x] Run an HTML parser check for duplicate IDs, missing local assets, and missing alt attributes on project images.
- [x] Verify all external project URLs are present and use HTTPS.
- [x] Update README/content notes with remaining email/LinkedIn placeholders and future Eleventh28 screenshot slot.
- [x] Zip package and run `unzip -t`.
