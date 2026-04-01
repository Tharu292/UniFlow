import { useState, useEffect } from 'react';
import type { Resource } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (resource: Omit<Resource, 'id'>, file?: File) => void;
  editingResource?: Resource | null;
}

export default function AddResourceModal({
  isOpen,
  onClose,
  onAdd,
  editingResource
}: Props) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState({
    title: '',
    module: '',
    semester: '',
    year: 'Year 1',
    tags: '',
    description: '',
    file: null as File | null,
  });

  // Populate form when editing a resource
  useEffect(() => {
    if (editingResource) {
      setForm({
        title: editingResource.title || '',
        module: editingResource.module || '',
        semester: editingResource.semester || '',
        year: editingResource.year || 'Year 1',
        tags: editingResource.tags ? editingResource.tags.join(', ') : '',
        description: editingResource.description || '',
        file: null, // keep existing file unless user uploads new one
      });
      setErrors({});
    } else {
      setForm({
        title: '',
        module: '',
        semester: '',
        year: 'Year 1',
        tags: '',
        description: '',
        file: null,
      });
      setErrors({});
    }
  }, [editingResource, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    
    if (!form.title.trim()) newErrors.title = 'Title is required';
    else if (form.title.trim().length < 3)
      newErrors.title = 'Title must be at least 3 characters';

    
    if (!form.module.trim()) newErrors.module = 'Module is required';

    
    if (!form.semester.trim()) newErrors.semester = 'Semester is required';

    
    if (!form.year) newErrors.year = 'Year is required';

    
    if (!form.tags.trim()) newErrors.tags = 'At least one tag is required';

    
    if (!form.description.trim())
      newErrors.description = 'Description is required';
    else if (form.description.trim().length < 10)
      newErrors.description = 'Description must be at least 10 characters';

    
    if (!editingResource && !form.file)
      newErrors.file = 'Please select a file';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newResource: Omit<Resource, 'id'> = {
      title: form.title.trim(),
      module: form.module.trim(),
      semester: form.semester.trim(),
      year: form.year,
      tags: form.tags.split(',').map((t) => t.trim()),
      description: form.description.trim(),
      fileName: editingResource?.fileName || form.file?.name || '',
    };

    onAdd(newResource, form.file || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          {editingResource ? 'Edit Resource' : 'Upload Resource'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-2 rounded-lg mt-1"
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>

          {/* FILE */}
          {!editingResource && (
            <div>
              <label className="text-sm font-medium">File</label>
              <input
                type="file"
                className="w-full mt-1"
                onChange={(e) =>
                  setForm({ ...form, file: e.target.files?.[0] || null })
                }
              />
              {errors.file && (
                <p className="text-red-500 text-xs">{errors.file}</p>
              )}
            </div>
          )}

          {/* MODULE, SEMESTER, YEAR, TAGS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                placeholder="Module"
                value={form.module}
                onChange={(e) => setForm({ ...form, module: e.target.value })}
                className="border p-2 rounded-lg"
              />
              {errors.module && (
                <p className="text-red-500 text-xs">{errors.module}</p>
              )}
            </div>

            <div>
              <input
                placeholder="Semester"
                value={form.semester}
                onChange={(e) =>
                  setForm({ ...form, semester: e.target.value })
                }
                className="border p-2 rounded-lg"
              />
              {errors.semester && (
                <p className="text-red-500 text-xs">{errors.semester}</p>
              )}
            </div>

            <div>
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="border p-2 rounded-lg w-full"
              >
                <option>Year 1</option>
                <option>Year 2</option>
                <option>Year 3</option>
                <option>Year 4</option>
              </select>
              {errors.year && (
                <p className="text-red-500 text-xs">{errors.year}</p>
              )}
            </div>

            <div>
              <input
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="border p-2 rounded-lg"
              />
              {errors.tags && (
                <p className="text-red-500 text-xs">{errors.tags}</p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button className="flex-1 bg-[#006591] text-white py-2 rounded-lg">
              {editingResource ? 'Update' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}