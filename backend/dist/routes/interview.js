import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { exec } from "child_process";
import util from "util";
import { fileURLToPath } from "url";
import { prisma } from "../lib/prisma.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const execPromise = util.promisify(exec);
// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-in-production");
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
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
        cb(null, `user-${userId}-field-${fieldId}-question-${questionId}-${timestamp}${ext}`);
    },
});
const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB limit
    },
    fileFilter: (_req, file, cb) => {
        // Accept video files
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        }
        else {
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
    }
    catch (error) {
        console.error("Create session error:", error);
        res.status(500).json({
            message: "Error creating session",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
// Upload interview video
router.post("/upload", verifyToken, upload.single("video"), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No video file uploaded" });
            return;
        }
        const { questionId, fieldId, sessionId } = req.body;
        if (!sessionId) {
            res.status(400).json({ message: "Session ID is required" });
            return;
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
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            message: "Error uploading video",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
// Run code execution
router.post("/run-code", verifyToken, async (req, res) => {
    try {
        const { code, language } = req.body;
        if (!code || !language) {
            res.status(400).json({
                message: "Code and language are required",
            });
            return;
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
                res.status(400).json({ message: "Unsupported language" });
                return;
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
        }
        catch (execError) {
            // Clean up temp file
            if (fs.existsSync(tempFile)) {
                try {
                    fs.unlinkSync(tempFile);
                }
                catch (e) {
                    // Ignore cleanup errors
                }
            }
            res.json({
                output: execError.stderr || execError.stdout || execError.message,
                error: execError.stderr || execError.message,
            });
        }
    }
    catch (error) {
        console.error("Run code error:", error);
        res.status(500).json({
            message: "Error executing code",
            error: error instanceof Error ? error.message : String(error),
            output: `Error: ${error instanceof Error ? error.message : String(error)}`,
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error("Get sessions error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Start interview session (NEW)
router.post("/start", verifyToken, async (req, res) => {
    try {
        const { fieldId } = req.body;
        const sessionId = `session-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        // Create interview session in database
        await prisma.interviewSession.create({
            data: {
                sessionId,
                userId: req.userId,
                fieldId: fieldId || "unknown",
                questionId: 1,
            },
        });
        res.json({
            message: "Interview session started",
            sessionId,
            fieldId: fieldId || "unknown",
        });
    }
    catch (error) {
        console.error("Start interview error:", error);
        res.status(500).json({
            message: "Error starting interview",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
// End interview and trigger evaluation (NEW)
router.post("/:sessionId/end", verifyToken, async (req, res) => {
    try {
        const { sessionId } = req.params;
        // Update session status
        await prisma.interviewSession.updateMany({
            where: { sessionId, userId: req.userId },
            data: { status: "completed" },
        });
        // Import evaluation service
        const { evaluateSession } = await import("../services/evaluationService.js");
        // Generate evaluation
        const evaluation = await evaluateSession(sessionId);
        // Save evaluation to database
        const session = await prisma.interviewSession.findFirst({
            where: { sessionId },
        });
        if (session) {
            await prisma.evaluation.create({
                data: {
                    interviewSessionId: session.id,
                    scores: evaluation.scores,
                    feedback: evaluation.feedback,
                    overallScore: evaluation.overallScore,
                },
            });
        }
        res.json({
            message: "Interview ended successfully",
            sessionId,
            evaluation,
        });
    }
    catch (error) {
        console.error("End interview error:", error);
        res.status(500).json({
            message: "Error ending interview",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
// Get interview report (NEW)
router.get("/:sessionId/report", verifyToken, async (req, res) => {
    try {
        const { sessionId } = req.params;
        // Get session
        const session = await prisma.interviewSession.findFirst({
            where: { sessionId, userId: req.userId },
            include: {
                transcripts: true,
                codeSnapshots: {
                    orderBy: { timestamp: "desc" },
                },
                evaluation: true,
            },
        });
        if (!session) {
            res.status(404).json({ message: "Interview session not found" });
            return;
        }
        res.json({
            session,
            transcripts: session.transcripts,
            codeSnapshots: session.codeSnapshots,
            evaluation: session.evaluation,
        });
    }
    catch (error) {
        console.error("Get report error:", error);
        res.status(500).json({
            message: "Error fetching report",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
// Text-to-speech endpoint (NEW)
router.post("/speak", async (req, res) => {
    try {
        const { text } = req.body;
        // Import speech service
        const { generateSpeech } = await import("../services/speechService.js");
        const result = await generateSpeech(text);
        res.json(result);
    }
    catch (error) {
        console.error("Speak error:", error);
        res.status(500).json({
            message: "Error generating speech",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
export default router;
//# sourceMappingURL=interview.js.map