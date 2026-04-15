// frontend/src/pages/AdminDashboard/NotificationManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaEye, 
  FaTrashAlt, 
  FaEdit,
  FaPlus,
  FaUsers,
  FaCalendarAlt,
  FaFlag,
  FaTimes,
  FaSearch,
  FaSpinner,
  FaUniversity,
  FaGraduationCap
} from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    highPriority: 0,
    totalViews: 0
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/notifications`);
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/notifications/stats`);
        if (response.data.success) {
          const data = response.data.data;
          setStats({
            total: data.total,
            active: data.active,
            highPriority: data.highPriority,
            totalViews: data.totalViews
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, [notifications]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    const matchesAudience = audienceFilter === 'all' || notification.targetAudience === audienceFilter;
    return matchesSearch && matchesPriority && matchesStatus && matchesAudience;
  });

  const handleCreateNotification = async (notificationData: any) => {
    try {
      const response = await axios.post(`${API_URL}/notifications`, notificationData);
      if (response.data.success) {
        await fetchNotifications();
        setShowCreateModal(false);
      }
    } catch (err: any) {
      console.error('Error creating notification:', err);
      alert(err.response?.data?.message || 'Failed to create notification');
    }
  };

  const handleUpdateNotification = async (id: string, notificationData: any) => {
    try {
      const response = await axios.put(`${API_URL}/notifications/${id}`, notificationData);
      if (response.data.success) {
        await fetchNotifications();
        setEditingNotification(null);
      }
    } catch (err: any) {
      console.error('Error updating notification:', err);
      alert(err.response?.data?.message || 'Failed to update notification');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        const response = await axios.delete(`${API_URL}/notifications/${id}`);
        if (response.data.success) {
          await fetchNotifications();
        }
      } catch (err: any) {
        console.error('Error deleting notification:', err);
        alert(err.response?.data?.message || 'Failed to delete notification');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notification Management</h1>
          <p className="text-gray-600 mt-1">Create and manage student notifications with semester/year filtering</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Notifications</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <FaBell className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">High Priority</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.highPriority}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Views</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <FaEye className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <FaPlus />
            Create Notification
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Audiences</option>
              <option value="All Students">All Students</option>
              <option value="By Faculty">By Faculty</option>
              <option value="By Semester">By Semester</option>
              <option value="By Year">By Year</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onDelete={handleDeleteNotification}
                onEdit={() => setEditingNotification(notification)}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                <FaPlus />
                Create your first notification
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {(showCreateModal || editingNotification) && (
        <NotificationForm
          notification={editingNotification}
          onSubmit={(data: any) => {
            if (editingNotification) {
              handleUpdateNotification(editingNotification._id, data);
            } else {
              handleCreateNotification(data);
            }
          }}
          onCancel={() => {
            setShowCreateModal(false);
            setEditingNotification(null);
          }}
        />
      )}
    </div>
  );
};

// Notification Card Component
const NotificationCard = ({ notification, onDelete, onEdit }: any) => {
  const [expanded, setExpanded] = useState(false);
  
  const priorityColors: any = {
    High: { bg: 'bg-red-50', text: 'text-red-600' },
    Medium: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    Low: { bg: 'bg-green-50', text: 'text-green-600' }
  };

  const priorityStyle = priorityColors[notification.priority];

  const getTargetDisplay = () => {
    switch (notification.targetAudience) {
      case 'By Faculty':
        return `${notification.targetAudience}: ${notification.targetFaculty}`;
      case 'By Semester':
        return `${notification.targetAudience}: ${notification.targetSemester}`;
      case 'By Year':
        return `${notification.targetAudience}: Year ${notification.targetYear}`;
      default:
        return notification.targetAudience;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
              <FaFlag className="text-xs" />
              {notification.priority}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              notification.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {notification.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <FaUsers className="text-xs" />
              {getTargetDisplay()}
            </span>
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="text-xs" />
              Expires: {new Date(notification.expiryDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <FaEye className="text-xs" />
              {notification.views} views
            </span>
          </div>
          <p className={`text-gray-700 ${!expanded && 'line-clamp-2'}`}>
            {notification.message}
          </p>
          {notification.message.length > 100 && (
            <button onClick={() => setExpanded(!expanded)} className="mt-2 text-sm text-indigo-600">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={onEdit} className="p-2 text-gray-400 hover:text-indigo-600">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(notification._id)} className="p-2 text-gray-400 hover:text-red-600">
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Form Component with Semester & Year
const NotificationForm = ({ notification, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    title: notification?.title || '',
    message: notification?.message || '',
    priority: notification?.priority || 'Medium',
    targetAudience: notification?.targetAudience || 'All Students',
    targetFaculty: notification?.targetFaculty || '',
    targetSemester: notification?.targetSemester || '',
    targetYear: notification?.targetYear || '',
    expiryDate: notification?.expiryDate ? new Date(notification.expiryDate).toISOString().split('T')[0] : ''
  });
  const [errors, setErrors] = useState<any>({});

  const validateField = (name: string, value: string) => {
    switch(name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length < 5) return 'Title must be at least 5 characters';
        if (value.length > 100) return 'Title must be less than 100 characters';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.length < 20) return 'Message must be at least 20 characters';
        if (value.length > 500) return 'Message must be less than 500 characters';
        return '';
      case 'expiryDate':
        if (!value) return 'Expiry date is required';
        const today = new Date().toISOString().split('T')[0];
        if (value < today) return 'Expiry date must be today or in the future';
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {
      title: validateField('title', formData.title),
      message: validateField('message', formData.message),
      expiryDate: validateField('expiryDate', formData.expiryDate)
    };
    
    setErrors(newErrors);
    
    if (!Object.values(newErrors).some(error => error !== '')) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{notification ? 'Edit Notification' : 'Create Notification'}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience *</label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                <option value="All Students">All Students</option>
                <option value="By Faculty">By Faculty</option>
                <option value="By Semester">By Semester</option>
                <option value="By Year">By Year</option>
              </select>
            </div>
          </div>

          {/* Conditional Fields based on Target Audience */}
          {formData.targetAudience === "By Faculty" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUniversity className="inline mr-2" /> Select Faculty *
              </label>
              <select
                name="targetFaculty"
                value={formData.targetFaculty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Faculty</option>
                <option value="Computing">Faculty of Computing</option>
                <option value="Business">Faculty of Business</option>
                <option value="Engineering">Faculty of Engineering</option>
              </select>
            </div>
          )}

          {formData.targetAudience === "By Semester" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaGraduationCap className="inline mr-2" /> Select Semester *
              </label>
              <select
                name="targetSemester"
                value={formData.targetSemester}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
          )}

          {formData.targetAudience === "By Year" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaGraduationCap className="inline mr-2" /> Select Year *
              </label>
              <select
                name="targetYear"
                value={formData.targetYear}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            />
            {errors.expiryDate && <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border rounded-lg">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg">
              {notification ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationManagement;
