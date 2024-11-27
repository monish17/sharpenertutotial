const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const MessageStoring = sequelize.define('Group-Messages',{
    ID:{
        type:Sequelize.INTEGER,
        unique:true,
        autoIncrement:true,
        primaryKey:true
    },
    USER_ID:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    USER_NAME:{
        type:Sequelize.STRING,
        allowNull:false
    },
    MESSAGE_CONTENT:{
        type:Sequelize.STRING,
        allowNull:false
    },
    GROUP_ID:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW 
    }
  });

  module.exports=MessageStoring;
