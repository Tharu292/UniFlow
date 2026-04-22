import React, { useState, useEffect } from 'react';
import { 
  FaEdit, 
  FaTrashAlt, 
  FaBan,
  FaSearch,
  FaFilter,
  FaEye,
  FaEnvelope,
  FaUserCircle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSpinner,
  FaCheck,
  FaUserGraduate,
  FaUserShield
} from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    admin: 0,
    student: 0,
  });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/users`, {
        params: {
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          page: currentPage,
          limit: itemsPerPage,
        }
      });

      if (response.data.success) {
        setUsers(response.data.data);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 404) {
        console.log('Admin users route not found. Make sure backend has /api/admin/users endpoint');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await axios.patch(`${API_URL}/admin/users/${userId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        fetchUsers();
        fetchStats();
        alert(`User status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`${API_URL}/admin/users/${userId}`);
        if (response.data.success) {
          fetchUsers();
          fetchStats();
          alert('User deleted successfully');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    }
  };

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData);
      if (response.data.success) {
        fetchUsers();
        setShowEditModal(false);
        setSelectedUser(null);
        alert('User updated successfully');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return (
          <span
            data-testid="user-status-active"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
          >
            <FaCheckCircle className="text-xs" /> active
          </span>
        );
      case 'pending':
        return (
          <span
            data-testid="user-status-pending"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700"
          >
            <FaClock className="text-xs" /> pending
          </span>
        );
      case 'inactive':
        return (
          <span
            data-testid="user-status-inactive"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
          >
            <FaTimesCircle className="text-xs" /> inactive
          </span>
        );
      default:
        return null;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        data-testid="user-management-loading"
      >
        <div className="text-center">
          <FaSpinner className="text-4xl text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="user-management-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900"
            data-testid="user-management-title"
          >
            User Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and monitor all platform users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm" data-testid="stats-total-users">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FaUserCircle className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm" data-testid="stats-active-users">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Users</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm" data-testid="stats-pending-users">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm" data-testid="stats-student-users">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Students</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.student}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaUserGraduate className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm" data-testid="stats-admin-users">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Admins</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.admin}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FaUserShield className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6" data-testid="user-filters-section">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  data-testid="user-search-input"
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <select
              data-testid="user-status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8" data-testid="users-table-wrapper">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" data-testid="users-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200" data-testid="users-table-body">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                      data-testid={`user-row-${user._id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-700 font-semibold text-sm">
                              {getInitials(user.firstName, user.lastName)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900" data-testid={`user-name-${user._id}`}>
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{user.email?.split('@')[0]}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 text-sm" />
                          <a
                            href={`mailto:${user.email}`}
                            className="text-sm text-gray-600 hover:text-indigo-600"
                            data-testid={`user-email-${user._id}`}
                          >
                            {user.email}
                          </a>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          data-testid={`user-role-${user._id}`}
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap" data-testid={`user-status-cell-${user._id}`}>
                        {getStatusBadge(user.status)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.points || 0}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-3">
                          <button 
                            data-testid={`view-user-${user._id}`}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowViewModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>

                          <button 
                            data-testid={`edit-user-${user._id}`}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit User"
                          >
                            <FaEdit />
                          </button>

                          {user.status === 'active' ? (
                            <button 
                              data-testid={`deactivate-user-${user._id}`}
                              onClick={() => handleUpdateStatus(user._id, 'inactive')}
                              className="text-orange-600 hover:text-orange-800 transition-colors"
                              title="Deactivate User"
                            >
                              <FaBan />
                            </button>
                          ) : (
                            <button 
                              data-testid={`activate-user-${user._id}`}
                              onClick={() => handleUpdateStatus(user._id, 'active')}
                              className="text-green-600 hover:text-green-800 transition-colors"
                              title="Activate User"
                            >
                              <FaCheck />
                            </button>
                          )}

                          <button 
                            data-testid={`delete-user-${user._id}`}
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete User"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr data-testid="no-users-row">
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          ©️ 2024 UniFlow Admin Portal. All rights reserved.
        </div>
      </div>

      {showViewModal && selectedUser && (
        <ViewUserModal user={selectedUser} onClose={() => setShowViewModal(false)} />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal 
          user={selectedUser} 
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

const ViewUserModal = ({ user, onClose }: any) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      data-testid="view-user-modal"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimesCircle />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-700 font-bold text-2xl">
                {`${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-500">{user.email}</p>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="font-medium">{user.contactNumber || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Points</p>
              <p className="font-medium">{user.points || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Faculty</p>
              <p className="font-medium">{user.faculty || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Semester/Year</p>
              <p className="font-medium">{user.semester ? `Semester ${user.semester}` : 'N/A'} {user.year ? `- Year ${user.year}` : ''}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{user.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified</p>
              <p className="font-medium">{user.verified ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ user, onClose, onUpdate }: any) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    contactNumber: user.contactNumber || '',
    address: user.address || '',
    faculty: user.faculty || '',
    semester: user.semester || '',
    year: user.year || '',
    role: user.role || 'student',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(user._id, formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      data-testid="edit-user-modal"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimesCircle />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
            <select
              value={formData.faculty}
              onChange={(e) => setFormData({...formData, faculty: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Faculty</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;