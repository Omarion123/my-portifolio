import { Router } from 'express';
import { getCertifications, bulkReplaceCertifications } from '../controllers/certificationsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getCertifications);
router.put('/', requireAuth, bulkReplaceCertifications);

export default router;
