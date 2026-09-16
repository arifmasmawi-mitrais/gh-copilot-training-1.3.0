# Copilot Instructions for AI Coding Agents

## Project Overview

This repository contains backend implementations for a Notes API:
- `backend/java/`: Java Spring Boot REST API

Implementation is self-contained, with its own build, test, and data management workflows.
---

## Architecture & Major Components

### Java (Spring Boot)
- Entry point: `NotesApiApplication.java`
- REST controllers: `controller/`
- Data models: `entity/`
- Persistence: `repository/` (Spring Data JPA)
- Business logic: `service/`
- Error handling: `exception/`
- Data files: `data/notes.json` (used for testing)
- Configuration: `application.properties`

---

## Developer Workflows

### Java
- Build: Run `mvnw.cmd clean package` from `backend/java/`
- Run: `java -jar target/notes-api-1.0.0.jar`
- Test: Use `mvnw.cmd test`
- Error handling: All exceptions are mapped to structured JSON via `GlobalExceptionHandler`

---

## Project-Specific Conventions

- Java: Follows standard Spring Boot layering, but uses JSON files for a database.
- Error handling: Both backends return structured error responses; see test cases for expected formats.
- Tests: Java uses JUnit (see `API_TESTS.md` for sample requests).

---

## Integration Points & External Dependencies

- Java: Spring Boot, Spring Data JPA, JSON file I/O (no external DB)

---

## Examples

- To add a new API endpoint in Java, create a controller in `controller/`, update service in `service/`, and add tests in `test/java/com/example/notesapi/controller/`.

---

## Key Files & Directories

- `backend/java/README.md`, `API_TESTS.md`
- `backend/java/src/main/java/com/example/notesapi/`


---

## How to Get Productive Fast

- Pick the backend you want to work on; follow its README for setup.
- Use the provided test files as references for new features.
- Follow the layering and error handling patterns shown in each backend.

## Suggestion header format
- EVERY SINGLE ONE OF THE RESPONSE SHOULD START WITH "This is Github Copilot Training session"