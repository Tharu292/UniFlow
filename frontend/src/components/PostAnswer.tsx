import { useState } from "react";
import api from "../api";
import { toast } from "react-hot-toast";

const PostAnswer = ({ questionId, refresh }: any) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // Validation and submission logic
  const submit = async () => {
  const contentTrim = content.trim();

  if (!contentTrim) {
    setError("Answer is required");
    return;
  }

  if (contentTrim.length < 20) {
    setError("Answer must be at least 20 characters");
    return;
  }

  // Block if ONLY numbers
  if (/^\d+$/.test(contentTrim)) {
    setError("Answer cannot contain only numbers. Please include some letters.");
    return;
  }

  try {
    setError("");
    await api.post("/answers", { content, questionId });
    toast.success("Answer posted successfully!");
    setContent("");
    refresh();
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to post answer");
  }
};

  return (
    <div className="bg-white shadow-md rounded-xl p-5 mt-6 border max-w-2xl">

      {/* Heading */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Your Answer
      </h3>

      {/* Textarea */}
      <textarea
        data-testid="answer-input"
        rows={5}
        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none
        ${error ? "border-red-500 focus:ring-red-300" : "focus:ring-green-400"}`}
        placeholder="Write a detailed and helpful answer..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Footer */}
      <div className="flex justify-between items-center mt-2">

        {/* Error */}
        <div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        {/* Character count */}
        <p className="text-xs text-gray-400">
          {content.length} characters
        </p>
      </div>

      {/* Button */}
      <button
        data-testid="submit-answer"
        onClick={submit}
        className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition shadow-sm"
      >
        Post Answer
      </button>
    </div>
  );
};

export default PostAnswer;