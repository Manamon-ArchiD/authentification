import jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string, username: string) => {
  return jwt.sign({ id, role, username }, "your_jwt_secret", { // TODO change this secret
    expiresIn: "24h",
  });
};