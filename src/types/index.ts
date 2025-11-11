export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'completed';
}

export type FilterType = 'all' | 'today' | 'week' | 'month' | 'overdue';
