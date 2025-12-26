const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false, // Set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Connected...');
    await sequelize.sync(); // Sync models with database
    console.log('✅ Database Synced...');
  } catch (error) {
    console.error('❌ Database Connection Error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };