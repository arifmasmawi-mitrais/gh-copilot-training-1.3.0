package com.example.notesapi.controller;

import com.example.notesapi.entity.Note;
import com.example.notesapi.service.NoteService;
import com.example.notesapi.exception.NoteNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NoteControllerTest {

    @Mock
    private NoteService noteService;

    @InjectMocks
    private NoteController noteController;

    private Note sampleNote;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleNote = new Note();
        sampleNote.setId("123e4567-e89b-12d3-a456-426614174000");
        sampleNote.setTitle("Test Title");
        sampleNote.setContent("Test Content");
        sampleNote.setCreatedAt(LocalDateTime.now());
        sampleNote.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testGetAllNotes() {
        List<Note> notes = Arrays.asList(sampleNote);
        when(noteService.getAllNotes()).thenReturn(notes);

        ResponseEntity<List<Note>> response = noteController.getAllNotes();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals(sampleNote.getId(), response.getBody().getFirst().getId());
        verify(noteService, times(1)).getAllNotes();
    }

    @Test
    void testGetNoteById() {
        when(noteService.getNoteById(sampleNote.getId())).thenReturn(sampleNote);

        ResponseEntity<Note> response = noteController.getNoteById(sampleNote.getId());

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleNote.getId(), response.getBody().getId());
        verify(noteService, times(1)).getNoteById(sampleNote.getId());
    }

    @Test
    void testUpdateNote() {
        Note updatedNote = new Note();
        updatedNote.setId(sampleNote.getId());
        updatedNote.setTitle("Updated Title");
        updatedNote.setContent("Updated Content");
        updatedNote.setCreatedAt(sampleNote.getCreatedAt());
        updatedNote.setUpdatedAt(LocalDateTime.now());

        when(noteService.updateNote(eq(sampleNote.getId()), any(Note.class))).thenReturn(updatedNote);

        ResponseEntity<Note> response = noteController.updateNote(sampleNote.getId(), updatedNote);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Updated Title", response.getBody().getTitle());
        verify(noteService, times(1)).updateNote(eq(sampleNote.getId()), any(Note.class));
    }

    @Test
    void testDeleteNote() {
        doNothing().when(noteService).deleteNote(sampleNote.getId());

        ResponseEntity<Map<String, Object>> response = noteController.deleteNote(sampleNote.getId());

        assertEquals(200, response.getStatusCode().value());
        assertTrue((Boolean) response.getBody().get("success"));
        assertEquals("Note deleted successfully", response.getBody().get("message"));
        assertEquals(sampleNote.getId(), response.getBody().get("id"));
        verify(noteService, times(1)).deleteNote(sampleNote.getId());
    }

    @Test
    void testGetNoteById_NotFound() {
        when(noteService.getNoteById("not-found-id")).thenThrow(new NoteNotFoundException("Note not found"));

        assertThrows(NoteNotFoundException.class, () -> {
            noteController.getNoteById("not-found-id");
        });
        verify(noteService, times(1)).getNoteById("not-found-id");
    }
}