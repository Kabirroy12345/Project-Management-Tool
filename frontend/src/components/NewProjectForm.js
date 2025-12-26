import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const NewProjectForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    status: 'In Progress',
    progress: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/projects`, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
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
      <h3>Create New Project</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div className="form-group">
          <label>Progress (%)</label>
          <input
            type="number"
            name="progress"
            min="0"
            max="100"
            placeholder="0"
            value={formData.progress}
            onChange={handleChange}
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectForm;