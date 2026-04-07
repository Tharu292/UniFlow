import api from "../Utils/axiosConfig";
import { Answer } from "../Types";

const AnswerCard = ({ a, refresh }: { a: Answer; refresh: () => void }) => {

  const vote = async () => {
    try {
      await api.post(`/answers/vote/${a._id}`);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAnswer = async () => {
    const confirmDelete = window.confirm("Delete this answer?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/answers/${a._id}`);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 mt-4 flex gap-4 hover:shadow-md transition">

      {/* LEFT SIDE - VOTES */}
      <div className="flex flex-col items-center justify-start min-w-[60px] border-r pr-4">
        <button
          onClick={vote}
          className="text-gray-500 hover:text-green-600 text-xl transition"
        >
          ▲
        </button>

        <span className="text-lg font-semibold text-gray-800">
          {a.votes}
        </span>

        <span className="text-xs text-gray-400">votes</span>
      </div>

      {/* RIGHT SIDE - CONTENT */}
      <div className="flex-1">

        {/* Answer Content */}
        <p className="text-gray-700 leading-relaxed">
          {a.content}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">

          {/* User Info */}
          <div className="text-sm text-gray-500">
            Rank:{" "}
            <span className="font-medium text-blue-500">
              {a.user.rank}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">

            <button
              onClick={vote}
              className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-sm hover:bg-green-200 transition"
            >
              Upvote
            </button>

            <button
              onClick={deleteAnswer}
              className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;