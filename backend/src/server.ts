import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import authRoutes from "./routes/auth.js";
import cvRoutes from "./routes/cv.js";
import interviewRoutes from "./routes/interview.js";
import { initSocketService } from "./services/socketService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.IO
void initSocketService(httpServer);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Logging middleware
app.use((_req: Request, _res: Response, next: NextFunction) => {
  // console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/interview", interviewRoutes);

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO is ready for connections`);
});
