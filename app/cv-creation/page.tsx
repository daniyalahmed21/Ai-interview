"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CVData {
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

export default function CVCreationPage() {
  const router = useRouter();

  const [cvData, setCvData] = useState<CVData>({
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
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    });
  };

  const handleExperienceChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newExperience = [...cvData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setCvData({ ...cvData, experience: newExperience });
  };

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

  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newEducation = [...cvData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setCvData({ ...cvData, education: newEducation });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        { degree: "", institute: "", graduationYear: "", fyp: "" },
      ],
    });
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...cvData.skills];
    newSkills[index] = value;
    setCvData({ ...cvData, skills: newSkills });
  };

  const addSkill = () => {
    setCvData({
      ...cvData,
      skills: [...cvData.skills, ""],
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cvData),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error saving CV:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-primary">PrepView</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create Your Resume
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* PERSONAL INFO */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) =>
                    handlePersonalInfoChange("fullName", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={cvData.personalInfo.email}
                  onChange={(e) =>
                    handlePersonalInfoChange("email", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="tel"
                  placeholder="Phone"
                  value={cvData.personalInfo.phone}
                  onChange={(e) =>
                    handlePersonalInfoChange("phone", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={cvData.personalInfo.location}
                  onChange={(e) =>
                    handlePersonalInfoChange("location", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={cvData.personalInfo.linkedin}
                  onChange={(e) =>
                    handlePersonalInfoChange("linkedin", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={cvData.personalInfo.github}
                  onChange={(e) =>
                    handlePersonalInfoChange("github", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Professional Summary</h2>
              <textarea
                rows={4}
                placeholder="Write a brief summary..."
                value={cvData.summary}
                onChange={(e) =>
                  setCvData({ ...cvData, summary: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* EXPERIENCE */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Experience</h2>
                <button
                  onClick={addExperience}
                  className="text-primary font-semibold"
                >
                  + Add
                </button>
              </div>

              {cvData.experience.map((exp, index) => (
                <div key={index} className="mb-4 space-y-2 border-b pb-4">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.jobTitle}
                    onChange={(e) =>
                      handleExperienceChange(index, "jobTitle", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceChange(index, "company", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "startDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={(e) =>
                      handleExperienceChange(index, "endDate", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <textarea
                    placeholder="Responsibilities"
                    value={exp.responsibilities}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "responsibilities",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* EDUCATION */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Education</h2>
                <button
                  onClick={addEducation}
                  className="text-primary font-semibold"
                >
                  + Add
                </button>
              </div>

              {cvData.education.map((edu, index) => (
                <div key={index} className="mb-4 space-y-2 border-b pb-4">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Institute"
                    value={edu.institute}
                    onChange={(e) =>
                      handleEducationChange(index, "institute", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Graduation Year"
                    value={edu.graduationYear}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "graduationYear",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="FYP (optional)"
                    value={edu.fyp}
                    onChange={(e) =>
                      handleEducationChange(index, "fyp", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* SKILLS */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Skills</h2>
                <button
                  onClick={addSkill}
                  className="text-primary font-semibold"
                >
                  + Add
                </button>
              </div>

              {cvData.skills.map((skill, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="Skill"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
              ))}
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
            >
              Save & Continue to Dashboard
            </button>
          </div>

          {/* RIGHT SIDE (Preview) */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-lg shadow-xl p-8 border-2">
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-bold">
                    {cvData.personalInfo.fullName || "Your Name"}
                  </h1>

                  <div className="text-sm text-gray-600 mt-2">
                    {cvData.personalInfo.email} • {cvData.personalInfo.phone}
                    {cvData.personalInfo.location &&
                      ` • ${cvData.personalInfo.location}`}
                  </div>

                  <div className="flex gap-4 text-primary mt-2 text-sm">
                    {cvData.personalInfo.linkedin && (
                      <a href={cvData.personalInfo.linkedin}>LinkedIn</a>
                    )}
                    {cvData.personalInfo.github && (
                      <a href={cvData.personalInfo.github}>GitHub</a>
                    )}
                  </div>
                </div>

                {cvData.summary && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 border-b pb-1">
                      Summary
                    </h2>
                    <p>{cvData.summary}</p>
                  </div>
                )}

                {cvData.experience.some((e) => e.company) && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 border-b pb-1">
                      Experience
                    </h2>
                    {cvData.experience.map(
                      (exp, index) =>
                        exp.company && (
                          <div key={index} className="mb-4">
                            <h3 className="font-bold">{exp.jobTitle}</h3>
                            <p className="text-primary">
                              {exp.company} • {exp.startDate} – {exp.endDate}
                            </p>
                            <p>{exp.responsibilities}</p>
                          </div>
                        )
                    )}
                  </div>
                )}

                {cvData.education.some((e) => e.institute) && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 border-b pb-1">
                      Education
                    </h2>
                    {cvData.education.map(
                      (edu, index) =>
                        edu.institute && (
                          <div key={index} className="mb-2">
                            <h3 className="font-bold">{edu.degree}</h3>
                            <p className="text-primary">
                              {edu.institute} • {edu.graduationYear}
                            </p>
                          </div>
                        )
                    )}
                  </div>
                )}

                {cvData.skills.some((skill) => skill.trim()) && (
                  <div>
                    <h2 className="text-xl font-bold mb-2 border-b pb-1">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills
                        .filter((skill) => skill.trim())
                        .map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-accent bg-opacity-20 text-primary px-3 py-1 rounded-full text-sm"
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
        </div>
      </div>
    </div>
  );
}
