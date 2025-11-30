'use client'

import { useState, useEffect } from 'react'
import { FileText, Edit2, Save, X, Briefcase, GraduationCap, Code, Plus, Trash2, FolderKanban } from 'lucide-react'

interface CVData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
  }
  summary: string
  experience: Array<{
    company: string
    position: string
    duration: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    year: string
  }>
  skills: string[]
  projects?: Array<{
    title: string
    role: string
    techStack: string[]
    description: string
  }>
}

export default function DashboardResume() {
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    fetchResume()
  }, [])

  const fetchResume = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:5000/api/cv', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCvData(data)
      }
    } catch (error) {
      console.error('Error fetching resume:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!cvData) return
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:5000/api/cv', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cvData),
      })
      if (response.ok) {
        setEditing(false)
        alert('Resume updated successfully!')
      }
    } catch (error) {
      console.error('Error updating resume:', error)
    }
  }

  // Helper functions for managing arrays
  const addExperience = () => {
    if (!cvData) return
    setCvData({
      ...cvData,
      experience: [...cvData.experience, { company: '', position: '', duration: '', description: '' }]
    })
  }

  const removeExperience = (index: number) => {
    if (!cvData) return
    setCvData({
      ...cvData,
      experience: cvData.experience.filter((_, i) => i !== index)
    })
  }

  const updateExperience = (index: number, field: string, value: string) => {
    if (!cvData) return
    const newExperience = [...cvData.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setCvData({ ...cvData, experience: newExperience })
  }

  const addEducation = () => {
    if (!cvData) return
    setCvData({
      ...cvData,
      education: [...cvData.education, { institution: '', degree: '', year: '' }]
    })
  }

  const removeEducation = (index: number) => {
    if (!cvData) return
    setCvData({
      ...cvData,
      education: cvData.education.filter((_, i) => i !== index)
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    if (!cvData) return
    const newEducation = [...cvData.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setCvData({ ...cvData, education: newEducation })
  }

  const addProject = () => {
    if (!cvData) return
    setCvData({
      ...cvData,
      projects: [...(cvData.projects || []), { title: '', role: '', techStack: [], description: '' }]
    })
  }

  const removeProject = (index: number) => {
    if (!cvData) return
    setCvData({
      ...cvData,
      projects: (cvData.projects || []).filter((_, i) => i !== index)
    })
  }

  const updateProject = (index: number, field: string, value: string | string[]) => {
    if (!cvData) return
    const newProjects = [...(cvData.projects || [])]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setCvData({ ...cvData, projects: newProjects })
  }

  const addSkill = () => {
    if (!cvData) return
    setCvData({
      ...cvData,
      skills: [...cvData.skills, '']
    })
  }

  const removeSkill = (index: number) => {
    if (!cvData) return
    setCvData({
      ...cvData,
      skills: cvData.skills.filter((_, i) => i !== index)
    })
  }

  const updateSkill = (index: number, value: string) => {
    if (!cvData) return
    const newSkills = [...cvData.skills]
    newSkills[index] = value
    setCvData({ ...cvData, skills: newSkills })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  if (!cvData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#131B2C] rounded-xl border border-white/5 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-6 text-lg">No resume found. Please create one first.</p>
          <a
            href="/cv-creation"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <FileText className="w-5 h-5" />
            Create Resume
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary-400" />
          My Resume
        </h1>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
            Edit Resume
          </button>
        )}
      </div>

      <div className="bg-[#131B2C] rounded-xl border border-white/5 p-8">
        {editing ? (
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, fullName: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={cvData.personalInfo.phone}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, phone: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.location || ''}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, location: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={cvData.personalInfo.linkedin}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, linkedin: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={cvData.personalInfo.github}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, github: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
              <textarea
                value={cvData.summary}
                onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Projects Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-primary-400" />
                  Projects
                </h3>
                <button
                  type="button"
                  onClick={addProject}
                  className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
              {(cvData.projects || []).map((project, index) => (
                <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      className="flex-1 px-4 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="ml-2 text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Your Role"
                    value={project.role}
                    onChange={(e) => updateProject(index, 'role', e.target.value)}
                    className="w-full px-4 py-2 mb-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Tech Stack (comma-separated)"
                    value={project.techStack.join(', ')}
                    onChange={(e) => updateProject(index, 'techStack', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full px-4 py-2 mb-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Project Description"
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            {/* Experience Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary-400" />
                  Work Experience
                </h3>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>
              {cvData.experience.map((exp, index) => (
                <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      className="flex-1 px-4 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="ml-2 text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="w-full px-4 py-2 mb-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., Jan 2020 - Present)"
                    value={exp.duration}
                    onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    className="w-full px-4 py-2 mb-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-400" />
                  Education
                </h3>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              </div>
              {cvData.education.map((edu, index) => (
                <div key={index} className="mb-4 p-4 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="flex-1 px-4 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="ml-2 text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    className="w-full px-4 py-2 mb-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                    className="w-full px-4 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            {/* Skills Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary-400" />
                  Skills
                </h3>
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Skill"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-6 py-3 rounded-lg transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold text-white mb-2">{cvData.personalInfo.fullName}</h2>
              <div className="text-gray-400 flex flex-wrap items-center gap-2">
                <span>{cvData.personalInfo.email}</span>
                {cvData.personalInfo.phone && (
                  <>
                    <span>•</span>
                    <span>{cvData.personalInfo.phone}</span>
                  </>
                )}
                {cvData.personalInfo.location && (
                  <>
                    <span>•</span>
                    <span>{cvData.personalInfo.location}</span>
                  </>
                )}
              </div>
              {(cvData.personalInfo.linkedin || cvData.personalInfo.github) && (
                <div className="flex gap-4 mt-3">
                  {cvData.personalInfo.linkedin && (
                    <a
                      href={cvData.personalInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {cvData.personalInfo.github && (
                    <a
                      href={cvData.personalInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
            {cvData.summary && (
              <div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-400" />
                  Summary
                </h3>
                <p className="text-gray-300 leading-relaxed">{cvData.summary}</p>
              </div>
            )}
            {cvData.experience.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary-400" />
                  Experience
                </h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/5">
                      <h4 className="font-bold text-white text-lg">{exp.position}</h4>
                      <p className="text-primary-400 mb-2">{exp.company} • {exp.duration}</p>
                      <p className="text-gray-300">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {cvData.education.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-400" />
                  Education
                </h3>
                <div className="space-y-4">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/5">
                      <h4 className="font-bold text-white">{edu.degree}</h4>
                      <p className="text-primary-400">{edu.institution} • {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {cvData.skills.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary-400" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.filter((s) => s.trim()).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-primary-500/10 border border-primary-500/20 text-primary-300 px-4 py-2 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

