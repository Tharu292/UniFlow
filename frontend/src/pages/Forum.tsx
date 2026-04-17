// src/pages/Forum.tsx
import { useEffect, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import api from "../api";
import PostQuestion from "../components/PostQuestion";
import QuestionCard from "../components/QuestionCard";
import type { Question } from "../types";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Forum() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/questions");
      setQuestions(res.data);
      setFilteredQuestions(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // Live search
  useEffect(() => {
    const filtered = questions.filter(q =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
  }, [searchTerm, questions]);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Dynamic Header */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare size={32} className="text-[#006591]" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isAdmin ? "Forum Management" : "Discussion Forum"}
              </h1>
              <p className="text-gray-500 mt-1">
                {isAdmin 
                  ? "View all questions and answers posted by students" 
                  : "Ask questions, share knowledge, and learn together"}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar (kept for students, hidden for admin as per "remove search bar" request - but you can toggle) */}
        {!isAdmin && (
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search questions by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#006591] text-lg"
            />
          </div>
        )}

        {/* Only students can post new questions */}
        {!isAdmin && <PostQuestion refresh={load} />}

        {/* Questions List */}
        <div className="space-y-6 mt-8">
          {loading ? (
            <p className="text-center text-gray-500 py-12">Loading questions...</p>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center text-gray-500">
              {searchTerm ? "No questions match your search." : "No questions yet."}
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <QuestionCard key={q._id} q={q} refresh={load} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}