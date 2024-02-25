const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Product = sequelize.define('Creating Post',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    postLink : {
      type :Sequelize.TEXT,
      allowNull : false
    },
  
    postDescription: {
      type : Sequelize.STRING,
      allowNull : true,
    }
  });
  
  module.exports=Product;
