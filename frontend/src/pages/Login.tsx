// frontend/src/pages/Login.tsx
import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const role = new URLSearchParams(location.search).get("role") || "student";
  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "student" && !/^it\d{8}@my\.sliit\.lk$/.test(email)) {
      setError("Students must login with a valid SLIIT email (itxxxxxxx@my.sliit.lk)");
      return;
    }

    if (role === "admin" && email !== "admin123@gmail.com") {
      setError("Admin must login with a valid email.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 800);

    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b3c5d] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 relative">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-[#0b3c5d] mb-2">
          {roleTitle} Login
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Welcome back! Please login to continue
        </p>

        <form onSubmit={handleLogin} className="grid gap-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
            data-testid="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
            data-testid="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]"
              required
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-orange-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
          data-testid="login-submit"
            type="submit"
            className="bg-[#0b3c5d] text-white py-3 rounded-xl font-semibold hover:bg-[#092c44] transition shadow-md"
          >
            Login as {roleTitle}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">
            {error}
          </p>
        )}

        {/* Register */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to={`/register?role=${role}`}
            className="text-[#0b3c5d] font-semibold hover:underline"
          >
            Create new account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;