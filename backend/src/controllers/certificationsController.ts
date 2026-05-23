import { Request, Response } from 'express';
import { Certification } from '../models/Certification';

export async function getCertifications(_req: Request, res: Response): Promise<void> {
  res.json(await Certification.find().sort('order'));
}

export async function bulkReplaceCertifications(req: Request, res: Response): Promise<void> {
  const items: Array<Record<string, unknown>> = req.body;
  await Certification.deleteMany({});
  const created = await Certification.insertMany(items.map(({ _id, ...c }, i) => ({ ...c, order: i })));
  res.json(created);
}
