import fs from "fs";
import jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string, username: string) => {
	const privateKey = fs.readFileSync("keys/private.key", "utf8");
	return jwt.sign({ id, role, username }, privateKey, {
		algorithm: "RS256",
    	expiresIn: "24h",
  	});
};