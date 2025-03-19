import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        const connectionString = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${connectionString.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to daatbase: ${error.message}`);
        process.exit(1);
    }
}