import mongoose from 'mongoose';
import { log } from '../vite';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin1:SDZ3E9dKfzt5vYEc@cluster0.rxi0w.mongodb.net/Recipe-Finder';

/**
 * Global cache for mongoose connection to prevent multiple connections during hot reloads.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      log('Connected to MongoDB', 'mongodb');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    log(`Error connecting to MongoDB: ${e}`, 'mongodb');
    throw e;
  }

  return cached.conn;
}

export function disconnectFromDatabase() {
  if (cached.conn) {
    mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    log('Disconnected from MongoDB', 'mongodb');
  }
}

// Connect to MongoDB when the server starts
connectToDatabase().catch(console.error);

// Gracefully disconnect on termination
process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

export { mongoose };
