import { Router } from 'express';
import { body } from 'express-validator';
import { login, me } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
  login
);

router.get('/me', requireAuth, me);

export default router;
