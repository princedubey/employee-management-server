const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_ADDON_URI);

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync()
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  connectToDatabase
};
