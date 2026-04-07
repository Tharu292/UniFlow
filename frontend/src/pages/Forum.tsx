import { useEffect, useState } from "react";
import api from "../Utils/axiosConfig";
import PostQuestion from "../Components/PostQuestion";
import QuestionCard from "../Components/QuestionCard";
import { Question } from "../Types";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* 🔷 Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Discussion Forum
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ask questions, share knowledge, and grow your rank 🚀
          </p>
        </div>

        {/* 🔷 Post Question */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Ask a Question
          </h2>

          <PostQuestion refresh={load} />
        </div>

        {/* 🔷 Questions List */}
        <div className="space-y-4">

          {loading ? (
            <p className="text-center text-gray-500">
              Loading questions...
            </p>
          ) : questions.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
              No questions yet. Be the first to ask!
            </div>
          ) : (
            questions.map((q) => (
              <QuestionCard key={q._id} q={q} refresh={load} />
            ))
          )}

        </div>
      </div>
    </div>
  );
}