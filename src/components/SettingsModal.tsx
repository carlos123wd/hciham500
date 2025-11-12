import React, { useState } from 'react';
import { X, Trash2, Download, Upload, User, Bell, Moon, Sun } from 'lucide-react';
import { Task } from '../types';
import { exportTasks, importTasks } from '../utils/exportImport';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTasks: (tasks: Task[]) => void;
  onClearAllData: () => void;
  onResetToDefault: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onImportTasks,
  onClearAllData,
  onResetToDefault
}) => {
  const [importError, setImportError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'general' | 'data'>('general');

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

  const handleResetDefault = () => {
    if (confirm('Are you sure you want to reset to default tasks? Your current tasks will be replaced.')) {
      onResetToDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User size={16} className="inline-block mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'data'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Download size={16} className="inline-block mr-2" />
            Data Management
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Theme Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Sun size={20} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Light Mode</p>
                        <p className="text-sm text-gray-600">Use light theme</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg opacity-50">
                    <div className="flex items-center gap-3">
                      <Moon size={20} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Dark Mode</p>
                        <p className="text-sm text-gray-600">Use dark theme (Coming Soon)</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Task Reminders</p>
                        <p className="text-sm text-gray-600">Get notified about upcoming tasks</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* Export Data */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Export Data</h4>
                  <p className="text-sm text-gray-600">Download all tasks as JSON file</p>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>

              {/* Import Data */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Import Data</h4>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
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

              {/* Reset to Default */}
              <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <div>
                  <h4 className="font-medium text-yellow-900">Reset to Default</h4>
                  <p className="text-sm text-yellow-700">Restore sample tasks</p>
                </div>
                <button
                  onClick={handleResetDefault}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <User size={16} />
                  Reset
                </button>
              </div>

              {/* Clear All Data */}
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <h4 className="font-medium text-red-900">Clear All Data</h4>
                  <p className="text-sm text-red-700">Permanently delete all tasks</p>
                </div>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Clear
                </button>
              </div>
            </div>
          )}
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
