import { prisma } from "../lib/prisma.js";
/**
 * Find CV by user ID
 */
export async function findCVByUserId(userId) {
    return await prisma.cV.findUnique({
        where: { userId },
    });
}
/**
 * Create a new CV for a user
 */
export async function createCV(userId, cvData) {
    return await prisma.cV.create({
        data: {
            userId,
            personalInfo: (cvData.personalInfo || {}),
            summary: cvData.summary || "",
            skills: cvData.skills || [],
            projects: (cvData.projects || []),
            education: (cvData.education || []),
            experience: (cvData.experience || []),
        },
    });
}
/**
 * Update existing CV
 */
export async function updateCV(userId, cvData) {
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
 */
export async function saveCV(userId, cvData) {
    const data = {
        personalInfo: (cvData.personalInfo || {}),
        summary: cvData.summary || "",
        skills: cvData.skills || [],
        projects: (cvData.projects || []),
        education: (cvData.education || []),
        experience: (cvData.experience || []),
    };
    return await prisma.cV.upsert({
        where: { userId },
        update: data,
        create: { userId, ...data },
    });
}
/**
 * Check if user has a CV
 */
export async function userHasCV(userId) {
    const cv = await prisma.cV.findUnique({
        where: { userId },
        select: { id: true },
    });
    return cv !== null;
}
//# sourceMappingURL=cvService.js.map