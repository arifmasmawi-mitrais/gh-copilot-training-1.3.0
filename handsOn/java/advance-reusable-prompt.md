---
mode: 'agent'
model: GPT-4.1
description: 'Generate information for each function as a documentation (Javadoc)'
---

# Javadoc Generation Prompt

Generate comprehensive Javadoc comments for the selected Java code following these guidelines:

## Javadoc Requirements
- **Public classes/methods**: Include purpose, parameters, return values, and exceptions thrown
- **Complex logic**: Explain WHY, not just WHAT
- **Interfaces/Types**: Document contract purpose and key properties
- **Classes**: Document responsibility and usage patterns

## Format Standards
```java
/**
 * Brief description of method purpose (one line).
 *
 * Longer description if needed explaining the business context or important behavior.
 *
 * @param paramName Description of parameter and its constraints
 * @param options Configuration object with specific properties
 * @return Description of the return value
 * @throws ValidationException When validation fails
 * @throws NotFoundException When resource not found
 *
 * <pre>
 * Example usage:
 * User user = userService.createUser("John", "john@example.com");
 * </pre>
 */
```

## Project-Specific Rules
- Document all thrown exceptions with their types and reasons
- For methods returning objects, specify the type and relevant details
- Include example usage for non-trivial public APIs
- Document side effects (logging, external calls, state changes)
- For repository methods, document return type (domain objects vs DTOs)
- For service methods, document transaction boundaries

## Error Documentation Pattern
```java
@throws AppException Brief description (code: "ERROR_CODE", meta: contextInfo)
```

## Examples by Layer

**Domain Method:**
```java
/**
 * Creates a new user entity with validation.
 *
 * @param props User creation properties
 * @return Valid user entity
 * @throws InvalidEmailException When email format is invalid
 */
```

**Service Method:**
```java
/**
 * Creates user and sends welcome email (transaction boundary).
 *
 * @param input User creation data
 * @return Created user with generated ID
 * @throws EmailExistsException When email already exists
 * @throws EmailSendFailedException When external email service fails
 */
```

**Repository Method:**
```java
/**
 * Persists user to database and returns domain object.
 *
 * @param userData User data to persist
 * @return User domain object (not raw DB response)
 * @throws DbConstraintException When database constraint violation occurs
 */
```

Generate JSDoc for the selected code following these patterns apply to NoteController.java