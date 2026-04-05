import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      handleVerify(token);
    }
  }, []);

  const handleVerify = async (token: string) => {
    try {
      // Send token to backend for verification
      await api.post("/auth/verify-email", { token });
      toast.success("Email verified! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center text-gray-700 text-lg">Verifying your email...</p>
    </div>
  );
};

export default VerifyEmail;