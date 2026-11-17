import express, { Request, Response } from 'express';
import cors from 'cors';
import pasteRoutes from './routes/paste.routes.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '1mb' })); // bigger bodies get a 413
app.use('/pastes', pasteRoutes);

// Catches errors from middleware, e.g. malformed JSON in the request body.
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  if (err.status === 413) return res.status(413).json({ error: 'Paste is too large (max 1 MB)' });
  if (err.status === 400) return res.status(400).json({ error: 'Invalid JSON body' });
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
