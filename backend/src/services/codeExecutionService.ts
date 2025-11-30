import { spawn } from "child_process";

interface ExecutionResult {
  output: string;
  error: string | null;
}

export const executeCode = (language: string, code: string): Promise<ExecutionResult> => {
  return new Promise((resolve) => {
    let command = "";
    let args: string[] = [];

    if (language === "javascript") {
      command = "node";
      args = ["-e", code];
    } else if (language === "python") {
      command = "python";
      args = ["-c", code];
    } else {
      return resolve({ output: "", error: "Unsupported language" });
    }

    const process = spawn(command, args);
    let output = "";
    let error = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        resolve({ output, error: error || `Process exited with code ${code}` });
      } else {
        resolve({ output, error: null });
      }
    });

    process.on("error", (err) => {
      resolve({ output: "", error: err.message });
    });
  });
};
