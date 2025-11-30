import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "Rayyanrak12+";
export function generateToken(user) {
    return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
    });
}
/**
 * Verify and decode JWT token
 * @param token - JWT token
 * @returns Decoded token data or null if invalid
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
}
//# sourceMappingURL=authService.js.map