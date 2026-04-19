import React, { useState, useEffect, useContext } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../src/context/AuthContext';
import { 
  FaEye, 
  FaTrashAlt, 
  FaBookOpen,
  FaSearch,
} from 'react-icons/fa';

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Image' | 'Link';
  fileUrl?: string;
  url?: string;
  fileName?: string;
  subject: string;
  uploadedBy: string;
  downloads: number;
  targetAudience: string;
  createdAt: string;
}

const ResourceManagement = () => {
  const { user } = useContext(AuthContext);

  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources');
      setResources(response.data);
    } catch (err: any) {
      console.error('Error fetching resources:', err);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await api.delete(`/resources/${id}`);
      toast.success("Resource deleted successfully");
      fetchResources();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete resource");
    }
  };

  const getResourceLink = (resource: Resource) => {
    return resource.fileUrl || resource.url || '#';
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600 mt-2">View and manage all learning resources (Admin only - View & Delete)</p>
        </div>

        {/* Stats Overview - Removed Pending/Approved since status is hidden */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Resources</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{resources.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaBookOpen className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Downloadable Files</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {resources.filter(r => ['PDF', 'Image', 'Video'].includes(r.type)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Links</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {resources.filter(r => r.type === 'Link').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Only - No Upload Button */}
        <div className="flex-1 relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Resources Table - No Status Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Audience</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResources.length > 0 ? (
                filteredResources.map(resource => (
                  <tr key={resource._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{resource.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{resource.description}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{resource.subject}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{resource.uploadedBy}</td>
                    <td className="px-6 py-4 text-gray-600">{resource.targetAudience}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <a 
                          href={getResourceLink(resource)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                        >
                          <FaEye /> View
                        </a>
                        <button 
                          onClick={() => handleDeleteResource(resource._id)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                        >
                          <FaTrashAlt /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No resources found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;