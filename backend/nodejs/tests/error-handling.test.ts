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

  // Add error handling middleware to test error scenarios
  app.use('/api/notes', (req, res, next) => {
    // Add custom header to test middleware
    res.setHeader('X-Test-Middleware', 'active');
    next();
  });

  app.use('/api/notes', notesRouter);
  return app;
};

describe('Notes API Error Handling', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  afterEach(async () => {
    // Clean up test data
    const testDataDir = path.join(process.cwd(), 'data');
    try {
      await fs.rm(testDataDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  it('should handle requests with custom middleware', async () => {
    const response = await request(app)
      .get('/api/notes')
      .expect(200);

    expect(response.headers['x-test-middleware']).toBe('active');
  });

  
});
