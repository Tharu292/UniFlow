// frontend/src/components/AddResourceModal.tsx
import { useState, useEffect, useContext } from 'react';
import { X } from 'lucide-react';
import type { Resource } from '../types';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'PDF' as 'PDF' | 'Image' | 'Video' | 'Link',
    targetAudience: 'All Students' as 'All Students' | 'By Faculty' | 'By Semester' | 'By Year',
    targetFaculty: '',
    targetSemester: '',
    targetYear: '',
    tags: '',                    // comma separated
    url: '',
    file: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingResource) {
      setForm({
        title: editingResource.title || '',
        description: editingResource.description || '',
        subject: editingResource.subject || '',
        type: (editingResource.type as any) || 'PDF',
        targetAudience: (editingResource.targetAudience as any) || 'All Students',
        targetFaculty: editingResource.targetFaculty || '',
        targetSemester: editingResource.targetSemester || '',
        targetYear: editingResource.targetYear || '',
        tags: Array.isArray(editingResource.tags) ? editingResource.tags.join(', ') : '',
        url: editingResource.url || '',
        file: null,
      });
    } else {
      setForm({
        title: '',
        description: '',
        subject: '',
        type: 'PDF',
        targetAudience: 'All Students',
        targetFaculty: '',
        targetSemester: '',
        targetYear: '',
        tags: '',
        url: '',
        file: null,
      });
    }
    setErrors({});
  }, [editingResource, isOpen]);

  if (!isOpen) return null;

  // Validation: Cannot be only numbers (must contain at least one letter)
  const isOnlyNumbers = (str: string): boolean => {
    return str.trim() !== '' && /^\d+$/.test(str.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (isOnlyNumbers(form.title)) {
      newErrors.title = 'Title cannot contain only numbers';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (isOnlyNumbers(form.description)) {
      newErrors.description = 'Description cannot contain only numbers';
    }

    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (isAdmin && !form.url.trim()) {
      newErrors.url = 'URL is required for admins';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convert comma-separated tags to array
    const tagsArray = form.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newResource = {
      title: form.title.trim(),
      description: form.description.trim(),
      subject: form.subject.trim(),
      type: form.type,
      targetAudience: form.targetAudience,
      targetFaculty: form.targetFaculty || undefined,
      targetSemester: form.targetSemester || undefined,
      targetYear: form.targetYear || undefined,
      tags: tagsArray,
      url: form.url.trim() || undefined,
    };

    onAdd(newResource, !isAdmin && form.file ? form.file : undefined);
    onClose();
    toast.success(editingResource ? 'Resource updated successfully!' : 'Resource uploaded successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            {editingResource ? 'Edit Resource' : isAdmin ? 'Add URL Resource' : 'Upload New Resource'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            <X size={26} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 custom-scrollbar">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-[#006591]"
              placeholder="Enter resource title"
              required
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-[#006591]"
              placeholder="e.g. Data Structures, Calculus"
              required
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-[#006591]"
            >
              <option value="PDF">PDF</option>
              <option value="Image">Image</option>
              <option value="Video">Video</option>
              <option value="Link">Link / URL</option>
            </select>
          </div>

          {(form.type === 'Link' || isAdmin) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL {isAdmin && <span className="text-red-500">*</span>}
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-[#006591]"
                placeholder="https://example.com/resource"
                required={isAdmin}
              />
              {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
            </div>
          )}

          {!isAdmin && form.type !== 'Link' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
              <input
                type="file"
                accept="image/*,application/pdf,video/*"
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
                className="w-full border border-gray-300 p-3 rounded-2xl"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-2xl h-28 focus:outline-none focus:border-[#006591]"
              placeholder="Brief description of the resource..."
              required
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-400 text-xs">(comma separated)</span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-[#006591]"
              placeholder="notes, midterm, important, python, revision"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <select
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value as any })}
              className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:border-[#006591]"
            >
              <option value="All Students">All Students</option>
              <option value="By Faculty">By Faculty</option>
              <option value="By Semester">By Semester</option>
              <option value="By Year">By Year</option>
            </select>
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="p-6 border-t bg-white sticky bottom-0">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"   // Changed from submit to button + onClick for consistency
              onClick={handleSubmit}
              className="flex-1 bg-[#006591] text-white py-3.5 rounded-2xl font-semibold hover:bg-[#00557a] transition"
            >
              {editingResource ? 'Update Resource' : 'Upload Resource'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}