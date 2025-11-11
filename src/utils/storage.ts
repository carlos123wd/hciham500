import { Task } from '../types';

const STORAGE_KEY = 'taskflow-pro-tasks';

export const getStoredTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const setStoredTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const initializeSampleData = (): Task[] => {
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete homepage redesign with new components',
      category: 'Development',
      amount: 2500,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Client Meeting',
      description: 'Quarterly review with ABC Corp',
      category: 'Meeting',
      amount: 0,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Invoice Processing',
      description: 'Process Q3 vendor invoices',
      category: 'Finance',
      amount: 15400,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Team Building',
      description: 'Organize team building activity',
      category: 'HR',
      amount: 500,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      createdAt: new Date().toISOString()
    }
  ];

  const existingTasks = getStoredTasks();
  if (existingTasks.length === 0) {
    setStoredTasks(sampleTasks);
    return sampleTasks;
  }
  return existingTasks;
};
