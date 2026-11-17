import type { Request, Response } from 'express';
import { validate } from 'uuid';
import { createPaste, getPasteStatus, viewPaste } from '../services/paste.service.js';

export const create = async (req: Request, res: Response) => {
  try {
    const { content, expires_at, max_views } = req.body;
    const paste = await createPaste(content, expires_at, max_views);
    res.status(201).json(paste);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!validate(id)) return res.status(404).json({ error: 'Paste not found' });

    const status = await getPasteStatus(id);
    if (!status) return res.status(404).json({ error: 'Paste not found' });

    res.json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!validate(id)) return res.status(404).json({ error: 'Paste not found' });

    const paste = await viewPaste(id);
    if (!paste) return res.status(404).json({ error: 'Paste not found' });

    res.json(paste);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
