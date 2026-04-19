// frontend/src/pages/Settings.tsx
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Activity,
  Settings as SettingsIcon,
  ArrowLeft,
  Lock,
} from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";

export default function Settings() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const user = authContext?.user ?? null;

  const [loading, setLoading] = useState(false);

  const handleOpenChangePassword = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/auth/change-password/request-otp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("OTP sent to your email");
      navigate("/verify-otp", {
        state: { email: res.data.email, type: "change-password" },
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    authContext?.setUser?.(null);
    navigate("/login");
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER - Same gradient as other pages */}
      <div className="bg-gradient-to-r from-[#006591] to-[#cc5500] text-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <SettingsIcon size={28} />
            <div>
              <h1 className="text-2xl font-semibold">Settings</h1>
              <p className="text-sm opacity-90">Manage your account preferences</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition"
          >
            <ArrowLeft size={18} /> Back to Profile
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Change Password */}
        <div className="bg-white rounded-2xl p-6 shadow flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Lock size={28} className="text-gray-700" />
            <div>
              <p className="font-semibold text-lg text-gray-900">Change Password</p>
              <p className="text-gray-500">Securely update your password</p>
            </div>
          </div>
          <button
            onClick={handleOpenChangePassword}
            disabled={loading}
            className={`px-6 py-2.5 rounded-xl text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#cc5500] hover:bg-[#b34700]"
            }`}
          >
            {loading ? "Sending OTP..." : "Change Password"}
          </button>
        </div>

        {/* Login Activity */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center gap-3 mb-5">
            <Activity size={24} className="text-gray-700" />
            <h2 className="font-semibold text-lg text-gray-900">Login Activity</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500">First Login</p>
              <p className="font-medium mt-1 text-gray-900">
                {user.firstLogin ? new Date(user.firstLogin).toLocaleString() : "Not available"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Last Login</p>
              <p className="font-medium mt-1 text-gray-900">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl p-6 shadow flex justify-between items-center">
          <div className="flex items-center gap-4">
            <LogOut size={28} className="text-red-500" />
            <div>
              <p className="font-semibold text-lg text-gray-900">Logout</p>
              <p className="text-gray-500">Sign out from your account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}