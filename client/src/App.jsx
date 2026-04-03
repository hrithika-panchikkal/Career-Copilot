import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import ProtectedRoute from "./components/ProtectedRoute";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-3xl font-bold">
      Dashboard Page
    </div>
  );
}

function History() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-3xl font-bold">
      History Page
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-3xl font-bold">
      About Page
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/success" element={<AuthSuccess />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}