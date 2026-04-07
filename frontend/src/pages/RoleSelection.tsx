import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#006591] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute w-[400px] h-[400px] bg-orange-400 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-300 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[-100px]"></div>

      {/* Header */}
      <div className="text-center mb-16 text-white z-10">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
          UniFlow
        </h1>
        <p className="text-lg opacity-90 max-w-xl">
          A unified platform to streamline academic collaboration, resource sharing,
          and student management.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl w-full z-10">

        {/* Student Card */}
        <div className="group bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] transform hover:-translate-y-3 transition duration-300 border-t-4 border-orange-400">
          
          <h2 className="text-3xl font-bold text-[#006591] mb-4">
            🎓 Student Portal
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Access your academic dashboard, upload and explore learning resources,
            collaborate with peers, and stay on track with your studies.
          </p>

          <ul className="text-sm text-gray-500 mb-8 space-y-2">
            <li>✔ Upload & access study materials</li>
            <li>✔ Track academic progress</li>
            <li>✔ Collaborate with peers</li>
          </ul>

          <button
            onClick={() => navigate("/login?role=student")}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 shadow-md group-hover:shadow-lg transition"
          >
            Continue as Student →
          </button>
        </div>

        {/* Admin Card */}
        <div className="group bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] transform hover:-translate-y-3 transition duration-300 border-t-4 border-[#006591]">
          
          <h2 className="text-3xl font-bold text-[#006591] mb-4">
            🛠 Admin Portal
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Manage platform operations, monitor system usage, and maintain
            an organized and efficient academic environment.
          </p>

          <ul className="text-sm text-gray-500 mb-8 space-y-2">
            <li>✔ Manage users & resources</li>
            <li>✔ View analytics & reports</li>
            <li>✔ Maintain system integrity</li>
          </ul>

          <button
            onClick={() => navigate("/login?role=admin")}
            className="w-full bg-[#006591] text-white py-3 rounded-xl font-semibold hover:bg-[#004d6e] shadow-md group-hover:shadow-lg transition"
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
};

export default RoleSelection;