import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Utils/axiosConfig";
import PostAnswer from "../Components/PostAnswer";
import AnswerCard from "../Components/AnswerCard";
import { Answer } from "../Types";

export default function QuestionDetails() {
  const { id } = useParams();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get(`/answers/${id}`);
      setAnswers(res.data);
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
      <div className="max-w-3xl mx-auto">

        {/* 🔷 Page Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Answers
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Help others by sharing your knowledge
          </p>
        </div>

        {/* 🔷 Post Answer Section */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Your Answer
          </h2>

          <PostAnswer questionId={id} refresh={load} />
        </div>

        {/* 🔷 Answers List */}
        <div className="space-y-4">

          {loading ? (
            <p className="text-center text-gray-500">Loading answers...</p>
          ) : answers.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
              No answers yet. Be the first to answer!
            </div>
          ) : (
            answers.map((a) => (
              <AnswerCard key={a._id} a={a} refresh={load} />
            ))
          )}

        </div>
      </div>
    </div>
  );
}