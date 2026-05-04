import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memServer: MongoMemoryServer | null = null;

function isLocalUri(uri: string) {
  return !uri || uri.includes('localhost') || uri.includes('127.0.0.1');
}

export async function connectDB() {
  let uri = process.env.MONGO_URI ?? '';

  if (isLocalUri(uri)) {
    console.log('No external MongoDB detected — starting in-memory server…');
    memServer = await MongoMemoryServer.create();
    uri = memServer.getUri();
    console.log(`In-memory MongoDB ready at ${uri}`);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memServer) await memServer.stop();
}
