import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetTasks: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetTasks }) => {
  if (!isOpen) return null;

  const handleReset = () => {
    if (confirm('⚠️ Are you sure you want to delete all tasks? This action cannot be undone.')) {
      onResetTasks();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-gray-700">
          <p className="text-sm">⚙️ Customize your preferences below.</p>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
