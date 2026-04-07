// frontend/src/pages/StudentNotifications.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaBell, 
  FaFlag, 
  FaEye, 
  FaCalendarAlt,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaUniversity,
  FaGraduationCap
} from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
  // Reset notification count in header when user visits full notifications page
  const resetHeaderCount = () => {
    // You can use a global state later (Context/Redux), but for now this works
    localStorage.setItem("lastNotifCheck", Date.now().toString());
  };
  resetHeaderCount();
}, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchNotifications(parsedUser);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get student-specific notifications based on faculty, semester, year
      const response = await axios.get(`${API_URL}/notifications/student`, {
        params: {
          faculty: userData.faculty || '',
          semester: userData.semester || '',
          year: userData.year || ''
        }
      });
      
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays < 0) return 'Expired';
    return `${diffDays} days remaining`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    const aExpiring = isExpiringSoon(a.expiryDate);
    const bExpiring = isExpiringSoon(b.expiryDate);
    
    if (aExpiring && !bExpiring) return -1;
    if (!aExpiring && bExpiring) return 1;
    
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/student/dashboard" className="text-indigo-600 hover:text-indigo-700">
            <FaArrowLeft className="text-xl" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <p className="text-gray-500 mt-1">Stay updated with important announcements</p>
          </div>
        </div>

        {/* Student Info Card */}
        {user && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 mb-6 border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Showing notifications for:</p>
                <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                <div className="flex flex-wrap gap-3 mt-1">
                  {user.faculty && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FaUniversity className="text-xs" /> {user.faculty}
                    </span>
                  )}
                  {user.semester && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FaGraduationCap className="text-xs" /> {user.semester}
                    </span>
                  )}
                  {user.year && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FaCalendarAlt className="text-xs" /> Year {user.year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {sortedNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications for you at this time</p>
            <p className="text-sm text-gray-400 mt-2">Check back later for updates</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedNotifications.map((notif) => {
              const expiringSoon = isExpiringSoon(notif.expiryDate);
              
              return (
                <div 
                  key={notif._id} 
                  className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                    expiringSoon 
                      ? 'border-orange-300 bg-orange-50/30 shadow-md' 
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-full ${
                      expiringSoon ? 'bg-orange-100' : 
                      notif.priority === 'High' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {expiringSoon ? (
                        <FaExclamationTriangle className="text-orange-500" />
                      ) : (
                        <FaBell className={notif.priority === 'High' ? 'text-red-500' : 'text-gray-500'} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className={`font-semibold ${expiringSoon ? 'text-orange-800' : 'text-gray-800'}`}>
                          {notif.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notif.priority)}`}>
                          <FaFlag className="inline mr-1 text-xs" /> {notif.priority}
                        </span>
                        {expiringSoon && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                            <FaClock className="inline mr-1 text-xs" /> Expiring Soon
                          </span>
                        )}
                      </div>
                      
                      <p className={`mb-3 ${expiringSoon ? 'text-orange-700' : 'text-gray-700'}`}>
                        {notif.message}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-xs">
                        <span className={`flex items-center gap-1 ${expiringSoon ? 'text-orange-500' : 'text-gray-500'}`}>
                          <FaCalendarAlt className="text-xs" />
                          {getDaysRemaining(notif.expiryDate)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <FaEye className="text-xs" />
                          {notif.views} views
                        </span>
                        {notif.targetAudience !== 'All Students' && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <FaCheckCircle className="text-xs" />
                            Targeted: {notif.targetAudience}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;