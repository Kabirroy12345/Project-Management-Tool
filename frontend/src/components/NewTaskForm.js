import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const NewTaskForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    assignee: '',
    priority: 'MEDIUM',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/tasks`, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal">
      <button className="modal-close" onClick={onClose}>
        <X size={18} />
      </button>
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Project</label>
          <input
            type="text"
            name="project"
            placeholder="Enter project name"
            value={formData.project}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Assignee</label>
          <input
            type="text"
            name="assignee"
            placeholder="Enter assignee name"
            value={formData.assignee}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm;