import express, { Router, Request, Response } from "express";
import { z } from "zod";
import * as userService from "../services/userService.js";
import * as authService from "../services/authService.js";

const router: Router = express.Router();

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

type SignupInput = z.infer<typeof signupSchema>;
type LoginInput = z.infer<typeof loginSchema>;

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    // console.log("Signup request received:", {
    //   name: req.body.name,
    //   email: req.body.email,
    // });

    // Validate input data
    const validatedData: SignupInput = signupSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({
        message: "User already exists with this email",
      });
      return;
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
      console.error("Validation error:", error.errors[0]);
      res.status(400).json({
        message: error.errors[0].message,
      });
      return;
    }

    // Handle other errors
    console.error(
      "Signup error:",
      error instanceof Error ? error.message : String(error)
    );
    res.status(500).json({
      message: "Failed to create account. Please try again.",
    });
  }
});

/**
 * POST /api/auth/login
 * Login existing user
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input data
    const validatedData: LoginInput = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user by email
    const user = await userService.findUserByEmail(email);
    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // Verify password
    const isValidPassword = await userService.verifyPassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
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
      res.status(400).json({
        message: error.errors[0].message,
      });
      return;
    }

    // Handle other errors
    console.error("Login error:", error);
    res.status(500).json({
      message: "Failed to login. Please try again.",
    });
  }
});

export default router;
