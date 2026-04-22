import { X, Calendar, Tag, AlertTriangle, FileText, Link as LinkIcon, BookOpen, CheckCircle2 } from 'lucide-react';
import type { Task } from '../types';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function TaskDetailsModal({
  isOpen,
  onClose,
  task
}: TaskDetailsModalProps) {
  if (!isOpen || !task) return null;

  const dueDate = new Date(task.dueDate);

  const priorityClasses =
    task.priority === 'high'
      ? 'bg-red-100 text-red-600'
      : task.priority === 'medium'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-gray-200 text-gray-600';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      data-testid="task-details-modal"
    >
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Task Details</h2>
              <p className="text-sm text-gray-500">View complete information for this task</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            data-testid="close-task-details-modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Title</p>
            <p className="text-xl font-semibold text-gray-900 break-words">{task.title}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4" />
                Task Type
              </p>
              <p className="text-gray-900 capitalize">{task.type}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Priority
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${priorityClasses}`}>
                {task.priority}
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </p>
              <p className="text-gray-900">{dueDate.toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">
                {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Status
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${task.completed ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4" />
              Module
            </p>
            <p className="text-gray-900">{task.module?.trim() ? task.module : 'Not provided'}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </p>
            <p className="text-gray-900 whitespace-pre-wrap break-words">
              {task.description?.trim() ? task.description : 'No description added'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <LinkIcon className="w-4 h-4" />
              Resource Link
            </p>

            {task.resourceLink?.trim() ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-blue-700 break-all">{task.resourceLink}</p>
                <a
                  href={task.resourceLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 bg-[#006591] hover:bg-[#00557a] text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  data-testid="open-resource-link-button"
                >
                  <LinkIcon className="w-4 h-4" />
                  Open Resource
                </a>
              </div>
            ) : (
              <p className="text-gray-900">No resource link added</p>
            )}
          </div>
        </div>

        <div className="border-t px-8 py-6">
          <button
            onClick={onClose}
            className="w-full py-3.5 text-gray-700 font-medium border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}