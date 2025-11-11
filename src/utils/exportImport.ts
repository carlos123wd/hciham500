import { Task } from '../types';

export const exportTasks = (tasks: Task[]): void => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `taskflow-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importTasks = (file: File): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const tasks: Task[] = JSON.parse(content);
        
        // Validate the imported data
        if (!Array.isArray(tasks)) {
          throw new Error('Invalid file format');
        }
        
        // Basic validation for task structure
        tasks.forEach(task => {
          if (!task.id || !task.title || !task.category || !task.dueDate) {
            throw new Error('Invalid task data structure');
          }
        });
        
        resolve(tasks);
      } catch (error) {
        reject(new Error('Failed to parse file. Please check the file format.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
