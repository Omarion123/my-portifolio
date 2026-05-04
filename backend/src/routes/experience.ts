import { Router } from 'express';
import { getExperience, bulkReplaceExperience } from '../controllers/experienceController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getExperience);
router.put('/', requireAuth, bulkReplaceExperience);

export default router;
