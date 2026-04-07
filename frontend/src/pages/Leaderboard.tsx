import { useEffect, useState } from "react";
import api from "../Utils/axiosConfig";

export default function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get("/users/leaderboard").then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Heading */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🏆 Leaderboard
      </h1>

      {/* List */}
      <div className="bg-white shadow-md rounded-xl border divide-y">

        {users.map((u, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-4 hover:bg-gray-50 transition
            ${i === 0 ? "bg-yellow-50" : ""}
            ${i === 1 ? "bg-gray-100" : ""}
            ${i === 2 ? "bg-orange-50" : ""}`}
          >

            {/* LEFT: Rank + Name */}
            <div className="flex items-center gap-4">

              {/* Rank Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold
                ${
                  i === 0
                    ? "bg-yellow-400 text-white"
                    : i === 1
                    ? "bg-gray-400 text-white"
                    : i === 2
                    ? "bg-orange-400 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {i + 1}
              </div>

              {/* Name */}
              <div>
                <p className="font-medium text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500">{u.rank}</p>
              </div>
            </div>

            {/* RIGHT: Points */}
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-600">
                {u.points}
              </p>
              <p className="text-xs text-gray-400">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}