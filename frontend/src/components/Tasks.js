import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, CheckSquare, Filter, Search, Calendar, User, MoreVertical, Trash2, Edit2, Check } from 'lucide-react';
import './Tasks.css';
import NewTaskForm from './NewTaskForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const toggleComplete = async (task) => {
    try {
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      await axios.put(`${API_URL}/tasks/${task.id}`, { ...task, status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'medium';
      case 'LOW': return 'low';
      default: return 'medium';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && task.status === 'Completed') ||
      (filter === 'pending' && task.status !== 'Completed');
    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status !== 'Completed').length;

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <CheckSquare size={32} />
            Tasks
          </h1>
          <p>Track and manage your tasks efficiently</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="tasks-stats">
        <div className="stat-item">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item completed">
          <span className="stat-number">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item pending">
          <span className="stat-number">{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="tasks-list">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="task-item skeleton" style={{ height: '80px' }}></div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={64} />
          <h3>{searchQuery ? 'No tasks found' : 'No tasks yet'}</h3>
          <p>{searchQuery ? 'Try adjusting your search' : 'Create your first task to get started!'}</p>
          {!searchQuery && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={20} /> Add Task
            </button>
          )}
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className={`task-item ${task.status === 'Completed' ? 'completed' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                className={`checkbox ${task.status === 'Completed' ? 'checked' : ''}`}
                onClick={() => toggleComplete(task)}
              >
                {task.status === 'Completed' && <Check size={14} />}
              </button>

              <div className="task-content">
                <h4>{task.title}</h4>
                <div className="task-meta">
                  <span className="meta-item">
                    <Calendar size={14} />
                    {task.project}
                  </span>
                  <span className="meta-item">
                    <User size={14} />
                    {task.assignee || 'Unassigned'}
                  </span>
                </div>
              </div>

              <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                {task.priority || 'Medium'}
              </span>

              <div className="task-actions">
                <button className="action-btn" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(task.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <NewTaskForm
              onClose={() => setShowForm(false)}
              onSuccess={fetchTasks}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;