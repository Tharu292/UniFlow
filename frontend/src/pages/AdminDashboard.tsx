import React, { useState, useEffect } from 'react';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBookOpen, 
  FaBell,
  FaDatabase,
  FaSignOutAlt,
  FaUserFriends,
  FaGraduationCap,
  FaComments,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api';   // Make sure this points to your axios instance with token

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
        // Fetch all needed stats in parallel
        const [usersRes, studentsRes, resourcesRes, questionsRes, recentRes] = await Promise.all([
          api.get('/user/all'),                    // or your admin users endpoint
          api.get('/user/all'),                    // we'll filter students client-side for simplicity
          api.get('/resources'),                   // adjust if your resources route is different
          api.get('/questions'),
          api.get('/user/all')                     // recent users (limit 5)
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
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="flex-1 px-6 lg:px-8 py-8 max-w-[1600px] mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, Admin! 👋</h2>
        <p className="text-gray-500 mt-1">Here's what's happening today across the platform.</p>
      </div>

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              <FaUserFriends className="inline mr-2 text-indigo-600" /> Recent Users
            </h3>
            <button 
              onClick={() => navigate('/admin/users')}
              className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full hover:bg-indigo-100 transition-colors"
            >
              View all →
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentUsers.length > 0 ? (
              recentUsers.map((u, idx) => (
                <li key={idx} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div>
                    <span className="font-medium text-gray-800">
                      {u.firstName} {u.lastName}
                    </span>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </div>
                  <FaEnvelope className="text-gray-300 text-sm" />
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center text-gray-500">No users found</li>
            )}
          </ul>
        </div>

        {/* System Alerts Card - Kept as static for now */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">
              <FaBell className="inline mr-2 text-yellow-600" /> System Alerts
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { icon: FaDatabase, color: "text-indigo-600", title: "Server storage at 78%", subtitle: "Monitor capacity" },
              { icon: FaCheckCircle, color: "text-green-600", title: "Backup completed", subtitle: "Last night" },
              { icon: FaExclamationTriangle, color: "text-yellow-600", title: "Pending notifications", subtitle: "3 alerts" }
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <button 
          onClick={() => navigate('/admin/users')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-indigo-300 group"
        >
          <FaUsers className="text-3xl text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800 text-center">Manage Users</h3>
          <p className="text-sm text-gray-500 text-center mt-1">View and manage all platform users</p>
        </button>

        <button 
          onClick={() => navigate('/admin/notifications')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-indigo-300 group"
        >
          <FaBell className="text-3xl text-yellow-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800 text-center">Notifications</h3>
          <p className="text-sm text-gray-500 text-center mt-1">Create and manage notifications</p>
        </button>

        <button 
          onClick={() => navigate('/admin/resources')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-indigo-300 group"
        >
          <FaBookOpen className="text-3xl text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800 text-center">Resources</h3>
          <p className="text-sm text-gray-500 text-center mt-1">Manage study materials</p>
        </button>
      </div>

      <div className="mt-10 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">UF</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">UniFlow<span className="text-indigo-600"> Admin</span></h1>
          </div>
          <div className="flex items-center space-x-5">
            <button 
              onClick={() => navigate('/admin/notifications')}
              className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <FaBell className="text-gray-500 text-lg hover:text-indigo-600 transition-colors" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-semibold shadow-sm">
                AD
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-[73px] z-10">
        <div className="px-6 lg:px-8 flex space-x-8">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="py-3 text-sm font-semibold border-b-2 border-indigo-600 text-indigo-700 flex items-center gap-2"
          >
            <FaTachometerAlt /> Dashboard
          </button>
          <button 
            onClick={() => navigate('/admin/users')}
            className="py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
          >
            <FaUsers /> Users
          </button>
          <button 
            onClick={() => navigate('/admin/notifications')}
            className="py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
          >
            <FaBell /> Notifications
          </button>
          <button 
            onClick={() => navigate('/admin/resources')}
            className="py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-2"
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