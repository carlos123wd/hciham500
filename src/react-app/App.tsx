import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./index.css";

interface Task {
  id: string;
  user_id: string;
  title: string;
  category: string;
  amount: number;
  dueDate: string;
  status: string;
  priority: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 🟢 جلب المهام من Supabase
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("hicham_task")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setTasks(data || []);
    setLoading(false);
  };

  // 🟠 إضافة مهمة جديدة
  const addTask = async () => {
    const { data, error } = await supabase
      .from("hicham_task")
      .insert([
        {
          title: "New Task",
          category: "General",
          amount: 0,
          dueDate: "Nov 15, 2025",
          status: "pending",
          priority: "medium",
        },
      ])
      .select();

    if (error) console.error(error);
    else setTasks((prev) => [data[0], ...prev]);
  };

  // 🔴 حذف مهمة
  const deleteTask = async (id: string) => {
    await supabase.from("hicham_task").delete().eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // 🟣 أول ما كيتفتح التطبيق كنجلبو المهام
  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app">
      <h1>Task Dashboard</h1>
      <button onClick={addTask}>+ Add Task</button>

      <div className="tasks-grid">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.category}</p>
            <p>{task.status}</p>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

