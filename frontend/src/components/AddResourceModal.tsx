// frontend/src/components/AddResourceModal.tsx
import { useState, useEffect } from 'react';
import type { Resource } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (resource: any, file?: File) => void;
  editingResource?: Resource | null;
}

export default function AddResourceModal({
  isOpen,
  onClose,
  onAdd,
  editingResource
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'PDF' as 'PDF' | 'Video' | 'Image' | 'Link',
    subject: '',
    targetAudience: 'All Students' as 'All Students' | 'By Faculty' | 'By Semester' | 'By Year',
    targetFaculty: '',
    targetSemester: '',
    targetYear: '',
    tags: '',
    file: null as File | null,
  });

  useEffect(() => {
    if (editingResource) {
      setForm({
        title: editingResource.title ?? '',
        description: editingResource.description ?? '',
        type: editingResource.type ?? 'PDF',
        subject: editingResource.subject ?? '',
        targetAudience: editingResource.targetAudience ?? 'All Students',
        targetFaculty: editingResource.targetFaculty ?? '',
        targetSemester: editingResource.targetSemester ?? '',
        targetYear: editingResource.targetYear ?? '',
        tags: editingResource.tags?.join(', ') ?? '',
        file: null,
      });
    } else {
      setForm({
        title: '',
        description: '',
        type: 'PDF',
        subject: '',
        targetAudience: 'All Students',
        targetFaculty: '',
        targetSemester: '',
        targetYear: '',
        tags: '',
        file: null,
      });
    }
    setErrors({});
  }, [editingResource, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';

    if (!editingResource && !form.file) newErrors.file = 'File is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newResource = {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      subject: form.subject.trim(),
      targetAudience: form.targetAudience,
      targetFaculty: form.targetFaculty || undefined,
      targetSemester: form.targetSemester || undefined,
      targetYear: form.targetYear || undefined,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    onAdd(newResource, form.file ?? undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          {editingResource ? 'Edit Resource' : 'Upload Resource'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-2 rounded-lg mt-1"
              placeholder="Enter resource title"
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border p-2 rounded-lg mt-1"
              placeholder="e.g. Data Structures"
            />
            {errors.subject && <p className="text-red-500 text-xs">{errors.subject}</p>}
          </div>

          {!editingResource && (
            <div>
              <label className="text-sm font-medium">File</label>
              <input
                type="file"
                className="w-full mt-1"
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
              />
              {errors.file && <p className="text-red-500 text-xs">{errors.file}</p>}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Target Audience</label>
            <select
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value as any })}
              className="w-full border p-2 rounded-lg mt-1"
            >
              <option value="All Students">All Students</option>
              <option value="By Faculty">By Faculty</option>
              <option value="By Semester">By Semester</option>
              <option value="By Year">By Year</option>
            </select>
          </div>

          {form.targetAudience === 'By Faculty' && (
            <div>
              <label className="text-sm font-medium">Faculty</label>
              <input
                value={form.targetFaculty}
                onChange={(e) => setForm({ ...form, targetFaculty: e.target.value })}
                className="w-full border p-2 rounded-lg mt-1"
                placeholder="e.g. Computing"
              />
            </div>
          )}

          {form.targetAudience === 'By Semester' && (
            <div>
              <label className="text-sm font-medium">Semester</label>
              <select
                value={form.targetSemester}
                onChange={(e) => setForm({ ...form, targetSemester: e.target.value })}
                className="w-full border p-2 rounded-lg mt-1"
              >
                <option value="">Select Semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
          )}

          {form.targetAudience === 'By Year' && (
            <div>
              <label className="text-sm font-medium">Year</label>
              <select
                value={form.targetYear}
                onChange={(e) => setForm({ ...form, targetYear: e.target.value })}
                className="w-full border p-2 rounded-lg mt-1"
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full border p-2 rounded-lg mt-1"
              placeholder="notes, lecture, exam"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border p-2 rounded-lg mt-1 h-24"
              placeholder="Brief description..."
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-[#006591] text-white py-2 rounded-lg font-medium">
              {editingResource ? 'Update Resource' : 'Upload Resource'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}