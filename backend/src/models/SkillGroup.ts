import { Schema, model, Document } from 'mongoose';

export interface ISkillItem {
  name: string;
  level: number;
}

export interface ISkillGroup extends Document {
  group: string;
  items: ISkillItem[];
  order: number;
}

const skillGroupSchema = new Schema<ISkillGroup>({
  group: { type: String, required: true },
  items: [{
    name:  { type: String, required: true },
    level: { type: Number, min: 0, max: 100, default: 75 },
  }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const SkillGroup = model<ISkillGroup>('SkillGroup', skillGroupSchema);
