const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TeamMember = sequelize.define('TeamMember', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    status: {
        type: DataTypes.ENUM('online', 'away', 'offline'),
        defaultValue: 'online',
    },
    tasks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    projects: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = TeamMember;
