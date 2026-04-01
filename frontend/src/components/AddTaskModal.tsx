import { useState, useEffect } from 'react';
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

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        type: editingTask.type,
        dueDate: editingTask.dueDate.slice(0, 16),
        priority: editingTask.priority,
        description: editingTask.description,
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
    const newErrors: any = {};

    if (!formData.title) newErrors.title = "Title is required";
    else if (formData.title.length < 3) newErrors.title = "Minimum 3 characters";
    else if (formData.title.length > 100) newErrors.title = "Max 100 characters";

    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = "Cannot be in the past";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Max 500 characters";
    }

    if (formData.resourceLink) {
      try {
        new URL(formData.resourceLink);
      } catch {
        newErrors.resourceLink = "Invalid URL";
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

  //Deadline urgency
  const timeDiff = formData.dueDate
    ? new Date(formData.dueDate).getTime() - Date.now()
    : null;

  const hoursLeft = timeDiff ? timeDiff / 3600000 : null;

  const urgency =
    hoursLeft !== null && hoursLeft > 0
      ? hoursLeft < 6
        ? "critical"
        : hoursLeft < 24
        ? "warning"
        : null
      : null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] p-6 overflow-y-auto">
    <h3 className="text-3xl font-bold mb-6">
      {editingTask ? 'Edit Task' : 'Add New Task'}
    </h3>

    <form onSubmit={handleSubmit} className="space-y-5">

      {/* TITLE */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Task Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className={`w-full border p-4 rounded-xl focus:outline-none 
            ${errors.title ? 'border-red-500' : 'focus:border-blue-500'}`}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* TYPE + PRIORITY */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Task Type</label>
          <select
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as Task['type'] })}
            className="border p-4 rounded-xl"
          >
            <option value="assignment">Assignment</option>
            <option value="exam">Exam</option>
            <option value="project">Project</option>
            <option value="quiz">Quiz</option>
            <option value="presentation">Presentation</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={e => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
            className="border p-4 rounded-xl"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </div>

      {/* DUE DATE */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Due Date</label>
        <input
          type="datetime-local"
          value={formData.dueDate}
          onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
          className={`w-full border p-4 rounded-xl
            ${errors.dueDate ? 'border-red-500' : ''} 
            ${!errors.dueDate && urgency ? 'border-yellow-400' : ''}`}
        />
        {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
        {!errors.dueDate && urgency === "warning" && (
          <p className="text-yellow-500 text-xs mt-1">Deadline within 24 hours!</p>
        )}
        {!errors.dueDate && urgency === "critical" && (
          <p className="text-red-500 text-xs mt-1">Less than 6 hours left!</p>
        )}
      </div>

      {/* MODULE */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Module (e.g. ITxxxx)</label>
        <input
          type="text"
          value={formData.module}
          onChange={e => setFormData({ ...formData, module: e.target.value })}
          className="w-full border p-4 rounded-xl"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Description (optional)</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className={`w-full border p-4 rounded-xl h-24 ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* RESOURCE LINK */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Resource Link (optional)</label>
        <input
          type="url"
          value={formData.resourceLink}
          onChange={e => setFormData({ ...formData, resourceLink: e.target.value })}
          className={`w-full border p-4 rounded-xl ${errors.resourceLink ? 'border-red-500' : ''}`}
        />
        {errors.resourceLink && <p className="text-red-500 text-xs mt-1">{errors.resourceLink}</p>}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className={`flex-1 py-4 rounded-xl font-semibold text-white
            ${editingTask ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 hover:bg-gray-300 border rounded-xl py-4 font-semibold"
        >
          Cancel
        </button>
      </div>

    </form>
  </div>
</div>
  );
}