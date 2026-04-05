import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  // Prevent unnecessary re-renders (FIX BLINK ISSUE)
  const safeUser = useMemo(() => user, [user]);

  if (!safeUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 text-sm">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-6">

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Welcome back, {safeUser.firstName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening with your academics today.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to="/profile"
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Profile
          </Link>

          <button className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow">
            New Activity
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Assignments</p>
          <h2 className="text-2xl font-semibold mt-2 text-gray-800">12</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Pending Tasks</p>
          <h2 className="text-2xl font-semibold mt-2 text-yellow-600">5</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-2xl font-semibold mt-2 text-green-600">7</h2>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border flex flex-col justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Profile
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Name:</span>{" "}
                {safeUser.firstName} {safeUser.lastName}
              </p>

              <p>
                <span className="font-medium text-gray-800">Email:</span>{" "}
                {safeUser.email}
              </p>

              <p>
                <span className="font-medium text-gray-800">Faculty:</span>{" "}
                {safeUser.faculty || "-"}
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/profile"
            className="mt-6 block text-center py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            Manage Profile →
          </Link>
        </div>

        {/* ACTIVITY TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activities
            </h2>
            <button className="text-sm text-indigo-600 hover:underline">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">

              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2">Title</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">

                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-3">Math 101 - Midterm</td>
                  <td>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </td>
                  <td>2026-03-15</td>
                </tr>

                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-3">
                    Programming Fundamentals - Assignment 2
                  </td>
                  <td>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Submitted
                    </span>
                  </td>
                  <td>2026-03-10</td>
                </tr>

                <tr className="hover:bg-gray-50 transition">
                  <td className="py-3">Physics 101 - Lab Report</td>
                  <td>
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                      Pending
                    </span>
                  </td>
                  <td>2026-03-20</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;