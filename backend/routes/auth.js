// Authentication Routes - Handles user signup and login endpoints
const express = require("express");
const router = express.Router();
const { z } = require("zod");

// Import services
const userService = require("../services/userService");
const authService = require("../services/authService");

// Validation schemas for input data
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post("/signup", async (req, res) => {
  try {
    // Validate input data
    const validatedData = signupSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    // Create new user
    const user = await userService.createUser({ name, email, password });

    // Generate authentication token
    const token = authService.generateToken(user);

    // Return success response
    res.status(201).json({
      message: "User created successfully",
      token,
      user,
      needsCV: true, // Signal that user should create CV next
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message
      });
    }

    // Handle other errors
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Failed to create account. Please try again."
    });
  }
});

/**
 * POST /api/auth/login
 * Login existing user
 */
router.post("/login", async (req, res) => {
  try {
    // Validate input data
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user by email
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Verify password
    const isValidPassword = await userService.verifyPassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate authentication token
    const token = authService.generateToken(user);

    // Return success response (without password)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message
      });
    }

    // Handle other errors
    console.error("Login error:", error);
    res.status(500).json({
      message: "Failed to login. Please try again."
    });
  }
});

module.exports = router;
