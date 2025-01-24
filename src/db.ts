import mongoose from "mongoose";

const connectDB = async () => {
  const user = process.env.MONGO_INITDB_ROOT_USERNAME;
  const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
  const string = `mongodb://${user}:${password}@mongodb:27017/auth_mongo?authSource=admin`;
  try {
await mongoose.connect(string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

export default connectDB;