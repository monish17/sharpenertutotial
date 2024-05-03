const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User=require('./models/SignUpDataModel');
const Expense=require('./models/ExpenseDataModel');
const Order=require('./models/orders');
const request=require("./models/forgotPassword");
const S3URLTable=require('./models/S3URLModel');
var cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));
const routes = require('./routes/routes');
const purchase=require('./routes/purchase');
const premium=require('./routes/premium');
const password=require('./routes/password');
const expense=require('./routes/Expense');
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(request);
request.belongsTo(User);
User.hasMany(S3URLTable);
S3URLTable.belongsTo(User);
app.use(routes);
app.use('/purchase',purchase);
app.use('/premium',premium);
app.use('/password',password);
app.use('/Expense',expense);
sequelize
    .sync()
    .then(result =>{
            app.listen(8000);
        })
    .catch(err => console.log(err));