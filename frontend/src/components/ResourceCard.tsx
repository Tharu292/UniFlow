// frontend/src/components/ResourceCard.tsx
import { Eye, Download, Link as LinkIcon, Edit2, Trash2 } from 'lucide-react';
import type { Resource } from '../types';

interface Props {
  resource: Resource;
  onPreview?: (resource: Resource) => void;
  onDownload?: (fileUrl: string, fileName?: string) => void;
  onOpenLink?: (url: string) => void;     // ← Make sure this is here
  onEdit?: (resource: Resource) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  showManageActions?: boolean;
}

export default function ResourceCard({
  resource,
  onPreview,
  onDownload,
  onOpenLink,
  onEdit,
  onDelete,
  showActions = false,
  showManageActions = false,
}: Props) {
  const isLink = resource.type === 'Link';

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl p-6 border border-gray-100 transition-all h-full flex flex-col">
      {/* Type Badge */}
      <div className="flex justify-end mb-3">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          resource.type === 'PDF' ? 'bg-red-100 text-red-700' :
          resource.type === 'Image' ? 'bg-purple-100 text-purple-700' :
          resource.type === 'Video' ? 'bg-blue-100 text-blue-700' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          {resource.type}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg leading-tight mb-3 line-clamp-2">
        {resource.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
        {resource.description}
      </p>

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

      {/* Action Buttons */}
      <div className="mt-auto">
        {isLink ? (
          <button
            onClick={() => onOpenLink?.(resource.url || '')}   // ← Fixed: Now properly calls onOpenLink
            className="w-full py-2.5 bg-[#006591] text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00557a] transition text-sm"
          >
            <LinkIcon size={16} /> Open Link
          </button>
        ) : (
          <div className="flex gap-3">
            {showActions && onPreview && (
              <button
                onClick={() => onPreview(resource)}
                className="flex-1 py-2.5 border border-[#006591] text-[#006591] hover:bg-[#006591] hover:text-white rounded-2xl flex items-center justify-center gap-2 text-sm transition"
              >
                <Eye size={16} /> Preview
              </button>
            )}
            {showActions && onDownload && (
              <button
                onClick={() => onDownload(resource.fileUrl || '', resource.fileName)}
                className="flex-1 py-2.5 bg-[#cc5500] text-white rounded-2xl flex items-center justify-center gap-2 text-sm hover:bg-[#b34700] transition"
              >
                <Download size={16} /> Download
              </button>
            )}
          </div>
        )}

        {/* Manage Actions for My Resources */}
        {showManageActions && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
            {onEdit && (
              <button
                onClick={() => onEdit(resource)}
                className="flex-1 py-2 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-2xl flex items-center justify-center gap-2 text-sm transition"
              >
                <Edit2 size={16} /> Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(resource._id)}
                className="flex-1 py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded-2xl flex items-center justify-center gap-2 text-sm transition"
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}