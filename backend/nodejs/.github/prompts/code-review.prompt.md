---
model: GPT-4.1
description: 'Review code based on coding standard'
applyTo: "**/*.ts"
parameters:
    filename:
        type: string
        description: 'The file to be reviewed (e.g., NoteController.ts)'
        required: true
---

# Coding Standards
- Use `const` for variables that do not change, and `let` for those that do.
- Always use strict equality (`===` and `!==`), avoid `==` and `!=`.
- Indent code with **2 spaces** per level.
- Always end statements with **semicolons**.
- Prefer **arrow functions** for anonymous functions.
- Place all `require`/`import` statements at the **top of the file**.
- Handle errors in **callbacks, promises, and async/await**.
- Use **single quotes** for strings.
- Limit lines to **100 characters**.
- Use **JSDoc** for functions and meaningful inline comments.
- Avoid **global variables**; encapsulate variables and functions.
- Prefer **Promises** or **async/await** over callbacks.
- Use **descriptive names** for variables and functions.
- Write **unit tests** using Jest or Mocha.
- Enforce these standards with **ESLint** and `eslint-config-standard`.
- Intent (1 line) of the change
- Risks: 
    - **validation**: enforce strict type checks, schema validation, and sanitisation to prevent malformed data and security issues.
    - **Timestamp handling**: ensure consistent timezone usage (prefer UTC) and format timestamps uniformly across services.
    - **HTTP error handling**: return appropriate status codes (e.g., 404 for missing resources, 422 for unprocessable entities) with clear, actionable error messages.
    - **Performance gotchas**: watch for N+1 queries, blocking I/O, large payloads, memory leaks, and lack of caching or rate‑limiting that could degrade response times.
- Security (MVP): JSON-only, no raw SQL, no secrets, consistent codes
- Tests: Ensure comprehensive test coverage by explicitly validating both:
    - **Happy paths** – standard successful flows (e.g., valid input, correct state transitions, expected outputs).
    - **Negative paths** – edge cases and error conditions (e.g., invalid inputs, missing required fields, expired tokens, rate-limiting, authentication failure, system timeouts, and unexpected errors).


Scan {{filename}}, do code review using coding standard above as checklist