"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface TerminalProps {
  onInput?: (data: string) => void;
  onOutput?: (data: string) => void;
}

export default function Terminal({ onInput, onOutput }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    // Handle input
    term.onData((data) => {
      term.write(data);
      if (onInput) {
        onInput(data);
      }
    });

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome message
    term.writeln("Welcome to PrepView Terminal");
    term.writeln("Type your commands here...");
    term.write("$ ");

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
    };
  }, [onInput]);

  // Method to write output to terminal
  useEffect(() => {
    if (onOutput && xtermRef.current) {
      // This would be called from parent to write output
    }
  }, [onOutput]);

  return (
    <div className="h-full w-full bg-[#1e1e1e] rounded-lg overflow-hidden">
      <div ref={terminalRef} className="h-full w-full p-2" />
    </div>
  );
}
