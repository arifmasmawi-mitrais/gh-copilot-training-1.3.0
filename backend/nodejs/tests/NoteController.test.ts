import request from 'supertest';
import express from 'express';
import cors from 'cors';
import notesRouter from '../src/controller/NoteController';
import fs from 'fs/promises';
import path from 'path';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/notes', notesRouter);
  return app;
};

// Mock the NoteService to use test data
jest.mock('../src/services/NoteService', () => {
  const originalModule = jest.requireActual('../src/services/NoteService');

  class MockNoteService extends originalModule.NoteService {
    protected getDataFilePath(): string {
      return path.join(process.cwd(), 'test-data', 'notes.json');
    }
  }

  return {
    NoteService: MockNoteService
  };
});

describe('Notes API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  afterEach(async () => {
    // Clean up both test and regular data directories
    const testDirs = [
      path.join(process.cwd(), 'test-data'),
      path.join(process.cwd(), 'data')
    ];

    for (const dir of testDirs) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
      } catch {
        // Directory might not exist
      }
    }
  });

  describe('GET /api/notes', () => {
    it('should return empty array when no notes exist', async () => {
      const response = await request(app)
        .get('/api/notes')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should filter notes by q query using case-insensitive contains matching', async () => {
      await request(app)
        .post('/api/notes')
        .send({ title: 'Project Meeting Notes', content: 'Daily standup summary' })
        .expect(201);

      await request(app)
        .post('/api/notes')
        .send({ title: 'Shopping List', content: 'Buy groceries next week' })
        .expect(201);

      const response = await request(app)
        .get('/api/notes?q=MEETING')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        title: 'Project Meeting Notes',
        content: 'Daily standup summary'
      });
    });

    it('should return proper content type', async () => {
      const response = await request(app)
        .get('/api/notes')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('GET /api/notes/count', () => {
    it('should return zero when no notes exist', async () => {
      const response = await request(app)
        .get('/api/notes/count')
        .expect(200);

      expect(response.body).toEqual({ count: 0 });
    });

    it('should return the number of existing notes', async () => {
      await request(app)
        .post('/api/notes')
        .send({ title: 'First note', content: 'First content' })
        .expect(201);
      await request(app)
        .post('/api/notes')
        .send({ title: 'Second note', content: 'Second content' })
        .expect(201);

      const response = await request(app)
        .get('/api/notes/count')
        .expect(200);

      expect(response.body).toEqual({ count: 2 });
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return 404 when note does not exist', async () => {
      const response = await request(app)
        .get('/api/notes/non-existent-id')
        .expect(404);

      expect(response.body).toEqual({ error: 'Note not found' });
    });
  });

  describe('POST /api/notes', () => {
    it('should create a new note with valid data', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({
          title: 'Test Note',
          content: 'This is a test note',
          tags: ['work', 'training']
        })
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'Test Note',
        content: 'This is a test note',
        tags: ['work', 'training']
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({ content: 'This is a test note' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Title is required' });
    });

    it('should return 400 when title is whitespace only', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({ title: '   ', content: 'This is a test note' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Title is required' });
    });

    it('should return 400 when content is missing', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({ title: 'Test Note' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Content is required' });
    });

    it('should return 400 when content is whitespace only', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({ title: 'Test Note', content: '   ' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Content is required' });
    });

    it('should return 400 when tags is not an array of strings', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({
          title: 'Test Note',
          content: 'This is a test note',
          tags: 'work'
        })
        .expect(400);

      expect(response.body).toEqual({ error: 'Tags must be an array of non-empty strings' });
    });
  });

  describe('GET /api/notes/search', () => {
    it('should return 400 when search keyword is missing', async () => {
      const response = await request(app)
        .get('/api/notes/search')
        .expect(400);

      expect(response.body).toEqual({ error: 'Search keyword is required' });
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should return 400 when update payload is empty', async () => {
      const response = await request(app)
        .put('/api/notes/some-id')
        .send({})
        .expect(400);

      expect(response.body).toEqual({ error: 'At least one field is required to update' });
    });

    it('should return 400 when title is not a non-empty string', async () => {
      const response = await request(app)
        .put('/api/notes/some-id')
        .send({ title: 123 })
        .expect(400);

      expect(response.body).toEqual({ error: 'Title must be a non-empty string' });
    });

    it('should return 400 when update title is whitespace only', async () => {
      const response = await request(app)
        .put('/api/notes/some-id')
        .send({ title: '   ' })
        .expect(400);

      expect(response.body).toEqual({ error: 'Title must be a non-empty string' });
    });

    it('should return 404 when updating non-existent note', async () => {
      const response = await request(app)
        .put('/api/notes/non-existent-id')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body).toEqual({ error: 'Note not found' });
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete an existing note successfully', async () => {
      const createResponse = await request(app)
        .post('/api/notes')
        .send({
          title: 'Delete Me',
          content: 'This note will be deleted'
        })
        .expect(201);

      await request(app)
        .delete(`/api/notes/${createResponse.body.id}`)
        .expect(204);

      const getResponse = await request(app)
        .get(`/api/notes/${createResponse.body.id}`)
        .expect(404);

      expect(getResponse.body).toEqual({ error: 'Note not found' });
    });
  });
});
