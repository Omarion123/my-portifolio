import { Request, Response } from 'express';
import { SkillGroup } from '../models/SkillGroup';

export async function getSkills(_req: Request, res: Response): Promise<void> {
  res.json(await SkillGroup.find().sort('order'));
}

export async function bulkReplaceSkills(req: Request, res: Response): Promise<void> {
  const items: Array<Record<string, unknown>> = req.body;
  await SkillGroup.deleteMany({});
  const created = await SkillGroup.insertMany(items.map((g, i) => ({ ...g, order: i })));
  res.json(created);
}
