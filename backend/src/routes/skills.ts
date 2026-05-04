import { Router } from 'express';
import { getSkills, bulkReplaceSkills } from '../controllers/skillsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getSkills);
router.put('/', requireAuth, bulkReplaceSkills);

export default router;
