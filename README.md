# Notes App

A lightweight notes application built as a training project for practicing AI-assisted development with GitHub Copilot.

## About

This project serves as a hands-on training ground for developers to practice Copilot-assisted coding across different skill levels (Yellow, Orange, and Green belts). The app implements basic CRUD operations for note management and progressively adds more advanced features.

## Features

- Read, update, and delete notes
- RESTful API with TypeScript
- JSON file storage
- Comprehensive unit tests with >85% coverage
- Input validation and error handling
- Expandable architecture for advanced features

## Installation

### Prerequisites

- Node.js 18 or newer and npm for the TypeScript/Express backend
- Java 17 or newer and Maven-compatible tooling for the Spring Boot backend
- Git, if cloning the repository

### Clone and install the Node.js backend

```bash
git clone <repository-url>
cd gh-copilot-training-1.3.0/backend/nodejs
npm install
npm run build
```

The optional setup script performs the Node.js version check, dependency
installation, and TypeScript build in one step. Run it from `backend/nodejs`:

```bash
bash setup.sh
```

On Windows, use the manual commands above or run the script from Git Bash or
WSL.

## Running the Application

Start the Node.js API with hot reload:

```bash
cd backend/nodejs
npm run dev
```

The server listens on `http://localhost:3000` by default. Set the `PORT`
environment variable to use another port:

```bash
PORT=4000 npm run dev
```

The JSON data file is created automatically at
`backend/nodejs/data/notes.json` when the API first reads or writes notes.

To run the compiled production build:

```bash
cd backend/nodejs
npm run build
npm start
```

## API Reference

Base URL: `http://localhost:3000`

The complete OpenAPI 3.0 specification is available at
[backend/nodejs/openapi.yaml](backend/nodejs/openapi.yaml).

### Common response formats

Notes use this shape:

```json
{
   "id": "a1b2c3d4-e5f6-47a8-9d10-3ec5a2c4d7e8",
   "title": "Project kickoff",
   "content": "Discuss sprint goals and assign ownership.",
   "tags": ["work", "planning"],
   "createdAt": "2026-09-16T08:00:00.000Z",
   "updatedAt": "2026-09-16T08:15:00.000Z"
}
```

Errors use a consistent JSON object:

```json
{
   "error": "Note not found"
}
```

### Endpoints

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| GET | `/health` | Check application status | `200 OK` |
| GET | `/api/notes` | List all notes | `200 OK` |
| POST | `/api/notes` | Create a note | `201 Created` |
| GET | `/api/notes/search?keyword=term` | Search title and content | `200 OK` |
| GET | `/api/notes/:id` | Get one note | `200 OK` |
| PUT | `/api/notes/:id` | Update one or more fields | `200 OK` |
| DELETE | `/api/notes/:id` | Delete one note | `204 No Content` |

### `GET /health`

Returns `200 OK`:

```json
{
   "status": "OK",
   "message": "Notes API is running"
}
```

### `GET /api/notes`

Returns `200 OK` with an array of notes. Storage failures return `500 Internal
Server Error` with `{ "error": "Failed to fetch notes" }`.

```bash
curl http://localhost:3000/api/notes
```

### `POST /api/notes`

Creates a note. `title` and `content` are required non-empty strings. `tags`
is optional and must be an array of non-empty strings.

```bash
curl -X POST http://localhost:3000/api/notes \
   -H "Content-Type: application/json" \
   -d '{"title":"Daily standup","content":"Reviewed the deployment plan.","tags":["work","team"]}'
```

Returns `201 Created` with the created note, including its generated UUID and
timestamps. Validation failures return `400 Bad Request`:

```json
{ "error": "Title is required" }
```

```json
{ "error": "Content is required" }
```

```json
{ "error": "Tags must be an array of non-empty strings" }
```

Storage failures return `500 Internal Server Error` with
`{ "error": "Failed to create note" }`.

### `GET /api/notes/search?keyword=term`

Searches note titles and content using a case-insensitive partial match.

```bash
curl "http://localhost:3000/api/notes/search?keyword=stand"
```

Returns `200 OK` with matching notes, or an empty array when there are no
matches. A missing or blank `keyword` returns `400 Bad Request`:

```json
{ "error": "Search keyword is required" }
```

### `GET /api/notes/:id`

```bash
curl http://localhost:3000/api/notes/a1b2c3d4-e5f6-47a8-9d10-3ec5a2c4d7e8
```

Returns `200 OK` with the note. Invalid or blank IDs return `400 Bad Request`.
If the ID does not exist, the response is `404 Not Found`:

```json
{ "error": "Note not found" }
```

Storage failures return `500 Internal Server Error` with
`{ "error": "Failed to fetch note" }`.

### `PUT /api/notes/:id`

Updates one or more fields. The request body must contain at least one of
`title`, `content`, or `tags`.

```bash
curl -X PUT http://localhost:3000/api/notes/a1b2c3d4-e5f6-47a8-9d10-3ec5a2c4d7e8 \
   -H "Content-Type: application/json" \
   -d '{"title":"Updated standup","tags":["work","delivery"]}'
```

Returns `200 OK` with the updated note. Validation failures return `400 Bad
Request`, for example `{ "error": "At least one field is required to update" }`.
An unknown ID returns `404 Not Found`, and storage failures return `500 Internal
Server Error` with `{ "error": "Failed to update note" }`.

### `DELETE /api/notes/:id`

```bash
curl -i -X DELETE http://localhost:3000/api/notes/a1b2c3d4-e5f6-47a8-9d10-3ec5a2c4d7e8
```

Returns `204 No Content` when the note is deleted. Invalid IDs return `400 Bad
Request`, unknown IDs return `404 Not Found`, and storage failures return `500
Internal Server Error` with `{ "error": "Failed to delete note" }`.

## Development Setup

The Node.js backend uses TypeScript, Express, Jest, and file-based JSON
storage. From `backend/nodejs`:

```bash
npm install
npm run build
npm test -- --runInBand
```

Useful development commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with `ts-node-dev` hot reload |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Run the compiled server |
| `npm test` | Run the Jest test suite |
| `npm test -- --runInBand` | Run tests serially for predictable file-storage tests |
| `npm run test:watch` | Re-run tests when files change |
| `npm run test:coverage` | Generate a Jest coverage report |

When adding a feature, update the relevant service or controller, add focused
tests under `backend/nodejs/tests`, and update `openapi.yaml` and this README
when the public API changes.

### Java backend

The repository also contains a Spring Boot implementation under
`backend/java`. Its Maven wrapper can be used from that directory:

```powershell
cd backend/java
./mvnw.cmd test
./mvnw.cmd spring-boot:run
```

Refer to [backend/java/README.md](backend/java/README.md) for Java-specific
details.

## Project Structure

```text
PRD.md                         # Product requirements and training goals
README.md                      # Project, API, and development documentation
backend/
   nodejs/
      src/
         index.ts                 # Express app, middleware, and server startup
         controller/
            NoteController.ts      # HTTP routes and status-code handling
         middleware/
            validateNote.ts        # Request validation and normalization
         services/
            NoteService.ts         # Note business logic and JSON persistence
         types/
            Note.ts                # Note and update request interfaces
      tests/                     # Jest service, controller, and error tests
      data/                      # Runtime notes.json storage directory
      openapi.yaml               # OpenAPI 3.0 API specification
      package.json               # Dependencies and npm scripts
      tsconfig.json              # TypeScript compiler configuration
      jest.config.js             # Jest and ts-jest configuration
      setup.sh                   # Unix setup helper
   java/
      src/                       # Spring Boot Notes API implementation
      pom.xml                    # Maven project configuration
      API_TESTS.md               # Java API test examples
handsOn/                       # Training exercises and reusable prompts
```

## License

This project is for educational purposes.