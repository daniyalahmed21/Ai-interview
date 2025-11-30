"use client";

import Link from "next/link";
import { ArrowRight, Terminal, Code2, Cpu } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[#0B0F19]">
      {/* Background Effects - Static for better FCP */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-400"></span>
              <span className="text-sm text-primary-300 font-medium">
                AI-Powered Interview Prep
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                Technical Interview
              </span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Practice with our advanced AI interviewer. Get real-time feedback on
              your code, communication, and problem-solving skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/signup"
                className="group bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-primary-600/40 flex items-center justify-center gap-2"
              >
                Start Practicing Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="group border border-white/10 bg-white/5 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
              >
                How It Works
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start space-x-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                <span>Live Coding</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                <span>AI Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                <span>System Design</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-1 shadow-2xl backdrop-blur-md border border-white/10">
                <div className="bg-[#0B0F19] rounded-xl overflow-hidden shadow-inner">
                  {/* Window Header */}
                  <div className="bg-white/5 px-4 py-3 flex items-center space-x-2 border-b border-white/5">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex-1 text-center text-xs font-mono text-gray-500">
                      interview_session.tsx
                    </div>
                  </div>

                  {/* Code Content */}
                  <div className="p-6 font-mono text-sm space-y-4">
                    <div className="flex">
                      <span className="text-gray-600 mr-4 select-none">1</span>
                      <span className="text-purple-400">const</span>{" "}
                      <span className="text-blue-400">solveProblem</span>{" "}
                      <span className="text-gray-400">=</span>{" "}
                      <span className="text-purple-400">async</span>{" "}
                      <span className="text-gray-400">()</span>{" "}
                      <span className="text-purple-400">=&gt;</span>{" "}
                      <span className="text-gray-400">{"{"}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 mr-4 select-none">2</span>
                      <span className="ml-4 text-gray-500">
                        {"// AI analyzing your solution..."}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 mr-4 select-none">3</span>
                      <span className="ml-4 text-purple-400">const</span>{" "}
                      <span className="text-blue-400">feedback</span>{" "}
                      <span className="text-gray-400">=</span>{" "}
                      <span className="text-purple-400">await</span>{" "}
                      <span className="text-yellow-400">ai</span>
                      <span className="text-gray-400">.</span>
                      <span className="text-blue-400">analyze</span>
                      <span className="text-gray-400">(</span>
                      <span className="text-green-400">code</span>
                      <span className="text-gray-400">);</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 mr-4 select-none">4</span>
                      <span className="ml-4 text-purple-400">return</span>{" "}
                      <span className="text-blue-400">feedback</span>
                      <span className="text-gray-400">;</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 mr-4 select-none">5</span>
                      <span className="text-gray-400">{"}"}</span>
                    </div>

                    {/* AI Feedback Pop-up */}
                    <div className="mt-4 bg-primary-900/30 border border-primary-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-500/20 rounded-lg">
                          <Cpu className="w-4 h-4 text-primary-400" />
                        </div>
                        <div>
                          <p className="text-primary-300 font-medium text-xs mb-1">
                            AI Feedback
                          </p>
                          <p className="text-gray-400 text-xs">
                            Great use of async/await! Consider handling potential
                            errors in the API call.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 z-20 bg-[#131B2C] border border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold">98%</span>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Match Score</p>
                  <p className="text-white font-bold text-sm">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
