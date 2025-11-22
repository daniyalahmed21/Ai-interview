"use client";

// CV Creation Page - New users create their resume here after signing up
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CVForm, { CVData } from "@/components/CVForm";

export default function CVCreationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Save CV to database
  const handleSaveCV = async (cvData: CVData) => {
    setLoading(true);
    setError("");

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

      const data = await response.json();

      if (response.ok) {
        // CV saved successfully, redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.message || "Failed to save CV");
      }
    } catch (err) {
      console.error("Error saving CV:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">PrepView</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Resume
          </h1>
          <p className="text-gray-600">
            Fill in your information to get started with interview practice
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* CV Form Component */}
        <CVForm onSave={handleSaveCV} loading={loading} />
      </div>
    </div>
  );
}
