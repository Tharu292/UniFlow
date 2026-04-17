// frontend/src/pages/StudentResources.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaFilePdf, 
  FaVideo, 
  FaImage, 
  FaLink, 
  FaDownload, 
  FaSearch,
  FaSpinner,
  FaBookOpen,
  FaUniversity,
  FaCalendarAlt,
  FaEye,
  FaUserGraduate,
  FaUsers
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
  tags: string[];
  targetAudience: string;
  targetFaculty?: string;
  targetSemester?: string;
  targetYear?: string;
  createdAt: string;
}

interface User {
  firstName: string;
  lastName: string;
  faculty: string;
  semester: string;
  year: string;
  email?: string;
}

const StudentResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserAndResources = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          await fetchResources(parsedUser);
        } else {
          setError('User not found. Please login again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    loadUserAndResources();
  }, []);

  const fetchResources = async (userData: User) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/resources/student`, {
        params: {
          faculty: userData.faculty,
          semester: userData.semester,
          year: userData.year,
        }
      });
      
      if (response.data.success) {
        setResources(response.data.data);
        if (response.data.data.length === 0) {
          setError('No resources available for your program');
        }
      } else {
        setError('Failed to load resources');
      }
    } catch (err: any) {
      console.error('Error fetching resources:', err);
      setError(err.response?.data?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resourceId: string, url: string) => {
    try {
      await axios.patch(`${API_URL}/resources/${resourceId}/download`);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error updating download count:', error);
      window.open(url, '_blank');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FaFilePdf className="text-red-600 text-2xl" />;
      case 'Video': return <FaVideo className="text-blue-600 text-2xl" />;
      case 'Image': return <FaImage className="text-green-600 text-2xl" />;
      default: return <FaLink className="text-purple-600 text-2xl" />;
    }
  };

  const getTargetAudienceLabel = (resource: Resource) => {
    switch(resource.targetAudience) {
      case 'All Students':
        return <span className="text-xs text-purple-600"><FaUsers className="inline mr-1" /> All Students</span>;
      case 'By Faculty':
        return <span className="text-xs text-blue-600"><FaUniversity className="inline mr-1" /> {resource.targetFaculty}</span>;
      case 'By Semester':
        return <span className="text-xs text-green-600"><FaCalendarAlt className="inline mr-1" /> {resource.targetSemester}</span>;
      case 'By Year':
        return <span className="text-xs text-orange-600"><FaUserGraduate className="inline mr-1" /> Year {resource.targetYear}</span>;
      default:
        return null;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/student/dashboard" className="text-indigo-600 hover:text-indigo-700">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Study Resources</h1>
              <p className="text-gray-500 mt-1">Access your course materials</p>
            </div>
          </div>
        </div>

        {/* Student Info Card */}
        {user && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 mb-6 border border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <FaBookOpen className="text-indigo-600 text-2xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800 text-lg">{user.firstName} {user.lastName}</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <span className="text-xs text-gray-600 flex items-center gap-1.5 bg-white px-2 py-1 rounded-full">
                    <FaUniversity className="text-indigo-500" /> {user.faculty}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1.5 bg-white px-2 py-1 rounded-full">
                    <FaCalendarAlt className="text-indigo-500" /> {user.semester}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1.5 bg-white px-2 py-1 rounded-full">
                    <FaUserGraduate className="text-indigo-500" /> Year {user.year}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg">
                {resources.length} resources
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search and Type Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources by title, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'PDF', 'Video', 'Image', 'Link'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-xl border">
            <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No resources available for your program</p>
          </div>
        )}

        {filteredResources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                        <div className="mt-1">
                          {getTargetAudienceLabel(resource)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Subject:</span>
                      <span className="font-medium text-gray-700">{resource.subject}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Uploaded by:</span>
                      <span className="font-medium text-gray-700">{resource.uploadedBy}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Downloads:</span>
                      <span className="font-medium text-indigo-600">{resource.downloads}</span>
                    </div>
                  </div>

                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleDownload(resource._id, resource.url)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      <FaDownload /> Download
                    </button>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <FaEye /> Preview
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResources;