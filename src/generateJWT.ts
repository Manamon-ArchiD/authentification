import jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string, username: string) => {
    const secret: string | undefined = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ id, role, username }, secret, {
        expiresIn: "24h",
    });
};