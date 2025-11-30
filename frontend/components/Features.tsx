"use client";

import {
  Brain,
  Code,
  Video,
  BarChart,
  Globe,
  FileText,
  Zap,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "AI-Powered Interviews",
      description:
        "Practice with intelligent AI that adapts to your skill level and provides real-time feedback.",
      icon: Brain,
      color: "text-primary-400",
      bg: "bg-primary-500/10",
      border: "border-primary-500/20",
      colSpan: "md:col-span-2",
    },
    {
      title: "Real-Time Coding",
      description:
        "Code in a full-featured IDE with syntax highlighting, autocomplete, and debugging tools.",
      icon: Code,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      colSpan: "md:col-span-1",
    },
    {
      title: "Video Recording",
      description:
        "Record your interview sessions to review your performance and improve over time.",
      icon: Video,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      colSpan: "md:col-span-1",
    },
    {
      title: "Performance Analytics",
      description:
        "Track your progress with detailed analytics and personalized improvement recommendations.",
      icon: BarChart,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      colSpan: "md:col-span-2",
    },
    {
      title: "Multiple Domains",
      description:
        "Practice interviews for Data Science, Software Engineering, DevOps, and more.",
      icon: Globe,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      colSpan: "md:col-span-1",
    },
    {
      title: "Resume Builder",
      description:
        "Create a professional resume with our built-in CV builder and templates.",
      icon: FileText,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      colSpan: "md:col-span-1",
    },
    {
      title: "Instant Feedback",
      description: "Get immediate insights on your answers.",
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      colSpan: "md:col-span-1",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F19] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                Accelerate Your Career
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to prepare for your next technical interview,
              all in one platform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.colSpan} group relative bg-[#131B2C] border border-white/5 rounded-2xl p-8 hover:border-${feature.color.replace('text-', '')}/30 transition-all duration-300 overflow-hidden`}
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.bg} to-transparent`}
              ></div>
              
              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
