// AddTaskModal.tsx
import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Tag, 
  AlertTriangle, 
  Link as LinkIcon, 
  FileText, 
  BookOpen 
} from 'lucide-react';
import { type Task } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id'>) => void;
  onUpdate?: (id: string, task: Omit<Task, 'id'>) => void;
  editingTask?: Task | null;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  editingTask
}: AddTaskModalProps) {

  const [formData, setFormData] = useState({
    title: '',
    type: 'assignment' as Task['type'],
    dueDate: '',
    priority: 'medium' as Task['priority'],
    description: '',
    resourceLink: '',
    module: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        type: editingTask.type,
        dueDate: editingTask.dueDate.slice(0, 16),
        priority: editingTask.priority,
        description: editingTask.description || '',
        resourceLink: editingTask.resourceLink || '',
        module: editingTask.module || '',
      });
    } else {
      setFormData({
        title: '',
        type: 'assignment',
        dueDate: '',
        priority: 'medium',
        description: '',
        resourceLink: '',
        module: '',
      });
    }
    setErrors({});
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must not exceed 100 characters";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = "Due date cannot be in the past";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    if (formData.resourceLink) {
      try {
        new URL(formData.resourceLink);
      } catch {
        newErrors.resourceLink = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString(),
      completed: editingTask ? editingTask.completed : false,
    };

    if (editingTask && onUpdate) {
      onUpdate(editingTask.id, taskData);
    } else {
      onAdd(taskData);
    }

    onClose();
  };

  // Urgency indicator
  const timeDiff = formData.dueDate
    ? new Date(formData.dueDate).getTime() - Date.now()
    : null;

  const hoursLeft = timeDiff ? timeDiff / 3600000 : null;

  const urgency = hoursLeft !== null && hoursLeft > 0
    ? hoursLeft < 6 ? 'critical' : hoursLeft < 24 ? 'warning' : null
    : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[92vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <p className="text-sm text-gray-500">
                {editingTask ? 'Update your task details' : 'Create a new task'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <FileText className="w-4 h-4" />
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Tag className="w-4 h-4" />
                Task Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Task['type'] })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
                <option value="project">Project</option>
                <option value="quiz">Quiz</option>
                <option value="presentation">Presentation</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <AlertTriangle className="w-4 h-4" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Calendar className="w-4 h-4" />
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                ${errors.dueDate ? 'border-red-500' : urgency === 'critical' ? 'border-red-400' : urgency === 'warning' ? 'border-amber-400' : 'border-gray-200'}`}
            />
            {errors.dueDate && <p className="text-red-500 text-xs mt-1.5">{errors.dueDate}</p>}
            
            {!errors.dueDate && urgency === 'warning' && (
              <p className="text-amber-600 text-xs mt-1.5 flex items-center gap-1">
                ⚠️ Deadline within 24 hours
              </p>
            )}
            {!errors.dueDate && urgency === 'critical' && (
              <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                🔥 Less than 6 hours remaining!
              </p>
            )}
          </div>

          {/* Module */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <BookOpen className="w-4 h-4" />
              Module Code
            </label>
            <input
              type="text"
              value={formData.module}
              onChange={(e) => setFormData({ ...formData, module: e.target.value })}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. IT3020"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <FileText className="w-4 h-4" />
              Description <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3.5 border rounded-2xl resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Add more details about the task..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
          </div>

          {/* Resource Link */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <LinkIcon className="w-4 h-4" />
              Resource Link <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.resourceLink}
              onChange={(e) => setFormData({ ...formData, resourceLink: e.target.value })}
              className={`w-full px-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.resourceLink ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="https://..."
            />
            {errors.resourceLink && <p className="text-red-500 text-xs mt-1.5">{errors.resourceLink}</p>}
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="border-t px-8 py-6 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 text-gray-700 font-medium border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`flex-1 py-3.5 rounded-2xl font-semibold text-white transition-all
              ${editingTask 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}