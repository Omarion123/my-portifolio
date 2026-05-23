import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getIdentity, updateIdentity } from '../controllers/identityController';

const router = Router();

router.get('/', requireAuth, getIdentity);
router.put('/', requireAuth, updateIdentity);

export default router;
