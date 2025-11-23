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
export declare function findCVByUserId(userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    personalInfo: import("@prisma/client/runtime/client.js").JsonValue;
    summary: string | null;
    skills: import("@prisma/client/runtime/client.js").JsonValue;
    projects: import("@prisma/client/runtime/client.js").JsonValue;
    education: import("@prisma/client/runtime/client.js").JsonValue;
    experience: import("@prisma/client/runtime/client.js").JsonValue;
} | null>;
/**
 * Create a new CV for a user
 */
export declare function createCV(userId: string, cvData: CVData): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    personalInfo: import("@prisma/client/runtime/client.js").JsonValue;
    summary: string | null;
    skills: import("@prisma/client/runtime/client.js").JsonValue;
    projects: import("@prisma/client/runtime/client.js").JsonValue;
    education: import("@prisma/client/runtime/client.js").JsonValue;
    experience: import("@prisma/client/runtime/client.js").JsonValue;
}>;
/**
 * Update existing CV
 */
export declare function updateCV(userId: string, cvData: CVData): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    personalInfo: import("@prisma/client/runtime/client.js").JsonValue;
    summary: string | null;
    skills: import("@prisma/client/runtime/client.js").JsonValue;
    projects: import("@prisma/client/runtime/client.js").JsonValue;
    education: import("@prisma/client/runtime/client.js").JsonValue;
    experience: import("@prisma/client/runtime/client.js").JsonValue;
}>;
/**
 * Create or update CV (upsert operation)
 */
export declare function saveCV(userId: string, cvData: CVData): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    personalInfo: import("@prisma/client/runtime/client.js").JsonValue;
    summary: string | null;
    skills: import("@prisma/client/runtime/client.js").JsonValue;
    projects: import("@prisma/client/runtime/client.js").JsonValue;
    education: import("@prisma/client/runtime/client.js").JsonValue;
    experience: import("@prisma/client/runtime/client.js").JsonValue;
}>;
/**
 * Check if user has a CV
 */
export declare function userHasCV(userId: string): Promise<boolean>;
//# sourceMappingURL=cvService.d.ts.map