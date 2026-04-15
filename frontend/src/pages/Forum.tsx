import { MessageSquare } from "lucide-react";
import PostQuestion from "../components/PostQuestion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Forum() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

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
                Ask questions and contribute to the community
              </p>
            </div>
          </div>
        </div>

        {/* Only students can post */}
        {!isAdmin && <PostQuestion />}

      </div>
    </div>
  );
}