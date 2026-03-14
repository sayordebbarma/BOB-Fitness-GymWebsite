import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'loaded' : 'MISSING');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected to ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;