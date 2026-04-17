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

interface User {
  firstName?: string;
  lastName?: string;
  faculty?: string;
  semester?: string;
  year?: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  expiryDate: string;
  priority: 'High' | 'Medium' | 'Low';
  views: number;
  targetAudience?: string;
}

const StudentNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // ✅ Reset notification count
  useEffect(() => {
    localStorage.setItem("lastNotifCheck", Date.now().toString());
  }, []);

  // ✅ Load user + fetch notifications
  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
        fetchNotifications(parsedUser);
      } catch (err) {
        console.error('Invalid user data');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async (userData: User) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/notifications/student`, {
        params: {
          faculty: userData.faculty || '',
          semester: userData.semester || '',
          year: userData.year || ''
        }
      });

      if (response?.data?.success) {
        setNotifications(response.data.data || []);
      } else {
        setNotifications([]);
      }

    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;

    const today = new Date();
    const expiry = new Date(expiryDate);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 3 && diffDays >= 0;
  };

  const getDaysRemaining = (expiryDate?: string) => {
    if (!expiryDate) return 'No expiry';

    const today = new Date();
    const expiry = new Date(expiryDate);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays < 0) return 'Expired';

    return `${diffDays} days remaining`;
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    const aExpiring = isExpiringSoon(a.expiryDate);
    const bExpiring = isExpiringSoon(b.expiryDate);

    if (aExpiring && !bExpiring) return -1;
    if (!aExpiring && bExpiring) return 1;

    const priorityOrder = { High: 3, Medium: 2, Low: 1 };

    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="text-4xl text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/student/dashboard">
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        {/* Notifications */}
        {sortedNotifications.length === 0 ? (
          <p className="text-center text-gray-500">
            No notifications available
          </p>
        ) : (
          sortedNotifications.map((notif: Notification) => {
            const expiringSoon = isExpiringSoon(notif.expiryDate);

            return (
              <div key={notif._id} className="bg-white p-4 mb-4 rounded shadow">
                <h3 className="font-bold">{notif.title}</h3>
                <p>{notif.message}</p>
                <p className="text-sm text-gray-500">
                  {getDaysRemaining(notif.expiryDate)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;