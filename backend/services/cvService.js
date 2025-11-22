// CV Service - Handles all CV-related database operations
const prisma = require("../lib/prisma");

/**
 * Find CV by user ID
 * @param {string} userId - User's ID
 * @returns {Promise<Object|null>} CV object or null
 */
async function findCVByUserId(userId) {
  return await prisma.cV.findUnique({
    where: { userId },
  });
}

/**
 * Create a new CV for a user
 * @param {string} userId - User's ID
 * @param {Object} cvData - CV data
 * @returns {Promise<Object>} Created CV object
 */
async function createCV(userId, cvData) {
  return await prisma.cV.create({
    data: {
      userId,
      personalInfo: cvData.personalInfo || {},
      summary: cvData.summary || "",
      skills: cvData.skills || [],
      projects: cvData.projects || [],
      education: cvData.education || [],
      experience: cvData.experience || [],
    },
  });
}

/**
 * Update existing CV
 * @param {string} userId - User's ID
 * @param {Object} cvData - Updated CV data
 * @returns {Promise<Object>} Updated CV object
 */
async function updateCV(userId, cvData) {
  return await prisma.cV.update({
    where: { userId },
    data: {
      personalInfo: cvData.personalInfo,
      summary: cvData.summary,
      skills: cvData.skills,
      projects: cvData.projects,
      education: cvData.education,
      experience: cvData.experience,
    },
  });
}

/**
 * Create or update CV (upsert operation)
 * @param {string} userId - User's ID
 * @param {Object} cvData - CV data
 * @returns {Promise<Object>} CV object
 */
async function saveCV(userId, cvData) {
  const data = {
    personalInfo: cvData.personalInfo || {},
    summary: cvData.summary || "",
    skills: cvData.skills || [],
    projects: cvData.projects || [],
    education: cvData.education || [],
    experience: cvData.experience || [],
  };

  return await prisma.cV.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}

/**
 * Check if user has a CV
 * @param {string} userId - User's ID
 * @returns {Promise<boolean>} True if CV exists
 */
async function userHasCV(userId) {
  const cv = await prisma.cV.findUnique({
    where: { userId },
    select: { id: true },
  });
  return cv !== null;
}

module.exports = {
  findCVByUserId,
  createCV,
  updateCV,
  saveCV,
  userHasCV,
};
