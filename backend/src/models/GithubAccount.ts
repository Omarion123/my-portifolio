import { Schema, model, Document } from 'mongoose';

export interface IGithubAccount extends Document {
  username: string;
  accessToken: string;
  label: string;
}

const githubAccountSchema = new Schema<IGithubAccount>({
  username:    { type: String, required: true },
  accessToken: { type: String, required: true },
  label:       { type: String, default: '' },
}, { timestamps: true });

export const GithubAccount = model<IGithubAccount>('GithubAccount', githubAccountSchema);
