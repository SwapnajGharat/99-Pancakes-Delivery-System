import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    console.error(`[Database] Please ensure MongoDB is running or update MONGO_URI in .env`);
    process.exit(1);
  }
};

// Graceful shutdown handling
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  console.log('[Database] Mongoose connection closed (SIGINT)');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  console.log('[Database] Mongoose connection closed (SIGTERM)');
  process.exit(0);
});
