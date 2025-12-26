const { connectDB, sequelize } = require('./config/db');
const TeamMember = require('./models/TeamMember');
const Project = require('./models/Project');
const Task = require('./models/Task');

const clearData = async () => {
    try {
        await connectDB();

        // Force sync to clear tables
        await sequelize.sync({ force: true });
        console.log('🗑️ Database cleared! All data reset to 0.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        process.exit(1);
    }
};

clearData();
