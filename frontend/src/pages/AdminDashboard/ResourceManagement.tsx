// frontend/src/pages/ResourceManagement.tsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../src/context/AuthContext';
import { 
  FaEye, 
  FaTrashAlt, 
  FaUpload, 
  FaFilePdf, 
  FaVideo, 
  FaImage, 
  FaLink,
  FaClock,
  FaCheckCircle,
  FaBookOpen,
  FaSearch,
  FaFilter
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
  status: 'pending' | 'approved' | 'rejected';
  tags: string[];
  targetAudience: string;
  createdAt: string;
}

const ResourceManagement = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

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
          <p className="text-gray-600 mt-2">Manage and monitor all learning resources on the platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {resources.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {resources.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <FaClock className="text-yellow-600 text-2xl" />
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
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <FaLink className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Upload */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition whitespace-nowrap"
          >
            <FaUpload /> {isAdmin ? "Add URL Resource" : "Upload Resource"}
          </button>
        </div>

        {/* Resources Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                        {resource.type === 'PDF' && <FaFilePdf />}
                        {resource.type === 'Video' && <FaVideo />}
                        {resource.type === 'Image' && <FaImage />}
                        {resource.type === 'Link' && <FaLink />}
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{resource.uploadedBy}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        resource.status === 'approved' ? 'bg-green-100 text-green-700' :
                        resource.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {resource.status}
                      </span>
                    </td>
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

        {showUploadModal && (
          <UploadResourceModal 
            onClose={() => setShowUploadModal(false)} 
            onSuccess={fetchResources}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
};

// Upload Modal (Role-aware)
const UploadResourceModal = ({ 
  onClose, 
  onSuccess, 
  isAdmin 
}: { 
  onClose: () => void; 
  onSuccess: () => void; 
  isAdmin: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF' as const,
    url: '',
    subject: '',
    targetAudience: 'All Students' as const,
    targetFaculty: '',
    targetSemester: '',
    targetYear: '',
    tags: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('subject', formData.subject);
      form.append('targetAudience', formData.targetAudience);
      if (formData.targetFaculty) form.append('targetFaculty', formData.targetFaculty);
      if (formData.targetSemester) form.append('targetSemester', formData.targetSemester);
      if (formData.targetYear) form.append('targetYear', formData.targetYear);
      if (formData.tags) form.append('tags', formData.tags);

      if (isAdmin) {
        if (!formData.url) {
          toast.error("URL is required");
          setLoading(false);
          return;
        }
        form.append('url', formData.url);
      } else {
        if (file) {
          form.append('file', file);
        } else if (formData.url) {
          form.append('url', formData.url);
        } else {
          toast.error("Please upload a file or provide a URL");
          setLoading(false);
          return;
        }
      }

      await api.post('/resources', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Resource uploaded successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-6">
          {isAdmin ? "Add Resource via URL" : "Upload New Resource"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-3 rounded-xl" />
          <textarea placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-3 rounded-xl h-24" />
          <input type="text" placeholder="Subject" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full border p-3 rounded-xl" />

          <input 
            type="url" 
            placeholder={isAdmin ? "Resource URL (required)" : "Resource URL (optional)"} 
            value={formData.url} 
            onChange={e => setFormData({...formData, url: e.target.value})} 
            className="w-full border p-3 rounded-xl" 
            required={isAdmin}
          />

          {!isAdmin && (
            <div>
              <label className="block text-sm font-medium mb-2">Or Upload File</label>
              <input 
                type="file" 
                accept="image/*,application/pdf,video/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                className="w-full border p-3 rounded-xl" 
              />
            </div>
          )}

          <select value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value as any})} className="w-full border p-3 rounded-xl">
            <option value="All Students">All Students</option>
            <option value="By Faculty">By Faculty</option>
            <option value="By Semester">By Semester</option>
            <option value="By Year">By Year</option>
          </select>

          <input type="text" placeholder="Tags (comma separated)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full border p-3 rounded-xl" />

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-xl">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl disabled:opacity-50">
              {loading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceManagement;
