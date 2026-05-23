import { Request, Response } from 'express';
import { BlogPost } from '../models/BlogPost';

export async function getPosts(_req: Request, res: Response): Promise<void> {
  res.json(await BlogPost.find({ published: true }).sort('-createdAt'));
}

export async function getAllPosts(_req: Request, res: Response): Promise<void> {
  res.json(await BlogPost.find().sort('-createdAt'));
}

export async function getPost(req: Request, res: Response): Promise<void> {
  const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
  if (!post) { res.status(404).json({ message: 'Post not found' }); return; }
  res.json(post);
}

export async function createPost(req: Request, res: Response): Promise<void> {
  const post = await BlogPost.create(req.body);
  res.status(201).json(post);
}

export async function updatePost(req: Request, res: Response): Promise<void> {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!post) { res.status(404).json({ message: 'Post not found' }); return; }
  res.json(post);
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.status(204).end();
}

export async function bulkReplacePosts(req: Request, res: Response): Promise<void> {
  const items: Array<Record<string, unknown>> = req.body;
  await BlogPost.deleteMany({});
  const created = await BlogPost.insertMany(items.map(({ _id, ...p }) => p));
  res.json(created);
}
