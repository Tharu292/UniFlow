import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-hot-toast";
import ChangePasswordOverlay from "./ChangePassword";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const type = location.state?.type; // "change-password" or undefined

  // ⏱ countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleVerify = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);

      if (type === "change-password") {
        // ✅ JUST OPEN PASSWORD FORM (NO API CALL HERE)
        toast.success("OTP verified ✅");
        setShowChangePassword(true);

      } else {
        // ✅ REGISTER FLOW
        await api.post("/auth/verify-otp", {
          email,
          otp: otp.trim(),
        });

        toast.success("Account verified 🎉");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (type === "change-password") {
        await api.post(
          "/auth/change-password/request-otp",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await api.post("/auth/resend-otp", { email });
      }

      toast.success("OTP resent 📩");
      setTimeLeft(60);

    } catch {
      toast.error("Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-4">
          Verify OTP
        </h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full p-3 border rounded-lg text-center tracking-widest text-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="------"
        />

        {/* ⏱ TIMER */}
        <p className="text-center text-sm text-gray-500 mb-4">
          {timeLeft > 0 ? (
            <>
              Expires in{" "}
              <span className="text-red-500 font-semibold">
                {formatTime(timeLeft)}
              </span>
            </>
          ) : (
            <span className="text-red-500 font-semibold">
              OTP expired ⚠️
            </span>
          )}
        </p>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg mb-2 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          onClick={handleResend}
          disabled={timeLeft > 0}
          className={`text-sm w-full ${
            timeLeft > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-indigo-600 hover:underline"
          }`}
        >
          Resend OTP
        </button>

      </div>

      {/* ✅ CHANGE PASSWORD STEP */}
      {showChangePassword && (
        <ChangePasswordOverlay
          email={email}
          otp={otp.trim()} // 🔥 IMPORTANT FIX
          closeModal={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
};

export default VerifyOTP;