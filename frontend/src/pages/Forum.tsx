// src/pages/Forum.tsx
import { useEffect, useState, useContext, useMemo } from "react";
import { MessageSquare, Search, Plus } from "lucide-react";
import api from "../api";
import QuestionCard from "../components/QuestionCard";
import type { Question } from "../types";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import CreateQuestionModal from "../components/CreateQuestionModal";

export default function Forum() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered questions + counts
  const { allQuestions, myQuestions, filteredQuestions } = useMemo(() => {
    let all = [...questions];
    let my: Question[] = [];

    if (user?._id) {
      my = questions.filter(q => 
        (typeof q.user === "object" && q.user?._id === user._id) ||
        (typeof q.user === "string" && q.user === user._id)
      );
    }

    // Apply search filter
    const term = searchTerm.toLowerCase().trim();
    const filtered = (activeTab === "all" ? all : my).filter(q =>
      !term || 
      q.title.toLowerCase().includes(term) ||
      q.description.toLowerCase().includes(term)
    );

    return {
      allQuestions: all,
      myQuestions: my,
      filteredQuestions: filtered,
    };
  }, [questions, searchTerm, activeTab, user?._id]);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare size={32} className="text-[#006591]" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isAdmin ? "Forum Management" : "Discussion Forum"}
              </h1>
              <p className="text-gray-500 mt-1">
                {isAdmin 
                  ? "Manage all questions and answers" 
                  : "Ask questions, share knowledge, and learn together"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs + Post Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          
          {/* Beautiful Tabs */}
          {!isAdmin && (
            <div className="inline-flex bg-white rounded-3xl p-1.5 shadow-sm border border-gray-100">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-2 px-7 py-3 rounded-3xl font-medium transition-all duration-200 ${
                  activeTab === "all"
                    ? "bg-[#006591] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Questions
                <span className="text-sm opacity-75">({allQuestions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("my")}
                className={`flex items-center gap-2 px-7 py-3 rounded-3xl font-medium transition-all duration-200 ${
                  activeTab === "my"
                    ? "bg-[#006591] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                My Questions
                <span className="text-sm opacity-75">({myQuestions.length})</span>
              </button>
            </div>
          )}

          {/* Post Question Button */}
          {!isAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-3 bg-[#006591] hover:bg-[#005580] text-white px-6 py-3.5 rounded-2xl font-medium shadow-lg transition-all active:scale-[0.97]"
            >
              <Plus size={22} />
              Post a Question
            </button>
          )}
        </div>

        {/* Search Bar - Show only in "All Questions" tab */}
        {activeTab === "all" && (
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

        {/* Questions List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-gray-500 py-16">Loading questions...</div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white p-16 rounded-2xl text-center text-gray-500">
              {activeTab === "my" 
                ? "You haven't posted any questions yet. Click 'Post a Question' to get started!" 
                : searchTerm 
                  ? "No questions match your search." 
                  : "No questions have been posted yet."}
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <QuestionCard key={q._id} q={q} refresh={load} />
            ))
          )}
        </div>
      </div>

      {/* Create Question Modal */}
      <CreateQuestionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        refresh={load}
      />
    </div>
  );
}