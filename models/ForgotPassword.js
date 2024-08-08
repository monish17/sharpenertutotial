const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../util/database');

const forgotPassword=sequelize.define("ForgotPasswordTable",{
    id:{
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => uuidv4()
      },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    isActive:Sequelize.BOOLEAN
});

module.exports=forgotPassword;