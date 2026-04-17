// frontend/src/pages/ResourceManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaFilePdf, FaVideo, FaImage, FaLink, FaDownload, FaCheckCircle, 
  FaClock, FaTimesCircle, FaSearch, FaUpload, FaEye, FaTrashAlt 
} from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

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
  targetAudience: 'All Students' | 'By Faculty' | 'By Semester' | 'By Year';
  targetFaculty?: string;
  targetSemester?: string;
  targetYear?: string;
  createdAt: string;
}

const ResourceManagement = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/resources`);
      setResources(response.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await axios.delete(`${API_URL}/resources/${id}`);
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const getResourceLink = (resource: Resource) => {
    return resource.fileUrl || resource.url || '#';
  };

  if (loading) return <div className="p-8">Loading resources...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resource Management</h1>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2"
        >
          <FaUpload /> Upload New Resource (URL)
        </button>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Subject</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Uploaded By</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{resource.title}</td>
                  <td className="px-6 py-4">{resource.subject}</td>
                  <td className="px-6 py-4">{resource.type}</td>
                  <td className="px-6 py-4">{resource.uploadedBy}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <a 
                        href={getResourceLink(resource)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <FaEye /> View
                      </a>
                      <button 
                        onClick={() => handleDeleteResource(resource._id)}
                        className="text-red-600 hover:underline"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showUploadModal && (
          <UploadResourceModal onClose={() => setShowUploadModal(false)} onSuccess={fetchResources} />
        )}
      </div>
    </div>
  );
};

// Admin Upload Modal (only URL support as per your original requirement)
const UploadResourceModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF',
    url: '',
    subject: '',
    targetAudience: 'All Students',
    targetFaculty: '',
    targetSemester: '',
    targetYear: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/resources`, {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      alert('Resource uploaded successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Upload Resource (URL only)</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-3 rounded" />
          <textarea placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-3 rounded h-24" />
          <input type="text" placeholder="Subject" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full border p-3 rounded" />
          <input type="url" placeholder="URL/Link" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full border p-3 rounded" />
          
          <select value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value as any})} className="w-full border p-3 rounded">
            <option value="All Students">All Students</option>
            <option value="By Faculty">By Faculty</option>
            <option value="By Semester">By Semester</option>
            <option value="By Year">By Year</option>
          </select>

          <input type="text" placeholder="Tags (comma separated)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full border p-3 rounded" />

          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 text-white rounded disabled:opacity-50">
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceManagement;