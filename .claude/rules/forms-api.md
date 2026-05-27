---
paths: functions/api/**
---

# Rules for HubSpot Form Handlers

1. No console.log in any form handler. This is a Hard Rule in CLAUDE.md. All handlers are production Cloudflare Workers.

2. Every form handler must import Env from _hubspot.ts. Never re-declare a local Env interface — it silently drops RESEND_API_KEY and ALERT_EMAIL, breaking error alerts.

3. Every error path in every handler must call reportFormError(). If a catch block or validation failure does not call reportFormError, the error is silently swallowed with no alert email.

4. Before modifying any form handler, read docs/hubspot-forms-spec.md in full. Do not rely on memory for HubSpot property names, association labels, or payload formats.

5. After modifying any handler, verify:
   - grep -n "console.log" [file] returns 0 results
   - grep -n "reportFormError" [file] returns results on every error path
   - grep -n "interface Env" [file] returns 0 results (must use shared Env)
