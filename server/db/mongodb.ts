import mongoose from 'mongoose';
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
import { log } from '../vite';
>>>>>>> 06d18af (Add user authentication with login and registration functionality.  Includes frontend and backend implementation, using JWT for authentication.)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin1:SDZ3E9dKfzt5vYEc@cluster0.rxi0w.mongodb.net/Recipe-Finder';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the structure of our cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global for TypeScript
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

<<<<<<< HEAD
export default connectToMongoDB;
>>>>>>> f5a0667 (Implement user authentication with MongoDB and update API key; add numerous packages including bcrypt, jsonwebtoken, and mongoose.)
=======
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

// Graceful disconnection when the server is shut down
process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

export { mongoose };
>>>>>>> 06d18af (Add user authentication with login and registration functionality.  Includes frontend and backend implementation, using JWT for authentication.)
