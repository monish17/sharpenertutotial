const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'mssql', 
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 1433, 
    dialectOptions: {
      encrypt: true, 
      options: {
        trustServerCertificate: false, 
      },
    },
    logging: false, 
  }
);

module.exports = sequelize;

