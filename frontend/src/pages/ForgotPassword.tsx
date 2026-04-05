import { useState } from "react";
import api from "../api";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleForgot = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your SLIIT email!");
      setSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to send reset link";
      toast.error(message);
      setError(message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ SLIIT email validation
    if (!/^it\d{8}@my\.sliit\.lk$/.test(email)) {
      const msg = "Please enter a valid SLIIT email (itxxxxxxx@my.sliit.lk)";
      setError(msg);
      toast.error(msg);
      return;
    }

    handleForgot();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Enter your SLIIT email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Send Reset Link
            </button>

          </form>
        ) : (
          <div className="text-center space-y-4">

            <p className="text-green-600 font-medium">
              Reset link sent successfully (Demo)
            </p>

            <button
              onClick={handleForgot}
              className="w-full bg-indigo-500 text-white py-2 rounded"
            >
              Resend Link
            </button>

          </div>
        )}

        {/* ❌ Error Message */}
        {error && (
          <p className="mt-4 text-center text-red-500">
            {error}
          </p>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;