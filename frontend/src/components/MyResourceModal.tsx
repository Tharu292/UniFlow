// frontend/src/components/MyResources.tsx
import { BookOpen } from 'lucide-react';
import type { Resource } from '../types';
import ResourceCard from './ResourceCard';

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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource._id}
            resource={resource}
            onPreview={onPreview}
            onDownload={onDownload}
            onOpenLink={onOpenLink}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={true}
            showManageActions={true}
          />
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-lg">
          You haven’t uploaded any resources yet!
        </div>
      )}
    </div>
  );
}