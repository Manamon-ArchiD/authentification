import fs from "fs";
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
  // TODO call the user service

  res.status(201).json({ message: "User registered",
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role, user.username),
    },
  });
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

// Public key
router.get("/public-key", (req: Request, res: Response) => {
  const publicKey: string = fs.readFileSync("keys/public.key", "utf8");
  res.status(200).json({ key: publicKey });
});

export default router;