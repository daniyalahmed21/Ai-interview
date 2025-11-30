'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ReportPageProps {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic';

export default function ReportPage({ params }: ReportPageProps) {
  const router = useRouter()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/interview/${params.id}/report`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch report')
        }

        const data = await response.json()
        setReport(data)
      } catch (error) {
        console.error('Error fetching report:', error)
        alert('Failed to load interview report')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your interview report...</p>
        </div>
      </div>
    )
  }

  if (!report || !report.evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No evaluation data available</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const { evaluation, transcripts, codeSnapshots } = report
  const scores = evaluation.scores
  const feedback = evaluation.feedback

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-primary">PrepView - Interview Report</span>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Overall Score */}
        <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Interview Complete! 🎉</h1>
          <p className="text-indigo-100 mb-6">Here&apos;s your detailed performance analysis</p>
          <div className="flex items-center space-x-4">
            <div className="text-6xl font-bold">{evaluation.overallScore}</div>
            <div>
              <div className="text-2xl font-semibold">Overall Score</div>
              <div className="text-indigo-200">Out of 10</div>
            </div>
          </div>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(scores).map(([key, value]: [string, any]) => (
            <div key={key} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="text-sm font-semibold text-gray-500 uppercase mb-2">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold text-primary">{value}</div>
                <div className="text-gray-400">/10</div>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(value / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strengths */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center">
              <span className="text-2xl mr-2">✅</span>
              Strengths
            </h3>
            <ul className="space-y-2">
              {feedback.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center">
              <span className="text-2xl mr-2">⚠️</span>
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {feedback.weaknesses.map((weakness: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center">
              <span className="text-2xl mr-2">💡</span>
              Suggestions
            </h3>
            <ul className="space-y-2">
              {feedback.suggestions.map((suggestion: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transcript */}
        {transcripts && transcripts.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Interview Transcript</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transcripts.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    item.speaker === 'ai' ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">
                      {item.speaker === 'ai' ? '🤖 AI Interviewer' : '👤 You'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Snapshots */}
        {codeSnapshots && codeSnapshots.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Code Snapshots</h3>
            <div className="space-y-4">
              {codeSnapshots.slice(0, 3).map((snapshot: any, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {snapshot.language}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(snapshot.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <pre className="p-4 bg-gray-900 text-green-400 text-sm overflow-x-auto">
                    <code>{snapshot.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-4 pb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  )
}
