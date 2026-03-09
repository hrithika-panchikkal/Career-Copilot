// Import React state hook
import { useState } from "react";

// Import axios to call backend API
import axios from "axios";

// Import spinner icon for loading animation
import { FaSpinner } from "react-icons/fa";

// Main application component
export default function App() {

  // State to store user profile input
  const [profile, setProfile] = useState("");

  // State to store job description input
  const [jobDescription, setJobDescription] = useState("");

  // State to store AI response result
  const [result, setResult] = useState("");

  // State to track loading while AI request runs
  const [loading, setLoading] = useState(false);


  // Function triggered when user clicks Analyze button
  const analyze = async () => {

    // Basic validation to ensure inputs are not empty
    if (!profile || !jobDescription) {
      alert("Please enter profile and job description");
      return;
    }

    try {

      // Set loading state true to show spinner
      setLoading(true);

      // Call backend API endpoint
      const response = await axios.post(
        "http://localhost:5000/api/ai/analyze",
        {
          profile,
          jobDescription,
        }
      );

      // Store AI response in result state
      setResult(response.data.result);

    } catch (error) {

      // Log error in console for debugging
      console.error(error);

      // Show error message to user
      alert("Error running analysis");

    } finally {

      // Stop loading spinner
      setLoading(false);

    }
  };


  // UI layout returned by component
  return (

    // Main container with sidebar + content layout
    <div className="flex min-h-screen bg-gray-100">


      {/* ================= Sidebar Navigation ================= */}

      <div className="w-64 bg-black text-white p-6">

        {/* App title */}
        <h1 className="text-2xl font-bold mb-10">
          CareerCopilot
        </h1>

        {/* Navigation links */}
        <ul className="space-y-4">

          <li className="hover:text-gray-400 cursor-pointer">
            Dashboard
          </li>

          <li className="hover:text-gray-400 cursor-pointer">
            History
          </li>

          <li className="hover:text-gray-400 cursor-pointer">
            About
          </li>

        </ul>

      </div>


      {/* ================= Main Content Area ================= */}

      <div className="flex-1 p-10">


        {/* Page title with gradient text */}
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-black via-white to-black text-transparent bg-clip-text">
          AI Career Analysis
        </h2>


        {/* Grid layout for input sections */}
        <div className="grid grid-cols-2 gap-6">


          {/* ===== Profile Input Card ===== */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="font-semibold mb-3">
              Your Profile
            </h3>

            {/* Textarea for profile input */}
            <textarea
              className="w-full border p-3 rounded-lg h-40"
              placeholder="Paste your resume summary"
              onChange={(e) => setProfile(e.target.value)}
            />

          </div>


          {/* ===== Job Description Input Card ===== */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="font-semibold mb-3">
              Job Description
            </h3>

            {/* Textarea for job description input */}
            <textarea
              className="w-full border p-3 rounded-lg h-40"
              placeholder="Paste job description"
              onChange={(e) => setJobDescription(e.target.value)}
            />

          </div>

        </div>


        {/* ================= Analyze Button ================= */}

        <div className="mt-6">

          <button
            onClick={analyze}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >

            {/* Show spinner while loading */}
            {loading ? (
              <>
                <FaSpinner className="animate-spin inline mr-2" />
                Analyzing...
              </>
            ) : (
              "Analyze with AI"
            )}

          </button>

        </div>


        {/* ================= AI Result Section ================= */}

        {result && (

          <div className="bg-white mt-10 p-6 rounded-xl shadow">

            <h3 className="text-xl font-semibold mb-4">
              AI Analysis
            </h3>

            {/* Display AI response */}
            <pre className="whitespace-pre-wrap text-gray-700">
              {result}
            </pre>

          </div>

        )}

      </div>

    </div>
  );
}