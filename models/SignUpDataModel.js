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
    isPremiumUser:Sequelize.BOOLEAN,
    TotalExpense:{
      type:Sequelize.INTEGER,
      allowNull:false,
      defaultValue:0
    }
  });


  module.exports=SignUpModel;
