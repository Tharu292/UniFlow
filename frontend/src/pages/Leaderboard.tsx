import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import api from "../api";

export default function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get("/user/leaderboard").then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <Trophy size={28} className="text-amber-500" /> Leaderboard
      </h1>

      <div className="bg-white shadow-md rounded-xl border divide-y">
        {users.map((u, i) => (
          <div key={i} className={`flex items-center justify-between p-4 hover:bg-gray-50 transition ${i === 0 ? "bg-yellow-50" : i === 1 ? "bg-gray-100" : i === 2 ? "bg-orange-50" : ""}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${i === 0 ? "bg-yellow-400 text-white" : i === 1 ? "bg-gray-400 text-white" : i === 2 ? "bg-orange-400 text-white" : "bg-blue-100 text-blue-600"}`}>
                {i + 1}
              </div>
              <div>
                <p className="font-medium text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500">{u.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-600">{u.points}</p>
              <p className="text-xs text-gray-400">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}