import { Schema, model, Document } from 'mongoose';

export interface IEducation extends Document {
  degree: string;
  org: string;
  from: string;
  to: string;
  note: string;
  order: number;
}

const educationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  org:    { type: String, required: true },
  from:   { type: String, required: true },
  to:     { type: String, required: true },
  note:   { type: String, default: '' },
  order:  { type: Number, default: 0 },
}, { timestamps: true });

export const Education = model<IEducation>('Education', educationSchema);
