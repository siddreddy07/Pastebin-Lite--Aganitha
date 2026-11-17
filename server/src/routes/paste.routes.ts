import { Router } from 'express';
import { create, getOne, getStatus, remove } from '../controllers/paste.controller.js';
import { validate } from '../middlewares/validate.js';
import { createPasteSchema } from '../validators/paste.validator.js';

const router = Router();

router.post('/', validate(createPasteSchema), create);
router.get('/:id/stats', getStatus); // read-only, doesn't count a view
router.get('/:id', getOne);
router.delete('/:id', remove);

export default router;
