import { useState } from "react";
import api from "../Utils/axiosConfig";

const PostAnswer = ({ questionId, refresh }: any) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // Validation and submission logic
  const submit = async () => {
    if (!content.trim()) {
      setError("Answer is required");
      return;
    }

    if (content.trim().length < 20) {
      setError("Answer must be at least 20 characters");
      return;
    }

    try {
      setError("");
      await api.post("/answers", { content, questionId });

      setContent("");
      refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
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
        onClick={submit}
        className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition shadow-sm"
      >
        Post Answer
      </button>
    </div>
  );
};

export default PostAnswer;