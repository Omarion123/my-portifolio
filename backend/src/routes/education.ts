import { Router } from 'express';
import { getEducation, bulkReplaceEducation } from '../controllers/educationController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getEducation);
router.put('/', requireAuth, bulkReplaceEducation);

export default router;
