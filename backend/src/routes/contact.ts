import { Router } from 'express';
import { body } from 'express-validator';
import { sendContact, getIdentity, updateIdentity } from '../controllers/contactController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/',
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('message').notEmpty().isLength({ min: 10, max: 2000 }),
  validate,
  sendContact
);

router.get('/identity', getIdentity);
router.put('/identity', requireAuth, updateIdentity);

export default router;
