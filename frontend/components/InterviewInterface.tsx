'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Terminal from './Terminal'
import { initSocket, disconnectSocket } from '../lib/socket'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface InterviewInterfaceProps {
  fieldId: string
}

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
]

export default function InterviewInterface({ fieldId }: InterviewInterfaceProps) {
  const router = useRouter()
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [totalQuestions] = useState(5)
  const [code, setCode] = useState('// Write your code here\n')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string; timestamp: Date }>>([])
  const [isListening, setIsListening] = useState(false)
  
  const socketRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const codeSnapshotIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const questions = [
    {
      id: 1,
      question: 'Implement a function to reverse a linked list.',
      description: 'Write a function that takes the head of a linked list and returns the reversed list.',
    },
    {
      id: 2,
      question: 'Find the maximum subarray sum (Kadane\'s Algorithm).',
      description: 'Given an array of integers, find the contiguous subarray with the largest sum.',
    },
    {
      id: 3,
      question: 'Implement a binary search algorithm.',
      description: 'Write a function that searches for a target value in a sorted array using binary search.',
    },
    {
      id: 4,
      question: 'Check if two strings are anagrams.',
      description: 'Write a function that determines if two strings are anagrams of each other.',
    },
    {
      id: 5,
      question: 'Implement a stack using arrays.',
      description: 'Create a stack data structure with push, pop, and peek operations.',
    },
  ]

  const startInterview = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Create session
      const sessionResponse = await fetch('http://localhost:5000/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fieldId }),
      })

      const sessionData = await sessionResponse.json()
      if (!sessionResponse.ok) {
        throw new Error(sessionData.message || 'Failed to create session')
      }

      const newSessionId = sessionData.sessionId
      setSessionId(newSessionId)

      // Initialize Socket.IO
      const socket = initSocket()
      socketRef.current = socket

      // Join room
      socket.emit('join-room', newSessionId)

      // Listen for transcript updates
      socket.on('transcript-update', (data: any) => {
        setTranscript(prev => [...prev, {
          speaker: data.speaker,
          text: data.text,
          timestamp: new Date(data.timestamp)
        }])
      })

      // Listen for terminal output
      socket.on('terminal-output', (data: any) => {
        console.log('Terminal output:', data)
      })

      // Start audio capture
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      mediaStreamRef.current = stream

      // Setup audio processing
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)

      source.connect(processor)
      processor.connect(audioContext.destination)

      processor.onaudioprocess = (e) => {
        const audioData = e.inputBuffer.getChannelData(0)
        // Convert to buffer and send via socket
        const buffer = Buffer.from(audioData.buffer)
        socket.emit('audio-stream', { chunk: buffer.toString('base64') })
      }

      setIsInterviewStarted(true)
      setIsListening(true)

      // Start code snapshot interval (every 10 seconds)
      codeSnapshotIntervalRef.current = setInterval(() => {
        socket.emit('code-snapshot', {
          sessionId: newSessionId,
          code,
          language: selectedLanguage,
        })
      }, 10000)

      // Speak first question
      speakQuestion(questions[0].question)

    } catch (error) {
      console.error('Error starting interview:', error)
      alert('Could not start interview. Please check permissions and try again.')
    }
  }

  const speakQuestion = async (text: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/interview/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      
      // In production, play the audio from data.audioUrl
      // For now, use browser's speech synthesis as fallback
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Error speaking question:', error)
    }
  }

  const handleNextQuestion = async () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1)
      setCode('// Write your code here\n')
      speakQuestion(questions[currentQuestion].question)
    } else {
      // End interview
      await endInterview()
    }
  }

  const endInterview = async () => {
    try {
      // Stop audio
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      // Stop code snapshots
      if (codeSnapshotIntervalRef.current) {
        clearInterval(codeSnapshotIntervalRef.current)
      }

      // Disconnect socket
      disconnectSocket()

      // Trigger evaluation
      const token = localStorage.getItem('token')
      await fetch(`http://localhost:5000/api/interview/${sessionId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      // Redirect to report
      router.push(`/interview/${sessionId}/report`)
    } catch (error) {
      console.error('Error ending interview:', error)
      router.push('/dashboard')
    }
  }

  const handleTerminalInput = (input: string) => {
    if (socketRef.current && sessionId) {
      socketRef.current.emit('terminal-input', {
        sessionId,
        input,
      })
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    
    // Emit code update via socket
    if (socketRef.current && sessionId) {
      socketRef.current.emit('code-update', {
        sessionId,
        code: newCode,
        language: selectedLanguage,
      })
    }
  }

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (codeSnapshotIntervalRef.current) {
        clearInterval(codeSnapshotIntervalRef.current)
      }
      disconnectSocket()
    }
  }, [])

  const currentQuestionData = questions[currentQuestion - 1]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-primary">PrepView AI Interview</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Exit Interview
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-80px)]">
        {/* Left Column - Question, Transcript, AI Tips */}
        <div className="col-span-3 flex flex-col space-y-4">
          {/* Question Card */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">CURRENT QUESTION</h3>
            <h4 className="text-lg font-bold mb-2 text-gray-900">{currentQuestionData.question}</h4>
            <p className="text-sm text-gray-600">{currentQuestionData.description}</p>
          </div>

          {/* Transcript */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">LIVE TRANSCRIPT</h3>
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {transcript.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Speak to see your transcript here...</p>
              ) : (
                transcript.map((item, idx) => (
                  <div key={idx} className={`text-sm p-2 rounded ${item.speaker === 'ai' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <span className="font-semibold text-xs text-gray-500">
                      {item.speaker === 'ai' ? '🤖 AI' : '👤 You'}:
                    </span>
                    <p className="text-gray-700 mt-1">{item.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 AI TIPS</h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Explain your thought process clearly</li>
              <li>• Consider edge cases</li>
              <li>• Test your code before submitting</li>
            </ul>
          </div>
        </div>

        {/* Center Column - Code Editor */}
        <div className="col-span-6 flex flex-col">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full shadow-sm">
            {/* Editor Header */}
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700">CODE EDITOR</h3>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <MonacoEditor
                height="100%"
                language={selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Terminal and Notes */}
        <div className="col-span-3 flex flex-col space-y-4">
          {/* Terminal */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700">TERMINAL</h3>
            </div>
            <div className="h-[calc(100%-48px)]">
              <Terminal onInput={handleTerminalInput} />
            </div>
          </div>

          {/* Notes */}
          <div className="h-48 bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">NOTES</h3>
            <textarea
              className="w-full h-[calc(100%-32px)] text-sm p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Take notes here..."
            />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {!isInterviewStarted ? (
            <button
              onClick={startInterview}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl w-full md:w-auto"
            >
              🎤 Start AI Interview
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  {isListening ? '🎤 Listening...' : 'Paused'}
                </span>
              </div>
              <button
                onClick={handleNextQuestion}
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                {currentQuestion < totalQuestions ? 'Next Question →' : 'Finish Interview'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
