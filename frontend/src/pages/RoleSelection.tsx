// src/pages/RoleSelection.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react"; // ✅ FIXED
import { FaUserGraduate, FaUserShield, FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function RoleSelection() {
  const { user } = useContext(AuthContext) as any; // ✅ add proper typing later
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect logged-in user to correct dashboard
      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  // Prevent UI flash before redirect
  if (user) return null;

  return (
    <div className="min-h-screen bg-[#006591] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-orange-400 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-900 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      {/* Header */}
      <div className="text-center mb-16 text-white z-10">
        <h1 className="text-5xl font-bold mb-4 tracking-tight drop-shadow-lg">
          UniFlow
        </h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">
          A unified platform to streamline academic collaboration,
          resource sharing, and student management.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl w-full z-10">

        {/* Student Card */}
        <div className="group bg-white rounded-3xl p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] transform hover:-translate-y-3 transition duration-300 border-t-4 border-orange-400">

          <div className="flex justify-center mb-4">
            <FaUserGraduate className="text-4xl text-orange-500" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Student Portal
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Access your academic dashboard, upload and explore learning resources,
            collaborate with peers, and stay on track with your studies.
          </p>

          <ul className="text-sm text-gray-500 mb-8 space-y-3 text-left inline-block">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-orange-500" />
              Upload & access study materials
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-orange-500" />
              Track academic progress
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-orange-500" />
              Collaborate with peers
            </li>
          </ul>

          <button
            onClick={() => navigate("/login?role=student")}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 shadow-md group-hover:shadow-lg transition"
          >
            Continue as Student →
          </button>
        </div>

        {/* Admin Card */}
        <div className="group bg-white rounded-3xl p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] transform hover:-translate-y-3 transition duration-300 border-t-4 border-[#0b3c5d]">

          <div className="flex justify-center mb-4">
            <FaUserShield className="text-4xl text-[#0b3c5d]" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Admin Portal
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Manage platform operations, monitor system usage, and maintain
            an organized academic environment.
          </p>

          <ul className="text-sm text-gray-500 mb-8 space-y-3 text-left inline-block">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-[#0b3c5d]" />
              Manage users & resources
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-[#0b3c5d]" />
              View analytics & reports
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-[#0b3c5d]" />
              Maintain system integrity
            </li>
          </ul>

          <button
            onClick={() => navigate("/login?role=admin")}
            className="w-full bg-[#0b3c5d] text-white py-3 rounded-xl font-semibold hover:bg-blue-800 shadow-md group-hover:shadow-lg transition"
          >
            Continue as Admin →
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-16 text-white/70 text-sm z-10">
        © {new Date().getFullYear()} UniFlow • Smart Academic Platform
      </div>

    </div>
  );
}