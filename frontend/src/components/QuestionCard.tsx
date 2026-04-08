// src/components/QuestionCard.tsx
import { Link } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import api from "../api";
import toast from "react-hot-toast";
import type { Question } from "../types";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import EditModal from "./EditModal";

const QuestionCard = ({ q, refresh }: { q: Question; refresh: () => void }) => {
  const { user } = useContext(AuthContext);

  // Safe ownership check
  const isOwner = user?._id === (typeof q.user === "object" && q.user ? q.user._id : q.user);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const deleteQ = async () => {
    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) return;

    try {
      await api.delete(`/questions/${q._id}`);
      toast.success("Question deleted successfully");
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete question");
    }
  };

  const handleUpdateQuestion = async (data: { title: string; description: string }) => {
    await api.put(`/questions/${q._id}`, data);
    refresh();
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition">
        <div className="flex justify-between items-start">
          <Link to={`/question/${q._id}`} className="flex-1">
            <h2 className="text-xl font-semibold text-blue-600 hover:underline">
              {q.title}
            </h2>
          </Link>

          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={deleteQ}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 mt-3 line-clamp-3">{q.description}</p>

        <div className="flex justify-between items-center mt-6 text-sm">
          <div className="text-gray-500">
            Asked by{" "}
            {typeof q.user === "object" && q.user
              ? q.user.name || `${q.user.firstName} ${q.user.lastName}`
              : "Unknown"}
          </div>

          <Link
            to={`/question/${q._id}`}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View Details →
          </Link>
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTitle={q.title}
        initialDescription={q.description}
        onSave={handleUpdateQuestion}
        type="question"
      />
    </>
  );
};

export default QuestionCard;