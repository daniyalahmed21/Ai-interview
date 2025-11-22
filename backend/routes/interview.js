const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);
const prisma = require("../lib/prisma");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const userId = req.userId;
    const questionId = req.body.questionId || "unknown";
    const fieldId = req.body.fieldId || "unknown";
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || ".webm";
    cb(
      null,
      `user-${userId}-field-${fieldId}-question-${questionId}-${timestamp}${ext}`
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept video files
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

// Create new interview session
router.post("/session", verifyToken, async (req, res) => {
  try {
    const { fieldId } = req.body;
    const sessionId = `session-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    res.json({
      message: "Interview session created",
      sessionId,
      fieldId: fieldId || "unknown",
    });
  } catch (error) {
    console.error("Create session error:", error);
    res
      .status(500)
      .json({ message: "Error creating session", error: error.message });
  }
});

// Upload interview video
router.post(
  "/upload",
  verifyToken,
  upload.single("video"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }

      const { questionId, fieldId, sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      // Save interview session record
      const interviewSession = await prisma.interviewSession.create({
        data: {
          sessionId: sessionId,
          userId: req.userId,
          fieldId: fieldId || "unknown",
          questionId: parseInt(questionId) || 0,
          videoPath: req.file.path,
          videoFilename: req.file.filename,
        },
      });

      res.json({
        message: "Video uploaded successfully",
        sessionId: interviewSession.sessionId,
        id: interviewSession.id,
        filename: req.file.filename,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ message: "Error uploading video", error: error.message });
    }
  }
);

// Run code execution
router.post("/run-code", verifyToken, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res
        .status(400)
        .json({ message: "Code and language are required" });
    }

    let command = "";
    let tempFile = "";

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    switch (language) {
      case "javascript":
        tempFile = path.join(tempDir, `code-${Date.now()}.js`);
        fs.writeFileSync(tempFile, code);
        command = `node "${tempFile}"`;
        break;
      case "python":
        tempFile = path.join(tempDir, `code-${Date.now()}.py`);
        fs.writeFileSync(tempFile, code);
        command = `python "${tempFile}"`;
        break;
      case "cpp":
        tempFile = path.join(tempDir, `code-${Date.now()}.cpp`);
        const exeFile = tempFile.replace(".cpp", ".exe");
        fs.writeFileSync(tempFile, code);
        command = `g++ "${tempFile}" -o "${exeFile}" && "${exeFile}"`;
        break;
      case "java":
        tempFile = path.join(tempDir, `Code-${Date.now()}.java`);
        fs.writeFileSync(tempFile, code);
        const className = code.match(/class\s+(\w+)/)?.[1] || "Code";
        command = `cd "${tempDir}" && javac "${tempFile}" && java ${className}`;
        break;
      case "typescript":
        tempFile = path.join(tempDir, `code-${Date.now()}.ts`);
        fs.writeFileSync(tempFile, code);
        command = `ts-node "${tempFile}"`;
        break;
      case "csharp":
        tempFile = path.join(tempDir, `code-${Date.now()}.cs`);
        fs.writeFileSync(tempFile, code);
        command = `csc "${tempFile}" && "${tempFile.replace(".cs", ".exe")}"`;
        break;
      default:
        return res.status(400).json({ message: "Unsupported language" });
    }

    try {
      const { stdout, stderr } = await execPromise(command, {
        timeout: 10000, // 10 second timeout
        maxBuffer: 1024 * 1024, // 1MB buffer
      });

      // Clean up temp file
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }

      res.json({
        output: stdout || stderr || "Code executed successfully",
        result: stdout,
        error: stderr || null,
      });
    } catch (execError) {
      // Clean up temp file
      if (fs.existsSync(tempFile)) {
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      res.json({
        output: execError.stderr || execError.stdout || execError.message,
        error: execError.stderr || execError.message,
      });
    }
  } catch (error) {
    console.error("Run code error:", error);
    res.status(500).json({
      message: "Error executing code",
      error: error.message,
      output: `Error: ${error.message}`,
    });
  }
});

// Get interview count for user
router.get("/count", verifyToken, async (req, res) => {
  try {
    const uniqueSessions = await prisma.interviewSession.findMany({
      where: { userId: req.userId },
      select: { sessionId: true },
      distinct: ["sessionId"],
    });

    res.json({
      count: uniqueSessions.length,
    });
  } catch (error) {
    console.error("Get count error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get interview sessions for a user
router.get("/sessions", verifyToken, async (req, res) => {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
