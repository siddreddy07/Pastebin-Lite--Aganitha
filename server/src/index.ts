import express, { Request, Response } from 'express';
import cors from 'cors';
import pasteRoutes from './routes/paste.routes.js';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use('/pastes', pasteRoutes);

// Catches errors from middleware, e.g. malformed JSON in the request body.
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  res.status(err.status ?? 500).json({ error: err.status === 400 ? 'Invalid JSON body' : 'Something went wrong' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
