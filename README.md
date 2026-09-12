# MARK Portfolio v3.2.1

# MARK.JB — Personal Portfolio v3.0.0

A recruiter-first personal portfolio for **Mark Jhollan Bricia**, built as a hybrid developer-workstation interface instead of one long landing page.

## Positioning

**Developer · IT Problem Solver · Digital Builder**

The first screen is intentionally optimized for a fast recruiter scan: role direction, education, core technologies, availability, and strongest proof are visible before the deeper technical case studies.

## Proof hierarchy

1. **Kopi Brews Operations App** — current private Android prototype built around real business operations using React Native, Firebase, and Cloud Firestore.
2. **Eleventh28 POS + Kitchen Display** — 2018–2019 team academic capstone using C# WinForms, .NET Framework 4.0, MySQL, and SAP Crystal Reports.
3. **AVENLO shipped web products** — SaaS, Café, and Portfolio static HTML products with live demos, documentation, responsive behavior, and buyer-oriented customization.
4. **Systems / IT Support** — Windows, hardware, peripherals, basic networking, RJ45/Ethernet, diagnostics, and troubleshooting.
5. **Credentials / About / Contact** — supporting context after the work evidence.

## Navigation model

Desktop uses in-place workspace views instead of forcing one very long page:

- Overview
- Work
- Kopi Brews App case study (`#kopi-app`)
- Foundations / Eleventh28 (`#capstone`)
- Systems
- Credentials
- About
- Contact

The old `#capstone` route remains intentionally compatible. On mobile, the same content is presented through a drawer and normal vertical scrolling inside each view.

## Interaction

- `Ctrl/Cmd + K` — command palette
- `O` — Overview
- `W` — Work
- `K` — Kopi Brews App
- `3` — Foundations / Eleventh28
- `S` — Systems
- `C` — Credentials
- `A` — About
- `X` — Contact

## Project links

- AVENLO SaaS: https://avenlo-saas.netlify.app/
- AVENLO Café: https://avenlo-cafe.netlify.app/
- AVENLO Portfolio: https://avenlo-portfolio.netlify.app/
- GitHub: https://github.com/mbricia

## Kopi Brews case-study evidence

The portfolio uses screenshots already present in the Kopi Brews project documentation and avoids the screenshot containing a personal profile photo. The case study identifies the application as a **private prototype / not publicly released** and does not treat demo balances, points, or transactions as production data.

Source-backed implementation details highlighted in the case study include:

- Administrator, Cashier, and Customer surfaces
- Firestore real-time snapshot listeners
- inventory records and automated/manual calculation modes
- sourcing/costing inputs such as harvest region, roast date, package price, surcharge, package weight, and unit cost
- inventory adjustment / waste logging and recent item history
- orders, sales insights, loyalty, rewards, missions, promotions, referrals, QR functions, and customer history

## Eleventh28 framing

The POS with Kitchen Display project is presented as a **team academic capstone / legacy system**, developed across 2018–2019. The portfolio does not claim unsupported individual ownership of every feature.

Recovered technical scope includes C# WinForms on .NET Framework 4.0, MySQL, SAP Crystal Reports, role-based Administrator/Cashier/Cook flows, POS/payment/receipt behavior, kitchen queue/status, products and ingredients, product-to-ingredient links, costing/stock deduction logic, sales/reporting, logs, account management, and database backup.

The case study also includes a modern legacy-code review covering password hashing, parameterized SQL, externalized secrets/config, separation of UI/data/business logic, automated tests, and database migrations.

## Content integrity rules

- No fake skill percentages.
- No fake client results or performance metrics.
- No unsupported seniority or years-of-experience claims.
- AVENLO items are independent static web products, not client projects.
- Kopi Brews is a private prototype.
- Eleventh28 is a team capstone.

## Before publishing publicly

Still replace / verify:

- Real email address
- LinkedIn URL
- Final résumé download file
- GitHub URL if the account changes
- Specific verified individual Eleventh28 contributions when recovered
- Optional Eleventh28 screenshots if the old archive or documentation contains them

## Structure

```text
MARK-Portfolio-v3.0.0/
├── index.html
├── README.md
├── PORTFOLIO-CONTENT-NOTES.txt
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── projects/
│       ├── avenlo-saas.png
│       ├── avenlo-cafe.png
│       ├── avenlo-family.png
│       ├── kopi-admin.png
│       ├── kopi-cashier.png
│       └── kopi-loyalty.png
├── qa/
│   └── test_portfolio.py
└── docs/
    └── superpowers/
        ├── specs/
        └── plans/
```

No framework or build tools are required. Open `index.html` directly or run a local static server.
