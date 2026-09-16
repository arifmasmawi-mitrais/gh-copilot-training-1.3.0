package com.example.notesapi.repository;

import com.example.notesapi.entity.Note;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.UUID;

@Repository
public class FileNoteRepository {
    
    @Value("${notes.storage.file.path:data/notes.json}")
    private String filePath;   
  
    private final ObjectMapper objectMapper;
    private List<Note> notes;
    
    public FileNoteRepository() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.notes = new ArrayList<>();
    }
    
    @PostConstruct
    public void initialize() {
        try {
            createDirectoryIfNotExists();
            loadNotesFromFile();
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize file repository", e);
        }
    }
    
    private void createDirectoryIfNotExists() throws IOException {
        Path path = Path.of(filePath);
        Path directory = path.getParent();
        if (directory != null && !Files.exists(directory)) {
            Files.createDirectories(directory);
        }
    }
    
    private void loadNotesFromFile() throws IOException {
        File file = new File(filePath);
        if (file.exists() && file.length() > 0) {
            TypeReference<List<Note>> typeReference = new TypeReference<List<Note>>() {};
            notes = objectMapper.readValue(file, typeReference);          
        } else {
            notes = new ArrayList<>();
            saveNotesToFile(); // Create initial empty file
        }
    }
    
    private synchronized void saveNotesToFile() throws IOException {
        objectMapper.writeValue(new File(filePath), notes);
    }
    
    public Note save(Note note) {
        try {
            if (note.getId() == null || note.getId().isEmpty()) {
                // New note
                note.setId(UUID.randomUUID().toString());
                note.setCreatedAt(LocalDateTime.now());
                note.setUpdatedAt(LocalDateTime.now());
                notes.add(note);
            } else {
                // Update existing note
                note.setUpdatedAt(LocalDateTime.now());
                notes = notes.stream()
                        .map(existingNote -> existingNote.getId().equals(note.getId()) ? note : existingNote)
                        .collect(Collectors.toList());
            }
            saveNotesToFile();
            return note;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save note", e);
        }
    }
    
    public List<Note> findAll() {
        return new ArrayList<>(notes);
    }
    
    public Optional<Note> findById(String id) {
        return notes.stream()
                .filter(note -> note.getId().equals(id))
                .findFirst();
    }
    
    public void deleteById(String id) {
        try {
            notes = notes.stream()
                    .filter(note -> !note.getId().equals(id))
                    .collect(Collectors.toList());
            saveNotesToFile();
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete note", e);
        }
    }
    
    public void delete(Note note) {
        deleteById(note.getId());
    }
    
    public List<Note> findByTitleOrContentContaining(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return notes.stream()
                .filter(note -> note.getTitle().toLowerCase().contains(lowerKeyword) ||
                               note.getContent().toLowerCase().contains(lowerKeyword))
                .collect(Collectors.toList());
    }
    
    public List<Note> findAllByOrderByCreatedAtDesc() {
        return notes.stream()
                .sorted((n1, n2) -> n2.getCreatedAt().compareTo(n1.getCreatedAt()))
                .collect(Collectors.toList());
    }
}