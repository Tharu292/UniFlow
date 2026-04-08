// frontend/src/components/Header.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, User, Search, LayoutDashboard, BookOpen, Users, FolderOpen, Trophy, MessageSquare } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const API_URL = 'http://localhost:5000/api';

export default function Header() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications for BOTH admin and student
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/notifications/student`, {
        params: {
          faculty: user.faculty || '',
          semester: user.semester || '',
          year: user.year || ''
        }
      });

      if (response.data.success) {
        const fetchedNotifs = response.data.data || [];
        setNotifications(fetchedNotifs);

        const lastViewed = localStorage.getItem('lastNotifViewed');
        const hasNew = lastViewed 
          ? fetchedNotifs.some((n: any) => new Date(n.createdAt) > new Date(lastViewed))
          : fetchedNotifs.length > 0;

        setUnreadCount(hasNew ? fetchedNotifs.length : 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAsViewed = () => {
    localStorage.setItem('lastNotifViewed', new Date().toISOString());
    setUnreadCount(0);
  };

  const handleBellClick = () => {
    setNotifOpen(!notifOpen);
    setOpen(false);
    if (!notifOpen && unreadCount > 0) markAsViewed();
  };

  const goToNotificationsPage = () => {
    markAsViewed();
    setNotifOpen(false);
    navigate(user?.role === "admin" ? "/admin/notifications" : "/student/notifications");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("lastNotifViewed");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    setOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="UniFlow Logo" className="w-25 h-16 object-contain" />
        </Link>

        {/* Dynamic Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-black font-medium">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="hover:text-[#006591] transition flex items-center gap-1">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/admin/users" className="hover:text-[#006591] transition flex items-center gap-1">
                <Users size={18} /> Users
              </Link>
              <Link to="/admin/resources" className="hover:text-[#006591] transition flex items-center gap-1">
                <FolderOpen size={18} /> Resources
              </Link>
              <Link to="/forum" className="hover:text-[#006591] transition flex items-center gap-1">
                <MessageSquare size={18} /> Forum
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-[#006591] transition">Dashboard</Link>
              <Link to="/resources" className="hover:text-[#006591] transition">Resources</Link>
              <Link to="/forum" className="hover:text-[#006591] transition">Forum</Link>
              <Link to="/leaderboard" className="hover:text-[#006591] transition">Leaderboard</Link>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search Bar - Removed as per your request */}
          {/* <div className="flex items-center ..."> ... </div> */}

          {user ? (
            <>
              {/* Notification Bell - Shown for BOTH admin and student */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleBellClick}
                  className="p-2.5 text-gray-700 hover:text-[#006591] hover:bg-gray-100 rounded-full transition-all"
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-2xl border border-gray-200 py-2 z-50 max-h-[420px] overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b bg-gray-50 rounded-t-2xl">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {loading ? (
                        <div className="py-12 text-center">
                          <FaSpinner className="animate-spin mx-auto text-indigo-600 text-2xl" />
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">No notifications at this time</div>
                      ) : (
                        notifications.slice(0, 5).map((notif: any) => (
                          <div
                            key={notif._id}
                            className="px-4 py-3.5 hover:bg-gray-50 border-b last:border-none cursor-pointer"
                            onClick={goToNotificationsPage}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${notif.priority === 'High' ? 'bg-red-100' : 'bg-indigo-100'}`}>
                                <Bell className={`text-lg ${notif.priority === 'High' ? 'text-red-600' : 'text-indigo-600'}`} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900 line-clamp-1">{notif.title}</p>
                                <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{notif.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t p-3">
                      <button
                        onClick={goToNotificationsPage}
                        className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium py-2"
                      >
                        View all notifications →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Icon */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setOpen(!open);
                    setNotifOpen(false);
                  }}
                  className="p-2.5 text-gray-700 hover:text-[#006591] hover:bg-gray-100 rounded-full transition-all"
                >
                  <User size={24} />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-52 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => navigate("/profile")}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-[#006591] font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition">
                Login
              </Link>
              <Link to="/register" className="text-sm bg-[#006591] text-white px-5 py-2 rounded-full hover:bg-[#00507a] transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}