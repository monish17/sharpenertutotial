// const Sequelize= require('sequelize');

// const sequelize= new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USERNAME,process.env.DATABASE_PASSWORD,{
//     dialect:'mysql',
//     host:process.env.DATABASE_HOST
// });

// module.exports= sequelize;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'mssql', // Change dialect to mssql for SQL Server
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 1433, // Default port for Azure SQL is 1433
    dialectOptions: {
      encrypt: true, // Necessary for Azure SQL to ensure the connection is encrypted
      options: {
        trustServerCertificate: false, // Recommended to keep this false for production
      },
    },
    logging: false, // Optional: Disable logging; can be useful for production
  }
);

module.exports = sequelize;

