# AI Recruitment & Candidate Pipeline Automation

A portfolio-ready n8n recruitment operations system that combines AI interpretation with deterministic business rules, human-controlled hiring decisions, duplicate protection, reminders, audit logs, and centralized technical error handling.

## What the system does

The project is designed as four cooperating n8n workflows sharing one recruitment datastore:

1. **Candidate Email Processor** — receives incoming candidate emails, filters obvious non-recruitment messages, uses AI for interpretation/extraction, prevents duplicate email/candidate/application records, and creates or updates the candidate pipeline.
2. **Recruiter Action Center** — lets a recruiter submit controlled actions such as Shortlist, Schedule Interview, Assessment, Offer, Reject, Hire, Put On Hold, and Close. Stage transitions are validated before updates.
3. **Follow-up & Reminder Engine** — checks active applications on a schedule, identifies due/overdue recruiter actions, prevents same-day duplicate reminders, creates recruiter reminder drafts, and logs them.
4. **Technical Error Handler** — captures automatic workflow failures and writes normalized diagnostic records to the shared error log.

## Design principle

**AI interprets; business logic decides.**

AI is used where language understanding is useful:
- recruitment email interpretation
- structured candidate/application extraction
- candidate-facing email draft generation

Deterministic logic controls:
- duplicate detection
- candidate/application matching
- stage transitions
- recruiter actions
- due/overdue checks
- reminder deduplication
- logging and error handling

## Workflow 1 — Candidate Email Processor

```text
Gmail Trigger
→ Get Full Email
→ Normalize
→ Email Dedup Check
→ Recruitment Keyword Gate
→ AI Interpretation / Extraction
→ Candidate-Pipeline Route
→ Candidate Lookup
→ Create Candidate if New
→ Application Lookup
→ Create or Update Application
→ Email Log
```

### Workflow 1 safeguards
- exact Gmail message deduplication before AI processing
- normalized candidate email matching
- one candidate can have multiple applications
- candidate + job title application matching
- interview date extraction when explicitly present
- non-candidate/job-alert emails stop before database writes
- Google Sheets acts as a transparent demo datastore

## Shared Google Sheets tabs

- `Candidates`
- `Applications`
- `Email_Log`
- `Recruiter_Action_Log`
- `Communication_Log`
- `Reminder_Log`
- `Error_Log`

## Tested scenarios

- new candidate application
- non-candidate job alert ignored
- exact email duplicate blocked
- existing candidate detected
- existing application updated instead of duplicated
- interview confirmation and interview date extraction
- candidate withdrawal
- invalid recruiter action blocked by stage-transition rules
- shortlist / interview / offer / hire recruiter lifecycle
- AI-generated Gmail drafts for candidate communication
- due-today and overdue recruiter reminders
- same-day reminder deduplication
- invalid application ID validation error
- automatic technical failure captured by the central error workflow

## Public export status

This folder currently includes the sanitized export for **Workflow 1 — Candidate Email Processor**. The remaining workflow exports can be added here as they are exported from n8n.

## Setup

### Required integrations
- Gmail OAuth2
- Google Sheets OAuth2
- OpenAI Chat Model

### Import notes
1. Import the sanitized workflow JSON into n8n.
2. Reconnect your own Gmail, Google Sheets, and OpenAI credentials.
3. Replace `YOUR_GOOGLE_SHEET_ID` with your own spreadsheet.
4. Confirm the expected sheet/tab names.
5. Import the companion recruiter, reminder, and error workflows when available.
6. Link the Technical Error Handler as the Error Workflow for production-style automatic executions.

The public JSON intentionally excludes credential IDs, private spreadsheet IDs/URLs, instance IDs, webhook IDs, workflow IDs, and the linked error-workflow ID.

## Portability

The design uses standard n8n nodes and external-service credentials, so it can be moved from n8n Cloud to a self-hosted n8n instance or a client-owned environment by reconnecting credentials and data sources.

## Portfolio note

All public examples use synthetic candidate and recruiter information. No production candidate data is included.
