import { Router } from 'express';
import { create, getOne, getStatuses } from '../controllers/paste.controller.js';
import { validate } from '../middlewares/validate.js';
import { createPasteSchema, statusSchema } from '../validators/paste.validator.js';

const router = Router();

router.post('/', validate(createPasteSchema), create);
router.post('/stats', validate(statusSchema), getStatuses); // read-only, doesn't count a view
router.get('/:id', getOne);

export default router;
