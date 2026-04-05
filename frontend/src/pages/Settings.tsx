import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  LogOut,
  Activity,
  Settings as SettingsIcon,
  ArrowLeft,
  Lock,
} from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";

export default function Settings() {
  const themeContext = useContext(ThemeContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const dark = themeContext?.dark ?? false;
  const setDark = themeContext?.setDark ?? (() => {});
  const user = authContext?.user ?? null;
  const setUser = authContext?.setUser ?? (() => {});

  const [loading, setLoading] = useState(false);

  /* =============================
     🔐 REQUEST OTP (CHANGE PASSWORD)
  ============================== */
  const handleOpenChangePassword = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        "/auth/change-password/request-otp",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("OTP sent to your email 📩");

      // ✅ Navigate to OTP page
      navigate("/verify-otp", {
        state: {
          email: res.data.email,
          type: "change-password", // 🔥 important
        },
      });

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     🚪 LOGOUT
  ============================== */
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition">

      {/* HEADER */}
      <div
        className="text-white py-5"
        style={{
          background: "linear-gradient(90deg, #006591 0%, #cc5500 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <SettingsIcon />
            <div>
              <h1 className="text-2xl font-semibold">Settings</h1>
              <p className="text-sm opacity-80">Manage your account</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 bg-white text-[#006591] px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* 🌙 DARK MODE */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex justify-between items-center">
          <div className="flex items-center gap-3">
            {dark ? <Moon /> : <Sun />}
            <div>
              <p className="font-semibold">Appearance</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle dark / light mode
              </p>
            </div>
          </div>

          <button
            onClick={() => setDark(!dark)}
            className="bg-[#006591] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* 🔐 CHANGE PASSWORD */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Lock />
            <div>
              <p className="font-semibold">Change Password</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive OTP and update password securely
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenChangePassword}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#cc5500] hover:bg-[#00557a]"
            }`}
          >
            {loading ? "Processing..." : "Change"}
          </button>
        </div>

        {/* 📊 LOGIN ACTIVITY */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} />
            <h2 className="font-semibold">Login Activity</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">
                First Login
              </p>
              <p className="font-semibold">
                {user.firstLogin
                  ? new Date(user.firstLogin).toLocaleString()
                  : "Not available"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">
                Last Login
              </p>
              <p className="font-semibold">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* 🚪 LOGOUT */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LogOut />
            <div>
              <p className="font-semibold">Logout</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign out from your account
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}