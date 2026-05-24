import { Schema, model, Document } from 'mongoose';

export interface ICredential extends Document {
  userId: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  deviceName: string;
  createdAt: Date;
}

const credentialSchema = new Schema<ICredential>({
  userId:       { type: String, required: true },
  credentialId: { type: String, required: true, unique: true },
  publicKey:    { type: String, required: true },
  counter:      { type: Number, required: true, default: 0 },
  deviceName:   { type: String, default: 'My device' },
}, { timestamps: true });

export const Credential = model<ICredential>('Credential', credentialSchema);
