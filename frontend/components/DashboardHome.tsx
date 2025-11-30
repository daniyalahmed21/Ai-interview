"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart2, Star, Clock, Zap, Play, FileText, Activity } from "lucide-react";

export default function DashboardHome() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [interviewCount, setInterviewCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchInterviewCount();

    // Listen for refresh events
    const handleRefresh = () => {
      fetchInterviewCount();
    };
    window.addEventListener("dashboard-refresh", handleRefresh);
    return () => window.removeEventListener("dashboard-refresh", handleRefresh);
  }, []);

  const fetchInterviewCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/interview/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setInterviewCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching interview count:", error);
    }
  };

  const stats = [
    {
      label: "Interviews Completed",
      value: interviewCount.toString(),
      icon: BarChart2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    { 
      label: "Average Score", 
      value: "N/A", 
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    { 
      label: "Total Practice Time", 
      value: "0h", 
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    { 
      label: "Skills Improved", 
      value: "0", 
      icon: Zap,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
  ];

  const handleStartInterview = () => {
    // Navigate to interview page with default field 'frontend'
    // In a real app, we might show a modal to select the field first
    router.push("/interview/frontend");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-gray-400">
          Ready to ace your next interview? Let&apos;s get started.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#131B2C] rounded-xl p-6 border border-white/5 hover:border-primary-500/50 transition-all duration-300 group"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#131B2C] rounded-xl p-6 border border-white/5">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <button 
              onClick={handleStartInterview}
              className="text-left p-4 bg-primary-600/10 hover:bg-primary-600/20 border border-primary-500/20 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-500/20 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                  <Play className="w-5 h-5 text-primary-400" />
                </div>
                <span className="font-semibold text-primary-100">Start New Interview</span>
              </div>
              <p className="text-sm text-primary-200/60 pl-[52px]">
                Practice with AI-powered interviews
              </p>
            </button>

            <button className="text-left p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <span className="font-semibold text-purple-100">Update Resume</span>
              </div>
              <p className="text-sm text-purple-200/60 pl-[52px]">
                Edit your CV information
              </p>
            </button>

            <button className="text-left p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <span className="font-semibold text-blue-100">View Performance</span>
              </div>
              <p className="text-sm text-blue-200/60 pl-[52px]">
                Check your progress and analytics
              </p>
            </button>
          </div>
        </div>

        <div className="bg-[#131B2C] rounded-xl p-6 border border-white/5">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Recent Activity
          </h2>
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
            <Activity className="w-8 h-8 mb-3 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm mt-1 opacity-60">
              Start practicing to see your activity here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
