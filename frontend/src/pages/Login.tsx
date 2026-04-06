import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const role = new URLSearchParams(location.search).get("role") || "student";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Student email format validation
    if (role === "student" && !/^it\d{8}@my\.sliit\.lk$/.test(email)) {
      setError("Students must login with a valid SLIIT email (itxxxxxxx@my.sliit.lk)");
      return;
    }
   // Admin email format validation
    if (role === "admin" && email !== "admin123@gmail.com") {
  setError("Admin must login with a valid email.");
  return;
}

    try {
      // Call login API
      const res = await api.post("/auth/login", { email, password });

      // Save user and token
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Show toast immediately on Login page
      toast.success("Login successful!");

      // Delay navigation slightly so toast is visible
      setTimeout(() => {
        if (res.data.user.role === "admin") navigate("/admin-dashboard");
        else navigate("/dashboard");
      }, 500); // 0.5 second delay is enough for practical UX

    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">

        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">Login</h1>
        <p className="text-center text-gray-500 mb-8">
          Welcome back! Please login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </p>

        <form onSubmit={handleLogin} className="grid gap-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input-style"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-style"
            required
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">
            {error}
          </p>
        )}

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to={`/register?role=${role}`}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Create new account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;