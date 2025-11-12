import React, { useState, useEffect } from 'react';
import { Task, TaskFormData, FilterType } from './types';
import { getStoredTasks, setStoredTasks } from './utils/storage';
import { useAuth } from './hooks/useAuth';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import StatsCard from './components/StatsCard';
import SearchBar from './components/SearchBar';
import AuthModal from './components/AuthModal';
import Icon from './components/Icon';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      const loadedTasks = await getStoredTasks();
      setTasks(loadedTasks);
    };
    loadTasks();
  }, [user]);

  useEffect(() => {
    if (tasks.length > 0) {
      setStoredTasks(tasks);
    }
  }, [tasks]);

  const handleCreateTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = (taskData: TaskFormData) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskData }
        : task
    ));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleToggleStatus = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
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

    const searchMatch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase());

    return dateMatch && searchMatch;
  });

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
      icon: 'layout-dashboard' as const,
      color: 'blue' as const,
    },
    {
      title: 'Completed',
      value: completedTasks,
      subtitle: `${progress.toFixed(0)}% progress`,
      icon: 'check-circle-2' as const,
      color: 'green' as const,
    },
    {
      title: 'Pending Payments',
      value: `$${pendingPayments.toLocaleString()}`,
      subtitle: 'Across all tasks',
      icon: 'dollar-sign' as const,
      color: 'orange' as const,
    },
    {
      title: 'Progress Rate',
      value: `${progress.toFixed(0)}%`,
      subtitle: 'Completion rate',
      icon: 'trending-up' as const,
      color: 'purple' as const,
    }
  ];

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'overdue', label: 'Overdue' }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Improved for Mobile */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="check-circle-2" className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">TaskFlow Pro</h1>
              <h1 className="text-xl font-bold text-gray-900 sm:hidden">TFP</h1>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Icon name="user" size={16} />
                    <span className="max-w-32 truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Icon name="log-out" size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Icon name="user" size={18} />
                  Sign In
                </button>
              )}
              
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!user}
              >
                <Icon name="plus" size={18} />
                Add Task
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              {user && (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!user}
                  title="Add Task"
                >
                  <Icon name="plus" size={18} />
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <Icon name="x" size={20} /> : <Icon name="menu" size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 bg-white">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700 px-2">
                    <Icon name="user" size={16} />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <Icon name="log-out" size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors justify-center"
                >
                  <Icon name="user" size={18} />
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!user ? (
          // Welcome screen for non-logged in users
          <div className="text-center py-8 sm:py-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Icon name="user" size={40} className="text-blue-600 sm:w-12 sm:h-12" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Welcome to TaskFlow Pro
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Complete task and project management system. Sign in now to start organizing your tasks professionally.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base sm:text-lg font-semibold"
            >
              Sign In to Get Started
            </button>
          </div>
        ) : (
          // Main content for logged in users
          <>
            {/* Statistics Cards - Improved for Mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="col-span-1">
                  <StatsCard {...stat} />
                </div>
              ))}
            </div>

            {/* Filters and Tasks Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header */}
              <div className="flex flex-col gap-4 p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Task Management</h2>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      {filteredTasks.length} of {tasks.length} tasks
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Search Bar */}
                    <div className="w-full sm:w-48 lg:w-64">
                      <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search tasks..."
                      />
                    </div>
                  </div>
                </div>

                {/* Filters - Improved for Mobile */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Icon name="filter" size={16} className="text-gray-400 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1 sm:gap-2 overflow-x-auto pb-1">
                    {filters.map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
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

              {/* Tasks Grid */}
              <div className="p-4 sm:p-6">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Icon name="clock" size={40} className="mx-auto text-gray-400 mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
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
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                      >
                        Clear Filters
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      >
                        Create Your First Task
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
          </>
        )}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
