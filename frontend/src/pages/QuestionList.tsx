import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../api";
import QuestionCard from "../components/QuestionCard";
import type { Question } from "../types";
import toast from "react-hot-toast";

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filtered, setFiltered] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/questions");

      // 🔴 SORT: latest first
      const sorted = res.data.sort(
        (a: Question, b: Question) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setQuestions(sorted);
      setFiltered(sorted);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 SEARCH
  useEffect(() => {
    const result = questions.filter(q =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, questions]);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* 🔷 SEARCH BAR */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border rounded-2xl focus:ring-2 focus:ring-[#006591]"
          />
        </div>

        {/* 🔷 LIST */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500">
              No questions found
            </p>
          ) : (
            filtered.map(q => (
              <QuestionCard key={q._id} q={q} refresh={load} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}