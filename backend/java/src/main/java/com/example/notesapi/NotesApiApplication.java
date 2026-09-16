package com.example.notesapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NotesApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotesApiApplication.class, args);
        System.out.println("==========================================");
        System.out.println("Notes API Application Started Successfully!");
        System.out.println("==========================================");
        System.out.println("API Base URL: http://localhost:3000/api/notes");
        System.out.println("Notes stored in: data/notes.json");
        System.out.println("==========================================");
    }
}