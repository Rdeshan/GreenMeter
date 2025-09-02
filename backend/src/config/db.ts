import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Atlas Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Log more details about the error
    if (err instanceof Error) {
      console.error('Error details:', err.message);
    }
    process.exit(1);
  }
};
