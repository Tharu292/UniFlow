// frontend/src/pages/Resources.tsx
import { useState, useEffect } from 'react';
import { Plus, Search, BookOpen, Download, Eye } from 'lucide-react';
import type { Resource } from '../types';
import AddResourceModal from '../components/AddResourceModal';
import MyResources from '../components/MyResourceModal';
import toast from 'react-hot-toast';
import PdfPreviewModal from '../components/PdfPreviewModal';

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [view, setView] = useState<'library' | 'my'>('library');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const BASE_URL = 'http://localhost:5000';

  // Fetch all resources (Library)
  useEffect(() => {
    fetch(`${BASE_URL}/api/resources`)
      .then(res => res.json())
      .then(setResources)
      .catch(() => toast.error("Failed to load resources"));
  }, []);

  // Fetch my resources
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE_URL}/api/resources/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setMyResources)
      .catch(() => toast.error("Failed to load my resources"));
  }, [token]);

  // Add or Update Resource
// Inside Resources.tsx — replace the addResource function
const addResource = async (newResource: any, file?: File) => {
  try {
    if (editingResource) {
      // Update (JSON)
      const res = await fetch(`${BASE_URL}/api/resources/${editingResource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newResource)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Update failed');
      }
      const updated = await res.json();

      setResources(prev => prev.map(r => r._id === updated._id ? updated : r));
      setMyResources(prev => prev.map(r => r._id === updated._id ? updated : r));

      toast.success('Resource updated successfully');
      setEditingResource(null);
      return;
    }

    // New upload with FormData
    const formData = new FormData();

    // Add all fields safely
    formData.append('title', newResource.title);
    formData.append('description', newResource.description);
    formData.append('type', newResource.type);
    formData.append('subject', newResource.subject);
    formData.append('targetAudience', newResource.targetAudience);

    if (newResource.targetFaculty) formData.append('targetFaculty', newResource.targetFaculty);
    if (newResource.targetSemester) formData.append('targetSemester', newResource.targetSemester);
    if (newResource.targetYear) formData.append('targetYear', newResource.targetYear);

    if (Array.isArray(newResource.tags)) {
      formData.append('tags', newResource.tags.join(','));
    }

    if (file) {
      formData.append('file', file);
    }

    const res = await fetch(`${BASE_URL}/api/resources`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },   // Do NOT set Content-Type for FormData
      body: formData
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Upload failed');
    }

    const data = await res.json();

    setResources(prev => [...prev, data]);
    setMyResources(prev => [...prev, data]);

    toast.success('Resource uploaded successfully');

  } catch (err: any) {
    console.error(err);
    toast.error(err.message || 'Error saving resource');
  }
};

  // Delete Resource
  const deleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      await fetch(`${BASE_URL}/api/resources/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      setResources(prev => prev.filter(r => r._id !== id));
      setMyResources(prev => prev.filter(r => r._id !== id));
      toast.success('Resource deleted successfully');
    } catch {
      toast.error('Failed to delete resource');
    }
  };

  // Filter resources
  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.subject.toLowerCase().includes(search.toLowerCase())
  );

  // Download handler
  const handleDownload = async (fileUrl: string, fileName?: string) => {
    try {
      const url = fileUrl.startsWith('http') ? fileUrl : `${BASE_URL}${fileUrl}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'resource';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch {
      toast.error('Download failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="text-white py-5 bg-gradient-to-r from-[#006591] to-[#cc5500]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Resources</h1>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${view === 'library' ? 'bg-white text-[#006591]' : 'bg-[#00557a]'}`}
              onClick={() => setView('library')}
            >
              Library
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${view === 'my' ? 'bg-white text-[#006591]' : 'bg-[#00557a]'}`}
              onClick={() => setView('my')}
            >
              My Resources
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-[#006591] px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-md hover:bg-gray-100 transition"
            >
              <Plus size={16} /> Upload
            </button>
          </div>
        </div>
      </div>

      {/* LIBRARY VIEW */}
      {view === 'library' ? (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="mb-6 flex items-center gap-3">
            <Search size={16} className="text-gray-500" />
            <input
              placeholder="Search by title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#006591]"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => {
              const previewUrl = resource.fileUrl?.startsWith('http')
                ? resource.fileUrl
                : `${BASE_URL}${resource.fileUrl}`;

              return (
                <div key={resource._id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen size={22} className="text-[#006591]" />
                    <h2 className="font-semibold text-lg">{resource.title}</h2>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                  <p className="text-xs text-gray-500 mb-4">{resource.subject}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="bg-gray-100 px-3 py-1 text-xs rounded-full">{tag}</span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setPreviewUrl(previewUrl)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 py-2.5 rounded-lg text-sm hover:bg-gray-200 transition"
                    >
                      <Eye size={16} /> Preview
                    </button>
                    <button
                      onClick={() => handleDownload(resource.fileUrl || '', resource.fileName)}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#cc5500] text-white py-2.5 rounded-lg text-sm hover:bg-[#b94400] transition"
                    >
                      <Download size={16} /> Download
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredResources.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                No resources found
              </div>
            )}
          </div>
        </div>
      ) : (
        <MyResources
          resources={myResources}
          onDelete={deleteResource}
          onEdit={(r) => {
            setEditingResource(r);
            setShowModal(true);
          }}
        />
      )}

      {/* MODALS */}
      <AddResourceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingResource(null);
        }}
        onAdd={addResource}
        editingResource={editingResource}
      />

      {previewUrl && (
        <PdfPreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </div>
  );
}
