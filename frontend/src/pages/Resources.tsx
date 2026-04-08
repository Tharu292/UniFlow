// frontend/src/pages/Resources.tsx
import { useState, useEffect, useContext, useMemo } from 'react';
import { 
  Plus, Search, BookOpen, Download, Eye, Link as LinkIcon 
} from 'lucide-react';
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
  const [audienceFilter, setAudienceFilter] = useState('All');

  const token = localStorage.getItem("token");
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetch(`${BASE_URL}/api/resources`)
      .then(res => res.json())
      .then(setResources)
      .catch(() => toast.error("Failed to load resources"));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE_URL}/api/resources/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setMyResources)
      .catch(() => toast.error("Failed to load my resources"));
  }, [token]);

  const addResource = async (newResource: any, file?: File) => {
    try {
      const formData = new FormData();
      Object.keys(newResource).forEach(key => {
        if (newResource[key] !== undefined) formData.append(key, newResource[key]);
      });
      if (file) formData.append('file', file);

      const res = await fetch(`${BASE_URL}/api/resources`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setResources(prev => [...prev, data]);
      setMyResources(prev => [...prev, data]);
      toast.success('Resource uploaded successfully');
    } catch (err) {
      toast.error('Error saving resource');
    }
  };

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

  const handleDownload = async (fileUrl: string, fileName?: string) => {
    try {
      const url = fileUrl.startsWith('http') ? fileUrl : `${BASE_URL}${fileUrl}`;
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'resource';
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch {
      toast.error('Download failed');
    }
  };

  const previewResource = (resource: Resource) => {
    const url = resource.fileUrl?.startsWith('http') ? resource.fileUrl : `${BASE_URL}${resource.fileUrl}`;
    setPreviewUrl(url);
  };

  const openLink = (url: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    else toast.error("No valid link available");
  };

  const filteredLibrary = useMemo(() => {
    return resources.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                           r.subject.toLowerCase().includes(search.toLowerCase());
      const matchesAudience = audienceFilter === 'All' || r.targetAudience === audienceFilter;
      return matchesSearch && matchesAudience;
    });
  }, [resources, search, audienceFilter]);

  const fileResources = filteredLibrary.filter(r => ['PDF', 'Image', 'Video'].includes(r.type));
  const linkResources = filteredLibrary.filter(r => r.type === 'Link');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#006591] to-[#cc5500] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            <BookOpen size={32} /> Resources Hub
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setView('library')} 
              className={`px-6 py-3 rounded-xl ${view === 'library' ? 'bg-white text-[#006591]' : 'bg-white/20'}`}
            >
              Library
            </button>
            <button 
              onClick={() => setView('my')} 
              className={`px-6 py-3 rounded-xl ${view === 'my' ? 'bg-white text-[#006591]' : 'bg-white/20'}`}
            >
              My Resources
            </button>
            <button 
              onClick={() => { setEditingResource(null); setShowModal(true); }} 
              className="bg-white text-[#006591] px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
            >
              <Plus size={18} /> Upload
            </button>
          </div>
        </div>
      </div>

      {view === 'library' ? (
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Filters */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                placeholder="Search resources..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full pl-11 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#006591]" 
              />
            </div>
            <select 
              value={audienceFilter} 
              onChange={(e) => setAudienceFilter(e.target.value)} 
              className="px-5 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#006591]"
            >
              <option value="All">All Audiences</option>
              <option value="All Students">All Students</option>
              <option value="By Faculty">By Faculty</option>
              <option value="By Semester">By Semester</option>
              <option value="By Year">By Year</option>
            </select>
          </div>

          {/* Downloadable Resources Section */}
          {fileResources.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-[#006591]">
                <BookOpen size={28} /> Downloadable Resources
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {fileResources.map(resource => (
                  <div 
                    key={resource._id} 
                    className="bg-gray-200 rounded-3xl p-6 shadow hover:shadow-lg transition border border-gray-200"
                  >
                    <h3 className="font-semibold text-xl mb-3 text-gray-900">{resource.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {resource.tags.slice(0, 4).map((tag, i) => (
                          <span 
                            key={i} 
                            className="bg-blue-50 text-[#006591] text-xs px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button 
                        onClick={() => previewResource(resource)} 
                        className="flex-1 py-3 border bg-white border-[#006591] text-[#006591] hover:bg-[#006591] hover:text-white rounded-2xl transition"
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => handleDownload(resource.fileUrl || '', resource.fileName)} 
                        className="flex-1 py-3 bg-[#cc5500] text-white rounded-2xl hover:bg-[#b34700] transition"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links Section */}
          {linkResources.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-[#006591]">
                <LinkIcon size={28} /> Useful Links
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {linkResources.map(resource => (
                  <div 
                    key={resource._id} 
                    className="bg-gray-200 rounded-3xl p-6 shadow hover:shadow-lg transition border border-gray-200"
                  >
                    <h3 className="font-semibold text-xl mb-3 text-gray-900">{resource.title}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">{resource.description}</p>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {resource.tags.slice(0, 4).map((tag, i) => (
                          <span 
                            key={i} 
                            className="bg-blue-50 text-[#006591] text-xs px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={() => openLink(resource.url || '')} 
                      className="w-full py-3 border bg-white border-[#006591] text-[#006591] hover:bg-[#006591] hover:text-white rounded-2xl transition"
                    >
                      Open Link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredLibrary.length === 0 && (
            <div className="text-center py-20 text-gray-400">No resources found.</div>
          )}
        </div>
      ) : (
        <MyResources
          resources={myResources}
          onDelete={deleteResource}
          onEdit={(r) => { setEditingResource(r); setShowModal(true); }}
          onPreview={previewResource}
          onDownload={handleDownload}
          onOpenLink={openLink}
        />
      )}

      <AddResourceModal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setEditingResource(null); }} 
        onAdd={addResource} 
        editingResource={editingResource} 
      />

      {previewUrl && <PdfPreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />}
    </div>
  );
}