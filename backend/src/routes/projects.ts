import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProjects, createProject, updateProject,
  deleteProject, bulkReplaceProjects,
} from '../controllers/projectsController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', getProjects);

router.put('/', requireAuth, bulkReplaceProjects);

router.post('/',
  requireAuth,
  body('title').notEmpty().trim(),
  body('blurb').notEmpty().trim(),
  body('year').notEmpty(),
  validate,
  createProject
);

router.patch('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
