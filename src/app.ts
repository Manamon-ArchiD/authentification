import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db";
import authRoutes from "./auth";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/auth", authRoutes);
connectDB();
app.listen(5000, () => console.log(`Server running on port 5000`));