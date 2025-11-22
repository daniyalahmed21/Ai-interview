const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

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

// Get CV
router.get("/", verifyToken, async (req, res) => {
  try {
    const cv = await prisma.cV.findUnique({
      where: { userId: req.userId },
    });

    if (!cv) {
      return res.status(404).json({ message: "CV not found" });
    }

    res.json(cv);
  } catch (error) {
    console.error("Get CV error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create CV
router.post("/", verifyToken, async (req, res) => {
  try {
    const cvData = req.body;

    // Check if CV already exists
    const existingCV = await prisma.cV.findUnique({
      where: { userId: req.userId },
    });

    if (existingCV) {
      // Update existing CV
      const updatedCV = await prisma.cV.update({
        where: { userId: req.userId },
        data: {
          personalInfo: cvData.personalInfo,
          summary: cvData.summary,

          skills: cvData.skills,
          projects: cvData.projects,

          education: cvData.education,
          experience: cvData.experience,
        },
      });

      return res.json(updatedCV);
    }

    // Create new CV
    const cv = await prisma.cV.create({
      data: {
        personalInfo: cvData.personalInfo,
        summary: cvData.summary,

        skills: cvData.skills,
        projects: cvData.projects,

        education: cvData.education,
        experience: cvData.experience,
      },
    });

    res.status(201).json(cv);
  } catch (error) {
    console.error("Create CV error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update CV
router.put("/", verifyToken, async (req, res) => {
  try {
    const cvData = req.body;

    const data = {
      personalInfo: cvData.personalInfo,
      summary: cvData.summary,

      skills: cvData.skills,
      projects: cvData.projects,

      education: cvData.education,
      experience: cvData.experience,
    };

    const cv = await prisma.cV.upsert({
      where: { userId: req.userId },
      update: data,
      create: { userId: req.userId, ...data },
    });

    res.json(cv);
  } catch (error) {
    console.error("Update CV error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
