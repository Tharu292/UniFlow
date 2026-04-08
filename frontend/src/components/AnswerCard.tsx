// src/components/AnswerCard.tsx
import { useContext, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import type { Answer } from "../types";
import { AuthContext } from "../context/AuthContext";
import { Trash2, Edit2 } from "lucide-react";
import EditModal from "./EditModal";

const AnswerCard = ({ a, refresh }: { a: Answer; refresh: () => void }) => {
  const { user } = useContext(AuthContext);
  
  // Safe check for user ownership
  const isOwner = user?._id === (typeof a.user === "object" && a.user ? a.user._id : a.user);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const vote = async () => {
    try {
      await api.post(`/answers/vote/${a._id}`);
      refresh();
      toast.success("Vote recorded!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Already voted");
    }
  };

  const deleteAnswer = async () => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      await api.delete(`/answers/${a._id}`);
      toast.success("Answer deleted successfully");
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete answer");
    }
  };

  const handleUpdateAnswer = async (newContent: string) => {
    await api.put(`/answers/${a._id}`, { content: newContent });
    refresh();
  };

  return (
    <>
      <div className="bg-white border rounded-2xl shadow-sm p-6 mt-4 flex gap-5 hover:shadow-md transition">
        {/* Votes */}
        <div className="flex flex-col items-center min-w-[70px] border-r pr-5">
          <button
            onClick={vote}
            className="text-2xl text-gray-400 hover:text-green-600 transition"
          >
            ▲
          </button>
          <span className="text-2xl font-bold text-gray-800 my-1">{a.votes}</span>
          <span className="text-xs text-gray-400">votes</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-gray-700 leading-relaxed">{a.content}</p>

          <div className="flex justify-between items-center mt-5">
            <div className="text-sm text-gray-500">
              Answered by{" "}
              {typeof a.user === "object" && a.user
                ? a.user.name || `${a.user.firstName} ${a.user.lastName}`
                : "Unknown"}
            </div>

            {isOwner && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={deleteAnswer}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialContent={a.content}
        onSave={handleUpdateAnswer}
        type="answer"
      />
    </>
  );
};

export default AnswerCard;