const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const SignUpModel = sequelize.define('SignUpData',{
    Name:{
        type : Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    Email : {
      type :Sequelize.STRING,
      allowNull : false,
      primaryKey:true,
      unique:true
    },
    Password: {
      type : Sequelize.STRING,
      allowNull : false,
    }
  });


  module.exports=SignUpModel;
