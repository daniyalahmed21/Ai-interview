"use client";

import { UserPlus, FileText, Video, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Account",
      description:
        "Sign up in seconds and build your professional profile. Import your LinkedIn data or upload your resume to get started.",
      icon: UserPlus,
      color: "text-primary-400",
      bg: "bg-primary-500/10",
      border: "border-primary-500/20",
    },
    {
      title: "Generate Your CV",
      description:
        "Use our AI-powered resume builder to create a standout CV tailored to your target role and industry.",
      icon: FileText,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Practice Interviews",
      description:
        "Start a simulated interview session. Our AI will ask relevant questions and adapt to your responses in real-time.",
      icon: Video,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
    },
    {
      title: "Get Feedback & Improve",
      description:
        "Receive detailed feedback on your performance, including code quality, communication style, and technical accuracy.",
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F19] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your journey to ace the technical interview starts here.
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-500/20 via-purple-500/20 to-transparent hidden md:block"></div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className={`bg-[#131B2C] border border-white/5 p-8 rounded-2xl hover:border-primary-500/30 transition-all duration-300 shadow-lg ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Icon/Marker */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full ${step.bg} ${step.border} border flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)]`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                </div>

                {/* Spacer for layout balance */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
