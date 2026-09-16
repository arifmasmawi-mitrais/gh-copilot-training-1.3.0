# Training code

## Node JS Tech Stack
- Runtime: Node.js (LTS)
- Lang: TypeScript (strict)
- Testing: Jest + ts-jest
- Linting: ESLint (typescript + import + jest) + Prettier
- HTTP: Express (or similar)
- Config: dotenv + typed config module
- Logging: Lightweight structured logger using winston

## Java Tech Stack
- Java 21
- Spring Boot 3.3.4
- Jackson JSON Processing
- Maven**
- Jakarta Validation
- File-based Storage (JSON)



## Basic Usage

### 2/7 Code Completion

- Repository Setup
    git clone https://github.com/mitrais-dev/gh-copilot-training
        NodeJS project setup
    cd gh-copilot-training/backend/nodejs
        npm install
    Java project setup
        cd gh-copilot-training/backend/java
        mvnw.cmd clean compile        

- Add comment
    // Create a new note with title and content, generate UUID and timestamps

- Add comment
    // POST route to create a new note, validate title and content are required

- curl for bash
"curl -X POST http://localhost:3000/api/notes   -H "Content-Type: application/json"   -d '{"title": "Test Note", "content": "Created with Copilot!"}'"

- curl for CMD
"curl -X POST http://localhost:3000/api/notes ^
  -H "Content-Type: application/json" ^
  -d "{\"title\": \"Test Note\", \"content\": \"Created with Copilot!\"}"
"

### 3/7 Ask Mode
- Prompt
“Explain the project structure and the role of each folder/file.”


- Prompt
“@workspace Analyze the current Notes App structure and suggest how to add input validation for the Notes API. Consider the existing error handling patterns and use middleware if applicable.”

- Prompt
"Looking at the current file, help me add a search feature that can find notes by title or content. The search should be case-insensitive and return partial matches. Show me the method signature and implementation"

- Prompt
"Based on the existing test files in the tests/ directory, generate unit tests for the new search functionality I want to add to NotesService. Include edge cases and error scenarios"

### 4/7 Prompt Engineering

- Prompt
“Update the Note class/interface to include tags. Tags is an array of string. No changes to service logic or functions required.”"

- Prompt
"Update the note creation logic in NoteService so that tags can be provided when creating a note and are saved to
notes.json.”​

###  5/7 Security Overview
- Prompt
    "Enhance endpoint to create notes with security requirements:
    - Validate title: 1-100 chars, alphanumeric + basic punctuation only
    - Validate content: max 10,000 chars, sanitize HTML entities
    - Rate limit: max 10 notes per user per minute
    - Return 400 with generic error for invalid input
    - Log failed attempts for monitoring"

###  6/7 Using @workspace

- Prompt
@workspace analyzes your entire project structure, code patterns, and configurations for contextually accurate responses

- Prompt
“@workspace What's the architecture of this Notes App? Explain the file structure and component relationships.”

- Prompt
“@workspace Review this codebase for potential security vulnerabilities. Focus on input validation, error handling, and data storage security.”

- Prompt
“@workspace Identify performance bottlenecks in this Notes App and suggest specific optimizations for the current architecture.”

- Prompt
"/tests Generate comprehensive unit tests for the NotesService class, including edge cases and error scenarios"

- Prompt
“/fix Fix this error while maintaining intended functionality and following platform best practices.”

- Prompt
"“/explain Explain how this method works, its role in the application, and how it fits into the overall architecture.”

- Prompt
“/explain #file:NotesService.ts” 

### 7/7 Documentation Generation
- Prompt
"Generate complete documentation comments for the NoteService class methods. Include parameter descriptions, return values, possible exceptions or errors, and usage examples. Follow best practices for either Java (Javadoc) or TypeScript (JSDoc) depending on the language."

### 7/7 API Documentation
- Prompt
“@workspace Generate comprehensive API documentation for all REST endpoints in the Notes App. Include request/response examples, status codes, and error responses in OpenAPI/Swagger format.”

### 7/7 Readme Enhancement
- Prompt
"@workspace Create comprehensive README sections for this Notes App including: installation instructions, API reference, usage examples, project structure explanation, and development setup guide"

## Advance Usage

### 4/5 Agent Mode

- Prompt
“Plan adding q query parameter to GET /notes for case-insensitive contains search on title/content. Rules: local DB, JSON-
only, no raw SQL, small changes, update tests. Output steps first - no edits yet.”​

- Prompt
“Execute step 1 only and show the single place you changed (file + function) and why; propose one test for GET
/notes?q=milk and how to assert it.”​


### 5/5 MCP

- Prompt
“Using the GitHub MCP server, create a new issue in ⟨ mitrais-dev/gh-copilot-training titled ‘Search: add q query parameter’ with a body that
states: goal, acceptance checks (case-insensitive filter on title/content), and a small-change scope (touch one handler only). Reply with the new
issue URL/number.”​

- Prompt
"Use the GitHub MCP server to list open issues in ⟨mitrais-dev/gh-copilot-training⟩; return a compact table: number, title, labels, assignee, state.”​