
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "./user";
import { generateToken } from "./generateJWT";

const router = express.Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, password: hashedPassword });

  res.status(201).json({ message: "User registered", user });
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id, user.role, user.username);
  res.status(200).json({ token });
});

export default router;