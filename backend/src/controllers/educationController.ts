import { Request, Response } from 'express';
import { Education } from '../models/Education';

export async function getEducation(_req: Request, res: Response): Promise<void> {
  res.json(await Education.find().sort('order'));
}

export async function bulkReplaceEducation(req: Request, res: Response): Promise<void> {
  const items: Array<Record<string, unknown>> = req.body;
  await Education.deleteMany({});
  const created = await Education.insertMany(items.map(({ _id, ...e }, i) => ({ ...e, order: i })));
  res.json(created);
}
