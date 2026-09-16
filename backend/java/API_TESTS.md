# Notes API Test Commands

## Test the API endpoints using curl or your preferred REST client

### 1. Get all notes
```bash
curl -X GET http://localhost:3000/api/notes
```

### 2. Get a specific note
```bash
curl -X GET http://localhost:3000/api/notes/1
```

### 4. Update a note
```bash
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Updated Note\",\"content\":\"This note has been updated\"}"
```

### 5. Search notes
```bash
curl -X GET "http://localhost:3000/api/notes/search?keyword=test"
```

### 8. Delete a note
```bash
curl -X DELETE http://localhost:3000/api/notes/1
```

## Expected Response Format

### Success Response (GET /api/notes)
```json
[
  {
    "id": 1,
    "title": "Welcome to Notes API",
    "content": "This is your first note!",
    "createdAt": "2025-10-03T10:00:00",
    "updatedAt": "2025-10-03T10:00:00"
  }
]
```

### Error Response (404 Not Found)
```json
{
  "status": 404,
  "error": "Note Not Found",
  "message": "Note not found with id: 999",
  "timestamp": "2025-10-03T10:30:00",
  "path": "uri=/api/notes/999"
}
```

## File Storage Verification

Check the following files to verify data persistence:
- `data/notes.json` - Main storage file

## PowerShell Commands (Windows)

If you prefer PowerShell:

### Get all notes
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/notes" -Method GET
```

### Create a note
```powershell
$body = @{
    title = "PowerShell Note"
    content = "Created using PowerShell"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/notes" -Method POST -Body $body -ContentType "application/json"
```