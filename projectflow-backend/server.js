const express = require('express');
const { connectDB } = require('./config/db'); // Updated import
const cors = require('cors');

// No dotenv needed for SQLite strictly, but good for PORT
require('dotenv').config();

// Connect to SQLite
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ProjectFlow Pro API is running (SQLite)' });
});

// Dashboard stats endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const Project = require('./models/Project');
        const Task = require('./models/Task');
        const TeamMember = require('./models/TeamMember');

        const totalProjects = await Project.count();
        const totalTasks = await Task.count();
        const completedTasks = await Task.count({ where: { status: 'Completed' } });
        const inProgressProjects = await Project.count({ where: { status: 'In Progress' } });
        const totalMembers = await TeamMember.count();

        res.json({
            totalProjects,
            totalTasks,
            completedTasks,
            pendingTasks: totalTasks - completedTasks,
            inProgressProjects,
            totalMembers,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));