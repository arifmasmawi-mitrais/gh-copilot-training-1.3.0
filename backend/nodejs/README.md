# Notes App Backend

A small REST API for creating, reading, searching, updating, and deleting notes. The service is built with TypeScript and Express and stores notes in a local JSON file.

## Requirements

- Node.js 18 or later
- npm

## Installation

Clone the repository, enter the backend directory, and install dependencies:

```bash
cd backend/nodejs
npm install
```

The repository includes a setup script that checks the Node.js version, installs dependencies, and builds the project:

```bash
./setup.sh
```

On Windows, run the equivalent commands in PowerShell:

```powershell
node --version
npm install
npm run build
```

The API creates `data/notes.json` automatically on first use. The `data` directory is runtime data and does not need to be created manually.

## Development Setup

Start the development server with automatic TypeScript reloads:

```bash
npm run dev
```

The server listens on `http://localhost:3000` by default. Set the `PORT` environment variable to use another port:

```powershell
$env:PORT = "4000"
npm run dev
```

Verify that the service is running:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "OK",
  "message": "Notes API is running"
}
```

### Production-style run

Compile the TypeScript source and run the generated JavaScript:

```bash
npm run build
npm start
```

### Quality checks

Run the complete test suite:

```bash
npm test
```

Run tests in watch mode while developing:

```bash
npm run test:watch
```

Generate a test coverage report:

```bash
npm run test:coverage
```

The complete OpenAPI 3.0 specification is available in [openapi.yaml](openapi.yaml).

## API Reference

Base URL: `http://localhost:3000`

All request and response bodies use `application/json`, except successful `DELETE` requests, which return no body.

### `GET /health`

Returns the service health status.

**Success: `200 OK`**

```json
{
  "status": "OK",
  "message": "Notes API is running"
}
```

### `GET /api/notes`

Returns all stored notes.

**Success: `200 OK`**

```json
[
  {
    "id": "a1b2c3d4-e5f6-47a8-9d10-3ec5a2c4d7e8",
    "title": "Project kickoff",
    "content": "Discuss sprint goals and assign ownership.",
    "tags": ["work", "planning"],
    "createdAt": "2026-09-16T08:00:00.000Z",
    "updatedAt": "2026-09-16T08:15:00.000Z"
  }
]
```

**Error: `500 Internal Server Error`**

```json
{
  "error": "Failed to fetch notes"
}
```

### `GET /api/notes/count`

Returns the number of stored notes.

**Success: `200 OK`**

```json
{
  "count": 2
}
```

**Error: `500 Internal Server Error`**

```json
{
  "error": "Failed to count notes"
}
```

### `POST /api/notes`

Creates a note. `title` and `content` must be non-empty strings. `tags` is optional and must be an array of non-empty strings.

**Request**

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Daily standup","content":"Reviewed the deployment plan.","tags":["work","team"]}'
```

**Success: `201 Created`**

```json
{
  "id": "4e56d4d1-48e2-4c9a-8a2b-7c0cf75d5b5d",
  "title": "Daily standup",
  "content": "Reviewed the deployment plan.",
  "tags": ["work", "team"],
  "createdAt": "2026-09-16T09:00:00.000Z",
  "updatedAt": "2026-09-16T09:00:00.000Z"
}
```

**Errors**

- `400 Bad Request` when `title` or `content` is missing or blank, or `tags` is invalid.
- `500 Internal Server Error` when the note cannot be persisted.

```json
{
  "error": "Title is required"
}
```

Other validation messages include `Content is required` and `Tags must be an array of non-empty strings`.

### `GET /api/notes/search?keyword={keyword}`

Searches note titles and content with a case-insensitive partial match. A blank or missing keyword is invalid.

**Request**

```bash
curl "http://localhost:3000/api/notes/search?keyword=meeting"
```

**Success: `200 OK`**

```json
[
  {
    "id": "d8f7f2bb-f17d-40a1-b17f-bdd23d3d2c1a",
    "title": "Client meeting notes",
    "content": "Follow up on onboarding requirements.",
    "tags": ["client"],
    "createdAt": "2026-09-14T10:30:00.000Z",
    "updatedAt": "2026-09-14T10:45:00.000Z"
  }
]
```

**Errors**

- `400 Bad Request` if `keyword` is missing or blank.
- `500 Internal Server Error` if the notes cannot be searched.

```json
{
  "error": "Search keyword is required"
}
```

### `GET /api/notes/{id}`

Returns one note by its ID.

**Request**

```bash
curl http://localhost:3000/api/notes/a1b2c3d4-e5f6-47a8-9d10-3ec5a2c4d7e8
```

**Success: `200 OK`**

The response is a single [note object](#note-object).

**Errors**

- `400 Bad Request` if the ID is missing or blank.
- `404 Not Found` if no note matches the ID.
- `500 Internal Server Error` if the note cannot be read.

```json
{
  "error": "Note not found"
}
```

### `PUT /api/notes/{id}`

Updates one or more note fields. At least one of `title`, `content`, or `tags` must be provided. The `createdAt` value is preserved and `updatedAt` is refreshed.

**Request**

```bash
curl -X PUT http://localhost:3000/api/notes/a1b2c3d4-e5f6-47a8-9d10-3ec5a2c4d7e8 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated project kickoff","tags":["delivery"]}'
```

**Success: `200 OK`**

```json
{
  "id": "a1b2c3d4-e5f6-47a8-9d10-3ec5a2c4d7e8",
  "title": "Updated project kickoff",
  "content": "Discuss sprint goals and assign ownership.",
  "tags": ["delivery"],
  "createdAt": "2026-09-16T08:00:00.000Z",
  "updatedAt": "2026-09-16T09:20:00.000Z"
}
```

**Errors**

- `400 Bad Request` for an empty payload, blank fields, or invalid tags.
- `404 Not Found` if no note matches the ID.
- `500 Internal Server Error` if the note cannot be updated.

```json
{
  "error": "At least one field is required to update"
}
```

### `DELETE /api/notes/{id}`

Deletes one note by its ID.

**Request**

```bash
curl -i -X DELETE http://localhost:3000/api/notes/a1b2c3d4-e5f6-47a8-9d10-3ec5a2c4d7e8
```

**Success: `204 No Content`**

The response has an empty body.

**Errors**

- `400 Bad Request` if the ID is missing or blank.
- `404 Not Found` if no note matches the ID.
- `500 Internal Server Error` if the note cannot be deleted.

```json
{
  "error": "Note not found"
}
```

## Data Model

### Note object

| Field | Type | Required in response | Description |
| --- | --- | --- | --- |
| `id` | string (UUID) | Yes | Unique note identifier. |
| `title` | string | Yes | Non-empty note title. |
| `content` | string | Yes | Non-empty note content. |
| `tags` | string[] | No | Optional list of non-empty tags. |
| `createdAt` | string (ISO 8601 date-time) | Yes | Creation timestamp. |
| `updatedAt` | string (ISO 8601 date-time) | Yes | Last update timestamp. |

## Project Structure

```text
.
├── openapi.yaml                 # OpenAPI 3.0 API specification
├── package.json                 # Scripts and dependency manifest
├── setup.sh                     # Node.js check, install, and build helper
├── tsconfig.json                # TypeScript compiler configuration
├── src/
│   ├── index.ts                 # Express app, middleware, and server startup
│   ├── controller/
│   │   └── NoteController.ts    # HTTP routes and response mapping
│   ├── middleware/
│   │   └── validateNote.ts      # Request validation and normalization
│   ├── services/
│   │   └── NoteService.ts       # Note persistence and business operations
│   └── types/
│       └── Note.ts              # Note and update request interfaces
├── tests/                       # Jest tests for routes, services, errors, and types
├── dist/                        # Compiled JavaScript output from npm run build
└── data/                        # Runtime notes.json file, created automatically
```

The controller is responsible for HTTP concerns, validation middleware handles incoming request rules, and `NoteService` owns note operations and JSON-file persistence. Tests use a separate temporary data location so they do not modify the normal runtime data file.

## API Documentation

Use [openapi.yaml](openapi.yaml) with any OpenAPI-compatible tool such as Swagger UI or Redoc to render interactive documentation. The API specification is maintained alongside the implementation and includes schemas, examples, status codes, and error responses.

## License

This project is licensed under the MIT License.
