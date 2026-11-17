import express, { Request, Response } from 'express';
import cors from 'cors';
import pasteRoutes from './routes/paste.routes.js';

const app = express();
const PORT = process.env.PORT || 8080;

// FRONTEND_URL limits CORS to the deployed client; unset (local dev) allows any origin.
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json({ limit: '1mb' })); // bigger bodies get a 413
app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
app.use('/pastes', pasteRoutes);

// Catches errors from middleware, e.g. malformed JSON in the request body.
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  if (err.status === 413) return res.status(413).json({ error: 'Paste is too large (max 1 MB)' });
  if (err.status === 400) return res.status(400).json({ error: 'Invalid JSON body' });
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
