interface ExecutionResult {
    output: string;
    error: string | null;
}
export declare const executeCode: (language: string, code: string) => Promise<ExecutionResult>;
export {};
//# sourceMappingURL=codeExecutionService.d.ts.map