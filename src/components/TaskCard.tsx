import React from 'react';
import { Task } from '../types';
import { Edit2, Trash2, Calendar, Tag, DollarSign } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'pending';
  
  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${
      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

      {/* Status Tag */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        {isOverdue && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            Overdue
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Tag size={14} />
          <span className="font-medium">Category:</span>
          <span className="text-gray-900">{task.category}</span>
        </div>
        
        {task.amount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign size={14} />
            <span className="font-medium">Amount:</span>
            <span className="text-green-600 font-semibold">${task.amount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} />
          <span className="font-medium">Due:</span>
          <span className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-900'}>
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            task.status === 'completed'
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {task.status === 'completed' ? 'Completed ✓' : 'Mark Complete'}
        </button>
        
        {isOverdue && (
          <span className="text-xs text-red-600 font-medium">⚠️ Overdue</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
