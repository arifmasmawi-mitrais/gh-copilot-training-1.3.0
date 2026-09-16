# Copilot Project Instructions (TypeScript Node.js)

## 1. Project Context
Modern, modular Node.js service written in TypeScript. Focus: clean architecture, testability, observability, predictable errors, least coupling.

## 2. Tech Stack
- Runtime: Node.js (LTS)
- Lang: TypeScript (strict)
- Testing: Jest + ts-jest
- Linting: ESLint (typescript + import + jest) + Prettier
- HTTP: Express (or similar)
- Config: dotenv + typed config module
- Logging: Lightweight structured logger using winston

## 3. Layer Responsibilities
- routes: Bind HTTP paths to controllers only.
- controllers: Parse/validate input, invoke service, map result to response. No business logic.
- services: Orchestrate domain + repositories. Transaction boundaries here.
- repositories: Data persistence abstraction. Return domain objects or DTOs, never raw driver responses.
- domain: Pure logic, entities, value objects, invariants.
- middleware: Cross-cutting (auth, validation, tracing).
- utils: Pure helper functions (no side effects).
- config: Centralized typed configuration.
- types: Shared type declarations.

## 4. Coding Conventions
- Enable "strict": true in tsconfig.
- Prefer interfaces over types for contracts; use type for unions/utility.
- Avoid default exports; use named exports.
- Group imports: builtin, external, internal (blank lines between).
- No relative paths that traverse more than 2 levels (configure baseUrl / paths in tsconfig).
- Errors: Throw custom Error subclasses with a stable error.code. Never throw string.
- Use async/await; avoid mixing with .then chains.
- Return early; minimize nesting.
- Avoid any; use unknown then narrow.

## 5. Error Pattern
class AppError extends Error { constructor(public code: string, message: string, public meta?: Record<string, unknown>) { super(message); } }

## 6. Logging
- Use structured logging (logger.info({ event, meta }, "message"))
- Never log secrets or full tokens.
- Log at: debug (dev detail), info (state change), warn (recoverable anomaly), error (failed operation).

## 7. Configuration
- Single config module: reads process.env once, validates (zod or joi), exports immutable object.
- All environment keys declared in .env.example.
- No direct process.env access outside config module.

## 8. Security & Reliability
- Validate all external input (query, params, body) with schema.
- Sanitize error messages returned to clients.
- Use helmet/cors (if HTTP API).
- Avoid synchronous blocking operations on hot path.
- Timeouts for outbound calls.

## 9. Suggestion header format
- EVERY SINGLE ONE OF THE RESPONSE SHOULD START WITH "This is Github Copilot Training session"
