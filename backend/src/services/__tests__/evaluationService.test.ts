import { evaluateSession } from "../evaluationService.js";

describe("EvaluationService", () => {
  test("should generate evaluation for a session", async () => {
    const sessionId = "test-session-123";
    
    const result = await evaluateSession(sessionId);
    
    expect(result).toBeDefined();
    expect(result.sessionId).toBe(sessionId);
    expect(result.scores).toBeDefined();
    expect(result.scores.clarity).toBeGreaterThanOrEqual(0);
    expect(result.scores.clarity).toBeLessThanOrEqual(10);
    expect(result.feedback).toBeDefined();
    expect(result.feedback.strengths).toBeInstanceOf(Array);
    expect(result.feedback.weaknesses).toBeInstanceOf(Array);
  });

  test("should include all required metrics", async () => {
    const sessionId = "test-session-456";
    
    const result = await evaluateSession(sessionId);
    
    expect(result.scores).toHaveProperty("clarity");
    expect(result.scores).toHaveProperty("understanding");
    expect(result.scores).toHaveProperty("correctness");
    expect(result.scores).toHaveProperty("codeQuality");
    expect(result.scores).toHaveProperty("testCoverage");
    expect(result.scores).toHaveProperty("timeManagement");
    expect(result.scores).toHaveProperty("confidence");
  });
});
