import mongoose from 'mongoose';

// MongoDB connection URL
// Using environment variable for MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_app';

export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Add initial data setup if needed
    await setupInitialData();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

async function setupInitialData(): Promise<void> {
  // This function will be used to set up any initial data the app needs
  // We'll implement this if needed
  console.log('Checking for initial data setup...');
}