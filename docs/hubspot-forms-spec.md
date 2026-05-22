# HubSpot Forms Integration Specification

**Project:** Better You Therapy (BYT) Website  
**Stack:** Astro 6 · Cloudflare Pages Functions · HubSpot CRM  
**Last updated:** 2026-05-22

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [HubSpot Portal Configuration](#2-hubspot-portal-configuration)
3. [Contact Properties](#3-contact-properties)
4. [Company Properties](#4-company-properties)
5. [Contact Types](#5-contact-types)
6. [Association Labels](#6-association-labels)
7. [Form-by-Form Specification](#7-form-by-form-specification)
8. [File Upload Flow](#8-file-upload-flow)
9. [Shared Helpers Reference](#9-shared-helpers-reference)
10. [Multi-Select Field Handling](#10-multi-select-field-handling)
11. [Upsert Logic](#11-upsert-logic)
12. [How to Add a New Form](#12-how-to-add-a-new-form)

---

## 1. Architecture Overview

### Data Flow

```
Browser Form
    │
    │  POST /api/{form-name}
    │  JSON payload
    ▼
Cloudflare Pages Function
(functions/api/{form-name}.ts)
    │
    ├── searchContactByEmail()    ─── POST /crm/v3/objects/contacts/search
    ├── createContact()           ─── POST /crm/v3/objects/contacts
    ├── updateContact()           ─── PATCH /crm/v3/objects/contacts/{id}
    │
    ├── searchCompanyByName()     ─── POST /crm/v3/objects/companies/search
    ├── createCompany()           ─── POST /crm/v3/objects/companies
    ├── updateCompany()           ─── PATCH /crm/v3/objects/companies/{id}
    │
    ├── uploadFileToHubSpot()     ─── POST /filemanager/api/v3/files/upload
    ├── updateContact(therapist_resume / document url)
    ├── createNote()              ─── POST /crm/v3/objects/notes
    │
    └── associate()               ─── PUT /crm/v4/objects/{type}/{id}/associations/...
    │
    ▼
HubSpot CRM (Portal 246246558, na2)
```

### Why Pages Functions (not client-side calls)

The HubSpot Service Key (`HUBSPOT_SERVICE_KEY`) is a private bearer token. Embedding it in browser JavaScript would expose it publicly, allowing anyone to read or write CRM data. Pages Functions run server-side in Cloudflare's edge network — the key never reaches the browser.

### Shared Helper Pattern

All reusable HubSpot API logic lives in `functions/api/_hubspot.ts`. Individual form handlers import from it. This means:

- Auth headers are constructed in one place
- CORS headers are defined once
- Contact/company search-and-upsert logic is not duplicated
- File upload and note creation are centralized

The `referral.ts` handler is a historical exception — it was written before the shared helper was mature and duplicates some local helpers internally. Future refactors should migrate it to use `_hubspot.ts` exclusively.

### Environment Variables

| Variable              | Purpose                                | Where configured                                                                                  |
| --------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `HUBSPOT_SERVICE_KEY` | Bearer token for all HubSpot API calls | Cloudflare Pages environment variables (Production + Preview); `apps/web/.dev.vars` for local dev |

No other env vars are required for the forms integration. See `docs/env-registry.md` for the full project env registry.

---

## 2. HubSpot Portal Configuration

| Setting      | Value                         |
| ------------ | ----------------------------- |
| Portal ID    | `246246558`                   |
| Region       | `na2`                         |
| API Base URL | `https://api.hubapi.com`      |
| Auth method  | Service Key (Bearer token)    |
| Auth header  | `Authorization: Bearer {key}` |

### Required API Scopes

| Scope                            | Used by                                                        |
| -------------------------------- | -------------------------------------------------------------- |
| `crm.objects.contacts.read`      | All forms (search before upsert)                               |
| `crm.objects.contacts.write`     | All forms (create / update contacts)                           |
| `crm.objects.companies.read`     | facility-referral, referral                                    |
| `crm.objects.companies.write`    | facility-referral, referral                                    |
| `crm.objects.notes.write`        | apply, referral                                                |
| `crm.schemas.contacts.read`      | Needed for custom property definitions                         |
| `crm.schemas.companies.read`     | Needed for custom property definitions                         |
| `files`                          | apply (resume upload), referral (doc upload)                   |
| `crm.objects.associations.write` | facility-referral, referral (contact↔company, contact↔contact) |

---

## 3. Contact Properties

### Standard Properties

| Internal name | Display label | Type | Used by forms                                             | Required                |
| ------------- | ------------- | ---- | --------------------------------------------------------- | ----------------------- |
| `email`       | Email         | text | All forms                                                 | Yes                     |
| `firstname`   | First name    | text | contact, book-session, apply, facility-referral, referral | Yes                     |
| `lastname`    | Last name     | text | contact, book-session, apply, facility-referral, referral | Yes (optional on apply) |
| `phone`       | Phone         | text | contact, book-session, apply, facility-referral, referral | Varies                  |
| `message`     | Message       | text | contact                                                   | Yes                     |
| `company`     | Company name  | text | facility-referral, referral                               | Set programmatically    |

### Custom Properties

| Internal name                  | Display label                | Type         | Options                                                                                                       | Used by forms                                    | Required             |
| ------------------------------ | ---------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------- |
| `contact_type`                 | Contact Type                 | select/radio | `Patient`, `Facility Employee`, `Provider`, `Guardian/Family`                                                 | book-session, apply, facility-referral, referral | Set programmatically |
| `refer_source`                 | Refer Source                 | text         | Always `Website Form`                                                                                         | All forms                                        | Always set           |
| `website_form`                 | Website Form                 | text         | `Newsletter`, `Contact Us`, `Book Session`, `Apply Job`, `Refer Facility`, `Refer Resident`, `Patient Intake` | All forms                                        | Always set           |
| `message`                      | Message                      | text         | Free text                                                                                                     | contact                                          | Yes                  |
| `reason_for_referral`          | Reason for Referral          | text         | Free text                                                                                                     | referral (patient)                               | Yes                  |
| `skilled_nursing`              | Skilled Nursing              | text         | `Yes`, `No` (title-cased from frontend value)                                                                 | referral (patient)                               | Yes                  |
| `what_brings_you_in`           | What Brings You In           | text/select  | Free text or select value                                                                                     | book-session                                     | Yes                  |
| `how_will_you_pay`             | How Will You Pay             | text/select  | Free text or select value                                                                                     | book-session                                     | Yes                  |
| `best_times_to_reach_you`      | Best Times to Reach You      | multi-select | `Weekday mornings`, `Weekday afternoons`, `Evenings`, `Weekends` (semicolon-joined)                           | book-session                                     | Yes (multi-select)   |
| `anything_else_we_should_know` | Anything Else We Should Know | text         | Free text                                                                                                     | book-session, facility-referral                  | Optional             |
| `hs_role`                      | Role                         | text         | Free text (job title at facility)                                                                             | facility-referral                                | Yes                  |
| `what_sparked_your_interest`   | What Sparked Your Interest   | multi-select | Free text values (semicolon-joined)                                                                           | facility-referral                                | Yes                  |
| `resume_cover_note`            | Resume / Cover Note          | text         | Free text                                                                                                     | apply                                            | Optional             |
| `therapist_resume`             | Therapist Resume URL         | text (URL)   | URL to uploaded file in HubSpot Files                                                                         | apply                                            | Optional             |

---

## 4. Company Properties

| Internal name           | Display label         | Type   | Options                                  | Used by forms               |
| ----------------------- | --------------------- | ------ | ---------------------------------------- | --------------------------- |
| `name`                  | Company name          | text   | Free text                                | facility-referral, referral |
| `phone`                 | Phone                 | text   | Free text                                | facility-referral, referral |
| `facility_type`         | Facility Type         | select | `ALF`, `SNF`, `CCRC`                     | facility-referral           |
| `county`                | County                | text   | Free text                                | facility-referral           |
| `approximate_bed_count` | Approximate Bed Count | select | `Under 50`, `50-100`, `100+`, `Not sure` | facility-referral           |

### Facility Type Mapping (Frontend → HubSpot)

| Frontend display value   | HubSpot stored value |
| ------------------------ | -------------------- |
| `Assisted Living (ALF)`  | `ALF`                |
| `Skilled Nursing (SNF)`  | `SNF`                |
| `Continuing Care (CCRC)` | `CCRC`               |

### Bed Count Mapping (Frontend → HubSpot)

| Frontend display value | HubSpot stored value |
| ---------------------- | -------------------- |
| `Under 50`             | `Under 50`           |
| `50–90`                | `50-100`             |
| `50–100`               | `50-100`             |
| `100–200`              | `100+`               |
| `200+`                 | `100+`               |
| `Not sure`             | `Not sure`           |

---

## 5. Contact Types

Every contact created through a form has `contact_type` set to one of four values:

| Value               | Meaning                                                         | Set by form(s)                                            |
| ------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| `Patient`           | A person seeking therapy services at BYT                        | book-session, referral (patient), intake (patient)        |
| `Facility Employee` | Staff at a partner facility who submitted a referral or inquiry | facility-referral, referral (referrer)                    |
| `Provider`          | A licensed therapist or clinician applying to work at BYT       | apply                                                     |
| `Guardian/Family`   | A family member or legal guardian of a referred patient         | referral (guardian, if provided), intake (RP, if present) |

**Note:** newsletter and contact forms do **not** set `contact_type` — those contacts are created/updated with only the fields the user submitted.

---

## 6. Association Labels

All associations use the HubSpot CRM v4 associations API:  
`PUT /crm/v4/objects/{fromType}/{fromId}/associations/{toType}/{toId}`

The body is an array: `[{ associationCategory, associationTypeId }]`

### Contact → Company Associations

| Label                   | associationCategory | associationTypeId | When created                                       | Triggered by form                              |
| ----------------------- | ------------------- | ----------------- | -------------------------------------------------- | ---------------------------------------------- |
| Admin staff at facility | `USER_DEFINED`      | `5`               | Facility employee linked to their facility company | facility-referral (Step 3), referral (Step 5a) |
| Patient at facility     | `USER_DEFINED`      | `1`               | Patient linked to their originating facility       | referral (Step 5b)                             |
| Default HUBSPOT_DEFINED | `HUBSPOT_DEFINED`   | `279`             | Guardian linked to facility company                | referral (Step 5c, guardian→company)           |

### Contact → Contact Associations

| Label    | associationCategory | associationTypeId | Direction          | When created                   | Triggered by form  |
| -------- | ------------------- | ----------------- | ------------------ | ------------------------------ | ------------------ |
| Guardian | `USER_DEFINED`      | `8`               | Guardian → Patient | When guardian name is provided | referral (Step 5c) |
| Patient  | `USER_DEFINED`      | `11`              | Patient → Guardian | Reciprocal of the above        | referral (Step 5c) |

**Association creation is always fatal** — if an association step fails, the function returns an error response (unlike file uploads, which are non-fatal).

---

## 7. Form-by-Form Specification

---

### 7.1 Newsletter

**A. Purpose:** Captures email subscribers from blog posts and the footer newsletter widget.

**B. Frontend locations:**

- `apps/web/src/components/blog/NewsletterBlock.astro` — inline CTA block on blog pages
- `apps/web/src/components/ui/Footer.astro` — footer newsletter form
- Form IDs: `#newsletterForm`

**C. API endpoint:** `POST /api/newsletter`  
**Function file:** `functions/api/newsletter.ts`

**D. Expected JSON payload:**

```json
{
  "email": "user@example.com",
  "firstName": "Jane"
}
```

| Field       | Type   | Required | Notes                 |
| ----------- | ------ | -------- | --------------------- |
| `email`     | string | Yes      | Validated non-empty   |
| `firstName` | string | No       | Set only if non-empty |

**E. HubSpot operations (in order):**

1. Search contact by `email`
2. If found → `PATCH` contact with props
3. If not found → `POST` create contact

Properties set on contact:

| Property       | Value                      |
| -------------- | -------------------------- |
| `email`        | from payload               |
| `firstname`    | from payload (if provided) |
| `refer_source` | `Website Form`             |
| `website_form` | `Newsletter`               |

No associations. No file upload.

**F. Success response:**

```json
{ "success": true, "contactId": "12345" }
```

**G. Error handling:**

| Scenario                      | HTTP status | Response body                                                         |
| ----------------------------- | ----------- | --------------------------------------------------------------------- |
| Missing `email`               | 400         | `{ "success": false, "error": "Missing required field: email" }`      |
| Invalid JSON                  | 400         | `{ "success": false, "error": "Invalid JSON body" }`                  |
| `HUBSPOT_SERVICE_KEY` missing | 500         | `{ "success": false, "error": "HUBSPOT_SERVICE_KEY not configured" }` |
| HubSpot API error             | 500         | `{ "success": false, "error": "HubSpot error", "details": "..." }`    |

**H. Field mapping:**

| Frontend field | JSON key    | HubSpot property |
| -------------- | ----------- | ---------------- |
| Email input    | `email`     | `email`          |
| First name     | `firstName` | `firstname`      |

---

### 7.2 Contact Us

**A. Purpose:** General inquiry form — routes to a BYT team member.

**B. Frontend location:**

- `apps/web/src/components/pages/ContactPage.astro`
- Form element: inline `<form>` on the contact page

**C. API endpoint:** `POST /api/contact`  
**Function file:** `functions/api/contact.ts`

**D. Expected JSON payload:**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "555-555-5555",
  "message": "I'd like to learn more about your services."
}
```

| Field       | Type   | Required | Notes                   |
| ----------- | ------ | -------- | ----------------------- |
| `firstName` | string | Yes      |                         |
| `lastName`  | string | Yes      |                         |
| `email`     | string | Yes      |                         |
| `phone`     | string | No       | Not validated for empty |
| `message`   | string | Yes      |                         |

**E. HubSpot operations (in order):**

1. Search contact by `email`
2. If found → `PATCH` contact
3. If not found → `POST` create contact

Properties set:

| Property       | Value          |
| -------------- | -------------- |
| `firstname`    | from payload   |
| `lastname`     | from payload   |
| `email`        | from payload   |
| `phone`        | from payload   |
| `message`      | from payload   |
| `refer_source` | `Website Form` |
| `website_form` | `Contact Us`   |

No associations. No file upload.

**F. Success response:**

```json
{ "success": true, "contactId": "12345" }
```

**G. Error handling:** Same pattern as Newsletter. Required fields: `firstName`, `lastName`, `email`, `message`.

**H. Field mapping:**

| Frontend field | JSON key    | HubSpot property |
| -------------- | ----------- | ---------------- |
| First name     | `firstName` | `firstname`      |
| Last name      | `lastName`  | `lastname`       |
| Email          | `email`     | `email`          |
| Phone          | `phone`     | `phone`          |
| Message        | `message`   | `message`        |

---

### 7.3 Book a Session

**A. Purpose:** Intake form for prospective patients — captures scheduling preferences and payment method.

**B. Frontend location:**

- `apps/web/src/components/ui/ModalForms.astro`
- Modal ID: `#modal-book`, form ID: `#bookForm`
- Submit handler: `handleSubmit(event, 'book')`

**C. API endpoint:** `POST /api/book-session`  
**Function file:** `functions/api/book-session.ts`

**D. Expected JSON payload:**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "555-555-5555",
  "whatBringsYouIn": "Anxiety and stress management",
  "howWillYouPay": "Insurance",
  "bestTimesToReachYou": "weekday-am,evenings",
  "anythingElse": "I prefer video sessions."
}
```

| Field                 | Type   | Required | Notes                                             |
| --------------------- | ------ | -------- | ------------------------------------------------- |
| `firstName`           | string | Yes      |                                                   |
| `lastName`            | string | Yes      |                                                   |
| `email`               | string | Yes      |                                                   |
| `phone`               | string | Yes      |                                                   |
| `whatBringsYouIn`     | string | Yes      | Free text or select value                         |
| `howWillYouPay`       | string | Yes      | Free text or select value                         |
| `bestTimesToReachYou` | string | Yes      | Comma-separated availability keys (see map below) |
| `anythingElse`        | string | No       | Free text                                         |

**Availability key → HubSpot label map:**

| Frontend key | HubSpot label        |
| ------------ | -------------------- |
| `weekday-am` | `Weekday mornings`   |
| `weekday-pm` | `Weekday afternoons` |
| `evenings`   | `Evenings`           |
| `weekends`   | `Weekends`           |

Unknown keys pass through as-is. Values are joined with semicolons before storage.

**E. HubSpot operations (in order):**

1. Search contact by `email`
2. If found → `PATCH`; if not found → `POST` create

Properties set:

| Property                       | Value                                  |
| ------------------------------ | -------------------------------------- |
| `firstname`                    | from payload                           |
| `lastname`                     | from payload                           |
| `email`                        | from payload                           |
| `phone`                        | from payload                           |
| `what_brings_you_in`           | from payload                           |
| `how_will_you_pay`             | from payload                           |
| `best_times_to_reach_you`      | mapped labels joined with `;`          |
| `anything_else_we_should_know` | from payload (empty string if omitted) |
| `contact_type`                 | `Patient`                              |
| `refer_source`                 | `Website Form`                         |
| `website_form`                 | `Book Session`                         |

No associations. No file upload.

**F. Success response:**

```json
{ "success": true, "contactId": "12345" }
```

**G. Error handling:** Required fields: `firstName`, `lastName`, `email`, `phone`, `whatBringsYouIn`, `howWillYouPay`.

**H. Field mapping:**

| Frontend field          | JSON key              | HubSpot property               |
| ----------------------- | --------------------- | ------------------------------ |
| First name              | `firstName`           | `firstname`                    |
| Last name               | `lastName`            | `lastname`                     |
| Email                   | `email`               | `email`                        |
| Phone                   | `phone`               | `phone`                        |
| What brings you in      | `whatBringsYouIn`     | `what_brings_you_in`           |
| How will you pay        | `howWillYouPay`       | `how_will_you_pay`             |
| Best times to reach you | `bestTimesToReachYou` | `best_times_to_reach_you`      |
| Anything else           | `anythingElse`        | `anything_else_we_should_know` |

---

### 7.4 Apply / Careers

**A. Purpose:** Job application form for therapists and clinicians who want to work at BYT.

**B. Frontend location:**

- `apps/web/src/components/pages/CareersPage.astro`
- Form submits to `/api/apply`

**C. API endpoint:** `POST /api/apply`  
**Function file:** `functions/api/apply.ts`

**D. Expected JSON payload:**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "555-555-5555",
  "resumeCoverNote": "I'm passionate about trauma-informed care...",
  "resumeFile": "data:application/pdf;base64,JVBERi0...",
  "resumeFileName": "jane-doe-resume.pdf"
}
```

| Field             | Type           | Required | Notes                                                    |
| ----------------- | -------------- | -------- | -------------------------------------------------------- |
| `firstName`       | string         | Yes      |                                                          |
| `lastName`        | string         | No       | Stored as empty string if absent                         |
| `email`           | string         | Yes      |                                                          |
| `phone`           | string         | No       |                                                          |
| `resumeCoverNote` | string         | No       |                                                          |
| `resumeFile`      | string \| null | No       | Base64 data URL (e.g. `data:application/pdf;base64,...`) |
| `resumeFileName`  | string \| null | No       | Original filename including extension                    |

**E. HubSpot operations (in order):**

1. Search contact by `email`
2. If found → `PATCH`; if not → `POST` create with core props
3. _(if `resumeFile` + `resumeFileName` present)_ Upload file to `/resumes` folder
4. `PATCH` contact with `therapist_resume` = uploaded file URL
5. `POST` note with `hs_attachment_ids` = file ID, body = `"Resume uploaded via website: {filename}"`

Steps 3–5 are **non-fatal**: if file upload fails, the function still returns `success: true` with `fileUploaded: false` and `fileError` populated.

Properties set on contact (Step 1/2):

| Property            | Value                                  |
| ------------------- | -------------------------------------- |
| `firstname`         | from payload                           |
| `lastname`          | from payload                           |
| `email`             | from payload                           |
| `phone`             | from payload                           |
| `resume_cover_note` | from payload (empty string if omitted) |
| `contact_type`      | `Provider`                             |
| `refer_source`      | `Website Form`                         |
| `website_form`      | `Apply Job`                            |

Properties set after file upload (Step 4):

| Property           | Value                       |
| ------------------ | --------------------------- |
| `therapist_resume` | Public URL of uploaded file |

**F. Success response:**

```json
{
  "success": true,
  "contactId": "12345",
  "fileUploaded": true,
  "fileUrl": "https://f.hubspotemail.net/...",
  "noteId": "67890",
  "fileError": null
}
```

When file upload fails: `fileUploaded: false`, `fileUrl: undefined`, `noteId: undefined`, `fileError: "Error message"`.

**G. Error handling:** Required fields: `firstName`, `email`.

**H. Field mapping:**

| Frontend field    | JSON key          | HubSpot property                      |
| ----------------- | ----------------- | ------------------------------------- |
| First name        | `firstName`       | `firstname`                           |
| Last name         | `lastName`        | `lastname`                            |
| Email             | `email`           | `email`                               |
| Phone             | `phone`           | `phone`                               |
| Cover note        | `resumeCoverNote` | `resume_cover_note`                   |
| Resume file (b64) | `resumeFile`      | `therapist_resume` (URL after upload) |
| Resume filename   | `resumeFileName`  | _(used as HubSpot file name)_         |

---

### 7.5 Facility Referral

**A. Purpose:** Allows a facility employee (administrator, social worker, etc.) to register their facility and express interest in partnering with BYT for on-site therapy services.

**B. Frontend location:**

- `apps/web/src/components/ui/ModalForms.astro`
- Modal ID: `#modal-refer`, form ID: `#referForm`
- Submit handler: `handleSubmit(event, 'refer')`

**C. API endpoint:** `POST /api/facility-referral`  
**Function file:** `functions/api/facility-referral.ts`

**D. Expected JSON payload:**

```json
{
  "facilityName": "Sunrise Senior Living",
  "facilityPhone": "555-200-3000",
  "facilityType": "Assisted Living (ALF)",
  "county": "Orange",
  "bedCount": "50–90",
  "firstName": "Maria",
  "lastName": "Santos",
  "email": "maria@sunrise.com",
  "phone": "555-200-3001",
  "role": "Social Worker",
  "whatSparkedInterest": "Patient needs,Staff recommendation",
  "anythingElse": "We serve mostly memory care residents."
}
```

| Field                 | Type   | Required | Notes                                    |
| --------------------- | ------ | -------- | ---------------------------------------- |
| `facilityName`        | string | Yes      | Used to search/create company            |
| `facilityPhone`       | string | No       | Stored on company record                 |
| `facilityType`        | string | Yes      | Mapped to short code (ALF/SNF/CCRC)      |
| `county`              | string | Yes      |                                          |
| `bedCount`            | string | Yes      | Mapped to HubSpot bucket                 |
| `firstName`           | string | No       |                                          |
| `lastName`            | string | No       |                                          |
| `email`               | string | Yes      |                                          |
| `phone`               | string | Yes      |                                          |
| `role`                | string | Yes      | Job title at facility                    |
| `whatSparkedInterest` | string | Yes      | Comma-separated; converted to semicolons |
| `anythingElse`        | string | No       |                                          |

**E. HubSpot operations (in order):**

1. **Step 1 — Company upsert:** Search by `facilityName`; if found → `PATCH`; if not → `POST` create
2. **Step 2 — Contact upsert:** Search by `email`; if found → `PATCH`; if not → `POST` create
3. **Step 3 — Association:** Contact → Company, `USER_DEFINED` / `5` ("Admin staff at facility")

All three steps are **fatal** — any failure returns an error response.

Properties set on Company:

| Property                | Value               |
| ----------------------- | ------------------- |
| `name`                  | `facilityName`      |
| `phone`                 | `facilityPhone`     |
| `facility_type`         | mapped short code   |
| `county`                | from payload        |
| `approximate_bed_count` | mapped bucket value |

Properties set on Contact:

| Property                       | Value                                  |
| ------------------------------ | -------------------------------------- |
| `firstname`                    | from payload                           |
| `lastname`                     | from payload                           |
| `email`                        | from payload                           |
| `phone`                        | from payload                           |
| `company`                      | `facilityName`                         |
| `hs_role`                      | from payload                           |
| `what_sparked_your_interest`   | comma-split, trimmed, semicolon-joined |
| `anything_else_we_should_know` | from payload (empty string if absent)  |
| `contact_type`                 | `Facility Employee`                    |
| `refer_source`                 | `Website Form`                         |
| `website_form`                 | `Refer Facility`                       |

**F. Success response:**

```json
{ "success": true, "companyId": "111", "contactId": "222" }
```

**G. Error handling:** Required fields: `facilityName`, `facilityType`, `county`, `email`, `phone`, `role`. Step failures return `{ "error": "Step N failed", "details": "..." }`.

**H. Field mapping:**

| Frontend field        | JSON key              | Object  | HubSpot property               |
| --------------------- | --------------------- | ------- | ------------------------------ |
| Facility name         | `facilityName`        | Company | `name`                         |
| Facility phone        | `facilityPhone`       | Company | `phone`                        |
| Facility type         | `facilityType`        | Company | `facility_type`                |
| County                | `county`              | Company | `county`                       |
| Bed count             | `bedCount`            | Company | `approximate_bed_count`        |
| First name            | `firstName`           | Contact | `firstname`                    |
| Last name             | `lastName`            | Contact | `lastname`                     |
| Email                 | `email`               | Contact | `email`                        |
| Phone                 | `phone`               | Contact | `phone`                        |
| Role                  | `role`                | Contact | `hs_role`                      |
| What sparked interest | `whatSparkedInterest` | Contact | `what_sparked_your_interest`   |
| Anything else         | `anythingElse`        | Contact | `anything_else_we_should_know` |

---

### 7.6 Resident Referral

**A. Purpose:** Allows a facility employee to refer a specific patient/resident to BYT therapy services. Creates up to four CRM objects: Company, Referrer contact, Patient contact, and (optionally) Guardian contact. Uploads any supporting clinical documents.

**B. Frontend location:**

- `apps/web/src/components/pages/ResidentReferralPage.astro`
- Form submits to `/api/referral`

**C. API endpoint:** `POST /api/referral`  
**Function file:** `functions/api/referral.ts`

**D. Expected JSON payload:**

```json
{
  "facilityName": "Sunrise Senior Living",
  "facilityPhone": "555-200-3000",
  "referrerFirstName": "Maria",
  "referrerLastName": "Santos",
  "referrerEmail": "maria@sunrise.com",
  "referrerPhone": "555-200-3001",
  "patientFirstName": "Robert",
  "patientLastName": "Chen",
  "guardianFirstName": "Linda",
  "guardianLastName": "Chen",
  "guardianPhone": "555-300-4000",
  "referralReason": "Depression and social isolation following stroke",
  "skilledNursing": "yes",
  "documents": [
    {
      "file": "data:application/pdf;base64,JVBERi0...",
      "name": "robert-chen-chart.pdf"
    }
  ]
}
```

| Field               | Type                                    | Required | Notes                                          |
| ------------------- | --------------------------------------- | -------- | ---------------------------------------------- |
| `facilityName`      | string                                  | Yes      |                                                |
| `facilityPhone`     | string                                  | Yes      |                                                |
| `referrerFirstName` | string                                  | Yes      |                                                |
| `referrerLastName`  | string                                  | Yes      |                                                |
| `referrerEmail`     | string                                  | Yes      |                                                |
| `referrerPhone`     | string                                  | Yes      |                                                |
| `patientFirstName`  | string                                  | Yes      |                                                |
| `patientLastName`   | string                                  | Yes      |                                                |
| `guardianFirstName` | string                                  | No       | If absent, no guardian record is created       |
| `guardianLastName`  | string                                  | No       |                                                |
| `guardianPhone`     | string                                  | No       |                                                |
| `referralReason`    | string                                  | Yes      |                                                |
| `skilledNursing`    | string                                  | Yes      | `"yes"` or `"no"` — title-cased before storage |
| `documents`         | `Array<{ file: string, name: string }>` | No       | Base64 data URLs                               |

**E. HubSpot operations (in order):**

1. **Step 1 — Company upsert:** Search by `facilityName`; create if not found (name + phone only)
2. **Step 2 — Referrer contact upsert:** Search by `referrerEmail`; create or update
3. **Step 3 — Patient contact upsert:** Search by first name + last name + company; create or update
4. **Step 4 — Guardian contact create:** Only if `guardianFirstName` is provided (always creates new record — no dedup)
5. **Step 5 — Associations (all fatal):**
   - 5a: Referrer → Company (`USER_DEFINED` / `5` — Admin staff at facility)
   - 5b: Patient → Company (`USER_DEFINED` / `1` — Patient at facility)
   - 5c (if guardian): Guardian → Company (`HUBSPOT_DEFINED` / `279`)
   - 5c (if guardian): Guardian → Patient (`USER_DEFINED` / `8`)
   - 5c (if guardian): Patient → Guardian (`USER_DEFINED` / `11`)
6. **Step 6 — Document uploads (non-fatal):** Each document uploaded to `/referral-documents`
7. **Step 7 — Note (non-fatal):** Single note with all uploaded file IDs joined with `;`

Properties set on Referrer contact:

| Property       | Value               |
| -------------- | ------------------- |
| `firstname`    | `referrerFirstName` |
| `lastname`     | `referrerLastName`  |
| `email`        | `referrerEmail`     |
| `phone`        | `referrerPhone`     |
| `company`      | `facilityName`      |
| `contact_type` | `Facility Employee` |
| `refer_source` | `Website Form`      |
| `website_form` | `Refer Resident`    |

Properties set on Patient contact:

| Property              | Value                                        |
| --------------------- | -------------------------------------------- |
| `firstname`           | `patientFirstName`                           |
| `lastname`            | `patientLastName`                            |
| `company`             | `facilityName`                               |
| `contact_type`        | `Patient`                                    |
| `reason_for_referral` | `referralReason`                             |
| `skilled_nursing`     | `skilledNursing` title-cased (`Yes` or `No`) |
| `refer_source`        | `Website Form`                               |
| `website_form`        | `Refer Resident`                             |

Properties set on Guardian contact:

| Property       | Value                         |
| -------------- | ----------------------------- |
| `firstname`    | `guardianFirstName`           |
| `lastname`     | `guardianLastName`            |
| `company`      | `facilityName`                |
| `phone`        | `guardianPhone` (if provided) |
| `contact_type` | `Guardian/Family`             |
| `refer_source` | `Website Form`                |
| `website_form` | `Refer Resident`              |

**F. Success response:**

```json
{
  "success": true,
  "companyId": "111",
  "referrerContactId": "222",
  "patientContactId": "333",
  "guardianContactId": "444",
  "uploadedUrls": ["https://f.hubspotemail.net/..."],
  "referralNoteId": "555",
  "uploadErrors": []
}
```

`guardianContactId` is `null` if no guardian was provided. `uploadedUrls` and `uploadErrors` are arrays (may be empty).

**G. Error handling:** Steps 1–5 are fatal; steps 6–7 are non-fatal. Each fatal step returns its own error key (`"Step N failed"`).

**H. Field mapping:**

| Frontend field      | JSON key            | Object  | HubSpot property       |
| ------------------- | ------------------- | ------- | ---------------------- |
| Facility name       | `facilityName`      | Company | `name`                 |
| Facility phone      | `facilityPhone`     | Company | `phone`                |
| Referrer first name | `referrerFirstName` | Contact | `firstname`            |
| Referrer last name  | `referrerLastName`  | Contact | `lastname`             |
| Referrer email      | `referrerEmail`     | Contact | `email`                |
| Referrer phone      | `referrerPhone`     | Contact | `phone`                |
| Patient first name  | `patientFirstName`  | Contact | `firstname`            |
| Patient last name   | `patientLastName`   | Contact | `lastname`             |
| Guardian first name | `guardianFirstName` | Contact | `firstname`            |
| Guardian last name  | `guardianLastName`  | Contact | `lastname`             |
| Guardian phone      | `guardianPhone`     | Contact | `phone`                |
| Referral reason     | `referralReason`    | Contact | `reason_for_referral`  |
| Skilled nursing     | `skilledNursing`    | Contact | `skilled_nursing`      |
| Documents (array)   | `documents`         | Files   | `/referral-documents/` |

---

### 7.7 Patient Intake

**A. Purpose:** Internal admin form for creating patient records directly in HubSpot. Captures full patient demographics, insurance details, provider references, and an optional Responsible Party (RP). Not surfaced via the public site layout.

**B. Frontend location:**

- `apps/web/src/pages/intake.astro` — standalone page, no site layout

**C. API endpoint:** `POST /api/intake`  
**Function file:** `functions/api/intake.ts`

**D. Expected JSON payload:**

```json
{
  "firstName": "Robert",
  "lastName": "Chen",
  "address": "123 Main St",
  "city": "Orlando",
  "state": "FL",
  "zip": "32801",
  "phone": "555-100-2000",
  "fax": "555-100-2001",
  "email": "robert@example.com",
  "dob": "1955-04-12",
  "ssn": "123-45-6789",
  "primaryInsurance": "Blue Cross",
  "primaryPolicyNumber": "BCB123456",
  "secondaryInsurance": "Medicare",
  "secondaryPolicyNumber": "MED789",
  "referringCompany": "Sunrise Senior Living",
  "reasonForReferral": "Depression following stroke",
  "pcpName": "Dr. Jane Smith",
  "pcpAddress": "456 Oak Ave, Orlando FL",
  "pcpPhone": "555-200-3000",
  "pcpFax": "555-200-3001",
  "otherProviderName": "Dr. Tom Brown",
  "otherProviderAddress": "789 Pine Rd, Orlando FL",
  "otherProviderPhone": "555-300-4000",
  "otherProviderFax": "555-300-4001",
  "insuranceCardFront": "data:image/jpeg;base64,/9j/4AAQ...",
  "insuranceCardBack": "data:image/jpeg;base64,/9j/4AAQ...",
  "rpFirstName": "Linda",
  "rpLastName": "Chen",
  "rpAddress": "123 Main St, Orlando FL",
  "rpPhone": "555-400-5000",
  "rpFax": "555-400-5001",
  "rpEmail": "linda@example.com"
}
```

| Field                   | Type           | Required | Notes                                                                    |
| ----------------------- | -------------- | -------- | ------------------------------------------------------------------------ |
| `firstName`             | string         | Yes      |                                                                          |
| `lastName`              | string         | Yes      |                                                                          |
| `address`               | string         | No       |                                                                          |
| `city`                  | string         | No       |                                                                          |
| `state`                 | string         | No       |                                                                          |
| `zip`                   | string         | No       |                                                                          |
| `phone`                 | string         | Yes      |                                                                          |
| `fax`                   | string         | No       |                                                                          |
| `email`                 | string         | No       | If present, used for dedup; if absent, name+company dedup is used        |
| `dob`                   | string         | Yes      | Date of birth (ISO 8601 or display string)                               |
| `ssn`                   | string         | No       |                                                                          |
| `primaryInsurance`      | string         | No       |                                                                          |
| `primaryPolicyNumber`   | string         | No       |                                                                          |
| `secondaryInsurance`    | string         | No       |                                                                          |
| `secondaryPolicyNumber` | string         | No       |                                                                          |
| `referringCompany`      | string         | No       | Stored as `company` on patient; also used for name dedup if no email     |
| `reasonForReferral`     | string         | No       |                                                                          |
| `pcpName`               | string         | No       |                                                                          |
| `pcpAddress`            | string         | No       |                                                                          |
| `pcpPhone`              | string         | No       |                                                                          |
| `pcpFax`                | string         | No       |                                                                          |
| `otherProviderName`     | string         | No       |                                                                          |
| `otherProviderAddress`  | string         | No       |                                                                          |
| `otherProviderPhone`    | string         | No       |                                                                          |
| `otherProviderFax`      | string         | No       |                                                                          |
| `insuranceCardFront`    | string \| null | No       | Base64 data URL (image)                                                  |
| `insuranceCardBack`     | string \| null | No       | Base64 data URL (image)                                                  |
| `rpFirstName`           | string         | No       | If absent, no RP record is created                                       |
| `rpLastName`            | string         | No       |                                                                          |
| `rpAddress`             | string         | No       |                                                                          |
| `rpPhone`               | string         | No       |                                                                          |
| `rpFax`                 | string         | No       |                                                                          |
| `rpEmail`               | string         | No       | If present, used for RP dedup; if absent, always creates a new RP record |

**E. HubSpot operations (in order):**

1. **Step 1 — Patient contact upsert (fatal):**
   - If `email` is present → `searchContactByEmail`; if found → `PATCH`; if not → `POST` create
   - If `email` is absent → `searchContactByName(firstName, lastName, referringCompany)`; if found → `PATCH`; if not → `POST` create
2. **Step 2 — Responsible Party upsert (fatal, only if `rpFirstName` is present):**
   - If `rpEmail` is present → `searchContactByEmail(rpEmail)`; if found → `PATCH`; if not → `POST` create
   - If `rpEmail` is absent → always `POST` create new RP record (no dedup)
3. **Step 3 — Associations (fatal, only if RP was created):**
   - RP → Patient: `USER_DEFINED` / `8` (Guardian → Patient)
   - Patient → RP: `USER_DEFINED` / `11` (Patient → Guardian)
4. **Step 4 — Insurance card uploads (non-fatal):**
   - If `insuranceCardFront` present → upload to `/intake-documents/`, create note: `"Insurance card insurance-card-front uploaded via intake form"`
   - If `insuranceCardBack` present → upload to `/intake-documents/`, create note: `"Insurance card insurance-card-back uploaded via intake form"`
   - Each card is uploaded and noted independently; failure of one does not block the other

Steps 1–3 are **fatal** — any failure returns an error response and halts execution. Step 4 is **non-fatal** — failures are collected in `fileError` but `success: true` is still returned.

Properties set on Patient contact:

| Property                  | Value                                |
| ------------------------- | ------------------------------------ |
| `firstname`               | `firstName`                          |
| `lastname`                | `lastName`                           |
| `phone`                   | `phone`                              |
| `date_of_birth`           | `dob`                                |
| `contact_type`            | `Patient`                            |
| `refer_source`            | `Website Form`                       |
| `website_form`            | `Patient Intake`                     |
| `address`                 | `address` (if present)               |
| `city`                    | `city` (if present)                  |
| `state`                   | `state` (if present)                 |
| `zip`                     | `zip` (if present)                   |
| `fax`                     | `fax` (if present)                   |
| `email`                   | `email` (if present)                 |
| `social_security_number`  | `ssn` (if present)                   |
| `primary_insurance`       | `primaryInsurance` (if present)      |
| `primary_policy_number`   | `primaryPolicyNumber` (if present)   |
| `secondary_insurance`     | `secondaryInsurance` (if present)    |
| `secondary_policy_number` | `secondaryPolicyNumber` (if present) |
| `company`                 | `referringCompany` (if present)      |
| `reason_for_referral`     | `reasonForReferral` (if present)     |
| `pcp_name`                | `pcpName` (if present)               |
| `pcp_address`             | `pcpAddress` (if present)            |
| `pcp_phone`               | `pcpPhone` (if present)              |
| `pcp_fax`                 | `pcpFax` (if present)                |
| `other_provider_name`     | `otherProviderName` (if present)     |
| `other_provider_address`  | `otherProviderAddress` (if present)  |
| `other_provider_phone`    | `otherProviderPhone` (if present)    |
| `other_provider_fax`      | `otherProviderFax` (if present)      |

Properties set on RP contact (if created):

| Property       | Value                    |
| -------------- | ------------------------ |
| `firstname`    | `rpFirstName`            |
| `lastname`     | `rpLastName`             |
| `contact_type` | `Guardian/Family`        |
| `refer_source` | `Website Form`           |
| `website_form` | `Patient Intake`         |
| `address`      | `rpAddress` (if present) |
| `phone`        | `rpPhone` (if present)   |
| `fax`          | `rpFax` (if present)     |
| `email`        | `rpEmail` (if present)   |

**F. Success response:**

```json
{
  "success": true,
  "patientContactId": "12345",
  "rpContactId": "67890",
  "fileError": null
}
```

`rpContactId` is `null` if no RP was provided. `fileError` is `null` on success, or a string (semicolon-joined if both cards failed) when one or both uploads failed.

**G. Error handling:**

| Scenario                      | HTTP status | Response body                                                         |
| ----------------------------- | ----------- | --------------------------------------------------------------------- |
| Missing `firstName`           | 400         | `{ "success": false, "error": "Missing required field: firstName" }`  |
| Missing `lastName`            | 400         | `{ "success": false, "error": "Missing required field: lastName" }`   |
| Missing `phone`               | 400         | `{ "success": false, "error": "Missing required field: phone" }`      |
| Missing `dob`                 | 400         | `{ "success": false, "error": "Missing required field: dob" }`        |
| Invalid JSON                  | 400         | `{ "success": false, "error": "Invalid JSON body" }`                  |
| `HUBSPOT_SERVICE_KEY` missing | 500         | `{ "success": false, "error": "HUBSPOT_SERVICE_KEY not configured" }` |
| Step 1 (patient upsert) fails | 500         | `{ "success": false, "error": "Step 1 failed", "details": "..." }`    |
| Step 2 (RP upsert) fails      | 500         | `{ "success": false, "error": "Step 2 failed", "details": "..." }`    |
| Step 3 (association) fails    | 500         | `{ "success": false, "error": "Step 3 failed", "details": "..." }`    |
| Insurance card upload fails   | 200         | `{ "success": true, ..., "fileError": "Error message" }` (non-fatal)  |

**H. Field mapping:**

| Frontend field          | JSON key                | HubSpot property                                       |
| ----------------------- | ----------------------- | ------------------------------------------------------ |
| First name              | `firstName`             | `firstname`                                            |
| Last name               | `lastName`              | `lastname`                                             |
| Address                 | `address`               | `address`                                              |
| City                    | `city`                  | `city`                                                 |
| State                   | `state`                 | `state`                                                |
| ZIP                     | `zip`                   | `zip`                                                  |
| Phone                   | `phone`                 | `phone`                                                |
| Fax                     | `fax`                   | `fax`                                                  |
| Email                   | `email`                 | `email`                                                |
| Date of birth           | `dob`                   | `date_of_birth`                                        |
| SSN                     | `ssn`                   | `social_security_number`                               |
| Primary insurance       | `primaryInsurance`      | `primary_insurance`                                    |
| Primary policy number   | `primaryPolicyNumber`   | `primary_policy_number`                                |
| Secondary insurance     | `secondaryInsurance`    | `secondary_insurance`                                  |
| Secondary policy number | `secondaryPolicyNumber` | `secondary_policy_number`                              |
| Referring company       | `referringCompany`      | `company`                                              |
| Reason for referral     | `reasonForReferral`     | `reason_for_referral`                                  |
| PCP name                | `pcpName`               | `pcp_name`                                             |
| PCP address             | `pcpAddress`            | `pcp_address`                                          |
| PCP phone               | `pcpPhone`              | `pcp_phone`                                            |
| PCP fax                 | `pcpFax`                | `pcp_fax`                                              |
| Other provider name     | `otherProviderName`     | `other_provider_name`                                  |
| Other provider address  | `otherProviderAddress`  | `other_provider_address`                               |
| Other provider phone    | `otherProviderPhone`    | `other_provider_phone`                                 |
| Other provider fax      | `otherProviderFax`      | `other_provider_fax`                                   |
| Insurance card (front)  | `insuranceCardFront`    | _(uploaded to `/intake-documents/`, noted on contact)_ |
| Insurance card (back)   | `insuranceCardBack`     | _(uploaded to `/intake-documents/`, noted on contact)_ |
| RP first name           | `rpFirstName`           | `firstname` (RP contact)                               |
| RP last name            | `rpLastName`            | `lastname` (RP contact)                                |
| RP address              | `rpAddress`             | `address` (RP contact)                                 |
| RP phone                | `rpPhone`               | `phone` (RP contact)                                   |
| RP fax                  | `rpFax`                 | `fax` (RP contact)                                     |
| RP email                | `rpEmail`               | `email` (RP contact)                                   |

---

## 8. File Upload Flow

### Frontend (Browser)

```javascript
// User selects file via <input type="file">
const file = input.files[0];
const reader = new FileReader();
reader.onload = (e) => {
  const base64DataUrl = e.target.result;
  // e.g. "data:application/pdf;base64,JVBERi0xLjQK..."
  payload.resumeFile = base64DataUrl;
  payload.resumeFileName = file.name;
};
reader.readAsDataURL(file);
```

The full base64 data URL (including the `data:{mime};base64,` prefix) is sent as a string in the JSON payload.

### Backend (Pages Function)

Inside `uploadFileToHubSpot()` in `_hubspot.ts`:

```
1. Parse data URL with regex: /^data:([^;]+);base64,(.+)$/s
   - group 1 → MIME type (e.g. "application/pdf")
   - group 2 → base64-encoded content

2. Decode: Uint8Array.from(atob(base64Content), c => c.charCodeAt(0))

3. Build FormData:
   - file: new Blob([binary], { type: mimeType }), filename
   - options: { access: "PUBLIC_NOT_INDEXABLE", overwrite: false }
   - folderPath: "/resumes" or "/referral-documents"

4. POST to: https://api.hubapi.com/filemanager/api/v3/files/upload
   Headers: { Authorization: "Bearer {key}" }
   (No Content-Type — fetch sets multipart boundary automatically)

5. Parse response: data.url ?? data.objects[0].url
                   data.id  ?? data.objects[0].id
```

### HubSpot Files API

| Parameter    | Value                                                      |
| ------------ | ---------------------------------------------------------- |
| Endpoint     | `POST /filemanager/api/v3/files/upload`                    |
| Auth         | `Authorization: Bearer {key}` (no Content-Type)            |
| `file`       | Binary blob with correct MIME type                         |
| `options`    | `{ "access": "PUBLIC_NOT_INDEXABLE", "overwrite": false }` |
| `folderPath` | `/resumes` (apply) or `/referral-documents` (referral)     |

### Access Level: PUBLIC_NOT_INDEXABLE

Files are `PUBLIC_NOT_INDEXABLE` rather than `PRIVATE` because HubSpot note attachments require a publicly accessible URL to render the file preview in the CRM timeline. `PRIVATE` files return access-denied errors when the CRM tries to display them. `PUBLIC_NOT_INDEXABLE` means the URL is accessible to anyone with the link but is not surfaced in search indexes.

### After Upload

**apply.ts:**

1. `PATCH` contact: set `therapist_resume` = file URL
2. `POST` note: `hs_attachment_ids` = file ID, body = `"Resume uploaded via website: {filename}"`

**referral.ts:**

1. Collect all uploaded file IDs into array
2. `POST` single note with `hs_attachment_ids` = all IDs joined with `;`, body = `"Referral documents uploaded via website: {filenames}"`

### Note Engagement API

```
POST https://api.hubapi.com/crm/v3/objects/notes
{
  "properties": {
    "hs_timestamp": "{ISO 8601 datetime}",
    "hs_note_body": "{note text}",
    "hs_attachment_ids": "{fileId}" or "{id1;id2;id3}"
  },
  "associations": [
    {
      "to": { "id": "{contactId}" },
      "types": [{ "associationCategory": "HUBSPOT_DEFINED", "associationTypeId": 202 }]
    }
  ]
}
```

`associationTypeId: 202` is HubSpot's built-in Note → Contact association.

---

## 9. Shared Helpers Reference

All functions exported from `functions/api/_hubspot.ts`:

---

### `hubspotHeaders(key: string): Record<string, string>`

Returns standard JSON + auth headers for all CRM API calls.

```typescript
{ Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
```

**Not used** for file uploads (Content-Type must be omitted so fetch can set multipart boundary).

---

### `jsonResponse(body: unknown, status: number): Response`

Wraps any value in a JSON Response with CORS headers attached.

```typescript
return new Response(JSON.stringify(body), {
  status,
  headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
});
```

---

### `searchContactByEmail(email: string, apiKey: string): Promise<string | null>`

Searches contacts by exact email match. Returns the contact's HubSpot ID or `null` if not found (or on API error).

- **Endpoint:** `POST /crm/v3/objects/contacts/search`
- **Returns:** `string` (ID) or `null`
- **Error handling:** Returns `null` on non-OK response (does not throw)

---

### `createContact(properties: Record<string, string>, apiKey: string): Promise<string>`

Creates a new contact with the given properties. Returns the new contact's ID.

- **Endpoint:** `POST /crm/v3/objects/contacts`
- **409 handling:** If HubSpot returns 409 (duplicate email), extracts the existing contact ID from the error message (`"Existing ID: {id}"`) and returns it
- **Other errors:** Throws with message including HTTP status and body

---

### `updateContact(contactId: string, properties: Record<string, string>, apiKey: string): Promise<void>`

Updates an existing contact by ID.

- **Endpoint:** `PATCH /crm/v3/objects/contacts/{contactId}`
- **Error handling:** Throws on non-OK response

---

### `searchCompanyByName(name: string, apiKey: string): Promise<string | null>`

Searches companies by exact name match. Returns company ID or `null`.

- **Endpoint:** `POST /crm/v3/objects/companies/search`
- **Returns:** `string` (ID) or `null`
- **Error handling:** Returns `null` on non-OK response

---

### `createCompany(properties: Record<string, string>, apiKey: string): Promise<string>`

Creates a new company. Returns the new company's ID.

- **Endpoint:** `POST /crm/v3/objects/companies`
- **Error handling:** Throws on non-OK response (no 409 handling — company names can duplicate)

---

### `updateCompany(companyId: string, properties: Record<string, string>, apiKey: string): Promise<void>`

Updates an existing company by ID.

- **Endpoint:** `PATCH /crm/v3/objects/companies/{companyId}`
- **Error handling:** Throws on non-OK response

---

### `searchContactByName(firstName: string, lastName: string, company: string, apiKey: string): Promise<string | null>`

Searches contacts by exact match on first name, last name, and company. Used when a contact has no email address (e.g. patients in the intake form).

- **Endpoint:** `POST /crm/v3/objects/contacts/search`
- **Filter:** `firstname EQ + lastname EQ + company EQ` (all three must match)
- **Returns:** `string` (ID) or `null`
- **Error handling:** Returns `null` on non-OK response (does not throw)
- **Reliability note:** Less reliable than email dedup — will miss contacts whose name or company changed, and will create duplicates if two contacts share the same full name and company

---

### `associate(fromType: string, fromId: string, toType: string, toId: string, category: string, typeId: number, apiKey: string): Promise<void>`

Creates an association between two CRM objects using the HubSpot v4 associations API.

- **Endpoint:** `PUT /crm/v4/objects/{fromType}/{fromId}/associations/{toType}/{toId}`
- **Body:** `[{ associationCategory: category, associationTypeId: typeId }]`
- **Error handling:** Throws on non-OK response with message including status and body
- **Usage:** Always called in reciprocal pairs for contact↔contact associations (e.g. Guardian→Patient label 8, then Patient→Guardian label 11)

---

### `uploadFileToHubSpot(base64DataUrl: string, fileName: string, folderPath: string, apiKey: string): Promise<{ url: string; id: string }>`

Uploads a file to HubSpot File Manager. Returns `{ url, id }`.

- **Endpoint:** `POST /filemanager/api/v3/files/upload`
- **Auth:** Bearer only (no Content-Type header — multipart boundary must be set by fetch)
- **Parses:** data URL into MIME type + binary content
- **Throws:** If data URL is invalid, upload fails, or response lacks url/id

---

### `createNote(fileIds: string, noteBody: string, contactId: string, apiKey: string): Promise<string>`

Creates a Note engagement in HubSpot attached to a contact, with file attachment IDs.

- **Endpoint:** `POST /crm/v3/objects/notes`
- **`fileIds`:** Single ID or semicolon-separated list for multiple files
- **Association:** `HUBSPOT_DEFINED` / `202` (Note → Contact)
- **Returns:** Note ID
- **Throws:** On non-OK response

---

### Constants

| Export         | Value                                       | Used for                   |
| -------------- | ------------------------------------------- | -------------------------- |
| `HUBSPOT_BASE` | `https://api.hubapi.com`                    | Base URL for all API calls |
| `CORS_HEADERS` | `{ Access-Control-Allow-Origin: '*', ... }` | Added to all responses     |
| `Env`          | `{ HUBSPOT_SERVICE_KEY?: string }`          | Pages Function env type    |

---

## 10. Multi-Select Field Handling

HubSpot stores multi-select property values as a single string with values separated by semicolons (`;`). Frontend checkboxes typically produce comma-separated values.

### The Conversion

```typescript
// Frontend sends: "weekday-am,evenings,weekends"
// Backend converts to: "Weekday mornings;Evenings;Weekends"

bestTimesToReachYou
  .split(',')
  .map((s) => AVAIL_MAP[s.trim()] ?? s.trim())
  .filter(Boolean)
  .join(';');
```

For `what_sparked_your_interest` (facility-referral), no label mapping is needed — values pass through as-is:

```typescript
whatSparkedInterest
  .split(',')
  .map((s) => s.trim())
  .join(';');
```

### Affected Properties

| HubSpot property             | Form              | Mapping applied          |
| ---------------------------- | ----------------- | ------------------------ |
| `best_times_to_reach_you`    | book-session      | Yes — `AVAIL_MAP` lookup |
| `what_sparked_your_interest` | facility-referral | No — values pass through |

### Rule

Any property defined as a multi-select in HubSpot **must** use `;` as the delimiter. Sending comma-separated values will cause HubSpot to reject the update or store the entire string as a single option.

---

## 11. Upsert Logic

All contact and company writes follow the same search-first pattern to avoid duplicates.

### Contact Upsert

```
1. searchContactByEmail(email)
   └─ POST /crm/v3/objects/contacts/search
      filter: email EQ {value}

2a. If found (existingId != null):
    updateContact(existingId, props)
    └─ PATCH /crm/v3/objects/contacts/{id}
    Returns: existingId

2b. If not found:
    createContact(props)
    └─ POST /crm/v3/objects/contacts
    Returns: new ID

    If 409 conflict:
    Extract ID from error message: /Existing ID:\s*(\d+)/i
    Returns: extracted ID
```

**On update:** All properties in the payload are overwritten. HubSpot does not merge — it replaces the given fields.

**On create with 409:** The 409 can occur if a contact was created by another means (import, another form) between the search and the create. The existing ID is extracted from HubSpot's error message and returned as if the create succeeded.

### Company Upsert

```
1. searchCompanyByName(name)
   └─ POST /crm/v3/objects/companies/search
      filter: name EQ {value}

2a. If found: updateCompany(existingId, props)
2b. If not found: createCompany(props)
```

No 409 handling for companies — HubSpot allows duplicate company names.

### Patient Contact Dedup (referral.ts only)

The patient has no email, so dedup uses a three-field match:

```
searchContactByName(firstName, lastName, companyName)
   filter: firstname EQ + lastname EQ + company EQ
```

This is less reliable than email dedup — it will miss patients whose name or company changed, and will create duplicates if two patients have the same full name at the same facility.

---

## 12. How to Add a New Form

Follow every step in order. Do not skip.

### Step 1 — Define fields and property mappings

Before writing any code:

- List every field the user will fill in
- Map each field to an existing HubSpot contact/company property
- Identify any new custom properties needed
- Decide: which `contact_type` value applies?
- Decide: are any company records created?
- Decide: are any associations created?
- Decide: is a file upload needed?

### Step 2 — Create custom properties in HubSpot

For any new custom property:

1. Go to HubSpot → Settings → Properties → Contact properties (or Company)
2. Create the property with the correct type (text, select, multi-select, etc.)
3. Note the **internal name** exactly — this is what goes in the API payload
4. For select/multi-select: create all option values upfront

### Step 3 — Create the Pages Function

```
functions/api/{form-name}.ts
```

Template structure:

```typescript
import type { Env } from './_hubspot';
import {
  CORS_HEADERS,
  jsonResponse,
  searchContactByEmail,
  createContact,
  updateContact,
  // add: searchCompanyByName, createCompany, updateCompany (if needed)
  // add: uploadFileToHubSpot, createNote (if needed)
} from './_hubspot';

interface {FormName}Body {
  // all expected fields with types
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const key = context.env.HUBSPOT_SERVICE_KEY;
  if (!key) return jsonResponse({ success: false, error: 'HUBSPOT_SERVICE_KEY not configured' }, 500);

  let body: {FormName}Body;
  try {
    body = (await context.request.json()) as {FormName}Body; // safe: validated below
  } catch {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  // Validate required fields
  const required: Record<string, string> = { /* field: value */ };
  for (const [field, val] of Object.entries(required)) {
    if (!val || !val.trim())
      return jsonResponse({ success: false, error: `Missing required field: ${field}` }, 400);
  }

  // Build props object
  const props: Record<string, string> = {
    // ... field mappings ...
    refer_source: 'Website Form',
    website_form: '{FormDisplayName}',
  };

  // Upsert contact
  let contactId: string;
  try {
    const existingId = await searchContactByEmail(email, key);
    if (existingId) {
      await updateContact(existingId, props, key);
      contactId = existingId;
    } else {
      contactId = await createContact(props, key);
    }
  } catch (err) {
    return jsonResponse({ success: false, error: 'HubSpot error', details: String(err) }, 500);
  }

  return jsonResponse({ success: true, contactId }, 200);
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
```

### Step 4 — Import helpers from \_hubspot.ts

Only import what you use. Never duplicate helper functions locally.

### Step 5 — Define required vs optional fields

- Required fields: validate with the `for...of` loop shown above
- Optional fields: use `?? ''` or `?? undefined` in the props object
- Never throw on missing optional fields

### Step 6 — Handle multi-select semicolons

For any multi-select HubSpot property:

```typescript
// comma-separated input → semicolon-separated for HubSpot
const hubspotValue = inputValue
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .join(';');
```

If values need label mapping (like `best_times_to_reach_you`), define a `Record<string, string>` map and look up each value.

### Step 7 — Always set refer_source and website_form

Every contact created through a form **must** include:

```typescript
refer_source: 'Website Form',
website_form: '{FormDisplayName}',
```

These are required for CRM filtering, reporting, and lead source attribution.

### Step 8 — Wire the frontend form

```javascript
const res = await fetch('/api/{form-name}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
const data = await res.json();
if (data.success) {
  /* show success state */
} else {
  /* show error state */
}
```

The route `/api/{form-name}` automatically maps to `functions/api/{form-name}.ts` via Cloudflare Pages Functions routing.

### Step 9 — Handle file uploads (if needed)

Frontend — read file as base64 data URL before submission:

```javascript
const reader = new FileReader();
reader.onload = (e) => {
  payload.resumeFile = e.target.result; // full data URL
  payload.resumeFileName = file.name;
};
reader.readAsDataURL(file);
```

Backend — use `uploadFileToHubSpot()` from `_hubspot.ts`. Make the upload **non-fatal**: catch the error, set a `fileError` flag, and still return `success: true` so the contact record is not lost.

After upload: call `updateContact()` to set the URL property, then `createNote()` with the file ID.

### Step 10 — Test with curl first

```bash
curl -X POST https://{your-pages-domain}/api/{form-name} \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test"}'
```

Verify: HTTP 200 + `"success": true` in response body.

### Step 11 — Verify in HubSpot

After a test submission, check the HubSpot CRM manually:

- [ ] Contact exists with correct email
- [ ] All mapped properties are populated with correct values
- [ ] `contact_type` is correct
- [ ] `refer_source` = `Website Form`
- [ ] `website_form` = correct form name
- [ ] Company created (if applicable) with correct properties
- [ ] Associations appear on contact record (if applicable)
- [ ] File appears in Files Manager under the correct folder (if applicable)
- [ ] Note appears in contact timeline with file attachment (if applicable)
- [ ] Multi-select properties show multiple chips (not one long string)
