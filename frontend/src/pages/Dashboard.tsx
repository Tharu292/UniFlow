import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Clock, AlertTriangle, Plus, BookOpen, Edit2, Trash2, CheckCircle, ListTodo } from 'lucide-react';
import type { Task } from '../types';
import AddTaskModal from '../components/AddTaskModal';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Calendar controlled state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');

  // Fetch tasks
  useEffect(() => {
    let mounted = true;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await taskAPI.getAll();
        if (mounted) {
          const formatted = res.data.map((t: any) => ({
            ...t,
            id: t._id,
            dueDate: t.dueDate,
          }));
          setTasks(formatted);
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load tasks. Is the backend running?');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTasks();

    return () => { mounted = false; };
  }, []);

  // Stats & derived values
  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const urgent = tasks.filter(
    t => !t.completed && (new Date(t.dueDate).getTime() - Date.now()) / 86400000 < 3
  ).length;

  const thisWeek = tasks.filter(t => {
    if (t.completed) return false;
    const diffDays = (new Date(t.dueDate).getTime() - Date.now()) / 86400000;
    return diffDays > 0 && diffDays <= 7;
  }).length;

  const nextTask = [...tasks]
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const timeLeftMs = nextTask ? Math.max(0, new Date(nextTask.dueDate).getTime() - Date.now()) : 0;
  const daysLeft = Math.floor(timeLeftMs / 86400000);
  const hoursLeft = Math.floor((timeLeftMs % 86400000) / 3600000);

  const calendarEvents = tasks.map(task => ({
    title: `${task.title} (${task.type})`,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    allDay: true,
  }));

  // CRUD handlers (unchanged)
 const addTask = async (newTaskData: Omit<Task, 'id'>) => {
  try {
    const res = await taskAPI.create(newTaskData);
    const createdTask = res.data; // assuming backend returns the task directly now

    const newTask = {
      ...createdTask,
      id: createdTask._id || createdTask.id
    };

    setTasks(prev => [...prev, newTask]);
    toast.success('Task created successfully');
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Failed to create task');
  }
};

  const updateTask = async (id: string, updatedData: Omit<Task, 'id'>) => {
    try {
      const res = await taskAPI.update(id, updatedData);
      const updated = { ...res.data, id: res.data._id };

      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
      setEditingTask(null);

      toast.success('Task updated successfully');

    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return;

    try {
      await taskAPI.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));

      toast.success('Task deleted');

    } catch (err) {
      console.error(err);
      toast.error('Failed to delete task');
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedData = { ...task, completed: !task.completed };
    try {
      await taskAPI.update(id, updatedData);
      setTasks(prev =>
        prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update completion status');
    }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="text-white py-5"  style={{
    background: 'linear-gradient(90deg, #006591 0%, #cc5500 100%)'
  }}>
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-2xl font-semibold">Welcome Back!</h1>
          <p className="text-sm opacity-80">Are you Ready to Make Your Day Productive?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* STATS FULL WIDTH */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: totalTasks, icon: <ListTodo size={30} />, color: 'text-[#006591]' },
            { label: 'Completed', value: completed, icon: <CheckCircle size={30} />, color: 'text-green-600' },
            { label: 'Urgent', value: urgent, icon: <AlertTriangle size={30} />, color: 'text-red-500' },
            { label: 'Week', value: thisWeek, icon: <Clock size={30} />, color: 'text-orange-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded-xl shadow-md flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-black">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
              <div className={stat.color}>{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-8">

            {/* VIEW TOGGLE */}
            <div className="bg-gray-100 p-2 rounded-xl shadow-md flex gap-2 mb-4 w-full">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-1 py-2 text-base rounded-lg transition ${viewMode === 'calendar' ? 'bg-[#006591] text-white' : 'bg-white'
                  }`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-2 text-base rounded-lg transition ${viewMode === 'list' ? 'bg-[#006591] text-white' : 'bg-white'
                  }`}
              >
                List View
              </button>
            </div>

            {/* CALENDAR */}
            {viewMode === 'calendar' && (
              <div className="bg-white rounded-xl shadow-sm border">

                {/* HEADER INSIDE CALENDAR */}
                <div className="flex justify-between items-center p-3 border-b">
                  <h2 className="text-sm font-semibold">Calendar</h2>

                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-[#cc5500] hover:bg-[#00557a] text-white font-semibold px-4 py-2 rounded-lg text-base shadow-md transition"
                  >
                    <Plus size={20} /> Add Task
                  </button>
                </div>

                <div style={{ height: 480 }} className="p-2 text-sm">
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    date={calendarDate}
                    view={calendarView}
                    onNavigate={date => setCalendarDate(date)}
                    onView={view => setCalendarView(view as 'month' | 'week')}
                    views={['month', 'week']}
                    popup
                  />
                </div>
              </div>
            )}

            {/* LIST */}
            {viewMode === 'list' && (
              <div className="bg-gray-100 rounded-xl p-3 shadow-md">
                <table className="w-full border-separate border-spacing-y-3 text-sm">

                  {/* HEADER */}
                  <thead>
                    <tr className="text-gray-600 text-xs">
                      <th className="text-left px-4">Task</th>
                      <th className="text-center">Type</th>
                      <th className="text-center">Date</th>
                      <th className="text-center">Priority</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>
                    {tasks.map(task => {
                      const date = new Date(task.dueDate);

                      return (
                        <tr
                          key={task.id}
                          className="bg-white shadow-md rounded-xl hover:shadow-lg transition"
                        >
                          {/* TASK */}
                          <td className="px-4 py-4 rounded-l-xl">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleComplete(task.id)}
                              />
                              <span className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-black'}`}>
                                {task.title}
                              </span>
                            </div>
                          </td>

                          {/* TYPE */}
                          <td className="text-center">
                            <span className="bg-gray-200 px-2 py-1 rounded text-xs capitalize">
                              {task.type}
                            </span>
                          </td>

                          {/* DATE */}
                          <td className="text-center text-gray-600">
                            <div>
                              {date.toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          {/* PRIORITY */}
                          <td className="text-center">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${task.priority === 'high'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                              {task.priority}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="text-center rounded-r-xl">
                            <div className="flex justify-center gap-3">
                              <Edit2
                                size={16}
                                onClick={() => openEdit(task)}
                                className="cursor-pointer text-gray-600 hover:text-black"
                              />
                              <Trash2
                                size={16}
                                onClick={() => deleteTask(task.id)}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-4 space-y-5">

            {/* NEXT DEADLINE */}
            {nextTask && (<div className="bg-gray-300 rounded-xl p-4 shadow-md"> <p className="text-xs text-gray-500 mb-1">Next Deadline</p> <div className="flex justify-between items-center"> <div> <p className="text-base font-semibold text-black">{nextTask.title}</p> <p className="text-xs text-gray-500 capitalize">{nextTask.type}</p> </div> <div className="text-right"> <p className="text-lg font-bold text-red-500"> {daysLeft} Days {hoursLeft} Hours </p> <p className="text-xs text-gray-400">remaining</p> </div> </div> </div>)}

            {/* URGENT TASKS */}
            <div className="bg-gray-300 rounded-xl p-5 shadow-md">
              <p className="text-base font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                Urgent Tasks
              </p>

              <div className="space-y-3">
                {tasks
                  .filter(t => t.priority === 'high' && !t.completed)
                  .slice(0, 3)
                  .map(task => {
                    const date = new Date(task.dueDate);
                    return (
                      <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-base font-medium text-black">{task.title}</p>

                        <div className="text-xs text-gray-500 mt-1">
                          {date.toLocaleDateString()} • {" "}
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {tasks.filter(t => t.priority === 'high' && !t.completed).length === 0 && (
                <p className="text-xs text-gray-400">No urgent tasks</p>
              )}
            </div>
            {/* QUICK ACTIONS */}
            <div className="bg-gray-300 rounded-xl p-5 shadow-md">
              <p className="text-base font-semibold mb-4">Quick Actions</p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setShowModal(true);
                  }}
                  className="w-full flex items-center gap-2 bg-[#006591] hover:bg-[#00557a] text-white py-3 px-4 rounded-lg text-base shadow-md transition"
                >
                  <Plus size={18} /> Add Task
                </button>

                <Link
                  to="/resources"
                  className="w-full flex items-center gap-2 bg-white hover:bg-gray-200 py-3 px-4 rounded-lg text-base shadow-sm"
                >
                  <BookOpen size={18} /> Browse Resources
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTask(null);
        }}
        onAdd={addTask}
        onUpdate={updateTask}
        editingTask={editingTask}
      />

    </div>
  );
}