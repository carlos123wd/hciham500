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
  Search,
  User,
  LogOut
} from 'lucide-react';
import { Task, TaskFormData, FilterType } from './types';
import { getStoredTasks, setStoredTasks } from './utils/storage';
import { useAuth } from './hooks/useAuth';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import StatsCard from './components/StatsCard';
import SearchBar from './components/SearchBar';
import AuthModal from './components/AuthModal';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const { user, signOut, loading: authLoading } = useAuth();

  // تحميل المهام
  useEffect(() => {
    const loadTasks = async () => {
      const loadedTasks = await getStoredTasks();
      setTasks(loadedTasks);
    };
    loadTasks();
  }, [user]);

  // حفظ المهام عند التغيير
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
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  // فلترة المهام
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

  // الإحصائيات
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
    },
    {
      title: 'Completed',
      value: completedTasks,
      subtitle: `${progress.toFixed(0)}% progress`,
      icon: CheckCircle2,
      color: 'green' as const,
    },
    {
      title: 'Pending Payments',
      value: `$${pendingPayments.toLocaleString()}`,
      subtitle: 'Across all tasks',
      icon: DollarSign,
      color: 'orange' as const,
    },
    {
      title: 'Progress Rate',
      value: `${progress.toFixed(0)}%`,
      subtitle: 'Completion rate',
      icon: TrendingUp,
      color: 'purple' as const,
    }
  ];

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Tasks' },
    { key: 'today', label: 'Today\'s Tasks' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'overdue', label: 'Overdue' }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User size={16} />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <User size={18} />
                  تسجيل الدخول
                </button>
              )}
              
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!user}
              >
                <Plus size={18} />
                إضافة مهمة
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          // شاشة الترحيب للمستخدمين غير المسجلين
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={48} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              مرحباً في TaskFlow Pro
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              نظام متكامل لإدارة المهام والمشاريع. سجل الدخول الآن للبدء في تنظيم مهامك بشكل احترافي.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              سجل الدخول للبدء
            </button>
          </div>
        ) : (
          // المحتوى الرئيسي للمستخدمين المسجلين
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Filters and Tasks Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">إدارة المهام</h2>
                  <p className="text-gray-600 mt-1">
                    {filteredTasks.length} من {tasks.length} مهمة
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  {/* Search Bar */}
                  <div className="w-full sm:w-64">
                    <SearchBar
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      placeholder="ابحث في المهام..."
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مهام</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || filter !== 'all' 
                        ? "لا توجد مهام تطابق معايير البحث والتصفية الحالية."
                        : "ابدأ بإضافة أول مهمة لك."
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
                        مسح الفلاتر
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        أضف أول مهمة
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
