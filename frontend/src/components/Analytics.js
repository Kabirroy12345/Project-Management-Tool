import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, BrainCircuit, Target, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';
import './Analytics.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projectsRes, tasksRes, teamRes] = await Promise.all([
                axios.get(`${API_URL}/projects`),
                axios.get(`${API_URL}/tasks`),
                axios.get(`${API_URL}/team`)
            ]);

            const projects = projectsRes.data;
            const tasks = tasksRes.data;
            const team = teamRes.data;

            setStats({ projects, tasks, team });
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Derived Logic (Safe for empty data)
    const taskCount = stats?.tasks.length || 0;
    const completedTasks = stats?.tasks.filter(t => t.status === 'Completed').length || 0;
    const completionRate = taskCount > 0 ? (completedTasks / taskCount) * 100 : 0;

    // Generate Velocity Data (Simulated for demonstration if no history)
    // If we have 0 tasks, show flatline 0
    const velocityData = taskCount === 0 ? [
        { name: 'Week 1', velocity: 0, prediction: 0 },
        { name: 'Week 2', velocity: 0, prediction: 0 },
        { name: 'Current', velocity: 0, prediction: 5 },
    ] : [
        { name: 'Start', velocity: 0, prediction: 0 },
        { name: 'Current', velocity: completedTasks, prediction: completedTasks + 2 },
        { name: 'Target', velocity: null, prediction: taskCount },
    ];

    // Generate Dynamic Insights
    const aiInsights = [];

    if (taskCount === 0) {
        aiInsights.push({
            type: 'info',
            icon: BrainCircuit,
            title: 'Project Inception',
            description: 'No tasks detected. Start by adding tasks to generate AI predictions and velocity metrics.',
        });
    } else {
        if (completionRate > 80) {
            aiInsights.push({
                type: 'success',
                icon: CheckCircle,
                title: 'High Performance',
                description: `Great job! You have completed ${Math.round(completionRate)}% of tasks.`,
            });
        } else if (completionRate < 20 && taskCount > 5) {
            aiInsights.push({
                type: 'warning',
                icon: AlertTriangle,
                title: 'Slow Progress Detected',
                description: 'Completion rate is below 20%. Consider breaking down large tasks.',
            });
        } else {
            aiInsights.push({
                type: 'info',
                icon: TrendingUp,
                title: 'Steady Progress',
                description: `Team is moving forward with ${completedTasks} tasks completed so far.`,
            });
        }

        // Resource Check
        if (stats?.team.length === 0) {
            aiInsights.push({
                type: 'warning',
                icon: AlertTriangle,
                title: 'No Team Members',
                description: 'Add team members to assign tasks and track specific velocity.',
            });
        }
    }

    const successProbability = taskCount === 0 ? 0 : Math.min(100, Math.max(10, completionRate + 40)); // Simple mock algo

    return (
        <div className="analytics-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>
                        <Sparkles size={32} />
                        AI Insights & Analytics
                    </h1>
                    <p>AI-powered predictions and project health monitoring</p>
                </div>
                <div className="ai-badge">
                    <Zap size={16} fill="currentColor" />
                    <span>Powered by ProjectFlow AI</span>
                </div>
            </div>

            <div className="analytics-grid">
                {/* Main Chart */}
                <div className="analytics-card chart-section">
                    <div className="card-header">
                        <h3>Team Velocity & AI Prediction</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={velocityData}>
                                <defs>
                                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#764ba2" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#764ba2" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '10px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area type="monotone" dataKey="velocity" stroke="#667eea" strokeWidth={3} fillOpacity={1} fill="url(#colorVelocity)" name="Actual Velocity" />
                                <Area type="monotone" dataKey="prediction" stroke="#764ba2" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrediction)" name="AI Prediction" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Success Probability */}
                <div className="analytics-card probability-card">
                    <h3>Project Success Probability</h3>
                    <div className="gauge-container">
                        <div className="gauge-outer">
                            <div className="gauge-inner" style={{ transform: `rotate(${45 + (successProbability / 100) * 135}deg)` }}></div>
                            <div className="gauge-value">
                                <span>{Math.round(successProbability)}%</span>
                                <small>Estimated</small>
                            </div>
                        </div>
                    </div>
                    <div className="probability-factors">
                        <div className={`factor ${taskCount > 0 ? 'positive' : 'negative'}`}>
                            <div className="dot"></div>
                            <span>{taskCount > 0 ? 'Active Tasks' : 'No Tasks'}</span>
                        </div>
                        <div className={`factor ${stats?.team.length > 0 ? 'positive' : 'negative'}`}>
                            <div className="dot"></div>
                            <span>{stats?.team.length > 0 ? 'Team Assembled' : 'No Team'}</span>
                        </div>
                    </div>
                </div>

                {/* AI Suggestions */}
                <div className="analytics-card suggestions-card">
                    <div className="card-header">
                        <h3>AI Recommendations</h3>
                        <button className="refresh-btn" onClick={fetchData}>
                            <Sparkles size={16} /> Refresh
                        </button>
                    </div>
                    <div className="suggestions-list">
                        {aiInsights.map((insight, index) => (
                            <div key={index} className={`suggestion-item ${insight.type}`}>
                                <div className="suggestion-icon">
                                    <insight.icon size={20} />
                                </div>
                                <div className="suggestion-content">
                                    <h4>{insight.title}</h4>
                                    <p>{insight.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
