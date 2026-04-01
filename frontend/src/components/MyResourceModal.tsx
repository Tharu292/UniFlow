import { Trash2, Edit } from 'lucide-react';
import type { Resource } from '../types';

interface Props {
  resources: Resource[];
  onDelete: (id: string) => void;
  onEdit: (resource: Resource) => void;
}

export default function MyResources({ resources, onDelete, onEdit }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">

      <h1 className="text-2xl font-semibold mb-6">My Resources</h1>

      <div className="space-y-4">

        {resources.map(resource => (
          <div
            key={resource.id}
            className="bg-gray-100 rounded-xl p-5 shadow-md border flex justify-between items-center hover:shadow-lg transition"
          >

            {/* LEFT CONTENT */}
            <div className="flex-1">

              <h2 className="font-semibold text-lg mb-1">
                {resource.title}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {resource.description}
              </p>

              <div className="flex gap-3 text-xs text-gray-600">
                <span>{resource.module}</span>
                <span>{resource.semester}</span>
                <span>{resource.year}</span>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 ml-4">

              <button
                onClick={() => onEdit(resource)}
                className="p-2 bg-white rounded-lg shadow hover:bg-gray-200"
              >
                <Edit size={16} />
              </button>

              <button
                onClick={() => onDelete(resource.id)}
                className="p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>

            </div>

          </div>
        ))}

        {resources.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            You haven’t uploaded any resources yet!
          </p>
        )}

      </div>
    </div>
  );
}