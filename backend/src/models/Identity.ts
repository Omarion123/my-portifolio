import { Schema, model, Document } from 'mongoose';

export interface IIdentity extends Document {
  name: string;
  title: string;
  location: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  available: boolean;
  aboutParagraphs: string[];
  aboutFocus: string[];
  aboutStats: { k: string; v: string }[];
}

const identitySchema = new Schema<IIdentity>({
  name:             { type: String, required: true },
  title:            { type: String, required: true },
  location:         { type: String, default: '' },
  tagline:          { type: String, default: '' },
  email:            { type: String, required: true },
  github:           { type: String, default: '' },
  linkedin:         { type: String, default: '' },
  available:        { type: Boolean, default: true },
  aboutParagraphs:  [{ type: String }],
  aboutFocus:       [{ type: String }],
  aboutStats:       [{ k: String, v: String }],
}, { timestamps: true });

export const Identity = model<IIdentity>('Identity', identitySchema);
