import { Router } from 'express';
import { create, getOne, getStatus } from '../controllers/paste.controller.js';
import { validate } from '../middlewares/validate.js';
import { createPasteSchema } from '../validators/paste.validator.js';

const router = Router();

router.post('/', validate(createPasteSchema), create);
router.get('/:id/stats', getStatus); // read-only, doesn't count a view
router.get('/:id', getOne);
export default router;
