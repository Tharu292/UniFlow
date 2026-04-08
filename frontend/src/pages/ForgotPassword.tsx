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

    // SLIIT email validation
    if (!/^it\d{8}@my\.sliit\.lk$/.test(email)) {
      const msg = "Please enter a valid SLIIT email (itxxxxxxx@my.sliit.lk)";
      setError(msg);
      toast.error(msg);
      return;
    }

    handleForgot();
  };

  return (
    <div className="min-h-screen bg-[#0b3c5d] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-[#0b3c5d] mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Enter your SLIIT email to receive a reset link
        </p>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                SLIIT Email Address
              </label>
              <input
                type="email"
                placeholder="itxxxxxxxx@my.sliit.lk"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#0b3c5d] text-white py-3 rounded-xl font-semibold hover:bg-[#092c44] transition shadow-md"
            >
              Send Reset Link
            </button>

          </form>
        ) : (
          <div className="text-center space-y-5">

            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
              Reset link sent successfully! Please check your email.
            </div>

            <button
              onClick={handleForgot}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition shadow-md"
            >
              Resend Link
            </button>

          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-4 text-center text-red-500 font-medium">
            {error}
          </p>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;