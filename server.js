const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User=require('./models/SignUpDataModel');
const Expense=require('./models/ExpenseDataModel');
const Order=require('./models/orders');
var cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));
const routes = require('./routes/routes');
const purchase=require('./routes/purchase');
const premium=require('./routes/premium');
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);
app.use(routes);
app.use('/purchase',purchase);
app.use('/premium',premium);
sequelize
    .sync()
    .then(result =>{
            app.listen(8000);
        })
    .catch(err => console.log(err));