# Recruiter-First Portfolio v3 Design

## Goal
Make Mark Jhollan Bricia's portfolio easy for recruiters and hiring managers to scan quickly while preserving deeper technical proof for engineers who choose to inspect projects.

## Audience and success criteria
The primary audience is recruiters and hiring managers evaluating Mark for development, IT support, technical operations, or adjacent technical roles. The opening view must communicate identity, target role, strongest technologies, education, availability, and strongest proof within one desktop viewport. Deeper project views should explain the problem, Mark's contribution, implementation, and technical judgment without unsupported metrics or seniority claims.

## Information hierarchy
1. Current identity and availability.
2. Strongest current software proof: Kopi Brews Operations App.
3. Foundations proof: Eleventh28 POS + Kitchen Display.
4. Shipped web products: AVENLO SaaS, AVENLO Café, AVENLO Portfolio.
5. Technical capabilities and IT support range.
6. Credentials and background.
7. Contact.

## Navigation
Keep the hybrid workstation shell rather than a long single-page scroll. Rename the existing `Capstone` destination to `Foundations` in recruiter-facing navigation while preserving `#capstone` routing compatibility. Work remains a focused project view. Each view may scroll internally as needed, especially case studies.

## Overview
The first screen should be less terminal-heavy and more recruiter-readable. It must show:
- Mark Jhollan Bricia.
- Developer · IT Problem Solver · Digital Builder.
- BS Information Technology, Major in Software Engineering.
- Core stack: JavaScript, React / React Native, Firebase / Firestore, C#, Java, HTML/CSS, Git.
- Open-to-opportunities status.
- Two primary CTAs: View selected work and Contact.
- A compact proof strip highlighting Kopi Brews App, Eleventh28, and AVENLO products.

## Work view
Split work into two visual groups.

### Software systems
1. Kopi Brews Operations App — feature first, visually largest card.
   - React Native / Expo-style stack as supported by source, Firebase / Firestore.
   - Administrator, cashier, and customer flows.
   - Inventory and waste logging, sourcing/cost fields, orders, sales insights, loyalty/rewards/promotions.
   - Mark as private prototype, not publicly released.
   - Add an in-site deep-dive panel rather than a fake external link.

2. Eleventh28 POS + Kitchen Display — second strongest system.
   - C# WinForms, .NET Framework 4.0, MySQL, Crystal Reports.
   - Team academic capstone developed 2018–2019.
   - Link to Foundations case study.

### Shipped web products
Show AVENLO SaaS, AVENLO Café, and AVENLO Portfolio as a compact product row with live-demo links. Use actual available preview imagery for SaaS and Café, and an AVENLO product-family visual or code-oriented visual for the portfolio product if a dedicated preview is unavailable. Never present demo statistics inside marketplace preview artwork as Mark's business results.

## Kopi Brews deep dive
Add a dedicated `#kopi-app` route/view so recruiter or technical reviewer can inspect the current application without leaving the portfolio. It should include:
- Context: internal multi-user Android prototype built for Kopi Brews operations.
- Role: founder / developer.
- Stack.
- User surfaces: Admin, Cashier, Customer.
- Operational data loop: orders → inventory → logs / insights → loyalty/customer history.
- Evidence from source: real-time Firestore listeners, inventory types, sourcing/costing inputs, adjustment/waste logs.
- Status: prototype / private / not production released.
- Screenshots extracted from existing project documentation when usable.

## Foundations view
Retain the Eleventh28 case study and shorten its opening copy for recruiter scan. Keep the system map, workflow, business logic, recovered feature matrix, and legacy code review. Explicitly label it as a team capstone and avoid claiming individual ownership of unverified modules.

## Systems, credentials, about
Shorten copy and prioritize searchable technology names. Keep IT support proof because it differentiates Mark for IT/support roles. Keep the AI section, but reduce it to a short engineering-principle block; do not make AI the main identity.

## Visual direction
Maintain dark graphite workstation styling with teal accent, monospace details, and restrained terminal elements. Increase whitespace, hierarchy, preview imagery, and clear labels. Reduce dense decorative terminal output and repeated slogans.

## Accessibility and responsive behavior
- Preserve keyboard navigation and command palette.
- Maintain visible focus states and reduced-motion support.
- On mobile, use a normal vertical content flow inside each route and a clear drawer menu.
- Images require meaningful alt text; decorative imagery must use empty alt text.

## Content integrity
- No fake skill percentages.
- No fake client results or performance metrics.
- No unsupported years of professional experience.
- AVENLO products are independent commercial template products, not client projects.
- Kopi Brews is a prototype and must be labeled as such.
- Eleventh28 is a team academic capstone and must be labeled as such.
- Email and LinkedIn remain placeholders until Mark supplies real values.
