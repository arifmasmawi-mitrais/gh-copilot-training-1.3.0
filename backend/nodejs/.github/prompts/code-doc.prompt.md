---
model: GPT-4.1
description: 'Generate information for each function as a documentation (JSDoc)'
parameters:
    filename:
        type: string
        description: 'Generate JSDoc for the selected code following there patterns apply to {{filename}}'
---

# JSDoc Generation Prompt

Generate comprehensive JSDoc comments for the selected TypeScript code following these guidelines:

## JSDoc Requirements
- **Public functions/methods**: Include purpose, parameters, returns, and throws
- **Complex logic**: Explain WHY, not WHAT
- **Interfaces/Types**: Document contract purpose and key properties
- **Classes**: Document responsibility and usage patterns

## Format Standards
```typescript
/**
 * Brief description of function purpose (one line)
 * 
 * Longer description if needed explaining the business context or important behavior.
 * 
 * @param paramName - Description of parameter and its constraints
 * @param options - Configuration object with specific properties
 * @param options.timeout - Timeout in milliseconds (default: 5000)
 * @returns Promise resolving to the created entity with generated ID
 * @throws {AppError} When validation fails (code: 'VALIDATION_ERROR')
 * @throws {AppError} When resource not found (code: 'NOT_FOUND')
 * 
 * @example
 * ```typescript
 * const user = await createUser({ name: 'John', email: 'john@example.com' });
 * ```
 */
```

## Project-Specific Rules
- Document all thrown `AppError` instances with their error codes
- For async functions, specify what the Promise resolves to
- Include `@example` for non-trivial public APIs
- Document side effects (logging, external calls, state changes)
- For repository methods, document return type (domain objects vs DTOs)
- For service methods, document transaction boundaries

## Error Documentation Pattern
```typescript
@throws {AppError} Brief description (code: 'ERROR_CODE', meta: { contextInfo })
```

## Examples by Layer

**Domain Function:**
```typescript
/**
 * Creates a new user entity with validation
 * 
 * @param props - User creation properties
 * @returns Valid user entity
 * @throws {AppError} When email format is invalid (code: 'INVALID_EMAIL')
 */
```

**Service Method:**
```typescript
/**
 * Creates user and sends welcome email (transaction boundary)
 * 
 * @param input - User creation data
 * @returns Promise resolving to created user with generated ID
 * @throws {AppError} When email already exists (code: 'EMAIL_EXISTS')
 * @throws {AppError} When external email service fails (code: 'EMAIL_SEND_FAILED')
 */
```

**Repository Method:**
```typescript
/**
 * Persists user to database and returns domain object
 * 
 * @param userData - User data to persist
 * @returns Promise resolving to User domain object (not raw DB response)
 * @throws {AppError} When database constraint violation (code: 'DB_CONSTRAINT_ERROR')
 */
```

Generate JSDoc for the selected code following these patterns apply to {{filename}}.