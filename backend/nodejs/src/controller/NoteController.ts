import { Router, Request, Response } from 'express';
import { NoteService } from '../services/NoteService';
import { UpdateNoteRequest } from '../types/Note';
import {
  validateCreateNote,
  validateNoteId,
  validateSearchKeyword,
  validateUpdateNote
} from '../middleware/validateNote';

const router = Router();
const noteService = new NoteService();

/**
 * Retrieves every note currently persisted by the service layer.
 *
 * This list endpoint provides the full note collection for UI or API consumers.
 * Any storage or read failure is caught at the HTTP boundary and converted into a
 * predictable 500 JSON response.
 *
 * @route GET /api/notes
 * @returns {Response} JSON array of note records.
 * @throws {Error} When the underlying service cannot read notes; the handler
 * responds with a 500 error payload instead of rethrowing.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const notes = await noteService.getAllNotes();
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

/**
 * Returns the total number of notes stored in the backing data source.
 *
 * This endpoint is intended for lightweight counters, pagination metadata, or
 * dashboard summaries without returning the note payloads themselves.
 *
 * @route GET /api/notes/count
 * @returns {Response} JSON object containing a numeric `count` field.
 * @throws {Error} When the service fails while counting notes; the route reports
 * a 500 error payload to the client.
 */
router.get('/count', async (req: Request, res: Response) => {
  try {
    const count = await noteService.countNotes();
    res.json({ count });
  } catch (error) {
    console.error('Error counting notes:', error);
    res.status(500).json({ error: 'Failed to count notes' });
  }
});

/**
 * Searches notes by keyword across the title and content fields.
 *
 * The request is validated before the service call so that the keyword is
 * normalized and the search remains case-insensitive and stable for clients.
 *
 * @route GET /api/notes/search
 * @param {Request} req.query.keyword - The text to match against note titles and content.
 * @returns {Response} JSON array of notes whose title or content includes the keyword.
 * @throws {Error} When the search cannot be completed; the handler converts the
 * failure into a 500 JSON response.
 */
router.get('/search', validateSearchKeyword, async (req: Request, res: Response) => {
  try {
    const keyword = String(req.query.keyword ?? '').trim();
    const notes = await noteService.searchNotes(keyword);
    res.json(notes);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

/**
 * Retrieves a single note by its unique identifier.
 *
 * The route validates the ID before looking up the note and returns a 404 JSON
 * payload when the resource is missing. This keeps the API contract explicit for
 * clients that depend on single-resource reads.
 *
 * @route GET /api/notes/:id
 * @param {Request} req.params.id - The note identifier to fetch.
 * @returns {Response} The matching note JSON, or a 404 error payload when no note exists.
 * @throws {Error} When the service cannot read the note; the route responds with
 * a 500 JSON error instead of throwing.
 */
router.get('/:id', validateNoteId, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await noteService.getNoteById(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

/**
 * Creates a new note from the request payload.
 *
 * Request validation ensures that the required title and content are present
 * before the service layer assigns the generated ID and timestamps. The created
 * note is returned with HTTP 201 for successful writes.
 *
 * @route POST /api/notes
 * @param {Request} req.body.title - The title for the new note.
 * @param {Request} req.body.content - The body content for the new note.
 * @param {Request} [req.body.tags=[]] - Optional tags to attach to the note.
 * @returns {Response} The newly created note with status 201.
 * @throws {Error} When persistence fails in the service layer; the route reports a
 * 500 JSON error to the client.
 */
router.post('/', validateCreateNote, async (req: Request, res: Response) => {
  try {
    const { title, content, tags = [] } = req.body;
    const newNote = await noteService.createNote(title, content, tags);
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});


/**
 * Updates an existing note with the supplied partial payload.
 *
 * The route validates both the target ID and the update body before writing the
 * change. If the note is missing, the API returns 404; otherwise it returns the
 * updated note payload.
 *
 * @route PUT /api/notes/:id
 * @param {Request} req.params.id - The note identifier to update.
 * @param {Request} req.body - Partial note fields to apply.
 * @returns {Response} The updated note JSON, or a 404 error payload when the note is missing.
 * @throws {Error} When the update cannot be completed; the handler converts the
 * failure into a 500 JSON response.
 */
router.put('/:id', validateNoteId, validateUpdateNote, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateNoteRequest = req.body;

    const updatedNote = await noteService.updateNote(id, updates);

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

/**
 * Deletes a note identified by the supplied route parameter.
 *
 * The route validates the ID before removing the note and returns 404 when the
 * resource does not exist. Successful deletion resolves as a 204 No Content
 * response with no payload.
 *
 * @route DELETE /api/notes/:id
 * @param {Request} req.params.id - The note identifier to remove.
 * @returns {Response} Empty 204 response when deleted, or a 404 error payload if the note is absent.
 * @throws {Error} When the deletion operation fails; the handler reports a 500
 * JSON error to the client.
 */
router.delete('/:id', validateNoteId, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await noteService.deleteNote(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
