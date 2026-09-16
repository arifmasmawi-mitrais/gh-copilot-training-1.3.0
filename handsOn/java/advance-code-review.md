--
mode: 'ask'
model: GPT-4.1
description: 'Review code based on Java coding standards'
applyTo: "**/*.java"
parameters:
    filename:
        type: string
        description: 'The Java file to be reviewed (e.g., NoteController.java)'
        required: true
---

# Java Coding Standards

- Use **meaningful, descriptive names** for classes, methods, and variables (CamelCase for classes, camelCase for methods/variables).
- **Class and method visibility**: Use the most restrictive visibility that makes sense (prefer `private`/`protected` over `public`).
- **Constants**: Use `static final` for constants, and name them in ALL_CAPS.
- **Indent code with 4 spaces** per level.
- **Braces**: Always use braces `{}` for blocks, even for single statements.
- **Imports**: Place all import statements at the top of the file; avoid wildcard imports (`import x.*`).
- **Exception handling**: Catch specific exceptions, log errors, and provide meaningful messages.
- **Javadoc**: Document all public classes and methods with Javadoc comments.
- **Limit lines to 120 characters**.
- **Avoid magic numbers and strings**; use named constants.
- **Prefer interfaces for abstraction**; use dependency injection for services.
- **Immutable objects**: Favor immutability where possible, especially for DTOs.
- **Unit tests**: Write JUnit tests for both happy and negative paths.
- **Annotations**: Use Spring annotations (`@Service`, `@Repository`, `@RestController`, etc.) appropriately.
- **Error responses**: Return structured error responses (see `GlobalExceptionHandler`).
- **Validation**: Use Bean Validation (`@Valid`, `@NotNull`, etc.) for request data.
- **Logging**: Use SLF4J for logging; avoid `System.out.println`.
- **Security**: No hardcoded secrets, credentials, or raw SQL; use parameterized queries and environment variables.
- **Performance**: Watch for N+1 queries, blocking I/O, large payloads, memory leaks, and lack of caching.
- **Timestamp handling**: Use UTC for timestamps and format consistently (e.g., ISO 8601).
- **Tests**: Ensure comprehensive test coverage for both:
    - **Happy paths** – valid input, correct state transitions, expected outputs.
    - **Negative paths** – invalid inputs, missing fields, expired tokens, rate-limiting, authentication failure, timeouts, unexpected errors.

Scan {{filename}}, do code review using the above Java coding standards as a checklist.