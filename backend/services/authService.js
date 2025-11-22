// Auth Service - Handles authentication logic
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "Rayyanrak12+";
const TOKEN_EXPIRY = "7d"; // 7 days

/**
 * Generate JWT token for a user
 * @param {Object} user - User object
 * @param {string} user.id - User's ID
 * @param {string} user.email - User's email
 * @returns {string} JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token data or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
