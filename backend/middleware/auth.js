// Authentication Middleware - Verifies JWT tokens and protects routes
const authService = require('../services/authService');

/**
 * Middleware to verify JWT token from request headers
 * Adds userId and userEmail to request object if token is valid
 */
const verifyToken = (req, res, next) => {
  // Extract token from Authorization header (format: "Bearer <token>")
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: 'Authentication required. Please log in.'
    });
  }

  // Verify token
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      message: 'Invalid or expired token. Please log in again.'
    });
  }

  // Add user info to request for use in route handlers
  req.userId = decoded.userId;
  req.userEmail = decoded.email;

  // Continue to next middleware/route handler
  next();
};

module.exports = verifyToken;

