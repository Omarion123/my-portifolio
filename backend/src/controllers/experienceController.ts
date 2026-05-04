import { Request, Response } from 'express';
import { Experience } from '../models/Experience';

export async function getExperience(_req: Request, res: Response): Promise<void> {
  res.json(await Experience.find().sort('order'));
}

export async function bulkReplaceExperience(req: Request, res: Response): Promise<void> {
  const items: Array<Record<string, unknown>> = req.body;
  await Experience.deleteMany({});
  const created = await Experience.insertMany(items.map((e, i) => ({ ...e, order: i })));
  res.json(created);
}
