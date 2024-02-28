import mongoose from 'mongoose';
import { env } from '../config/enviroment';

const MONGO_URI = env.MONGODB_URL || ''; // Placeholder URI, replace with your actual connection string

export async function connectToMongoose(): Promise<mongoose.Mongoose> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB with Mongoose');
        return mongoose;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Re-throw the error to be handled by the calling code
    }
}