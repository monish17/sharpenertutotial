const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const CreateNewGroup = sequelize.define('CustomGroups',{
    GROUP_ID:{
        type:Sequelize.INTEGER,
        unique:true,
        autoIncrement:true,
        primaryKey:true
    },
    NAME:{
        type : Sequelize.STRING,
        allowNull:false,
        unique:true
    },
   CREATED_BY:{
    type:Sequelize.INTEGER,
    allowNull:false,
    references: {
        model: 'GroupChatUserDetails', 
        key: 'ID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
   },
   INVITE_TOKEN: {
    type: Sequelize.STRING,
    allowNull: false
  }
  });


  module.exports=CreateNewGroup;
