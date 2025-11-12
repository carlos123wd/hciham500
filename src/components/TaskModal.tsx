import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, TaskFormData } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskFormData) => void;
  task?: Task | null;
  isDarkMode?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, isDarkMode }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: '',
    amount: 0,
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        amount: task.amount,
        dueDate: task.dueDate.split('T')[0],
        status: task.status
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        description: '',
        category: '',
        amount: 0,
        dueDate: today,
        status: 'pending'
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('Please enter a task title');
    onSave(formData);
    onClose();
  };

  const categories = [
    'Development', 'Design', 'Marketing', 'Finance',
    'HR', 'Meeting', 'Personal', 'Shopping', 'Health', 'Education'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn ${isDarkMode ? 'bg-dark-card' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex justify-between items-center px-6 py-4 border-b ${isDarkMode ? 'border-dark-border' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-dark-text' : 'text-gray-800'}`}>
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${isDarkMode ? 'bg-dark-background border-dark-border text-dark-text' : 'border-gray-300'}`}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none ${isDarkMode ? 'bg-dark-background border-dark-border text-dark-text' : 'border-gray-300'}`}
              placeholder="Enter task details"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${isDarkMode ? 'bg-dark-background border-dark-border text-dark-text' : 'border-gray-300'}`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Due Date *
              </label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${isDarkMode ? 'bg-dark-background border-dark-border text-dark-text' : 'border-gray-300'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Amount
              </label>
              <input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) || 0 })}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${isDarkMode ? 'bg-dark-background border-dark-border text-dark-text' : 'border-gray-300'}`}
                placeholder="e.g., 50"
              />
            </div>
            <div>
              <label htmlFor="status" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'completed' })}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${isDarkMode ? 'bg-dark-background border-dark-border text-dark-text' : 'border-gray-300'}`}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className={`flex justify-end gap-3 pt-3 border-t ${isDarkMode ? 'border-dark-border' : 'border-gray-100'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 text-sm rounded-xl transition-colors ${isDarkMode ? 'text-gray-300 border border-gray-600 hover:bg-gray-700' : 'text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              {task ? 'Update' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
