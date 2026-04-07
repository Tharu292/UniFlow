// frontend/src/components/MyResourceModal.tsx  (or MyResources.tsx)
import { Trash2, Edit } from 'lucide-react';
import type { Resource } from '../types';

interface Props {
  resources: Resource[];
  onDelete: (id: string) => void;
  onEdit: (resource: Resource) => void;
}

export default function MyResources({ resources, onDelete, onEdit }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-8">My Resources</h1>

      <div className="space-y-6">
        {resources.map((resource) => (
          <div
            key={resource._id}
            className="bg-white rounded-2xl p-6 shadow border flex justify-between items-start hover:shadow-lg transition"
          >
            <div className="flex-1">
              <h2 className="font-semibold text-xl mb-2">{resource.title}</h2>
              <p className="text-gray-600 mb-4">{resource.description}</p>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-gray-100 px-4 py-1 rounded-full">{resource.subject}</span>
                {resource.targetSemester && (
                  <span className="bg-gray-100 px-4 py-1 rounded-full">{resource.targetSemester}</span>
                )}
                {resource.targetYear && (
                  <span className="bg-gray-100 px-4 py-1 rounded-full">Year {resource.targetYear}</span>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                {resource.tags?.map((tag, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 ml-6">
              <button
                onClick={() => onEdit(resource)}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                title="Edit"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(resource._id)}
                className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {resources.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">You haven’t uploaded any resources yet!</p>
          </div>
        )}
      </div>
    </div>
  );
}