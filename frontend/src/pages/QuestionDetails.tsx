import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import PostAnswer from "../components/PostAnswer";
import AnswerCard from "../components/AnswerCard";
import { ArrowLeft } from "lucide-react";

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = async () => {
    const [qRes, aRes] = await Promise.all([
      api.get(`/questions/${id}`),
      api.get(`/answers/${id}`)
    ]);
    setQuestion(qRes.data);
    setAnswers(aRes.data);
  };

  useEffect(() => { load(); }, [id, refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  if (!question) return <p className="text-center py-12">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/forum" className="flex items-center gap-2 text-blue-600 mb-6 hover:underline">
        <ArrowLeft size={20} /> Back to Forum
      </Link>

      <div className="bg-white rounded-2xl shadow p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{question.title}</h1>
        <p className="text-gray-600 mt-4 leading-relaxed">{question.description}</p>
        <div className="text-xs text-gray-400 mt-6">
          Asked by {question.user.name}
        </div>
      </div>

      <PostAnswer questionId={id} refresh={refresh} />

      <h2 className="text-xl font-semibold mt-12 mb-6">Answers ({answers.length})</h2>
      {answers.map(a => (
        <AnswerCard key={a._id} a={a} refresh={refresh} />
      ))}
    </div>
  );
}