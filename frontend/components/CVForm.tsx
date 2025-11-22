// CV Form Component - Reusable form for creating and editing CV
"use client";

import { useState } from "react";

// Define the structure of CV data
export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    location?: string;
  };
  summary: string;
  skills: string[];
  projects: Array<{
    title: string;
    role: string;
    techStack: string[];
    description: string;
  }>;
  education: Array<{
    degree: string;
    institute: string;
    graduationYear: string;
    fyp?: string;
  }>;
  experience: Array<{
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }>;
}

interface CVFormProps {
  initialData?: CVData;
  onSave: (data: CVData) => Promise<void>;
  loading?: boolean;
}

export default function CVForm({ initialData, onSave, loading = false }: CVFormProps) {
  // Initialize CV data with default empty values or provided initial data
  const [cvData, setCvData] = useState<CVData>(
    initialData || {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        location: "",
      },
      summary: "",
      skills: [""],
      projects: [{ title: "", role: "", techStack: [], description: "" }],
      education: [{ degree: "", institute: "", graduationYear: "", fyp: "" }],
      experience: [
        {
          jobTitle: "",
          company: "",
          startDate: "",
          endDate: "",
          responsibilities: "",
        },
      ],
    }
  );

  // Update a specific field in personal info
  const updatePersonalInfo = (field: string, value: string) => {
    setCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    });
  };

  // Update a specific experience entry
  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...cvData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setCvData({ ...cvData, experience: newExperience });
  };

  // Add a new empty experience entry
  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          jobTitle: "",
          company: "",
          startDate: "",
          endDate: "",
          responsibilities: "",
        },
      ],
    });
  };

  // Update a specific education entry
  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...cvData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setCvData({ ...cvData, education: newEducation });
  };

  // Add a new empty education entry
  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        { degree: "", institute: "", graduationYear: "", fyp: "" },
      ],
    });
  };

  // Update a specific skill
  const updateSkill = (index: number, value: string) => {
    const newSkills = [...cvData.skills];
    newSkills[index] = value;
    setCvData({ ...cvData, skills: newSkills });
  };

  // Add a new empty skill field
  const addSkill = () => {
    setCvData({
      ...cvData,
      skills: [...cvData.skills, ""],
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(cvData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
      {/* LEFT SIDE - Form Inputs */}
      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={cvData.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={cvData.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={cvData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="text"
              placeholder="Location (e.g., New York, USA)"
              value={cvData.personalInfo.location}
              onChange={(e) => updatePersonalInfo("location", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={cvData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={cvData.personalInfo.github}
              onChange={(e) => updatePersonalInfo("github", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Professional Summary</h2>
          <textarea
            rows={4}
            placeholder="Write a brief summary about yourself..."
            value={cvData.summary}
            onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Work Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              + Add Experience
            </button>
          </div>

          {cvData.experience.map((exp, index) => (
            <div key={index} className="mb-4 space-y-2 border-b pb-4 last:border-b-0">
              <input
                type="text"
                placeholder="Job Title"
                value={exp.jobTitle}
                onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <textarea
                placeholder="Describe your responsibilities and achievements..."
                value={exp.responsibilities}
                onChange={(e) => updateExperience(index, "responsibilities", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
              />
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Education</h2>
            <button
              type="button"
              onClick={addEducation}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              + Add Education
            </button>
          </div>

          {cvData.education.map((edu, index) => (
            <div key={index} className="mb-4 space-y-2 border-b pb-4 last:border-b-0">
              <input
                type="text"
                placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                value={edu.degree}
                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Institute Name"
                value={edu.institute}
                onChange={(e) => updateEducation(index, "institute", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Graduation Year"
                value={edu.graduationYear}
                onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Final Year Project (optional)"
                value={edu.fyp}
                onChange={(e) => updateEducation(index, "fyp", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Skills</h2>
            <button
              type="button"
              onClick={addSkill}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              + Add Skill
            </button>
          </div>

          {cvData.skills.map((skill, index) => (
            <input
              key={index}
              type="text"
              placeholder="Enter a skill (e.g., JavaScript, Python, React)"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save & Continue to Dashboard"}
        </button>
      </div>

      {/* RIGHT SIDE - CV Preview */}
      <div className="lg:sticky lg:top-8 h-fit">
        <div className="bg-white rounded-lg shadow-xl p-8 border-2">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">PREVIEW</h3>
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b pb-4">
              <h1 className="text-3xl font-bold">
                {cvData.personalInfo.fullName || "Your Name"}
              </h1>
              <div className="text-sm text-gray-600 mt-2">
                {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
                {cvData.personalInfo.phone && <span> • {cvData.personalInfo.phone}</span>}
                {cvData.personalInfo.location && <span> • {cvData.personalInfo.location}</span>}
              </div>
              {(cvData.personalInfo.linkedin || cvData.personalInfo.github) && (
                <div className="flex gap-4 text-blue-600 mt-2 text-sm">
                  {cvData.personalInfo.linkedin && <span>LinkedIn</span>}
                  {cvData.personalInfo.github && <span>GitHub</span>}
                </div>
              )}
            </div>

            {/* Summary */}
            {cvData.summary && (
              <div>
                <h2 className="text-xl font-bold mb-2 border-b pb-1">Summary</h2>
                <p className="text-sm">{cvData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {cvData.experience.some((e) => e.company) && (
              <div>
                <h2 className="text-xl font-bold mb-2 border-b pb-1">Experience</h2>
                {cvData.experience.map(
                  (exp, index) =>
                    exp.company && (
                      <div key={index} className="mb-4">
                        <h3 className="font-bold text-sm">{exp.jobTitle}</h3>
                        <p className="text-blue-600 text-sm">
                          {exp.company}
                          {exp.startDate && ` • ${exp.startDate}`}
                          {exp.endDate && ` – ${exp.endDate}`}
                        </p>
                        <p className="text-sm mt-1">{exp.responsibilities}</p>
                      </div>
                    )
                )}
              </div>
            )}

            {/* Education */}
            {cvData.education.some((e) => e.institute) && (
              <div>
                <h2 className="text-xl font-bold mb-2 border-b pb-1">Education</h2>
                {cvData.education.map(
                  (edu, index) =>
                    edu.institute && (
                      <div key={index} className="mb-2">
                        <h3 className="font-bold text-sm">{edu.degree}</h3>
                        <p className="text-blue-600 text-sm">
                          {edu.institute}
                          {edu.graduationYear && ` • ${edu.graduationYear}`}
                        </p>
                      </div>
                    )
                )}
              </div>
            )}

            {/* Skills */}
            {cvData.skills.some((skill) => skill.trim()) && (
              <div>
                <h2 className="text-xl font-bold mb-2 border-b pb-1">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills
                    .filter((skill) => skill.trim())
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
