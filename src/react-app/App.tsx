import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./index.css";

interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  amount: number;
  dueDate?: string;
  status: "pending" | "completed" | "overdue";
  priority: "high" | "medium" | "low";
  user_id?: string;
  created_at?: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ 1) جلب المستخدم الحالي
  useEffect(() => {
    (async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser || null);
    })();
  }, []);

  // ✅ 2) تحميل المهام للمستخدم الحالي
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    let active = true;
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && active) setTasks(data || []);
      setLoading(false);
    };

    fetchTasks();

    // ✅ التحديث التلقائي (realtime)
    const channel = supabase
      .channel(`public:tasks:user=${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `user_id=eq.${user.id}` },
        () => fetchTasks()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  // ✅ إضافة مهمة جديدة
  const handleAddTask = async () => {
    if (!user) return alert("Please sign in first!");

    const newTask = {
      title: "New Task",
      description: "",
      category: "General",
      amount: 0,
      dueDate: new Date().toISOString().split("T")[0],
      status: "pending" as const,
      priority: "medium" as const,
      user_id: user.id,
    };

    const { data, error } = await supabase.from("tasks").insert([newTask]).select();
    if (error) {
      alert("Error adding task!");
      console.error(error);
    } else {
      setTasks(prev => [data[0], ...prev]);
    }
  };

  // ✅ حذف مهمة
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) console.error(error);
    else setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const totalAmount = tasks.reduce((sum, t) => sum + (t.amount || 0), 0);
  const progress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="app">
      <div className="sidebar">
        <h2>TaskFlow Pro</h2>

        <div className="stats">
          <p>Total Tasks: {tasks.length}</p>
          <p>Completed: {completedTasks}</p>
          <p>Total $: {totalAmount.toFixed(2)}</p>
          <p>Progress: {progress.toFixed(0)}%</p>
        </div>

        <div className="filters">
          {["all", "pending", "completed", "overdue"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={filter === f ? "active" : ""}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="main-content">
        <header className="header">
          <h1>Tasks</h1>
          <button onClick={handleAddTask}>+ Add Task</button>
        </header>

        <div className="tasks-grid">
          {loading ? (
            <p>Loading...</p>
          ) : filteredTasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-card ${task.status}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                </div>
                <p>{task.description}</p>
                <div className="task-details">
                  <span>{task.category}</span>
                  <span>${(task.amount || 0).toFixed(2)}</span>
                </div>
                <div className="task-footer">
                  <span>{task.dueDate}</span>
                  <button onClick={() => handleDelete(task.id)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


