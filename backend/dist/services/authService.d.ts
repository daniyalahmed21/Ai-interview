interface TokenPayload {
    userId: string;
    email: string;
}
interface User {
    id: string;
    email: string;
    name?: string;
}
export declare function generateToken(user: User): string;
/**
 * Verify and decode JWT token
 * @param token - JWT token
 * @returns Decoded token data or null if invalid
 */
export declare function verifyToken(token: string): TokenPayload | null;
export {};
//# sourceMappingURL=authService.d.ts.map