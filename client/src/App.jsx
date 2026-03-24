// ================= IMPORTS =================

import { useState, useEffect } from "react";
import axios from "axios";

import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaQuestionCircle
} from "react-icons/fa";



// ================= COMPONENT =================

export default function App() {

  // User fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Resume upload
  const [resume, setResume] = useState(null);

  // Job description
  const [jobDescription, setJobDescription] = useState("");

  // AI result
  const [result, setResult] = useState(null);

  // Analysis history
  const [history, setHistory] = useState([]);

  // Loading spinner
  const [loading, setLoading] = useState(false);

  // Page navigation
  const [activePage, setActivePage] = useState("dashboard");



  // ================= FETCH HISTORY =================

  const fetchHistory = async () => {

    if (!email) return;

    try {

      const response = await axios.get(
        `http://localhost:5000/api/ai/history?email=${email}`
      );

      setHistory(response.data);

    } catch (error) {

      console.error("Error fetching history:", error);

    }

  };



  // Load history when email changes
  useEffect(() => {

    if (email) {
      fetchHistory();
    }

  }, [email]);

  // ================= PARSE RESUME =================

  const parseResume = async (file) => {

    try {

      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        "http://localhost:5000/api/ai/parse-resume",
        formData
      );

      const data = response.data;

      // Autofill fields
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");

    } catch (error) {

      console.error("Resume parsing failed:", error);

    }

  };

  // ================= ANALYZE FUNCTION =================

  const analyze = async () => {

    if (!firstName || !lastName || !email || !resume || !jobDescription) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await axios.post(
        "http://localhost:5000/api/ai/analyze",
        formData
      );

      setResult(JSON.parse(response.data));

      fetchHistory();

    } catch (error) {

      console.error(error);
      alert("Error running analysis");

    } finally {

      setLoading(false);

    }

  };



  // ================= UI =================

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}

      <div className="w-64 bg-black text-white p-6">

        <h1 className="text-2xl font-bold mb-10">
          CareerCopilot
        </h1>

        <ul className="space-y-4">

          <li
            className="cursor-pointer hover:text-gray-400"
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </li>

          <li
            className="cursor-pointer hover:text-gray-400"
            onClick={() => setActivePage("history")}
          >
            History
          </li>

          <li
            className="cursor-pointer hover:text-gray-400"
            onClick={() => setActivePage("about")}
          >
            About
          </li>

        </ul>

      </div>



      {/* ================= MAIN CONTENT ================= */}

      <div className="flex-1 p-10">

        {/* ================= DASHBOARD ================= */}

        {activePage === "dashboard" && (

          <>

            <h2 className="text-3xl font-bold mb-8">
              AI Career Analysis
            </h2>

            {/* ================= RESUME UPLOAD ================= */}

            <div className="bg-white p-6 rounded-xl shadow mb-6">

              <h3 className="font-semibold mb-3">
                Upload Resume (PDF)
              </h3>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                
                  const file = e.target.files[0];
                
                  setResume(file);
                
                  if (file) {
                    parseResume(file);
                  }
                
                }}
              />

            </div>

            {/* ================= USER FORM ================= */}

            <div className="bg-white p-6 rounded-xl shadow mb-6">

              <div className="grid grid-cols-2 gap-4">

                <input
                  value={firstName}
                  placeholder="First Name"
                  className="border p-3 rounded-lg"
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                  value={lastName}
                  placeholder="Last Name"
                  className="border p-3 rounded-lg"
                  onChange={(e) => setLastName(e.target.value)}
                />

              </div>

              <input
                value={email}
                placeholder="Email"
                className="border p-3 rounded-lg w-full mt-4"
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            {/* ================= JOB DESCRIPTION ================= */}

            <div className="bg-white p-6 rounded-xl shadow">

              <h3 className="font-semibold mb-3">
                Job Description
              </h3>

              <textarea
                className="w-full border p-3 rounded-lg h-40"
                placeholder="Paste job description"
                onChange={(e) => setJobDescription(e.target.value)}
              />

            </div>



            {/* ================= ANALYZE BUTTON ================= */}

            <div className="mt-6">

              <button
                onClick={analyze}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
              >

                {loading ? (
                  <>
                    <FaSpinner className="animate-spin inline mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}

              </button>

            </div>



            {/* ================= RESULT DASHBOARD ================= */}

            {result && (

              <div className="mt-10 space-y-6">

                {/* Fit Score */}

                <div className="bg-green-500 text-white p-6 rounded-xl shadow">

                  <h3 className="flex items-center gap-2 font-semibold">
                    <FaCheckCircle />
                    Fit Score
                  </h3>

                  <p className="text-4xl font-bold mt-2">
                    {result.fitScore}%
                  </p>

                </div>



                <div className="grid grid-cols-2 gap-6">

                  {/* Matching Skills */}

                  <div className="bg-white p-6 rounded-xl shadow">

                    <h3 className="flex items-center gap-2 font-semibold mb-3">
                      <FaCheckCircle className="text-green-500" />
                      Matching Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {result.matchingSkills?.map((skill, i) => (

                        <span
                          key={i}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>

                      ))}

                    </div>

                  </div>



                  {/* Missing Skills */}

                  <div className="bg-white p-6 rounded-xl shadow">

                    <h3 className="flex items-center gap-2 font-semibold mb-3">
                      <FaExclamationTriangle className="text-red-500" />
                      Missing Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {result.missingSkills?.map((skill, i) => (

                        <span
                          key={i}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>

                      ))}

                    </div>

                  </div>

                </div>



                {/* Advice */}

                <div className="bg-white p-6 rounded-xl shadow">

                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <FaLightbulb className="text-blue-500" />
                    Advice
                  </h3>

                  <p>{result.advice}</p>

                </div>



                {/* Interview Questions */}

                <div className="bg-white p-6 rounded-xl shadow">

                  <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <FaQuestionCircle className="text-purple-500" />
                    Interview Questions
                  </h3>

                  <ul className="list-disc ml-5">

                    {result.interviewQuestions?.map((q, i) => (

                      <li key={i}>{q}</li>

                    ))}

                  </ul>

                </div>

              </div>

            )}

          </>

        )}



        {/* ================= HISTORY ================= */}

        {activePage === "history" && (

          <div>

            <h2 className="text-3xl font-bold mb-8">
              Analysis History
            </h2>

            {history.length === 0 ? (

              <p>No analysis history found for this email.</p>

            ) : (

              history.map((item) => {

                const parsed = JSON.parse(item.result);

                return (

                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-xl shadow mb-4"
                  >

                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>

                    <p className="font-semibold">
                      Fit Score: {parsed.fitScore}%
                    </p>

                  </div>

                );

              })

            )}

          </div>

        )}



        {/* ================= ABOUT ================= */}

        {activePage === "about" && (

          <div>

            <h2 className="text-3xl font-bold mb-6">
              About CareerCopilot
            </h2>

            <p className="max-w-xl text-gray-700">

              CareerCopilot is an AI-powered platform that analyzes
              resumes against job descriptions to determine role fit,
              highlight missing skills, and generate interview
              preparation questions.

            </p>

          </div>

        )}

      </div>

    </div>

  );

}