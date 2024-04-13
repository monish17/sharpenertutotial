const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const SignUpModel = sequelize.define('SignUpData',{
    ID:{
        type:Sequelize.INTEGER,
        unique:true,
        autoIncrement:true,
        primaryKey:true
    },
    Name:{
        type : Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    Email : {
      type :Sequelize.STRING,
      allowNull : false,
      unique:true
    },
    Password: {
      type : Sequelize.STRING,
      allowNull : false,
    },
    isPremiumUser:Sequelize.BOOLEAN
  });


  module.exports=SignUpModel;
