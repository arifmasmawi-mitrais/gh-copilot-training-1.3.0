# Notes App - Product Requirements Document

## Overview
A lightweight app that allows users to create, edit, delete, and manage notes. The app will serve as a training project for frontend and backend developers to practice Copilot-assisted coding.

## Goals
- Provide a simple but realistic project for practicing AI-assisted development
- Ensure developers cover scaffolding, feature building, security, and CI/CD
- Create a base app that can grow with belt-level exercises

## Non-Goals
- No production-scale deployment
- No third-party integrations (e.g., Google login, payment)
- No offline mode

## Target Users
- **Frontend Devs**: Focus on UI (React/Next.js, Vue, etc.)
- **Backend Devs**: Focus on API and data storage (Node.js/Express, Go/Fiber, etc.)

## Features

### Core Features (MVP)
- Create Note (title + content)
- View Notes List
- Edit Note
- Delete Note

### Advanced Features (Later Belts)
- Search notes (Orange Belt)
- User authentication (Orange Belt)
- Sharing notes (optional) (Orange Belt)
- CI/CD pipeline with GitHub Actions (Green Belt)

## Requirements

### Functional Requirements
- Notes stored in local DB (SQLite, Postgres, or JSON file)
- UI must display notes in list format
- Each note must have timestamp and editable content
- CRUD endpoints available for backend

### Non-Functional Requirements
- Code reviewed with Copilot + checklist
- Minimum 2 unit tests (Yellow Belt), expanded to more coverage (Orange Belt)
- Secure input handling (prevent XSS/SQLi)
- Automated CI/CD pipeline (Green Belt)

## Success Criteria

### Yellow Belt
App scaffold runs locally with CRUD and tests

### Orange Belt
At least 1 secure feature added + code review completed

### Green Belt
CI/CD pipeline runs build/tests on PR and deploys on merge