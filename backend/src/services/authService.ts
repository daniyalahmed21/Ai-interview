import jwt, { SignOptions } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

const JWT_SECRET: string = process.env.JWT_SECRET || "Rayyanrak12+";

export function generateToken(user: User): string {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  } as SignOptions);
}

/**
 * Verify and decode JWT token
 * @param token - JWT token
 * @returns Decoded token data or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
