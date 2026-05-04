import { Schema, model, Document } from 'mongoose';

export interface IExperience extends Document {
  role: string;
  org: string;
  from: string;
  to: string;
  where: string;
  summary: string;
  bullets: string[];
  order: number;
}

const experienceSchema = new Schema<IExperience>({
  role:    { type: String, required: true },
  org:     { type: String, required: true },
  from:    { type: String, required: true },
  to:      { type: String, required: true },
  where:   { type: String, default: '' },
  summary: { type: String, default: '' },
  bullets: [{ type: String }],
  order:   { type: Number, default: 0 },
}, { timestamps: true });

export const Experience = model<IExperience>('Experience', experienceSchema);
