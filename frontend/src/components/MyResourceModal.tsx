// frontend/src/components/MyResources.tsx
import { Trash2, Edit2, Eye, Download, BookOpen, Link as LinkIcon } from 'lucide-react';
import type { Resource } from '../types';
import toast from 'react-hot-toast';

interface Props {
  resources: Resource[];
  onDelete: (id: string) => void;
  onEdit: (resource: Resource) => void;
  onPreview: (resource: Resource) => void;
  onDownload: (fileUrl: string, fileName?: string) => void;
  onOpenLink: (url: string) => void;
}

export default function MyResources({
  resources,
  onDelete,
  onEdit,
  onPreview,
  onDownload,
  onOpenLink,
}: Props) {
  const fileResources = resources.filter(r => ['PDF', 'Image', 'Video'].includes(r.type || ''));
  const linkResources = resources.filter(r => r.type === 'Link');

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-[#006591] rounded-2xl flex items-center justify-center text-white">
          <BookOpen size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Resources</h1>
          <p className="text-gray-500">Manage your uploaded study materials</p>
        </div>
      </div>

      {fileResources.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-[#006591]">
            📄 Documents & Media
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fileResources.map((resource) => (
              <div key={resource._id} className="bg-white rounded-3xl shadow-md hover:shadow-xl p-7 border border-gray-100 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-xl line-clamp-2 pr-4">{resource.title}</h3>
                  <span className="px-3 py-1 text-xs bg-orange-100 text-[#cc5500] rounded-full font-medium">
                    {resource.type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-6">{resource.description}</p>

                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resource.tags.slice(0, 5).map((tag, i) => (
                      <span key={i} className="bg-blue-50 text-[#006591] text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => onPreview(resource)} className="flex-1 py-3 border border-[#006591] text-[#006591] hover:bg-[#006591] hover:text-white rounded-2xl flex items-center justify-center gap-2 font-medium transition">
                    <Eye size={18} /> Preview
                  </button>
                  <button onClick={() => onDownload(resource.fileUrl || '', resource.fileName)} className="flex-1 py-3 bg-[#cc5500] text-white rounded-2xl flex items-center justify-center gap-2 font-medium hover:bg-[#b34700] transition">
                    <Download size={18} /> Download
                  </button>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => onEdit(resource)} className="flex-1 py-2.5 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-2xl flex items-center justify-center gap-2 transition">
                    <Edit2 size={18} /> Edit
                  </button>
                  <button onClick={() => onDelete(resource._id)} className="flex-1 py-2.5 border border-red-500 text-red-600 hover:bg-red-50 rounded-2xl flex items-center justify-center gap-2 transition">
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {linkResources.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-[#006591]">
            🔗 My Links
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {linkResources.map((resource) => (
              <div key={resource._id} className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl border border-gray-100 transition-all">
                <h3 className="font-semibold text-xl mb-3">{resource.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-4">{resource.description}</p>

                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resource.tags.slice(0, 5).map((tag, i) => (
                      <span key={i} className="bg-blue-50 text-[#006591] text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => onOpenLink(resource.url || '')} className="flex-1 py-3 bg-[#006591] text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00557a] transition">
                    <LinkIcon size={18} /> Open Link
                  </button>
                  <button onClick={() => onEdit(resource)} className="p-3 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-2xl transition">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => onDelete(resource._id)} className="p-3 border border-red-500 text-red-600 hover:bg-red-50 rounded-2xl transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resources.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-lg">
          You haven’t uploaded any resources yet!
        </div>
      )}
    </div>
  );
}