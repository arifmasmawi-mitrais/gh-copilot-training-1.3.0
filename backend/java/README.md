# Notes API - Spring Boot REST Application

A comprehensive REST API for note management built with Spring Boot 3.3.4 and Java 17, using file-based storage.

## Features

- **CRUD Operations**: Create, Read, Update, Delete notes
- **Search Functionality**: Search notes by title or content
- **File Storage**: JSON file-based persistence
- **Validation**: Input validation with proper error messages
- **Exception Handling**: Global exception handling with detailed error responses
- **RESTful Design**: Following REST principles and best practices

## Technology Stack

- **Java 21**
- **Spring Boot 3.3.4**
- **Jackson JSON Processing**
- **Maven**
- **Jakarta Validation**
- **File-based Storage** (JSON)

## API Endpoints

### Base URL: `http://localhost:3000/api/notes`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes (ordered by creation date) |
| GET | `/api/notes/{id}` | Get a specific note by ID |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/{id}` | Update an existing note |
| DELETE | `/api/notes/{id}` | Delete a note |

## Request/Response Examples

### Create Note (POST /api/notes)
```json
{
    "title": "Meeting Notes",
    "content": "Important points discussed in today's meeting..."
}
```

### Response:
```json
{
    "id": 1,
    "title": "Meeting Notes",
    "content": "Important points discussed in today's meeting...",
    "createdAt": "2025-10-03T10:30:00",
    "updatedAt": "2025-10-03T10:30:00"
}
```

### Update Note (PUT /api/notes/1)
```json
{
    "title": "Updated Meeting Notes",
    "content": "Updated content with additional information..."
}
```

### Search Notes (GET /api/notes/search?keyword=meeting)
Returns all notes containing "meeting" in title or content.

## Running the Application

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

### Steps
1. Navigate to the project directory:
   ```cmd
   cd d:\Project\gh-copilot-training\backend\java
   ```

2. Build the project:
   ```cmd
   mvnw.cmd clean compile
   ```

3. Run the application:
   ```cmd
   mvnw.cmd spring-boot:run
   ```

4. The application will start on port 3000:
   - API Base URL: http://localhost:3000/api/notes
   - Notes file: data/notes.json

### File Storage
- Notes are stored in `data/notes.json` as a JSON array
- Initial sample notes are provided on first startup

## Project Structure

```
src/
├── main/
│   ├── java/com/example/notesapi/
│   │   ├── NotesApiApplication.java          # Main application class
│   │   ├── controller/
│   │   │   └── NoteController.java           # REST endpoints
│   │   ├── entity/
│   │   │   └── Note.java                     # Note model class
│   │   ├── exception/
│   │   │   ├── ErrorResponse.java            # Error response model
│   │   │   ├── GlobalExceptionHandler.java   # Global exception handler
│   │   │   └── NoteNotFoundException.java    # Custom exception
│   │   ├── repository/
│   │   │   └── FileNoteRepository.java       # File-based data access
│   │   └── service/
│   │       └── NoteService.java              # Business logic layer
│   └── resources/
│       └── application.properties            # Configuration
├── data/
│   └── notes.json                            # JSON file storage
└── test/                                     # Test files
```

## Validation Rules

- **Title**: Required, maximum 200 characters
- **Content**: Required, maximum 2000 characters

## Error Handling

The API provides comprehensive error handling with detailed error responses:

### Validation Error Example:
```json
{
    "status": 400,
    "error": "Validation Failed",
    "message": "Invalid input data",
    "timestamp": "2025-10-03T10:30:00",
    "path": "uri=/api/notes",
    "validationErrors": {
        "title": "Title is required",
        "content": "Content cannot exceed 2000 characters"
    }
}
```

### Not Found Error Example:
```json
{
    "status": 404,
    "error": "Note Not Found",
    "message": "Note not found with id: 999",
    "timestamp": "2025-10-03T10:30:00",
    "path": "uri=/api/notes/999"
}
```

## Testing the API

You can test the API using:
- **Postman** or **Insomnia** for GUI testing
- **curl** commands
- **VS Code REST Client** extension

### Example curl commands:

```bash
# Get all notes
curl -X GET http://localhost:3000/api/notes

# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"This is a test note"}'

# Get a specific note
curl -X GET http://localhost:3000/api/notes/1

# Update a note
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Note","content":"Updated content"}'

# Delete a note
curl -X DELETE http://localhost:3000/api/notes/1

# Search notes
curl -X GET "http://localhost:3000/api/notes/search?keyword=test"
```

## Future Enhancements

- Add pagination for large datasets
- Implement user authentication and authorization
- Add note categories/tags
- Implement file attachments
- Add audit logging
- Implement caching
- Add API documentation with Swagger/OpenAPI