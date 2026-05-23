import { Request, Response } from 'express';
import { Project } from '../models/Project';

export async function getProjects(_req: Request, res: Response): Promise<void> {
  const projects = await Project.find().sort('order');
  res.json(projects);
}

export async function createProject(req: Request, res: Response): Promise<void> {
  const project = await Project.create(req.body);
  res.status(201).json(project);
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) { res.status(404).json({ message: 'Project not found' }); return; }
  res.json(project);
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  await Project.findByIdAndDelete(req.params.id);
  res.status(204).end();
}

export async function bulkReplaceProjects(req: Request, res: Response): Promise<void> {
  const items: Array<Record<string, unknown>> = req.body;
  await Project.deleteMany({});
  const created = await Project.insertMany(items.map(({ _id, ...p }, i) => ({ ...p, order: i })));
  res.json(created);
}
