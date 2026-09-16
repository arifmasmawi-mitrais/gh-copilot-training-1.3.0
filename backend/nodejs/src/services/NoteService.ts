import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Note, UpdateNoteRequest } from '../types/Note';

/**
 * Stores and retrieves notes from a JSON file on disk.
 *
 * This service provides the application's persistence boundary for note records,
 * keeping business-facing methods simple while handling file creation, reading,
 * updates, deletion, and basic lookup behavior.
 */
export class NoteService {
  /**
   * Returns the absolute path to the JSON file used for persistence.
   *
   * The file is stored beneath the current working directory inside a `data`
   * folder as `notes.json`, which keeps the service self-contained for local
   * development and test environments.
   *
   * @returns The absolute path of the notes datastore file.
   */
  protected getDataFilePath(): string {
    return path.join(process.cwd(), 'data', 'notes.json');
  }

  /**
   * Ensures the notes data file exists before read or write operations.
   *
   * If the file is missing, the parent directory is created and a new empty JSON
   * array is initialized so subsequent reads do not fail on first use.
   *
   * @returns A Promise that resolves once the datastore is ready for use.
   * @throws Will propagate any filesystem error triggered while creating the
   *         directory or file.
   */
  private async ensureDataFile(): Promise<void> {
    const dataFile = this.getDataFilePath();
    try {
      await fs.access(dataFile);
    } catch {
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      await fs.writeFile(dataFile, JSON.stringify([], null, 2));
    }
  }

  /**
   * Reads the entire note collection from disk and parses it as a list of Note
   * objects.
   *
   * The method ensures the backing file exists before reading, so the first call
   * to the service can safely initialize an empty datastore.
   *
   * @returns A Promise resolving to the full list of notes currently stored.
   * @throws Will throw if the file is unreadable, malformed, or cannot be
   *         initialized by `ensureDataFile`.
   */
  private async readNotes(): Promise<Note[]> {
    await this.ensureDataFile();
    const dataFile = this.getDataFilePath();
    const data = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(data) as Note[];
  }

  /**
   * Persists the provided note list to the JSON datastore.
   *
   * @param notes - The complete set of notes to write to disk.
   * @returns A Promise that resolves once the note collection has been saved.
   * @throws Will propagate any filesystem write error that occurs while saving.
   */
  private async writeNotes(notes: Note[]): Promise<void> {
    const dataFile = this.getDataFilePath();
    await fs.writeFile(dataFile, JSON.stringify(notes, null, 2));
  }

  /**
   * Retrieves every note currently stored in the application datastore.
   *
   * @returns A Promise resolving to an array of all notes currently persisted.
   * @throws Will throw if the notes file cannot be read or parsed.
   *
   * @example
   * ```ts
   * const notes = await noteService.getAllNotes();
   * console.log(notes);
   * ```
   */
  async getAllNotes(): Promise<Note[]> {
    return await this.readNotes();
  }

  /**
   * Counts how many notes are currently stored.
   *
   * @returns A Promise resolving to the total number of saved notes.
   * @throws Will throw if the datastore cannot be read or initialized.
   *
   * @example
   * ```ts
   * const totalNotes = await noteService.countNotes();
   * console.log(`Stored notes: ${totalNotes}`);
   * ```
   */
  async countNotes(): Promise<number> {
    const notes = await this.readNotes();
    return notes.length;
  }

  /**
   * Finds a note by its unique identifier.
   *
   * @param id - The note ID to match against stored records.
   * @returns A Promise resolving to the matching note, or `null` when no note
   *          exists with the supplied ID.
   * @throws Will throw if the backing file cannot be read or parsed.
   *
   * @example
   * ```ts
   * const note = await noteService.getNoteById('123');
   * if (note) {
   *   console.log(note.title);
   * }
   * ```
   */
  async getNoteById(id: string): Promise<Note | null> {
    const notes = await this.readNotes();
    return notes.find(note => note.id === id) || null;
  }

  /**
   * Searches notes by matching the provided keyword against titles and content.
   *
   * Matching is case-insensitive and partial, so a term like "meeting" will
   * match notes whose title or body contains that substring. Empty or whitespace
   * only queries return the full collection unchanged.
   *
   * @param keyword - The text to search for within note titles and content.
   * @returns A Promise resolving to every note whose title or body includes the
   *          keyword.
   * @throws Will throw if the datastore cannot be read or parsed.
   *
   * @example
   * ```ts
   * const results = await noteService.searchNotes('meeting');
   * console.log(results);
   * ```
   */
  async searchNotes(keyword: string): Promise<Note[]> {
    const notes = await this.readNotes();
    const term = keyword.trim().toLowerCase();

    if (!term) {
      return notes;
    }

    return notes.filter(note => {
      const title = note.title.toLowerCase();
      const content = note.content.toLowerCase();

      return title.includes(term) || content.includes(term);
    });
  }

  /**
   * Creates a new note and saves it to the persistent JSON store.
   *
   * A UUID is generated for the record, while the creation and update timestamps
   * are initialized to the current ISO-8601 time. Tags are normalized by
   * trimming whitespace and removing empty values before writing.
   *
   * @param title - The note title. This should be a meaningful, non-empty value.
   * @param content - The full note content or body text.
   * @param tags - Optional list of tag strings to associate with the note.
   * @returns A Promise resolving to the newly created note instance.
   * @throws Will throw if the datastore cannot be created, read, or written.
   *
   * @example
   * ```ts
   * const newNote = await noteService.createNote(
   *   'Meeting Notes',
   *   'Discuss feature timeline and launch checklist.',
   *   ['work', 'planning', 'team']
   * );
   * console.log(newNote.id);
   * ```
   */
  async createNote(title: string, content: string, tags: string[] = []): Promise<Note> {
    const newNote: Note = {
      id: uuidv4(),
      title,
      content,
      tags: tags.map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const notes = await this.readNotes();
    notes.push(newNote);
    await this.writeNotes(notes);

    return newNote;
  }

  /**
   * Updates a note identified by the supplied ID.
   *
   * Only the provided fields are merged into the existing record and the
   * `updatedAt` timestamp is refreshed automatically. If no matching note is
   * found, the method returns `null` without mutating the store.
   *
   * @param id - The unique identifier of the note to update.
   * @param updates - Partial note fields such as `title`, `content`, or `tags`.
   * @returns A Promise resolving to the updated note, or `null` if the note is
   *          not found.
   * @throws Will throw if the datastore cannot be read or written.
   *
   * @example
   * ```ts
   * const updated = await noteService.updateNote('note-123', {
   *   title: 'Updated Meeting Notes',
   *   content: 'Updated agenda after the call.'
   * });
   * ```
   */
  async updateNote(id: string, updates: UpdateNoteRequest): Promise<Note | null> {
    const notes = await this.readNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      return null;
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;
    await this.writeNotes(notes);

    return updatedNote;
  }

  /**
   * Deletes a note by its unique identifier.
   *
   * @param id - The note ID to remove from storage.
   * @returns A Promise resolving to `true` when a note is removed, or `false`
   *          if the note does not exist.
   * @throws Will throw if the datastore cannot be read or written.
   *
   * @example
   * ```ts
   * const deleted = await noteService.deleteNote('note-123');
   * if (deleted) {
   *   console.log('Note deleted');
   * }
   * ```
   */
  async deleteNote(id: string): Promise<boolean> {
    const notes = await this.readNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      return false;
    }

    notes.splice(noteIndex, 1);
    await this.writeNotes(notes);

    return true;
  }
}
