import { executeCode } from "../codeExecutionService.js";
describe("CodeExecutionService", () => {
    test("should execute JavaScript code", async () => {
        const code = "console.log('Hello World');";
        const language = "javascript";
        const result = await executeCode(language, code);
        expect(result.output).toContain("Hello World");
        expect(result.error).toBeNull();
    });
    test("should handle syntax errors", async () => {
        const code = "console.log('Hello World'";
        const language = "javascript";
        const result = await executeCode(language, code);
        expect(result.error).not.toBeNull();
    });
    test("should execute Python code", async () => {
        const code = "print('Hello Python')";
        const language = "python";
        const result = await executeCode(language, code);
        expect(result.output).toContain("Hello Python");
        expect(result.error).toBeNull();
    });
});
//# sourceMappingURL=codeExecutionService.test.js.map