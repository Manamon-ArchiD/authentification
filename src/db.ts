import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://admin:password@mongodb:27017/manamon-auth?authSource=admin&directConnection=true");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;