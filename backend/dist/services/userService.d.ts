export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}
export interface UserResponse {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}
/**
 * Find a user by email address
 */
export declare function findUserByEmail(email: string): Promise<{
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
} | null>;
/**
 * Find a user by ID
 */
export declare function findUserById(userId: string): Promise<UserResponse | null>;
/**
 * Create a new user with hashed password
 */
export declare function createUser({ name, email, password, }: CreateUserInput): Promise<UserResponse>;
/**
 * Verify user password
 */
export declare function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
//# sourceMappingURL=userService.d.ts.map