import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Filter,
  LayoutDashboard,
  BarChart3,
  Settings,
  Search
} from 'lucide-react';
import { Task, TaskFormData, FilterType } from './types';
import { getStoredTasks, setStoredTasks, initializeSampleData } from './utils/storage';
import { useNotifications } from './hooks/useNotifications';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import StatsCard from './components/StatsCard';
import SearchBar from './components/SearchBar';
import NotificationContainer from './components/NotificationContainer';
import SettingsModal from './components/SettingsModal';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'stats'>('dashboard');

  const { notifications, addNotification, removeNotification } = useNotifications();

  // Load tasks from localStorage
  useEffect(() => {
    const loadedTasks = initializeSampleData();
    setTasks(loadedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks]);

  const handleCreateTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    addNotification('success', 'Task Created', 'New task has been created successfully');
  };

  const handleUpdateTask = (taskData: TaskFormData) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskData }
        : task
    ));
    setEditingTask(null);
    addNotification('success', 'Task Updated', 'Task has been updated successfully');
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
      addNotification('warning', 'Task Deleted', 'Task has been deleted');
    }
  };

  const handleToggleStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        addNotification(
          'info', 
          'Status Updated', 
          `Task marked as ${newStatus}`
        );
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleImportTasks = (importedTasks: Task[]) => {
    setTasks(importedTasks);
    addNotification('success', 'Data Imported', 'Tasks have been imported successfully');
  };

  const handleClearAllData = () => {
    setTasks([]);
    localStorage.removeItem('taskflow-pro-tasks');
    addNotification('warning', 'Data Cleared', 'All tasks have been deleted');
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Date filtering
    const now = new Date();
    const taskDate = new Date(task.dueDate);
    
    let dateMatch = true;
    switch (filter) {
      case 'today':
        dateMatch = taskDate.toDateString() === now.toDateString();
        break;
      case 'week':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        dateMatch = taskDate >= startOfWeek && taskDate <= endOfWeek;
        break;
      case 'month':
        dateMatch = taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
        break;
      case 'overdue':
        dateMatch = taskDate < now && task.status === 'pending';
        break;
      default:
        dateMatch = true;
    }

    // Search filtering
    const searchMatch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase());

    return dateMatch && searchMatch;
  });

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingPayments = tasks
    .filter(task => task.status === 'pending' && task.amount > 0)
    .reduce((sum, task) => sum + task.amount, 0);
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const overdueTasks = tasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status === 'pending'
  ).length;

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      subtitle: `${overdueTasks} overdue`,
      icon: LayoutDashboard,
      color: 'blue' as const,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Completed',
      value: completedTasks,
      subtitle: `${progress.toFixed(0)}% progress`,
      icon: CheckCircle2,
      color: 'green' as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Pending Payments',
      value: `$${pendingPayments.toLocaleString()}`,
      subtitle: 'Across all tasks',
      icon: DollarSign,
      color: 'orange' as const,
      trend: { value: 5, isPositive: false }
    },
    {
      title: 'Progress Rate',
      value: `${progress.toFixed(0)}%`,
      subtitle: 'Completion rate',
      icon: TrendingUp,
      color: 'purple' as const,
      trend: { value: 15, isPositive: true }
    }
  ];

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'today', label: 'Today\'s Tasks' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'overdue', label: 'Overdue' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-bold text-gray-900">TaskFlow Pro</h1>
              </div>
              
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeView === 'dashboard'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('stats')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    activeView === 'stats'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 size={18} />
                  Statistics
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </button>
              
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                🎉 TaskFlow Pro is Live!
              </h3>
              <p className="text-green-700 mt-1">
                Your professional task management dashboard is ready to use. 
                Start by adding your first task or explore the sample data.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Tasks Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Task Management</h2>
              <p className="text-gray-600 mt-1">
                {filteredTasks.length} of {tasks.length} tasks
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="w-full sm:w-64">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search tasks..."
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <Filter size={18} className="text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {filters.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filter === key
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== 'all' 
                    ? "No tasks match your current search and filter criteria."
                    : "Get started by creating your first task."
                  }
                </p>
                {(searchTerm || filter !== 'all') ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Task
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onImportTasks={handleImportTasks}
        onClearAllData={handleClearAllData}
      />
    </div>
  );
}

export default App;
