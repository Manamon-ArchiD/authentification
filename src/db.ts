import mongoose from "mongoose";

const connectDB = async () => {
  try {
await mongoose.connect("mongodb://admin:password@mongodb:27017/auth_mongo?authSource=admin");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;