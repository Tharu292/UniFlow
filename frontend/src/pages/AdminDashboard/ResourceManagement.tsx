// frontend/src/pages/ResourceManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  FaFilePdf, 
  FaVideo, 
  FaImage, 
  FaLink, 
  FaDownload, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaUpload,
  FaFileExport,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaBook,
  FaGraduationCap,
  FaSpinner,
  FaUniversity,
  FaCalendarAlt,
  FaTag,
  FaUsers,
  FaUserGraduate
} from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Image' | 'Link';
  url: string;
  fileSize?: string;
  subject: string;
  uploadedBy: string;
  downloads: number;
  status: 'pending' | 'approved' | 'rejected';
  tags: string[];
  targetAudience: 'All Students' | 'By Faculty' | 'By Semester' | 'By Year';
  targetFaculty?: string;
  targetSemester?: string;
  targetYear?: string;
  createdAt: string;
}

const ResourceManagement = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [targetAudienceFilter, setTargetAudienceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalDownloads: 0,
  });
  
  const itemsPerPage = 10;

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/resources/admin`, {
        params: {
          search: searchTerm,
          type: typeFilter,
          status: statusFilter,
          targetAudience: targetAudienceFilter,
          page: currentPage,
          limit: itemsPerPage,
        }
      });
      if (response.data.success) {
        setResources(response.data.data);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [searchTerm, typeFilter, statusFilter, targetAudienceFilter, currentPage]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await axios.patch(`${API_URL}/resources/${id}/status`, { status });
      if (response.data.success) {
        fetchResources();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await axios.delete(`${API_URL}/resources/${id}`);
        if (response.data.success) {
          fetchResources();
        }
      } catch (err) {
        console.error('Error deleting resource:', err);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <FaCheckCircle className="text-xs" /> Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
            <FaClock className="text-xs" /> Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
            <FaTimesCircle className="text-xs" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getTargetAudienceBadge = (resource: Resource) => {
    switch(resource.targetAudience) {
      case 'All Students':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700"><FaUsers className="text-xs" /> All Students</span>;
      case 'By Faculty':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700"><FaUniversity className="text-xs" /> {resource.targetFaculty}</span>;
      case 'By Semester':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700"><FaCalendarAlt className="text-xs" /> {resource.targetSemester}</span>;
      case 'By Year':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700"><FaUserGraduate className="text-xs" /> Year {resource.targetYear}</span>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: any = {
      PDF: { icon: FaFilePdf, color: "text-red-600", bgColor: "bg-red-50" },
      Video: { icon: FaVideo, color: "text-blue-600", bgColor: "bg-blue-50" },
      Image: { icon: FaImage, color: "text-green-600", bgColor: "bg-green-50" },
      Link: { icon: FaLink, color: "text-purple-600", bgColor: "bg-purple-50" }
    };
    const { icon: Icon, color, bgColor } = icons[type] || icons.PDF;
    return (
      <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
        <Icon className={`${color} text-lg`} />
      </div>
    );
  };

  const clearFilters = () => {
    setTargetAudienceFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600 mt-1">Manage and moderate study materials</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Resources</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <FaBook className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <FaTimesCircle className="text-red-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Downloads</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalDownloads.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <FaDownload className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <FaFileExport className="text-gray-500" />
            Export Data
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaUpload />
            Upload Resource
          </button>
          <button 
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <FaFilter />
            Clear Filters
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, subject..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <select
              value={targetAudienceFilter}
              onChange={(e) => {
                setTargetAudienceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Target Audiences</option>
              <option value="All Students">All Students</option>
              <option value="By Faculty">By Faculty</option>
              <option value="By Semester">By Semester</option>
              <option value="By Year">By Year</option>
            </select>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              {['all', 'PDF', 'Video', 'Image', 'Link'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setTypeFilter(type);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    typeFilter === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Audience</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(resource.type)}
                        <div>
                          <p className="font-medium text-gray-900">{resource.title}</p>
                          <p className="text-xs text-gray-500">{resource.subject}</p>
                          <p className="text-xs text-gray-400 mt-1">by {resource.uploadedBy}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getTargetAudienceBadge(resource)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <FaDownload className="text-gray-400 text-xs" />
                        <span className="text-sm text-gray-700">{resource.downloads}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(resource.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <FaEye className="text-sm" />
                        </a>
                        {resource.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(resource._id, 'approved')}
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                              title="Approve"
                            >
                              <FaThumbsUp className="text-sm" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(resource._id, 'rejected')}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Reject"
                            >
                              <FaThumbsDown className="text-sm" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDeleteResource(resource._id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <FaTrashAlt className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {resources.length === 0 && (
            <div className="text-center py-12">
              <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No resources found</p>
              <button 
                onClick={clearFilters}
                className="mt-4 text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          © 2024 UniFlow Admin Portal. All rights reserved.
        </div>
      </div>

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <UploadResourceModal onClose={() => setShowUploadModal(false)} onUpload={fetchResources} />
      )}
    </div>
  );
};

// Upload Resource Modal Component with Target Audience
const UploadResourceModal = ({ onClose, onUpload }: any) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF',
    url: '',
    fileSize: '',
    subject: '',
    uploadedBy: 'Admin',
    tags: '',
    targetAudience: 'All Students',
    targetFaculty: '',
    targetSemester: '',
    targetYear: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.url || !formData.subject) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate conditional fields
    if (formData.targetAudience === 'By Faculty' && !formData.targetFaculty) {
      alert('Please select a faculty for this resource');
      return;
    }
    if (formData.targetAudience === 'By Semester' && !formData.targetSemester) {
      alert('Please select a semester for this resource');
      return;
    }
    if (formData.targetAudience === 'By Year' && !formData.targetYear) {
      alert('Please select a year for this resource');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/resources`, {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      });
      
      if (response.data.success) {
        alert('Resource uploaded successfully!');
        onUpload();
        onClose();
      } else {
        alert('Failed to upload resource');
      }
    } catch (err: any) {
      console.error('Error uploading resource:', err);
      alert(err.response?.data?.message || 'Failed to upload resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaUpload className="text-indigo-600" />
            Upload New Resource
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter resource title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter resource description"
            />
          </div>
          
          {/* Resource Type & URL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                <option value="PDF">📄 PDF Document</option>
                <option value="Video">🎥 Video</option>
                <option value="Image">🖼️ Image</option>
                <option value="Link">🔗 External Link</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Size (Optional)
              </label>
              <input
                type="text"
                name="fileSize"
                value={formData.fileSize}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                placeholder="e.g., 2.5 MB"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL/Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="url"
              required
              value={formData.url}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="https://example.com/resource"
            />
          </div>
          
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject/Course <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="e.g., Data Structures, Calculus, Physics"
            />
          </div>
          
          {/* Target Audience Selection */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUsers className="inline mr-2 text-indigo-500" />
              Target Audience <span className="text-red-500">*</span>
            </label>
            <select
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
            >
              <option value="All Students">🎓 All Students</option>
              <option value="By Faculty">🏛️ By Faculty</option>
              <option value="By Semester">📚 By Semester</option>
              <option value="By Year">📅 By Year</option>
            </select>
          </div>

          {/* Conditional Fields based on Target Audience */}
          {formData.targetAudience === "By Faculty" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUniversity className="inline mr-2 text-indigo-500" /> Select Faculty <span className="text-red-500">*</span>
              </label>
              <select
                name="targetFaculty"
                value={formData.targetFaculty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Faculty</option>
                <option value="Computing">💻 Faculty of Computing</option>
                <option value="Business">📊 Faculty of Business</option>
                <option value="Engineering">🔧 Faculty of Engineering</option>
              </select>
            </div>
          )}

          {formData.targetAudience === "By Semester" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2 text-indigo-500" /> Select Semester <span className="text-red-500">*</span>
              </label>
              <select
                name="targetSemester"
                value={formData.targetSemester}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Semester</option>
                <option value="Semester 1">📚 Semester 1</option>
                <option value="Semester 2">📚 Semester 2</option>
                <option value="Semester 3">📚 Semester 3</option>
                <option value="Semester 4">📚 Semester 4</option>
              </select>
            </div>
          )}

          {formData.targetAudience === "By Year" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUserGraduate className="inline mr-2 text-indigo-500" /> Select Year <span className="text-red-500">*</span>
              </label>
              <select
                name="targetYear"
                value={formData.targetYear}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Year</option>
                <option value="1">🎓 Year 1</option>
                <option value="2">🎓 Year 2</option>
                <option value="3">🎓 Year 3</option>
                <option value="4">🎓 Year 4</option>
              </select>
            </div>
          )}
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaTag className="inline mr-2 text-indigo-500" />
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              placeholder="e.g., lecture, notes, tutorial, exam"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload Resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceManagement;