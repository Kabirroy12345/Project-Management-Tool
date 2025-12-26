import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, TrendingDown, Users, FolderKanban, CheckSquare, Clock, Download } from 'lucide-react';
import './Reports.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Reports = () => {
  const [projectStats, setProjectStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0
  });
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });
  const [teamProductivity, setTeamProductivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch projects
      const projectsRes = await axios.get(`${API_URL}/projects`);
      const projects = projectsRes.data;

      // Fetch tasks
      const tasksRes = await axios.get(`${API_URL}/tasks`);
      const tasks = tasksRes.data;

      // Fetch team members
      const teamRes = await axios.get(`${API_URL}/team`);
      const team = teamRes.data;

      // Calculate project stats
      setProjectStats({
        total: projects.length,
        completed: projects.filter(p => p.status === 'Completed').length,
        inProgress: projects.filter(p => p.status === 'In Progress').length,
        upcoming: projects.filter(p => p.status === 'On Hold' || p.status === 'Pending').length
      });

      // Calculate task stats
      setTaskStats({
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        pending: tasks.filter(t => t.status !== 'Completed').length
      });

      // Calculate team productivity
      const productivity = team.map(member => {
        const memberTasks = tasks.filter(t => t.assignee === member.name);
        const completedTasks = memberTasks.filter(t => t.status === 'Completed').length;
        return {
          name: member.name,
          avatar: member.avatar,
          tasks: memberTasks.length,
          completed: completedTasks
        };
      });
      setTeamProductivity(productivity);

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Weekly progress (simulated based on actual task count)
  const weeklyProgress = [
    { day: 'Mon', tasks: Math.max(1, Math.floor(taskStats.total * 0.15)) },
    { day: 'Tue', tasks: Math.max(1, Math.floor(taskStats.total * 0.20)) },
    { day: 'Wed', tasks: Math.max(1, Math.floor(taskStats.total * 0.12)) },
    { day: 'Thu', tasks: Math.max(1, Math.floor(taskStats.total * 0.25)) },
    { day: 'Fri', tasks: Math.max(1, Math.floor(taskStats.total * 0.18)) },
    { day: 'Sat', tasks: Math.max(0, Math.floor(taskStats.total * 0.06)) },
    { day: 'Sun', tasks: Math.max(0, Math.floor(taskStats.total * 0.04)) },
  ];

  const maxTasks = Math.max(...weeklyProgress.map(d => d.tasks), 1);
  const completionRate = projectStats.total > 0
    ? Math.round((projectStats.completed / projectStats.total) * 100)
    : 0;

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <BarChart3 size={32} />
            Reports & Analytics
          </h1>
          <p>Track your team's performance and project progress</p>
        </div>
        <button className="btn btn-primary">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Overview Stats */}
      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FolderKanban size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{projectStats.total}</span>
            <span className="stat-label">Total Projects</span>
          </div>
          <div className="stat-trend up">
            <TrendingUp size={16} />
            Active
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <CheckSquare size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{taskStats.completed}</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
          <div className="stat-trend up">
            <TrendingUp size={16} />
            +{taskStats.completed}
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{taskStats.pending}</span>
            <span className="stat-label">Pending Tasks</span>
          </div>
          <div className="stat-trend down">
            <TrendingDown size={16} />
            To do
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{teamProductivity.length}</span>
            <span className="stat-label">Team Members</span>
          </div>
          <div className="stat-trend neutral">
            Active
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Weekly Progress */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Task Progress</h3>
            <select className="chart-filter">
              <option>This Week</option>
              <option>Last Week</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="bar-chart">
            {weeklyProgress.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ height: `${(item.tasks / maxTasks) * 100}%` }}
                  >
                    <span className="bar-value">{item.tasks}</span>
                  </div>
                </div>
                <span className="bar-label">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Project Status</h3>
          </div>
          <div className="donut-chart">
            <div className="donut-visual">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="12"
                  strokeDasharray={`${(completionRate / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="donut-center">
                <span className="donut-value">{completionRate}%</span>
                <span className="donut-label">Complete</span>
              </div>
            </div>
            <div className="donut-legend">
              <div className="legend-item">
                <span className="legend-dot completed"></span>
                <span>Completed ({projectStats.completed})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot in-progress"></span>
                <span>In Progress ({projectStats.inProgress})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot upcoming"></span>
                <span>On Hold ({projectStats.upcoming})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Productivity */}
      <div className="productivity-section">
        <div className="section-header">
          <h3>Team Productivity</h3>
          <a href="/team">View All</a>
        </div>
        {loading ? (
          <div className="productivity-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="productivity-item skeleton" style={{ height: '60px' }}></div>
            ))}
          </div>
        ) : teamProductivity.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <Users size={48} />
            <h3>No team members yet</h3>
            <p>Add team members to see productivity stats</p>
          </div>
        ) : (
          <div className="productivity-list">
            {teamProductivity.map((member, index) => (
              <div key={index} className="productivity-item">
                <div className="member-info">
                  <div className="member-avatar">{member.avatar}</div>
                  <div className="member-details">
                    <h4>{member.name}</h4>
                    <span>{member.completed}/{member.tasks} tasks completed</span>
                  </div>
                </div>
                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: member.tasks > 0 ? `${(member.completed / member.tasks) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="progress-value">
                    {member.tasks > 0 ? Math.round((member.completed / member.tasks) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;