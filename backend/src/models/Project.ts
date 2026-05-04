import { Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
  idx: string;
  title: string;
  blurb: string;
  role: string;
  year: string;
  stack: string[];
  category: string;
  featured: boolean;
  live: string;
  repo: string;
  status: string;
  order: number;
}

const projectSchema = new Schema<IProject>({
  idx:      { type: String, required: true },
  title:    { type: String, required: true },
  blurb:    { type: String, required: true },
  role:     { type: String, default: '' },
  year:     { type: String, required: true },
  stack:    [{ type: String }],
  category: { type: String, default: 'Product' },
  featured: { type: Boolean, default: false },
  live:     { type: String, default: '' },
  repo:     { type: String, default: '' },
  status:   { type: String, default: 'In Progress' },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

export const Project = model<IProject>('Project', projectSchema);
