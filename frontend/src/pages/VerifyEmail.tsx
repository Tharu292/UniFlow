import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      handleVerify(token);
    } else {
      setStatus("error");
    }
  }, []);

  const handleVerify = async (token: string) => {
    try {
      await api.post("/auth/verify-email", { token });
      setStatus("success");
      toast.success("Email verified successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setStatus("error");
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b3c5d] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">

        {/* Loading State */}
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-[#0b3c5d] mb-2">
              Verifying Email
            </h2>
            <p className="text-gray-500">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
                <span className="text-green-600 text-xl">✓</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-500 mb-4">
              Your account has been successfully verified.
            </p>
            <p className="text-sm text-gray-400">
              Redirecting to login...
            </p>
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full">
                <span className="text-red-600 text-xl">✕</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-500 mb-6">
              Invalid or expired verification link.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition shadow-md"
            >
              Go to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;