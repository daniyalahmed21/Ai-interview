interface EvaluationScores {
    clarity: number;
    understanding: number;
    correctness: number;
    codeQuality: number;
    testCoverage: number;
    timeManagement: number;
    confidence: number;
}
interface Feedback {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}
interface EvaluationResult {
    sessionId: string;
    scores: EvaluationScores;
    feedback: Feedback;
    overallScore: number;
}
export declare function evaluateSession(sessionId: string): Promise<EvaluationResult>;
export {};
//# sourceMappingURL=evaluationService.d.ts.map