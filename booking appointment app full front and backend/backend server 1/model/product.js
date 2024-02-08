const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('appointment',{
  id:{
    type : Sequelize.INTEGER,
    autoIncrement : true,
    allowNull : false,
    primaryKey : true
  },
  name : {
    type :Sequelize.STRING,
    allowNull : false
  },

  email : {
    type : Sequelize.STRING,
    allowNull : false,
    unique : true
  },
  phonenumber :{
    type : Sequelize.BIGINT,
    allowNull : false,
    unique : true
  },
  schedule : {
    type : Sequelize.DATE,
    allowNull : false
  }
});

module.exports=Product;
