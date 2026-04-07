import { Link } from "react-router-dom";
import api from "../Utils/axiosConfig";
import { Question } from "../Types";

const QuestionCard = ({ q, refresh }: { q: Question; refresh: () => void }) => {

  const deleteQ = async () => {
    try {
      await api.delete(`/questions/${q._id}`);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 mb-4 border hover:shadow-lg transition">

      {/* Title */}
      <Link to={`/question/${q._id}`}>
        <h2 className="text-lg font-semibold text-blue-600 hover:underline">
          {q.title}
        </h2>
      </Link>

      {/* Description (trimmed) */}
      <p className="text-gray-600 mt-2 line-clamp-2">
        {q.description}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">

        {/* View Button */}
        <Link
          to={`/question/${q._id}`}
          className="text-sm text-blue-500 hover:text-blue-700 transition"
        >
          View Details →
        </Link>

        {/* Delete Button */}
        <button
          onClick={deleteQ}
          className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;