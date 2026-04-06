import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ADD THIS
import api from "../api";
import { toast } from "react-hot-toast";

interface Props {
  email: string;
  otp: string;
  closeModal: () => void;
}

const ChangePasswordOverlay = ({ email, otp, closeModal }: Props) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ADD THIS

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await api.post("/auth/change-password/verify", {
        email,
        otp,
        newPassword,
      });

      toast.success("Password updated successfully 🎉");

      closeModal();

      // REDIRECT AFTER SUCCESS
      setTimeout(() => {
        navigate("/profile"); // CHANGE HERE IF YOUR ROUTE DIFFERENT
      }, 1000);

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-2xl">

        <h2 className="text-xl font-bold mb-2 text-center">
          Set New Password
        </h2>

        <p className="text-gray-500 text-sm mb-6 text-center">
          Create a strong password
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="input-style mb-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="input-style mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="w-full border py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChangePasswordOverlay;