const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  project: {
    type: DataTypes.STRING, // Storing project name string for simplicity based on current frontend
    allowNull: false,
  },
  assignee: {
    type: DataTypes.STRING,
    defaultValue: 'Unassigned',
  },
  priority: {
    type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
    defaultValue: 'MEDIUM',
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    defaultValue: 'Pending',
  },
});

module.exports = Task;