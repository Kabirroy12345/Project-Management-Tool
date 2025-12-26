import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Mail, Phone, MoreVertical, Plus, Crown, Loader } from 'lucide-react';
import './Team.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState({ totalMembers: 0, onlineNow: 0, activeTasks: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
  });

  const fetchTeamMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/team`);
      setTeamMembers(res.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/team/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching team stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTeamMembers(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const avatar = newMember.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      await axios.post(`${API_URL}/team`, {
        ...newMember,
        avatar,
        status: 'online',
        tasks: 0,
        projects: 0,
      });
      setShowForm(false);
      setNewMember({ name: '', role: '', email: '', phone: '' });
      fetchTeamMembers();
      fetchStats();
    } catch (error) {
      console.error('Error adding team member:', error);
      alert('Failed to add team member');
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await axios.delete(`${API_URL}/team/${id}`);
        fetchTeamMembers();
        fetchStats();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'online';
      case 'away': return 'away';
      default: return 'offline';
    }
  };

  return (
    <div className="team-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Users size={32} />
            Team
          </h1>
          <p>Manage your team members and their roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="team-stats">
        <div className="stat-item">
          <span className="stat-number">{stats.totalMembers}</span>
          <span className="stat-label">Total Members</span>
        </div>
        <div className="stat-item online">
          <span className="stat-number">{stats.onlineNow}</span>
          <span className="stat-label">Online Now</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.activeTasks}</span>
          <span className="stat-label">Active Tasks</span>
        </div>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="team-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="team-card skeleton" style={{ height: '300px' }}></div>
          ))}
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="empty-state">
          <Users size={64} />
          <h3>No team members yet</h3>
          <p>Add your first team member to get started!</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={20} /> Add Member
          </button>
        </div>
      ) : (
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="team-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-actions">
                <button
                  className="action-btn delete"
                  onClick={() => handleDeleteMember(member.id)}
                  title="Remove member"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="member-avatar-wrapper">
                <div className={`member-avatar ${getStatusColor(member.status)}`}>
                  {member.avatar || member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span className={`status-dot ${getStatusColor(member.status)}`}></span>
                {member.isAdmin && (
                  <div className="admin-badge" title="Admin">
                    <Crown size={12} />
                  </div>
                )}
              </div>

              <h3>{member.name}</h3>
              <span className="member-role">{member.role}</span>

              <div className="member-stats">
                <div className="mini-stat">
                  <span className="mini-value">{member.tasks}</span>
                  <span className="mini-label">Tasks</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-value">{member.projects}</span>
                  <span className="mini-label">Projects</span>
                </div>
              </div>

              <div className="member-contact">
                <a href={`mailto:${member.email}`} className="contact-btn" title={member.email}>
                  <Mail size={16} />
                </a>
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="contact-btn" title={member.phone}>
                    <Phone size={16} />
                  </a>
                )}
              </div>

              <button className="view-profile-btn">View Profile</button>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Team Member</h3>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  placeholder="e.g. Developer, Designer"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;