import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

export function signToken(payload: any) {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
}

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
export const comparePassword = verifyPassword;
