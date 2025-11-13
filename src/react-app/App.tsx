import React, { useState, useEffect } from 'react'
import './index.css'

// أنواع البيانات
interface Task {
  id: number
  title: string
  description: string
  category: string
  amount: number
  dueDate: string
  status: 'pending' | 'completed' | 'overdue'
  priority: 'high' | 'medium' | 'low'
}

function App() {
  // ✅ البداية تكون فارغة (ماشي فيها بيانات افتراضية)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState('all')

  // 🧩 مستقبلاً هنا تقدر تربط Supabase أو API
  useEffect(() => {
    // مثال: لو بغيت تجيب المهام من Supabase
    // async function loadTasks() {
    //   const { data, error } = await supabase.from('tasks').select('*')
    //   if (error) console.error(error)
    //   else setTasks(data)
    // }
    // loadTasks()
  }, [])

  // 🔍 التصفية
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'today') return task.dueDate.includes('Today')
    if (filter === 'overdue') return task.status === 'overdue'
    return task.status === filter
  })

  // 📊 الإحصائيات
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const totalAmount = tasks.reduce((sum, task) => sum + task.amount, 0)
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  // ⚙️ دالة إعادة التعيين (تحذف جميع المهام)
  const handleResetTasks = () => {
    setTasks([])
  }

  return (
    <div className="app">
      {/* الشريط الجانبي */}
      <div className="sidebar">
        <div className="logo">
          <h2>TaskFlow Pro</h2>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="number">{tasks.length}</p>
          </div>
          
          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <p className="number">{completedTasks}</p>
          </div>

          <div className="stat-card">
            <h3>Pending Payments</h3>
            <p className="amount">${totalAmount.toFixed(2)}</p>
          </div>

          <div className="stat-card">
            <h3>Progress</h3>
            <p className="progress">{progress.toFixed(0)}%</p>
          </div>
        </div>

        <div className="filters">
          <h4>Filter by:</h4>
          {['All Tasks', "Today's Tasks", 'This Week', 'This Month', 'Overdue'].map(item => (
            <button 
              key={item}
              className={`filter-btn ${filter === item.toLowerCase().replace(/'/g, '').replace(' ', '-') ? 'active' : ''}`}
              onClick={() => setFilter(item.toLowerCase().replace(/'/g, '').replace(' ', '-'))}
            >
              {item}
            </button>
          ))}
        </div>

        {/* 🔘 زر لحذف جميع المهام */}
        <button className="reset-btn" onClick={handleResetTasks}>
          Reset All Tasks
        </button>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="main-content">
        <header className="header">
          <h1>Task Dashboard</h1>
          <button className="add-btn">+ Add Task</button>
        </header>

        <div className="tasks-grid">
          {filteredTasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one!</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-card ${task.status}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                </div>
                
                <p className="description">{task.description}</p>
                
                <div className="task-details">
                  <span className="category">{task.category}</span>
                  <span className="amount">$ {task.amount.toFixed(2)}</span>
                </div>
                
                <div className="task-footer">
                  <span className={`due-date ${task.status}`}>{task.dueDate}</span>
                  <div className="task-actions">
                    <button className="complete-btn">✓</button>
                    <button className="delete-btn">✕</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
