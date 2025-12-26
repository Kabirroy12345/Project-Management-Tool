const { connectDB, sequelize } = require('./config/db'); // Use connectDB from updated db.js
const TeamMember = require('./models/TeamMember');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedData = async () => {
    try {
        // Connect and Sync
        await connectDB();

        // Force sync to clear tables
        await sequelize.sync({ force: true });
        console.log('🗑️ Cleared existing data');

        // Seed Team Members
        const teamMembers = [
            {
                name: 'Kabir Roy',
                role: 'Project Lead',
                email: 'kabir.roy@projectflow.com',
                phone: '+91 98765 43210',
                avatar: 'KR',
                status: 'online',
                tasks: 12,
                projects: 5,
                isAdmin: true,
            },
            {
                name: 'Anshumaan Singh',
                role: 'Full Stack Developer',
                email: 'anshumaan.singh@projectflow.com',
                phone: '+91 98765 43211',
                avatar: 'AS',
                status: 'online',
                tasks: 10,
                projects: 4,
                isAdmin: false,
            },
            {
                name: 'Snehil Priyam',
                role: 'UI/UX Designer',
                email: 'snehil.priyam@projectflow.com',
                phone: '+91 98765 43212',
                avatar: 'SP',
                status: 'online',
                tasks: 8,
                projects: 3,
                isAdmin: false,
            },
        ];

        await TeamMember.bulkCreate(teamMembers);
        console.log('👥 Seeded team members');

        // Seed Projects
        const projects = [
            {
                title: 'E-Commerce Platform',
                dueDate: new Date('2025-01-15'),
                status: 'In Progress',
                progress: 65,
            },
            {
                title: 'Mobile App Redesign',
                dueDate: new Date('2025-02-01'),
                status: 'In Progress',
                progress: 40,
            },
            {
                title: 'API Integration',
                dueDate: new Date('2025-01-20'),
                status: 'Completed',
                progress: 100,
            },
            {
                title: 'Dashboard Analytics',
                dueDate: new Date('2025-01-25'),
                status: 'In Progress',
                progress: 80,
            },
        ];

        await Project.bulkCreate(projects);
        console.log('📁 Seeded projects');

        // Seed Tasks
        const tasks = [
            {
                title: 'Design user authentication flow',
                project: 'E-Commerce Platform',
                assignee: 'Kabir Roy',
                priority: 'HIGH',
                status: 'In Progress',
            },
            {
                title: 'Implement payment gateway',
                project: 'E-Commerce Platform',
                assignee: 'Anshumaan Singh',
                priority: 'HIGH',
                status: 'Pending',
            },
            {
                title: 'Create product listing UI',
                project: 'E-Commerce Platform',
                assignee: 'Snehil Priyam',
                priority: 'MEDIUM',
                status: 'Completed',
            },
            {
                title: 'Mobile responsive design',
                project: 'Mobile App Redesign',
                assignee: 'Snehil Priyam',
                priority: 'HIGH',
                status: 'In Progress',
            },
            {
                title: 'Setup API endpoints',
                project: 'API Integration',
                assignee: 'Anshumaan Singh',
                priority: 'MEDIUM',
                status: 'Completed',
            },
            {
                title: 'Build analytics charts',
                project: 'Dashboard Analytics',
                assignee: 'Kabir Roy',
                priority: 'MEDIUM',
                status: 'In Progress',
            },
        ];

        await Task.bulkCreate(tasks);
        console.log('✅ Seeded tasks');

        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
