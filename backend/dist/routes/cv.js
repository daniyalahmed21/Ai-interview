import express from "express";
import * as cvService from "../services/cvService.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();
/**
 * GET /api/cv
 * Get user's CV
 */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const cv = await cvService.findCVByUserId(userId);
        if (!cv) {
            res.status(404).json({
                message: "CV not found",
                hasCV: false,
            });
            return;
        }
        res.json(cv);
    }
    catch (error) {
        console.error("Get CV error:", error);
        res.status(500).json({
            message: "Failed to retrieve CV",
        });
    }
});
/**
 * POST /api/cv
 * Create or update user's CV
 */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const cvData = req.body;
        // Check if CV already exists
        const existingCV = await cvService.findCVByUserId(userId);
        if (existingCV) {
            // Update existing CV
            const updatedCV = await cvService.updateCV(userId, cvData);
            res.json({
                message: "CV updated successfully",
                cv: updatedCV,
            });
            return;
        }
        // Create new CV
        const newCV = await cvService.createCV(userId, cvData);
        res.status(201).json({
            message: "CV created successfully",
            cv: newCV,
        });
    }
    catch (error) {
        console.error("Create/Update CV error:", error);
        res.status(500).json({
            message: "Failed to save CV. Please try again.",
        });
    }
});
/**
 * PUT /api/cv
 * Update or create user's CV (upsert)
 */
router.put("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const cvData = req.body;
        // Save CV (creates if doesn't exist, updates if exists)
        const cv = await cvService.saveCV(userId, cvData);
        res.json({
            message: "CV saved successfully",
            cv,
        });
    }
    catch (error) {
        console.error("Save CV error:", error);
        res.status(500).json({
            message: "Failed to save CV. Please try again.",
        });
    }
});
/**
 * GET /api/cv/check
 * Check if user has a CV
 */
router.get("/check", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const hasCV = await cvService.userHasCV(userId);
        res.json({ hasCV });
    }
    catch (error) {
        console.error("Check CV error:", error);
        res.status(500).json({
            message: "Failed to check CV status",
        });
    }
});
export default router;
//# sourceMappingURL=cv.js.map