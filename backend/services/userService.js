// User Service - Handles all user-related database operations
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

/**
 * Find a user by email address
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} User object or null
 */
async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Find a user by ID
 * @param {string} userId - User's ID
 * @returns {Promise<Object|null>} User object or null
 */
async function findUserById(userId) {
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
 * @param {Object} userData - User data
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - Plain text password
 * @returns {Promise<Object>} Created user object (without password)
 */
async function createUser({ name, email, password }) {
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
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if password matches
 */
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
};
