import mongoose from 'mongoose';
import { seedInitialData } from '../seeds/seedData.js';
import { User } from '../models/User.js';

let mongoMemoryServerInstance = null;

/**
 * Connect to MongoDB database instance.
 * If local/specified MongoDB is unavailable, automatically boots an in-memory Mongo server
 * so the backend works instantly anywhere with zero local setup required!
 */
export const connectDB = async () => {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dayflow_hrms';

  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database]: Empty database detected. Auto-seeding initial Dayflow HRMS data...');
      await seedInitialData(false);
    }

    return conn;
  } catch (externalError) {
    console.warn(`[MongoDB Notice]: Could not connect to external MongoDB (${connStr}): ${externalError.message}`);
    console.log('[MongoDB]: Initializing high-speed in-memory MongoDB engine...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServerInstance = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServerInstance.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB In-Memory Connected]: ${memoryUri}`);

      console.log('[Database]: Auto-seeding in-memory Dayflow HRMS database...');
      await seedInitialData(false);

      return conn;
    } catch (memError) {
      console.error('[MongoDB Fatal Error]: Failed to initialize in-memory database:', memError);
      process.exit(1);
    }
  }
};

/**
 * Disconnect and stop in-memory server if running
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServerInstance) {
      await mongoMemoryServerInstance.stop();
    }
  } catch (err) {
    console.error('Error during database disconnect:', err);
  }
};
