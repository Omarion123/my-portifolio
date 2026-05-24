import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getContributions,
  listAccounts,
  addAccount,
  deleteAccount,
} from '../controllers/githubController';

const router = Router();

// Public — landing page reads this
router.get('/contributions', getContributions);

// Protected — admin manages accounts
router.get('/accounts',        requireAuth, listAccounts);
router.post('/accounts',       requireAuth, addAccount);
router.delete('/accounts/:id', requireAuth, deleteAccount);

export default router;
