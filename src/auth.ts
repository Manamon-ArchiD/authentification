import fs from "fs";
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "./user";
import { generateToken } from "./generateJWT";
import SendVerifMail from "./password";

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
  const token = generateToken(user.id, user.role, user.username);

  const profileURL = 'http://10.144.193.214:3000/profile';
  const profileData = {
    "username": user.username,
    "email": user.email,
    "userId": user.id,
    "avatar": "https://siecledigital.fr/wp-content/uploads/2017/05/Rickroll.jpg"
  };

  const profileResponse = await fetch(profileURL, {
    method: 'POST',
    body: JSON.stringify(profileData),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!profileResponse.ok) {
    console.error(profileResponse.statusText);
    console.log(profileResponse);
    return res.status(500).json({ message: "Profile creation failed", error: profileResponse });
  }

  res.status(201).json({ message: "User registered",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: token,
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

// Reset password
// ! NE MARCHE PAS, NE MARCHERA PAS !!!
router.post("/reset-password", async (req: Request, res: Response) => {
  const  { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const result = await SendVerifMail(email);
 if (!result) {
    return res.status(400).json({ message: "Password update failed" });
}
 return res.status(200).json({ message: "Password updated" });
});

// Public key
router.get("/public-key", (req: Request, res: Response) => {
  const publicKey: string = fs.readFileSync("keys/public.key", "utf8");
  res.status(200).json({ key: publicKey });
});

export default router;