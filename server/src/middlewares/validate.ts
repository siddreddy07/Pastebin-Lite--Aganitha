import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

// Checks req.body against a zod schema; replies 400 with the first problem.
export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0]!.message });
  }
  req.body = result.data;
  next();
};
