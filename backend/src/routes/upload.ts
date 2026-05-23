import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { upload, uploadToCloudinary } from '../middleware/upload';

const router = Router();

router.post(
  '/image',
  requireAuth,
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio');
    res.json({ url: result.secure_url, publicId: result.public_id });
  }
);

export default router;
