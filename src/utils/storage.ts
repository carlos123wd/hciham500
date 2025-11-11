import { Task } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'taskflow-pro-tasks';

export const getStoredTasks = async (): Promise<Task[]> => {
  try {
    // محاولة جلب البيانات من Supabase
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      category: task.category,
      amount: task.amount,
      dueDate: task.due_date,
      status: task.status,
      createdAt: task.created_at
    }));
  } catch (error) {
    console.log('Using local storage as fallback');
    return getLocalTasks();
  }
};

export const setStoredTasks = async (tasks: Task[]): Promise<void> => {
  try {
    // محاولة الحفظ في Supabase
    const tasksToInsert = tasks.map(task => ({
      title: task.title,
      description: task.description,
      category: task.category,
      amount: task.amount,
      due_date: task.dueDate,
      status: task.status,
      created_at: task.createdAt
    }));

    const { error } = await supabase
      .from('tasks')
      .upsert(tasksToInsert);

    if (error) throw error;
    
  } catch (error) {
    console.log('Saving to local storage as fallback');
    setLocalTasks(tasks);
  }
};

const getLocalTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setLocalTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const initializeSampleData = (): Task[] => {
  return getLocalTasks();
};
