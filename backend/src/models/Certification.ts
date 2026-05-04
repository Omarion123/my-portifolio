import { Schema, model, Document } from 'mongoose';

export interface ICertification extends Document {
  name: string;
  org: string;
  year: string;
  link?: string;
  order: number;
}

const certificationSchema = new Schema<ICertification>({
  name:  { type: String, required: true },
  org:   { type: String, required: true },
  year:  { type: String, required: true },
  link:  { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Certification = model<ICertification>('Certification', certificationSchema);
