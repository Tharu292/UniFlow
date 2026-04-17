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

  const isOwner =
    user?._id ===
    (typeof a.user === "object" && a.user ? a.user._id : a.user);

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
    if (!window.confirm("Delete this answer?")) return;

    try {
      await api.delete(`/answers/${a._id}`);
      toast.success("Deleted successfully");
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // ✅ FIXED: Correct parameter handling
  const handleUpdateAnswer = async (data: { content?: string }) => {
    await api.put(`/answers/${a._id}`, {
      content: data.content,
    });

    refresh();
  };

  return (
    <>
      <div className="bg-white border rounded-2xl shadow-sm p-6 mt-4 flex gap-5">
        <div className="flex flex-col items-center min-w-[70px] border-r pr-5">
          <button onClick={vote}>▲</button>
          <span className="text-xl font-bold">{a.votes}</span>
        </div>

        <div className="flex-1">
          <p>{a.content}</p>

          <div className="flex justify-between mt-4">
            <span className="text-sm text-gray-500">
              {typeof a.user === "object"
                ? `${a.user.firstName} ${a.user.lastName}`
                : "Unknown"}
            </span>

            {isOwner && (
              <div className="flex gap-3">
                <button onClick={() => setIsEditModalOpen(true)}>
                  <Edit2 size={16} />
                </button>

                <button onClick={deleteAnswer}>
                  <Trash2 size={16} />
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