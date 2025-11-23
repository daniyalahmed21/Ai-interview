import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
/**
 * Find a user by email address
 */
export async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email },
    });
}
/**
 * Find a user by ID
 */
export async function findUserById(userId) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
}
/**
 * Create a new user with hashed password
 */
export async function createUser({ name, email, password, }) {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user in database
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
    return user;
}
/**
 * Verify user password
 */
export async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
//# sourceMappingURL=userService.js.map