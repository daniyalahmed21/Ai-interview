import { prisma } from "../lib/prisma.js";

export interface CVData {
  personalInfo?: Record<string, any>;
  summary?: string;
  skills?: string[];
  projects?: Record<string, any>[];
  education?: Record<string, any>[];
  experience?: Record<string, any>[];
}

/**
 * Find CV by user ID
 */
export async function findCVByUserId(userId: string) {
  return await prisma.cV.findUnique({
    where: { userId },
  });
}

/**
 * Create a new CV for a user
 */
export async function createCV(userId: string, cvData: CVData) {
  return await prisma.cV.create({
    data: {
      userId,
      personalInfo: (cvData.personalInfo || {}) as any,
      summary: cvData.summary || "",
      skills: cvData.skills || [],
      projects: (cvData.projects || []) as any,
      education: (cvData.education || []) as any,
      experience: (cvData.experience || []) as any,
    },
  });
}

/**
 * Update existing CV
 */
export async function updateCV(userId: string, cvData: CVData) {
  return await prisma.cV.update({
    where: { userId },
    data: {
      personalInfo: cvData.personalInfo as any,
      summary: cvData.summary,
      skills: cvData.skills,
      projects: cvData.projects as any,
      education: cvData.education as any,
      experience: cvData.experience as any,
    },
  });
}

/**
 * Create or update CV (upsert operation)
 */
export async function saveCV(userId: string, cvData: CVData) {
  const data = {
    personalInfo: (cvData.personalInfo || {}) as any,
    summary: cvData.summary || "",
    skills: cvData.skills || [],
    projects: (cvData.projects || []) as any,
    education: (cvData.education || []) as any,
    experience: (cvData.experience || []) as any,
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
export async function userHasCV(userId: string): Promise<boolean> {
  const cv = await prisma.cV.findUnique({
    where: { userId },
    select: { id: true },
  });
  return cv !== null;
}
