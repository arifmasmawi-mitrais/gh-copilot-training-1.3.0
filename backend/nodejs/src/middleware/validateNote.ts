import { NextFunction, Request, Response } from 'express';

const validateTagArray = (tags: unknown): boolean => {
  return Array.isArray(tags) && tags.every(tag => typeof tag === 'string' && tag.trim().length > 0);
};

export const validateCreateNote = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, tags } = req.body;

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Content is required' });
  }

  if (tags !== undefined && !validateTagArray(tags)) {
    return res.status(400).json({ error: 'Tags must be an array of non-empty strings' });
  }

  req.body.title = title.trim();
  req.body.content = content.trim();
  req.body.tags = Array.isArray(tags)
    ? tags.map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  next();
};

export const validateUpdateNote = (req: Request, res: Response, next: NextFunction) => {
  const updates = req.body;

  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    return res.status(400).json({ error: 'Invalid update payload' });
  }

  const keys = Object.keys(updates);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'At least one field is required to update' });
  }

  if (updates.title !== undefined) {
    if (typeof updates.title !== 'string' || !updates.title.trim()) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    updates.title = updates.title.trim();
  }

  if (updates.content !== undefined) {
    if (typeof updates.content !== 'string' || !updates.content.trim()) {
      return res.status(400).json({ error: 'Content must be a non-empty string' });
    }
    updates.content = updates.content.trim();
  }

  if (updates.tags !== undefined) {
    if (!validateTagArray(updates.tags)) {
      return res.status(400).json({ error: 'Tags must be an array of non-empty strings' });
    }
    updates.tags = updates.tags.map((tag: string) => tag.trim()).filter(Boolean);
  }

  next();
};

export const validateSearchKeyword = (req: Request, res: Response, next: NextFunction) => {
  const keyword = req.query.keyword;

  if (typeof keyword !== 'string' || !keyword.trim()) {
    return res.status(400).json({ error: 'Search keyword is required' });
  }

  req.query.keyword = keyword.trim();
  next();
};

export const validateNoteId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (typeof id !== 'string' || !id.trim()) {
    return res.status(400).json({ error: 'Note id is required' });
  }

  next();
};
