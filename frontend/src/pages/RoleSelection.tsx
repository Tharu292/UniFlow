import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 flex flex-col items-center justify-center px-6">

      {/* Header */}
      <div className="text-center mb-14 text-white">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
          Welcome to UniFlow
        </h1>
        <p className="text-lg opacity-90">
          Select your role to continue
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full">

        {/* Student Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 hover:scale-105 transition duration-300">
          <h2 className="text-3xl font-bold text-blue-600 mb-5">
            Student Portal
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Access your dashboard, join discussions, share resources,
            and track your academic progress.
          </p>

          <button
            onClick={() => navigate("/login?role=student")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-md transition"
          >
            Continue as Student
          </button>
        </div>

        {/* Admin Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 hover:scale-105 transition duration-300">
          <h2 className="text-3xl font-bold text-purple-600 mb-5">
            Admin Portal
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Manage users, oversee system analytics, moderate content,
            and configure platform settings.
          </p>

          <button
            onClick={() => navigate("/login?role=admin")}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 shadow-md transition"
          >
            Continue as Admin
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoleSelection;