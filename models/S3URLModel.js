const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const S3URLTable= sequelize.define('S3URLTable',{
    ID:{
        type:Sequelize.INTEGER,
        unique:true,
        autoIncrement:true,
        primaryKey:true
    },
    URL:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    FileName:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=S3URLTable;