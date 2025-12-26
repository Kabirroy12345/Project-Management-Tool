import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Calendar, MoreVertical, FolderKanban, Search, Filter } from 'lucide-react';
import './Projects.css';
import NewProjectForm from './NewProjectForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${API_URL}/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    if (progress >= 50) return 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || project.status?.toLowerCase().replace(' ', '-') === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="projects-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FolderKanban size={32} />
            Projects
          </h1>
          <p>Manage and track all your projects in one place</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={20} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="projects-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="project-card skeleton" style={{ height: '220px' }}></div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">
          <FolderKanban size={64} />
          <h3>{searchQuery ? 'No projects found' : 'No projects yet'}</h3>
          <p>{searchQuery ? 'Try adjusting your search' : 'Create your first project to get started!'}</p>
          {!searchQuery && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={20} /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="project-card-header">
                <span className={`status-badge ${project.status?.toLowerCase().replace(' ', '-') || 'in-progress'}`}>
                  {project.status || 'In Progress'}
                </span>
                <div className="project-actions">
                  <button className="action-btn" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(project.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3>{project.title}</h3>

              <div className="project-meta">
                <span className="date">
                  <Calendar size={14} />
                  Due: {formatDate(project.dueDate)}
                </span>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span>Progress</span>
                  <span className="progress-value">{project.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${project.progress || 0}%`,
                      background: getProgressColor(project.progress || 0)
                    }}
                  ></div>
                </div>
              </div>

              <div className="project-footer">
                <div className="team-avatars">
                  <div className="avatar">KR</div>
                  <div className="avatar">AB</div>
                  <div className="avatar more">+2</div>
                </div>
                <button className="view-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <NewProjectForm
              onClose={() => setShowForm(false)}
              onSuccess={fetchProjects}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;