const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const GroupChatUserDetails=require('../Models/SignUpData');

const UserGroupRelation = sequelize.define('USER_GROUP_RELATION',{
    ID:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    GROUP_ID:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references: {
            model: 'CustomGroups',
            key: 'GROUP_ID'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
    },
    USER_ID:{
        type : Sequelize.INTEGER,
        allowNull:false,
        references: {
            model: 'GroupChatUserDetails', 
            key: 'ID'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
    },
    ISADMIN:{
        type : Sequelize.BOOLEAN,
        allowNull:false,
    }
    },{
        indexes:[
            {
                name: 'user_group_unique',
                unique: true,
                fields: ['GROUP_ID', 'USER_ID']
            }
        ]
    });


  module.exports=UserGroupRelation;
