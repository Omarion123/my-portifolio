import { Request, Response } from 'express';
import { Identity } from '../models/Identity';

export async function getIdentity(_req: Request, res: Response): Promise<void> {
  const identity = await Identity.findOne();
  res.json(identity ?? {});
}

export async function updateIdentity(req: Request, res: Response): Promise<void> {
  const identity = await Identity.findOne();
  if (!identity) {
    res.status(404).json({ message: 'Identity not found' });
    return;
  }
  const allowed = [
    'name', 'title', 'location', 'tagline', 'email',
    'github', 'linkedin', 'available', 'profileImage',
    'aboutParagraphs', 'aboutFocus', 'aboutStats',
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) (identity as any)[key] = req.body[key];
  }
  await identity.save();
  res.json(identity);
}
