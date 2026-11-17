import { z } from 'zod';

export const createPasteSchema = z.object({
  content: z
    .string({ error: 'content is required' })
    .refine((value) => value.trim().length > 0, 'content is required'),

  expires_at: z.iso
    .datetime({ offset: true, error: 'expires_at must be a valid date and time' })
    .refine((value) => new Date(value) > new Date(), 'expires_at must be in the future')
    .optional(),

  max_views: z
    .number({ error: 'max_views must be a whole number of at least 1' })
    .int('max_views must be a whole number of at least 1')
    .min(1, 'max_views must be a whole number of at least 1')
    .optional(),
});
