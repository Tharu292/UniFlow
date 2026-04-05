import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get token from query params
  const token = new URLSearchParams(location.search).get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Basic validation
    if (!password || !confirmPassword) {
      const msg = "Please enter all fields";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      // ✅ API call with token
      await api.post("/auth/reset-password", { token, password });

      toast.success("Password reset successful!");
      // Redirect to login
      navigate("/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Reset failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Reset Password
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;