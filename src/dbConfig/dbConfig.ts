import mongoose from "mongoose";

// connect function for establishing a connection to MongoDB using Mongoose. 

export async function connect() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI must be defined');
        process.exit(1); // Exit with failure code
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit with failure code
    }
}