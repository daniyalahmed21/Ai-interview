'use client'

import { TrendingUp, Target, MessageSquare, Clock, Activity, Lightbulb, BarChart3 } from 'lucide-react'

export default function DashboardPerformance() {
  const performanceData = [
    { category: 'Problem Solving', score: 0, maxScore: 100, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500' },
    { category: 'Code Quality', score: 0, maxScore: 100, icon: BarChart3, color: 'text-green-400', bg: 'bg-green-500' },
    { category: 'Communication', score: 0, maxScore: 100, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500' },
    { category: 'Time Management', score: 0, maxScore: 100, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary-400" />
          Performance Analytics
        </h1>
        <p className="text-gray-400">Track your progress and identify areas for improvement</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[#131B2C] rounded-xl border border-white/5 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary-400" />
            Overall Performance
          </h2>
          <div className="space-y-6">
            {performanceData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-white flex items-center gap-2">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    {item.category}
                  </span>
                  <span className="text-gray-400">{item.score}/{item.maxScore}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3">
                  <div
                    className={`${item.bg} h-3 rounded-full transition-all`}
                    style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#131B2C] rounded-xl border border-white/5 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-400" />
            Interview History
          </h2>
          <div className="flex flex-col items-center justify-center h-[250px] text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
            <Activity className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-lg mb-2">No interviews completed yet</p>
            <p className="text-sm opacity-60">Start practicing to see your performance data here</p>
          </div>
        </div>

        <div className="bg-[#131B2C] rounded-xl border border-white/5 p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            Improvement Suggestions
          </h2>
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-6">
            <p className="text-gray-300 leading-relaxed">
              Complete your first interview to receive personalized improvement suggestions based on your performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

