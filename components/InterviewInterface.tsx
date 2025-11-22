'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface InterviewInterfaceProps {
  fieldId: string
}

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'csharp', label: 'C#' },
]

export default function InterviewInterface({ fieldId }: InterviewInterfaceProps) {
  const router = useRouter()
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [totalQuestions] = useState(5)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const [code, setCode] = useState('// Write your code here\n')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const smallVideoRef = useRef<HTMLVideoElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recorderChunks, setRecorderChunks] = useState<Blob[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isStopped, setIsStopped] = useState(false)

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
      // Create session first
      const token = localStorage.getItem('token')
      const sessionResponse = await fetch('http://localhost:5000/api/interview/session', {
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

      setSessionId(sessionData.sessionId)

      // Start camera and recording
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setMediaStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      if (smallVideoRef.current) {
        smallVideoRef.current.srcObject = stream
      }

      const chunks: Blob[] = []
      setRecorderChunks(chunks)

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus',
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data)
          setRecorderChunks([...chunks])
        }
      }

      setRecorder(mediaRecorder)
      setIsInterviewStarted(true)
      setIsRecording(true)
      setIsStopped(false)
      mediaRecorder.start(1000) // Collect data every second
    } catch (error) {
      console.error('Error starting interview:', error)
      alert('Could not start interview. Please check permissions and try again.')
    }
  }

  const stopRecording = async () => {
    if (!recorder || !isRecording || !sessionId) {
      return
    }

    // Stop recording
    recorder.stop()
    setIsRecording(false)
    setIsStopped(true)

    // Wait a bit for final data
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Upload video
    if (recorderChunks.length > 0) {
      const blob = new Blob(recorderChunks, { type: 'video/webm' })
      const formData = new FormData()
      formData.append('video', blob, `question-${currentQuestion}.webm`)
      formData.append('questionId', currentQuestion.toString())
      formData.append('fieldId', fieldId)
      formData.append('sessionId', sessionId)

      const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:5000/api/interview/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Upload failed:', errorData)
        }
      } catch (error) {
        console.error('Error uploading video:', error)
      }
    }
  }

  const handleNextQuestion = async () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1)
      setCode('// Write your code here\n')
      setOutput('')
      setIsStopped(false)
      setRecorderChunks([])

      // Start recording for next question
      if (mediaStream) {
        const chunks: Blob[] = []
        setRecorderChunks(chunks)

        const newRecorder = new MediaRecorder(mediaStream, {
          mimeType: 'video/webm;codecs=vp8,opus',
        })

        newRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data)
            setRecorderChunks([...chunks])
          }
        }

        setRecorder(newRecorder)
        setIsRecording(true)
        newRecorder.start(1000)
      }
    } else {
      // Interview completed
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop())
      }
      
      // Update dashboard stats
      const token = localStorage.getItem('token')
      try {
        await fetch('http://localhost:5000/api/interview/count', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // Trigger refresh event for dashboard
        window.dispatchEvent(new Event('dashboard-refresh'))
      } catch (error) {
        console.error('Error updating stats:', error)
      }

      alert('Interview completed! Redirecting to dashboard...')
      router.push('/dashboard')
    }
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('Running...\n')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/interview/run-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setOutput(data.output || data.result || 'Code executed successfully')
      } else {
        setOutput(`Error: ${data.error || data.message || 'Failed to execute code'}`)
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Failed to execute code. Please check your connection.'}`)
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [mediaStream])

  const currentQuestionData = questions[currentQuestion - 1]

  // Get Monaco language mapping
  const getMonacoLanguage = (lang: string) => {
    const mapping: { [key: string]: string } = {
      javascript: 'javascript',
      python: 'python',
      cpp: 'cpp',
      java: 'java',
      typescript: 'typescript',
      csharp: 'csharp',
    }
    return mapping[lang] || 'javascript'
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <nav className="bg-white border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-primary">PrepView</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-text-primary transition-colors"
            >
              Exit Interview
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] pb-24">
        {/* Left Side - Question always visible, then video and simulator */}
        <div className="w-full lg:w-1/2 flex flex-col p-6 space-y-6">
          {/* Question Card - Always on top */}
          <div className="bg-white rounded-xl p-6 border border-border shadow-md">
            <h3 className="text-xl font-bold mb-4 text-accent">Current Question</h3>
            <h4 className="text-lg font-semibold mb-2 text-text-primary">{currentQuestionData.question}</h4>
            <p className="text-gray-600">{currentQuestionData.description}</p>
          </div>

          {/* Video Preview */}
          <div className="bg-white rounded-xl border border-border overflow-hidden shadow-md">
            <div className="relative w-full aspect-video bg-gray-900">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* AI Simulator Circle */}
          <div className="bg-white rounded-xl p-8 border border-border flex items-center justify-center shadow-md">
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-2xl animate-pulse">
                <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
                  <div className="text-6xl">🤖</div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full border-2 border-white animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Monaco Editor with language selector and output */}
        <div className="w-full lg:w-1/2 flex flex-col p-6">
          <div className="bg-white rounded-xl border border-border overflow-hidden flex flex-col h-full shadow-md relative">
            {/* Editor Header with Language Selector */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Code Editor</h3>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-button-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? 'Running...' : 'Run'}
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 relative" style={{ minHeight: '300px' }}>
              <MonacoEditor
                height="100%"
                language={getMonacoLanguage(selectedLanguage)}
                theme="vs"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
              {/* Small camera box in right bottom corner - Desktop only */}
              <div className="hidden lg:block absolute bottom-4 right-4 w-32 h-32 bg-gray-900 rounded-lg overflow-hidden border-2 border-accent shadow-xl z-10">
                <video
                  ref={smallVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Output Section */}
            <div className="border-t border-border">
              <div className="p-4 bg-gray-50">
                <h4 className="text-sm font-semibold text-text-primary mb-2">Output</h4>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 min-h-[100px] max-h-[200px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{output || 'Output will appear here...'}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-6 py-4 shadow-lg z-20">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {!isInterviewStarted ? (
            <button
              onClick={startInterview}
              className="bg-button-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl w-full md:w-auto"
            >
              Start Interview
            </button>
          ) : (
            <div className="flex items-center justify-between w-full md:w-auto md:space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-danger animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-text-primary">
                  {isRecording ? 'Recording...' : isStopped ? 'Stopped' : 'Paused'}
                </span>
              </div>
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="bg-danger text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl mt-4 md:mt-0 w-full md:w-auto"
                >
                  Stop Recording
                </button>
              ) : isStopped ? (
                <button
                  onClick={handleNextQuestion}
                  className="bg-button-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl mt-4 md:mt-0 w-full md:w-auto"
                >
                  {currentQuestion < totalQuestions ? 'Next Question' : 'Finish Interview'}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
