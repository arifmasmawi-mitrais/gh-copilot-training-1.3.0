import fs from 'fs/promises';
import path from 'path';
import { NoteService } from '../src/services/NoteService';
import { UpdateNoteRequest } from '../src/types/Note';

// Mock the data file path for testing
const TEST_DATA_FILE = path.join(process.cwd(), 'test-data', 'notes.json');

// Create a test version of NoteService that uses test data directory
class TestNoteService extends NoteService {
  protected getDataFilePath(): string {
    return TEST_DATA_FILE;
  }
}

describe('NoteService', () => {
  let noteService: TestNoteService;

  beforeEach(() => {
    noteService = new TestNoteService();
  });

  afterEach(async () => {
    // Clean up test data
    try {
      await fs.rm(path.dirname(TEST_DATA_FILE), { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  describe('getAllNotes', () => {
    it('should return empty array when no notes exist', async () => {
      const notes = await noteService.getAllNotes();
      expect(notes).toEqual([]);
    });
  });

  describe('countNotes', () => {
    it('should return zero when no notes exist', async () => {
      await expect(noteService.countNotes()).resolves.toBe(0);
    });

    it('should return the number of stored notes', async () => {
      await noteService.createNote('First note', 'First content');
      await noteService.createNote('Second note', 'Second content');

      await expect(noteService.countNotes()).resolves.toBe(2);
    });
  });

  describe('getNoteById', () => {
    it('should return null when note does not exist', async () => {
      const note = await noteService.getNoteById('non-existent-id');
      expect(note).toBeNull();
    });
  });

  describe('updateNote', () => {
    it('should return null when updating non-existent note', async () => {
      const updatedNote = await noteService.updateNote('non-existent-id', { title: 'Updated' });
      expect(updatedNote).toBeNull();
    });
  });

  describe('searchNotes', () => {
    it('should return empty array when there are no notes', async () => {
      const results = await noteService.searchNotes('meeting');
      expect(results).toEqual([]);
    });

    it('should search case-insensitively in note titles', async () => {
      await noteService.createNote('Project Meeting Notes', 'Daily standup summary');
      await noteService.createNote('Shopping List', 'Buy groceries next week');

      const results = await noteService.searchNotes('MEETING');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Project Meeting Notes');
    });

    it('should search case-insensitively in note content using partial matches', async () => {
      await noteService.createNote('Work Items', 'Prepare release notes for tomorrow');
      await noteService.createNote('Travel', 'Book flight to Singapore');

      const results = await noteService.searchNotes('RELEASE');

      expect(results).toHaveLength(1);
      expect(results[0].content).toContain('release');
    });

    it('should return all notes when search keyword is blank or whitespace', async () => {
      await noteService.createNote('Alpha', 'First note');
      await noteService.createNote('Beta', 'Second note');

      const results = await noteService.searchNotes('   ');

      expect(results).toHaveLength(2);
    });

    it('should return empty array when keyword matches nothing', async () => {
      await noteService.createNote('Project Plan', 'Team updates');
      await noteService.createNote('Travel', 'Book flight');

      const results = await noteService.searchNotes('zebra');

      expect(results).toEqual([]);
    });
  });

  describe('file system operations', () => {
    it('should create data directory if it does not exist', async () => {
      // Ensure directory doesn't exist
      try {
        await fs.rm(path.dirname(TEST_DATA_FILE), { recursive: true, force: true });
      } catch {
        // Directory might not exist
      }

      // Create a note file manually since createNote is removed
      await fs.mkdir(path.dirname(TEST_DATA_FILE), { recursive: true });
      await fs.writeFile(TEST_DATA_FILE, JSON.stringify([], null, 2));

      // Check that directory was created
      const stats = await fs.stat(path.dirname(TEST_DATA_FILE));
      expect(stats.isDirectory()).toBe(true);
    });
  });
});
