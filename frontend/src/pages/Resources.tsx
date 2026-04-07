import { useState, useEffect, useContext } from 'react';
import { Plus, Search, BookOpen, Download, Eye } from 'lucide-react';
import type { Resource } from '../types';
import AddResourceModal from '../components/AddResourceModal';
import MyResources from '../components/MyResourceModal';
import toast from 'react-hot-toast';
import PdfPreviewModal from '../components/PdfPreviewModal';
import { AuthContext } from '../context/AuthContext';

export default function Resources() {
  const { user } = useContext(AuthContext);

  const [resources, setResources] = useState<Resource[]>([]);
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [view, setView] = useState<'library' | 'my'>('library');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const BASE_URL = 'http://localhost:5000';

  // ✅ FETCH ALL
  useEffect(() => {
    fetch(`${BASE_URL}/api/resources`)
      .then(res => res.json())
      .then(setResources)
      .catch(() => toast.error("Failed to load resources"));
  }, []);

  // ✅ FETCH MY
  useEffect(() => {
    fetch(`${BASE_URL}/api/resources/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setMyResources)
      .catch(() => toast.error("Failed to load my resources"));
  }, []);

  // ✅ ADD / UPDATE
  const addResource = async (newResource: any, file?: File) => {
  try {
    // If editing an existing resource
    if (editingResource) {
      const res = await fetch(`${BASE_URL}/api/resources/${editingResource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newResource,
          // Ensure tags are always a string array for backend
          tags: Array.isArray(newResource.tags)
            ? newResource.tags.map((t: string) => t.trim()).filter(Boolean)
            : newResource.tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || []
        })
      });

      const updated = await res.json();

      // Update both library and my resources
      setResources(prev => prev.map(r => r._id === updated._id ? updated : r));
      setMyResources(prev => prev.map(r => r._id === updated._id ? updated : r));

      toast.success('Resource updated successfully');
      setEditingResource(null);
      return;
    }

    // Handle new upload
    const formData = new FormData();

    Object.entries(newResource).forEach(([k, v]) => {
      if (k === 'tags') {
        // Convert tags array to comma-separated string
        if (Array.isArray(v)) {
          formData.append(k, v.join(','));
        } else if (typeof v === 'string') {
          formData.append(k, v);
        }
      } else if (Array.isArray(v)) {
        v.forEach(val => formData.append(k, val));
      } else {
        formData.append(k, v as string);
      }
    });

    if (file) formData.append('file', file);

    const res = await fetch(`${BASE_URL}/api/resources`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();

    // Add new resource to both library and my resources if created by this user
    setResources(prev => [...prev, data]);
    if (data.createdBy === user?._id) {
      setMyResources(prev => [...prev, data]);
    }

    toast.success('Resource uploaded successfully');

  } catch (err) {
    console.error(err);
    toast.error('Error saving resource');
  }
};
  // ✅ DELETE
  const deleteResource = async (id: string) => {
    if (!confirm('Delete this resource?')) return;

    await fetch(`${BASE_URL}/api/resources/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    setResources(prev => prev.filter(r => r._id !== id));
    setMyResources(prev => prev.filter(r => r._id !== id));
    toast.success('Deleted');
  };

  // ✅ FILTER
  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ DOWNLOAD
  const handleDownload = async (fileUrl: string, fileName?: string) => {
    try {
      const url = fileUrl.startsWith('http') ? fileUrl : `${BASE_URL}${fileUrl}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch file');

      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      const downloadName = fileName || fileUrl.split('/').pop() || 'resource';
      link.download = downloadName;
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

      {/* VIEW */}
      {view === 'my' ? (
        <MyResources
          resources={myResources}
          onDelete={deleteResource}
          onEdit={(r) => { setEditingResource(r); setShowModal(true); }}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* SEARCH */}
          <div className="mb-4 flex items-center gap-3">
            <Search size={16} className="text-gray-500" />
            <input
              placeholder="Search resources..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border p-2 rounded-lg w-full"
            />
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => {
              const previewUrl = resource.fileUrl.startsWith('http') 
                ? resource.fileUrl 
                : `${BASE_URL}${resource.fileUrl}`;
              return (
                <div key={resource._id} className="bg-gray-100 rounded-xl p-5 shadow-md hover:shadow-lg transition">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={18} className="text-[#006591]" />
                    <h2 className="font-semibold text-base text-black">{resource.title}</h2>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                  <p className="text-xs text-gray-400 mb-2">{resource.fileName}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {resource.tags.map((tag, i) => (
                      <span key={i} className="bg-white px-2 py-1 text-xs rounded shadow-sm">{tag}</span>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className="bg-white px-2 py-1 text-xs rounded shadow-sm">{resource.module}</span>
                    <span className="bg-white px-2 py-1 text-xs rounded shadow-sm">{resource.semester}</span>
                    <span className="bg-white px-2 py-1 text-xs rounded shadow-sm">{resource.year}</span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setPreviewUrl(previewUrl)}
                      className="flex-1 flex items-center justify-center gap-1 bg-white py-2 rounded-lg text-sm shadow-sm hover:bg-gray-200 transition"
                    >
                      <Eye size={14} /> Preview
                    </button>

                    <button
                      onClick={() => handleDownload(resource.fileUrl, resource.fileName)}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#cc5500] text-white py-2 rounded-lg text-sm shadow-md hover:bg-[#00557a] transition"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredResources.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400">No resources found</div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      <AddResourceModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingResource(null); }}
        onAdd={addResource}
        editingResource={editingResource}
      />

      {previewUrl && (
        <PdfPreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </div>
  );
}