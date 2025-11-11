import React, { useState } from 'react';
import { X, Download, Upload, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { exportTasks, importTasks } from '../utils/exportImport';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTasks: (tasks: Task[]) => void;
  onClearAllData: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onImportTasks,
  onClearAllData
}) => {
  const [importError, setImportError] = useState<string>('');

  const handleExport = () => {
    const tasks = JSON.parse(localStorage.getItem('taskflow-pro-tasks') || '[]');
    exportTasks(tasks);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const tasks = await importTasks(file);
      onImportTasks(tasks);
      setImportError('');
      // Reset the file input
      event.target.value = '';
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      onClearAllData();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Data Management</h3>
            
            <div className="space-y-4">
              {/* Export */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Export Data</h4>
                  <p className="text-sm text-gray-600">Download all tasks as JSON file</p>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>

              {/* Import */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Import Data</h4>
                  <label className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <Upload size={16} />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Upload a JSON file to import tasks
                </p>
                {importError && (
                  <p className="text-sm text-red-600">{importError}</p>
                )}
              </div>

              {/* Clear Data */}
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h4 className="font-medium text-red-900">Clear All Data</h4>
                  <p className="text-sm text-red-700">Permanently delete all tasks</p>
                </div>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">App Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Storage:</strong> Local Browser Storage</p>
              <p><strong>Data Location:</strong> Your device only</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
