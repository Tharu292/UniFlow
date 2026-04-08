// frontend/src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBookOpen, 
  FaBell,
  FaSignOutAlt,
  FaUserFriends,
  FaGraduationCap,
  FaComments,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaArrowUp,
  FaDatabase,
  FaArrowDown
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBgColor: string;
  iconTextColor: string;
  trends?: Array<{ value: string; positive: boolean }>;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, iconBgColor, iconTextColor, trends }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${iconBgColor} p-3 rounded-xl`}>
        <Icon className={`${iconTextColor} text-xl`} />
      </div>
    </div>
    {trends && trends.length > 0 && (
      <div className="flex items-center gap-3 mt-3 text-sm">
        {trends.map((trend, idx) => (
          <span key={idx} className={trend.positive ? 'text-green-600' : 'text-red-600'}>
            {trend.positive ? <FaArrowUp className="inline mr-1 text-xs" /> : <FaArrowDown className="inline mr-1 text-xs" />}
            {trend.value}
          </span>
        ))}
      </div>
    )}
  </div>
);

const AdminDashboardContent: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    totalResources: 0,
    forumPosts: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, resourcesRes, questionsRes] = await Promise.all([
          api.get('/user/all'),
          api.get('/resources'),
          api.get('/questions')
        ]);

        const allUsers = usersRes.data || [];
        const students = allUsers.filter((u: any) => u.role === 'student');

        setStats({
          totalUsers: allUsers.length,
          activeStudents: students.length,
          totalResources: resourcesRes.data?.length || 0,
          forumPosts: questionsRes.data?.length || 0,
        });

        // Recent users (last 5)
        setRecentUsers(allUsers.slice(0, 5));

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 lg:px-8 py-8 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="mb-1">
        {/*<div className="flex items-center gap-4">
          <img src="/logo.png" alt="UniFlow" className="h-10 w-auto" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of platform activity</p>
          </div>
        </div>*/}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={FaUserFriends}
          iconBgColor="bg-indigo-50" 
          iconTextColor="text-indigo-600"
        />
        <StatsCard 
          title="Active Students" 
          value={stats.activeStudents} 
          icon={FaGraduationCap}
          iconBgColor="bg-green-50" 
          iconTextColor="text-green-600"
        />
        <StatsCard 
          title="Total Resources" 
          value={stats.totalResources} 
          icon={FaBookOpen}
          iconBgColor="bg-yellow-50" 
          iconTextColor="text-yellow-600"
        />
        <StatsCard 
          title="Forum Questions" 
          value={stats.forumPosts} 
          icon={FaComments}
          iconBgColor="bg-blue-50" 
          iconTextColor="text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Recent Users Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FaUserFriends className="text-indigo-600" /> Recent Users
            </h3>
            <button 
              onClick={() => navigate('/admin/users')}
              className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
            >
              View all →
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentUsers.length > 0 ? (
              recentUsers.map((u, idx) => (
                <li key={idx} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <FaEnvelope className="text-gray-400" />
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center text-gray-500">No recent users</li>
            )}
          </ul>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FaBell className="text-yellow-600" /> System Alerts
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { icon: FaDatabase, color: "text-indigo-600", title: "Server storage at 78%", subtitle: "Monitor capacity" },
              { icon: FaCheckCircle, color: "text-green-600", title: "Backup completed successfully", subtitle: "Last night" },
              { icon: FaExclamationTriangle, color: "text-yellow-600", title: "3 pending user notifications", subtitle: "Review required" }
            ].map((alert, idx) => (
              <div key={idx} className="px-6 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <alert.icon className={`${alert.color} mt-0.5 text-xl`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">{alert.title}</p>
                  <p className="text-xs text-gray-400">{alert.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button 
          onClick={() => navigate('/admin/users')}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-indigo-300 group text-left"
        >
          <FaUsers className="text-4xl text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800">Manage Users</h3>
          <p className="text-sm text-gray-500 mt-1">View and manage all platform users</p>
        </button>

        <button 
          onClick={() => navigate('/admin/notifications')}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-indigo-300 group text-left"
        >
          <FaBell className="text-4xl text-yellow-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <p className="text-sm text-gray-500 mt-1">Create and manage system notifications</p>
        </button>

        <button 
          onClick={() => navigate('/admin/resources')}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-indigo-300 group text-left"
        >
          <FaBookOpen className="text-4xl text-green-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800">Resources</h3>
          <p className="text-sm text-gray-500 mt-1">Manage study materials and links</p>
        </button>
      </div>

      <div className="mt-12 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} UniFlow Admin Portal. All rights reserved.
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin Header with Logo */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="UniFlow" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Admin</h1>
              <p className="text-xs text-gray-500 -mt-1">Management Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaBell className="text-gray-600 text-xl" />
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-[73px] z-10">
        <div className="px-6 lg:px-8 flex space-x-8">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="py-4 text-sm font-semibold border-b-2 border-indigo-600 text-indigo-700 flex items-center gap-2"
          >
            <FaTachometerAlt /> Dashboard
          </button>
          <button 
            onClick={() => navigate('/admin/users')}
            className="py-4 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
          >
            <FaUsers /> Users
          </button>
          <button 
            onClick={() => navigate('/admin/notifications')}
            className="py-4 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
          >
            <FaBell /> Notifications
          </button>
          <button 
            onClick={() => navigate('/admin/resources')}
            className="py-4 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
          >
            <FaBookOpen /> Resources
          </button>
        </div>
      </div>

      <AdminDashboardContent />
    </div>
  );
};

export default AdminDashboard;