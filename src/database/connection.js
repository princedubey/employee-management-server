// const { Sequelize } = require('sequelize')
const { Sequelize } = require("sequelize-cockroachdb");

require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DATABASE_URL,

  // process.env.DB_DATABASE,
  // process.env.DB_USERNAME,
  // process.env.DB_PASSWORD, 
  // {
  //   host: process.env.DB_HOST,
  //   dialect: process.env.DB_DIALECT
  // }
)

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = sequelize

// const sequelize = new Sequelize(process.env.DATABASE_URL);

// (async () => {
//   try {
//     const [results, metadata] = await sequelize.query("SELECT NOW()");
//     console.log(results);
//   } catch (err) {
//     console.error("error executing query:", err);
//   } finally {
//     await sequelize.close();
//   }
// })();