import React from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            CareerCopilot
          </h1>
          <p className="text-slate-400">
            AI-powered resume analysis for smarter job applications
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 rounded-2xl transition-all duration-300"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;