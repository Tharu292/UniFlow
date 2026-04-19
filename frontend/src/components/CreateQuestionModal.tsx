// src/components/CreateQuestionModal.tsx
import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
}

export default function CreateQuestionModal({
  isOpen,
  onClose,
  refresh,
}: CreateQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = { title: "", description: "" };

    if (!title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    } else if (title.length < 5) {
      newErrors.title = "Minimum 5 characters required";
      valid = false;
    } else if (title.length > 150) {
      newErrors.title = "Maximum 150 characters allowed";
      valid = false;
    } else if (!/[a-zA-Z]/.test(title)) {
      newErrors.title = "Title must contain at least one letter";
      valid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    } else if (description.length < 30) {
      newErrors.description = "Minimum 30 characters required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const titleTrim = title.trim();
    const descTrim = description.trim();

    if (/^\d+$/.test(titleTrim) || /^\d+$/.test(descTrim)) {
      toast.error("Title and description cannot contain only numbers.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/questions", { title: titleTrim, description: descTrim });
      toast.success("Question posted successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setErrors({ title: "", description: "" });

      onClose();
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Ask a Question
        </h2>

        {/* Title */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear and concise title"
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006591]
              ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          <p className="text-xs text-gray-400 text-right mt-1">{title.length}/150</p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your problem in detail..."
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006591] resize-y
              ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-[#006591] text-white rounded-xl hover:bg-[#005580] disabled:opacity-70 font-medium"
          >
            {loading ? "Posting..." : "Post Question"}
          </button>
        </div>
      </div>
    </div>
  );
}