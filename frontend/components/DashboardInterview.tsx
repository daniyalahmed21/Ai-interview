'use client'

import { useRouter } from 'next/navigation'
import { Play, Clock, CheckCircle2, Database, Code, Palette, Server, Rocket, Globe, Smartphone, Shield } from 'lucide-react'

interface InterviewCard {
  id: string
  topic: string
  duration: string
  coverage: string[]
  icon: any
  color: string
  bg: string
}

export default function DashboardInterview() {
  const router = useRouter()

  const interviewFields: InterviewCard[] = [
    {
      id: 'data-science',
      topic: 'Data Science',
      duration: '45 minutes',
      coverage: ['Python', 'Machine Learning', 'Statistics', 'Data Analysis'],
      icon: Database,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'software-engineering',
      topic: 'Software Engineering',
      duration: '60 minutes',
      coverage: ['Algorithms', 'Data Structures', 'System Design', 'Problem Solving'],
      icon: Code,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
    },
    {
      id: 'frontend-development',
      topic: 'Frontend Development',
      duration: '45 minutes',
      coverage: ['React', 'JavaScript', 'CSS', 'Web APIs'],
      icon: Palette,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
    },
    {
      id: 'backend-development',
      topic: 'Backend Development',
      duration: '50 minutes',
      coverage: ['Node.js', 'Databases', 'APIs', 'System Architecture'],
      icon: Server,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      id: 'devops',
      topic: 'DevOps',
      duration: '40 minutes',
      coverage: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Services'],
      icon: Rocket,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      id: 'full-stack',
      topic: 'Full Stack Development',
      duration: '75 minutes',
      coverage: ['Full Stack', 'MERN Stack', 'Database Design', 'Deployment'],
      icon: Globe,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      id: 'mobile-development',
      topic: 'Mobile Development',
      duration: '45 minutes',
      coverage: ['React Native', 'iOS', 'Android', 'Mobile APIs'],
      icon: Smartphone,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      id: 'cybersecurity',
      topic: 'Cybersecurity',
      duration: '50 minutes',
      coverage: ['Security', 'Network Security', 'Encryption', 'Best Practices'],
      icon: Shield,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ]

  const handleStartInterview = (fieldId: string) => {
    router.push(`/interview/${fieldId}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Choose Your Interview Field</h1>
        <p className="text-gray-400">Select a domain to start practicing with AI-powered interviews</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewFields.map((field) => (
          <div
            key={field.id}
            className="bg-[#131B2C] rounded-xl border border-white/5 overflow-hidden hover:border-primary-500/30 transition-all duration-300 group"
          >
            <div className={`${field.bg} p-8 text-center border-b border-white/5`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${field.bg} border border-white/10 flex items-center justify-center`}>
                <field.icon className={`w-8 h-8 ${field.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{field.topic}</h3>
              <p className="text-gray-400 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                {field.duration}
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary-400" />
                What it covers:
              </h4>
              <ul className="space-y-2 mb-6">
                {field.coverage.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="text-primary-400 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleStartInterview(field.id)}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Interview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

