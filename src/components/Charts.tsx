import React from 'react';
import { Task } from '../types';

interface ChartsProps {
  tasks: Task[];
}

const Charts: React.FC<ChartsProps> = ({ tasks }) => {
  // Calculate chart data
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const totalTasks = tasks.length;
  
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Category distribution
  const categoryCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Priority distribution
  const overdueTasks = tasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status === 'pending'
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Completion Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Completed</span>
              <span>{completedTasks} / {totalTasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900">{completionRate.toFixed(0)}%</span>
            <p className="text-sm text-gray-600">Overall Completion</p>
          </div>
        </div>
      </div>

      {/* Task Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Completed</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-600">{completedTasks}</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Pending</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-600">{pendingTasks}</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Overdue</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-red-600">{overdueTasks}</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="text-center p-3 border border-gray-200 rounded-lg">
              <div className="text-lg font-bold text-blue-600 mb-1">{count}</div>
              <div className="text-sm text-gray-600 truncate" title={category}>
                {category}
              </div>
            </div>
          ))}
          {Object.keys(categoryCounts).length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-4">
              No categories yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
