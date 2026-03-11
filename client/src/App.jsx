// ================= IMPORTS =================

// React hooks
import { useState, useEffect } from "react";

// Axios for API requests
import axios from "axios";

// Spinner icon
import { FaSpinner } from "react-icons/fa";



// ================= MAIN COMPONENT =================

export default function App() {

  // Store profile input
  const [profile, setProfile] = useState("");

  // Store job description input
  const [jobDescription, setJobDescription] = useState("");

  // Store AI result
  const [result, setResult] = useState("");

  // Store history
  const [history, setHistory] = useState([]);

  // Loading spinner state
  const [loading, setLoading] = useState(false);

  // Page navigation state
  const [activePage, setActivePage] = useState("dashboard");



  // ================= FETCH HISTORY =================

  const fetchHistory = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/ai/history"
      );

      setHistory(response.data);

    } catch (error) {

      console.error("Error fetching history:", error);

    }

  };



  // Load history when app loads
  useEffect(() => {

    fetchHistory();

  }, []);



  // ================= ANALYZE FUNCTION =================

  const analyze = async () => {

    if (!profile || !jobDescription) {

      alert("Please enter profile and job description");

      return;

    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/ai/analyze",
        {
          profile,
          jobDescription
        }
      );

      setResult(response.data.result);

      // Refresh history
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
            className="hover:text-gray-400 cursor-pointer"
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </li>

          <li
            className="hover:text-gray-400 cursor-pointer"
            onClick={() => setActivePage("history")}
          >
            History
          </li>

          <li
            className="hover:text-gray-400 cursor-pointer"
            onClick={() => setActivePage("about")}
          >
            About
          </li>

        </ul>

      </div>



      {/* ================= MAIN CONTENT ================= */}

      <div className="flex-1 p-10">


        {/* ================= DASHBOARD PAGE ================= */}

        {activePage === "dashboard" && (

          <>

            {/* Page title */}
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text">
              AI Career Analysis
            </h2>


            {/* INPUT SECTION */}

            <div className="grid grid-cols-2 gap-6">

              {/* Profile input */}
              <div className="bg-white p-6 rounded-xl shadow">

                <h3 className="font-semibold mb-3">
                  Your Profile
                </h3>

                <textarea
                  className="w-full border p-3 rounded-lg h-40"
                  placeholder="Paste your resume summary"
                  onChange={(e) => setProfile(e.target.value)}
                />

              </div>


              {/* Job description input */}
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

            </div>



            {/* ANALYZE BUTTON */}

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
                  "Analyze with AI"
                )}

              </button>

            </div>



            {/* AI RESULT */}

            {result && (

              <div className="bg-white mt-10 p-6 rounded-xl shadow">

                <h3 className="text-xl font-semibold mb-4">
                  AI Analysis
                </h3>

                <pre className="whitespace-pre-wrap text-gray-700">
                  {result}
                </pre>

              </div>

            )}

          </>

        )}



        {/* ================= HISTORY PAGE ================= */}

        {activePage === "history" && (

          <div>

            <h2 className="text-3xl font-bold mb-8">
              Analysis History
            </h2>

            <div className="space-y-4">

              {history.length === 0 ? (

                <p className="text-gray-500">
                  No analysis history yet.
                </p>

              ) : (

                history.map((item) => (

                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-xl shadow"
                  >

                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>

                    <pre className="whitespace-pre-wrap text-gray-700">
                      {item.result}
                    </pre>

                  </div>

                ))

              )}

            </div>

          </div>

        )}



        {/* ================= ABOUT PAGE ================= */}

        {activePage === "about" && (

          <div>

            <h2 className="text-3xl font-bold mb-6">
              About CareerCopilot
            </h2>

            <p className="text-gray-700 max-w-2xl">
              CareerCopilot is an AI-powered platform that analyzes
              resumes against job descriptions to generate role-fit
              insights, identify skill gaps, and provide interview
              preparation questions using modern AI models.
            </p>

          </div>

        )}

      </div>

    </div>

  );

}