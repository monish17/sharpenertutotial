const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../util/database');

const Product = sequelize.define('ExpenseTracking',{
  id:{
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  Expense_Amount : {
    type :Sequelize.INTEGER,
    allowNull : false
  },

  description: {
    type : Sequelize.STRING,
    allowNull : false,
  },
  category:{
    type : Sequelize.STRING,
    allowNull : false,
  }
});

module.exports=Product;
