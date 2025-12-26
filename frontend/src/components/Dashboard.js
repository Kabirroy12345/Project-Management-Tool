import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FolderKanban, CheckSquare, TrendingUp, Users, Plus, Calendar, ArrowRight } from 'lucide-react';
import './Dashboard.css';
import NewProjectForm from './NewProjectForm';
import NewTaskForm from './NewTaskForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressProjects: 0,
    totalMembers: 0,
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Calculate from local data if API fails
      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'Completed').length,
        inProgressProjects: projects.filter(p => p.status === 'In Progress').length,
        totalMembers: 0,
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchTasks(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getPriorityClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'medium';
      case 'LOW': return 'low';
      default: return 'medium';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    if (progress >= 50) return 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const formatDate = (date) => {
    if (!date) return 'No date set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard">
      <h1>Welcome Back! 👋</h1>
      <p className="dashboard-subtitle">Here's what's happening with your projects today.</p>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">
            <FolderKanban size={24} />
          </div>
          <div className="stat-card-value">{stats.totalProjects}</div>
          <div className="stat-card-label">Total Projects</div>
          <div className="stat-card-trend up">
            <TrendingUp size={14} />
            Active
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-card-icon">
            <CheckSquare size={24} />
          </div>
          <div className="stat-card-value">{stats.totalTasks}</div>
          <div className="stat-card-label">Total Tasks</div>
          <div className="stat-card-trend up">
            <TrendingUp size={14} />
            {stats.completedTasks} completed
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-card-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-card-value">{stats.inProgressProjects}</div>
          <div className="stat-card-label">In Progress</div>
          <div className="stat-card-trend up">
            <TrendingUp size={14} />
            On track
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-card-icon">
            <Users size={24} />
          </div>
          <div className="stat-card-value">{stats.totalMembers}</div>
          <div className="stat-card-label">Team Members</div>
          <div className="stat-card-trend up">
            <TrendingUp size={14} />
            Active team
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={() => setShowProjectForm(true)}>
          <Plus size={20} />
          New Project
        </button>
        <button onClick={() => setShowTaskForm(true)}>
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="modal-overlay" onClick={() => setShowProjectForm(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <NewProjectForm
              onClose={() => setShowProjectForm(false)}
              onSuccess={() => { fetchProjects(); fetchStats(); }}
            />
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="modal-overlay" onClick={() => setShowTaskForm(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <NewTaskForm
              onClose={() => setShowTaskForm(false)}
              onSuccess={() => { fetchTasks(); fetchStats(); }}
            />
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div className="section-header">
        <h2>
          <FolderKanban size={22} />
          Recent Projects
        </h2>
        <a href="/projects">
          View All <ArrowRight size={16} />
        </a>
      </div>

      {loading ? (
        <div className="projects-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="project-card skeleton" style={{ height: '180px' }}></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <FolderKanban size={64} />
          <h3>No projects yet</h3>
          <p>Create your first project to get started!</p>
          <button className="btn btn-primary" onClick={() => setShowProjectForm(true)}>
            <Plus size={20} /> Create Project
          </button>
        </div>
      ) : (
        <div className="projects-list">
          {projects.slice(0, 6).map((project, index) => (
            <div
              key={project.id}
              className="project-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3>{project.title}</h3>
              <p className="date">
                <Calendar size={14} />
                Due: {formatDate(project.dueDate)}
              </p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${project.progress || 0}%`,
                    background: getProgressColor(project.progress || 0)
                  }}
                ></div>
              </div>
              <p className="progress-text">{project.progress || 0}% Complete</p>
              <span className={`status ${project.status?.toLowerCase().replace(' ', '-')}`}>
                {project.status || 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Tasks */}
      <div className="section-header">
        <h2>
          <CheckSquare size={22} />
          Recent Tasks
        </h2>
        <a href="/tasks">
          View All <ArrowRight size={16} />
        </a>
      </div>

      {loading ? (
        <div className="tasks-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="task-card skeleton" style={{ height: '140px' }}></div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={64} />
          <h3>No tasks yet</h3>
          <p>Add your first task to start tracking your work!</p>
          <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>
            <Plus size={20} /> Add Task
          </button>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.slice(0, 6).map((task, index) => (
            <div
              key={task.id}
              className="task-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h4>{task.title}</h4>
              <p>
                <FolderKanban size={14} />
                {task.project}
              </p>
              <p>
                <Users size={14} />
                {task.assignee || 'Unassigned'}
              </p>
              <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                {task.priority || 'Medium'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;