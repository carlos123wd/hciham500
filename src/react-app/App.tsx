import React, { useState } from "react";
import { supabase } from "./supabaseClient"; // تأكد import صحيح

const TaskForm = () => {
  const [tasks, setTasks] = useState([]);

  // State ديال الحقول ديال المهمة الجديدة
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newAmount, setNewAmount] = useState(0);
  const [newDueDate, setNewDueDate] = useState(""); // صيغة: "YYYY-MM-DD"
  const [newPriority, setNewPriority] = useState("medium");

  // دالة لإضافة مهمة جديدة
  const addTask = async () => {
    try {
      const newTask = {
        user_id: "00000000-0000-0000-0000-000000000001", // ← ضروري
        title: newTitle || "New Task",
        category: newCategory || "General",
        amount: newAmount || 0,
        dueDate: newDueDate || new Date().toISOString().split("T")[0],
        status: "pending",
        priority: newPriority || "medium",
      };

      console.log("Adding task:", newTask);

      const { data, error } = await supabase
        .from("hicham_task")
        .insert([newTask])
        .select();

      if (error) throw error;

      // تحديث state ديال المهام
      setTasks((prev) => [data[0], ...prev]);

      // تصفير الحقول بعد الإضافة
      setNewTitle("");
      setNewCategory("General");
      setNewAmount(0);
      setNewDueDate("");
      setNewPriority("medium");
    } catch (error) {
      console.error("SUPABASE ERROR:", error);
    }
  };

  return (
    <div className="task-form p-4 border rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>

      <input
        type="text"
        placeholder="Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Category"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Amount"
        value={newAmount}
        onChange={(e) => setNewAmount(parseFloat(e.target.value))}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        type="date"
        placeholder="Due Date"
        value={newDueDate}
        onChange={(e) => setNewDueDate(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <select
        value={newPriority}
        onChange={(e) => setNewPriority(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button
        onClick={addTask}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        + Add Task
      </button>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.title} - {task.category} - ${task.amount} - {task.dueDate} - {task.priority}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskForm;
