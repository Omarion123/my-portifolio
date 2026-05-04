import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPosts, getAllPosts, getPost, createPost,
  updatePost, deletePost, bulkReplacePosts,
} from '../controllers/blogController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', getPosts);
router.get('/all', requireAuth, getAllPosts);
router.get('/:slug', getPost);

router.put('/', requireAuth, bulkReplacePosts);

router.post('/',
  requireAuth,
  body('title').notEmpty().trim(),
  body('excerpt').notEmpty().trim(),
  body('date').notEmpty(),
  validate,
  createPost
);

router.patch('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);

export default router;
