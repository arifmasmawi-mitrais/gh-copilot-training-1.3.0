package com.example.notesapi.controller;

import com.example.notesapi.entity.Note;
import com.example.notesapi.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NoteController {
    
    private final NoteService noteService;
    
    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }
    
    /**
     * GET /api/notes - Get all notes
     */
    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        List<Note> notes = noteService.getAllNotes();
        return ResponseEntity.ok(notes);
    }
    
    /**
     * GET /api/notes/{id} - Get a specific note by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable String id) {
        Note note = noteService.getNoteById(id);
        return ResponseEntity.ok(note);
    }
    
    /**
     * PUT /api/notes/{id} - Update an existing note
     */
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable String id, @Valid @RequestBody Note noteDetails) {
        Note updatedNote = noteService.updateNote(id, noteDetails);
        return ResponseEntity.ok(updatedNote);
    }
    
    /**
     * DELETE /api/notes/{id} - Delete a note
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNote(@PathVariable String id) {
        noteService.deleteNote(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Note deleted successfully");
        response.put("id", id);
        response.put("success", true);
        
        return ResponseEntity.ok(response);
    }
}