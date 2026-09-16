package com.example.notesapi.service;

import com.example.notesapi.entity.Note;
import com.example.notesapi.exception.NoteNotFoundException;
import com.example.notesapi.repository.FileNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {
    
    private final FileNoteRepository noteRepository;
    
    @Autowired
    public NoteService(FileNoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }
    
    /**
     * Get all notes ordered by creation date (newest first)
     */
    public List<Note> getAllNotes() {
        return noteRepository.findAllByOrderByCreatedAtDesc();
    }
    
    /**
     * Get a note by ID
     */
    public Note getNoteById(String id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new NoteNotFoundException("Note not found with id: " + id));
    }
    
    /**
     * Update an existing note
     */
    public Note updateNote(String id, Note noteDetails) {
        Note existingNote = getNoteById(id);        
        existingNote.setTitle(noteDetails.getTitle());
        existingNote.setContent(noteDetails.getContent());
        
        return noteRepository.save(existingNote);
    }
    
    /**
     * Delete a note by ID
     */
    public void deleteNote(String id) {
        Note note = getNoteById(id);
        noteRepository.delete(note);
    }
}