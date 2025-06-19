import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        // connect to mongodb
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch (error){
        console.log("MongoDB connection error :", error);
    }
};